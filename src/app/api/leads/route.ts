import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm"; 
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const userLeads = await db.query.leads.findMany({
      where: eq(leads.userId, userId), 
      with: {
        campaign: {
          columns: {
            name: true,
          },
        },
        owner: {
          columns: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: (leads, { desc }) => [desc(leads.lastContactDate)],
    });

    return NextResponse.json(userLeads);
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}