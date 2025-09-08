import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const { name, status } = await req.json();

    const [updated] = await db
      .update(campaigns)
      .set({ name, status })
      .where(eq(campaigns.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating campaign:", err);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await db.delete(leads).where(eq(leads.campaignId, id));

    await db.delete(campaigns).where(eq(campaigns.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const leadId = parseInt(resolvedParams.id);

    if (!leadId) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    // Fetch campaign details for this lead using your existing schema
    const result = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        description: campaigns.description,
        status: campaigns.status,
        createdAt: campaigns.createdAt,
      })
      .from(campaigns)
      .innerJoin(leads, eq(leads.campaignId, campaigns.id))
      .where(eq(leads.id, leadId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

