import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

// GET a single campaign and its leads
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // 👈 await it
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const campaignId = parseInt(id, 10);

    const campaignData = await db.query.campaigns.findFirst({
      where: and(eq(campaigns.id, campaignId), eq(campaigns.userId, userId)),
      with: { leads: true },
    });

    if (!campaignData) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(campaignData);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE a campaign
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // 👈 await here
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const campaignId = parseInt(id, 10);

    const campaignData = await db.query.campaigns.findFirst({
      where: and(eq(campaigns.id, campaignId), eq(campaigns.userId, userId)),
      with: { leads: true },
    });

    if (!campaignData) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(campaignData);
  } catch (err) {
    console.error("Error updating campaign:", err);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

// DELETE a campaign
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ Secure the endpoint
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const campaignId = parseInt(params.id);

    // ✅ Delete the campaign only if the ID and userId match
    const [deleted] = await db
      .delete(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, userId)))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Campaign not found or not authorized" },
        { status: 404 }
      );
    }

    // Note: Drizzle's onDelete: "cascade" should handle deleting related leads automatically

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
