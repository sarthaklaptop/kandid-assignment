import { NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/campaigns
export async function GET() {
  try {
    // fetch all campaigns
    const rawCampaigns = await db.select().from(campaigns);

    // enrich each campaign with lead counts
    const enriched = await Promise.all(
      rawCampaigns.map(async (c) => {
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