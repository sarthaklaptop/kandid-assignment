import { NextResponse } from "next/server";
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
