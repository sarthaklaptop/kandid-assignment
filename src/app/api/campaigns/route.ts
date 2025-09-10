import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth"; 

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const userCampaigns = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId));

    const enriched = await Promise.all(
      userCampaigns.map(async (c) => {
        const allLeads = await db
          .select()
          .from(leads)
          .where(eq(leads.campaignId, c.id));

        const successful = allLeads.filter(
          (l) => l.status === "CONVERTED" || l.status === "RESPONDED"
        );

        return {
          ...c,
          totalLeads: allLeads.length,
          successfulLeads: successful.length,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}