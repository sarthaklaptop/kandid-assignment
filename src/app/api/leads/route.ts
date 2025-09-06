import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch leads and join related campaign and user (owner) data
    const leads = await db.query.leads.findMany({
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

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}