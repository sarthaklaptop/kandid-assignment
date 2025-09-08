// src/app/api/dev/seed-user/route.ts

import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { auth } from "@/lib/auth";
import { faker } from "@faker-js/faker";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Create a few sample campaigns for this user
    const campaignsData = [
      {
        name: "Q1 Marketing Push",
        status: "Active",
        description: "General marketing for the first quarter.",
        userId: userId,
      },
      {
        name: "Social Media Outreach",
        status: "Planning",
        description: "Targeting new clients on LinkedIn.",
        userId: userId,
      },
    ];
    const insertedCampaigns = await db
      .insert(campaigns)
      .values(campaignsData)
      .returning();

    // 3. Create a few sample leads for these new campaigns
    const leadsData = Array.from({ length: 15 }).map(() => {
        const randomCampaign = faker.helpers.arrayElement(insertedCampaigns);
        return {
            name: faker.person.fullName(),
            role: faker.person.jobTitle(),
            email: faker.internet.email(),
            company: faker.company.name(),
            avatarUrl: faker.image.avatar(),
            status: faker.helpers.arrayElement(["PENDING", "CONTACTED", "RESPONDED"]),
            campaignId: randomCampaign.id,
            userId: userId, // Assign lead to the current user
            lastContactDate: faker.date.recent({ days: 30 }),
        }
    });

    await db.insert(leads).values(leadsData);

    return NextResponse.json({
      message: `Successfully seeded 2 campaigns and 15 leads for user ${userId}`,
    });
  } catch (error) {
    console.error("Error seeding user data:", error);
    return NextResponse.json(
      { error: "Failed to seed user data" },
      { status: 500 }
    );
  }
}