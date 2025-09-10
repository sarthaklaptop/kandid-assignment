import { db } from "./index.ts";
import { user } from "./auth-schema.ts";
import { leads, campaigns } from "./schema.ts";
import { faker } from "@faker-js/faker";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const usersData = [
      {
        id: "u1",
        name: "Om Satyarthy",
        email: "om@example.com",
        emailVerified: true,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        id: "u2",
        name: "Dr. Bhuvaneshwari",
        email: "bhuvaneshwari@example.com",
        emailVerified: true,
        image: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "u3",
        name: "Utkarsh K.",
        email: "utkarsh@example.com",
        emailVerified: true,
        image: "https://randomuser.me/api/portraits/men/76.jpg",
      },
      {
        id: "u4",
        name: "Ananya Sharma",
        email: "ananya@example.com",
        emailVerified: true,
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        id: "VZzEtq0VFD0oDssfF5If2WJwmMuwveYl",
        name: "Akash Khalekar",
        email: "akashkhalekar123222@gmail.com",
        emailVerified: true,
        image: "https://randomuser.me/api/portraits/men/5.jpg",
      },
    ];

    await db.insert(user).values(usersData).onConflictDoNothing();
    console.log("✅ Inserted Users");

    const campaignsData = [
      { 
        name: "Juicy Chemistry", 
        status: "Active", 
        description: "Beauty and skincare campaign",
      },
      { 
        name: "Hyugalife 2", 
        status: "Active",
        description: "Health and wellness campaign",
      },
      { 
        name: "Honeyveda", 
        status: "Active",
        description: "Ayurvedic products campaign",
      },
      { 
        name: "HempStreet", 
        status: "Active",
        description: "Hemp-based products campaign",
      },
    ];

    const baseCampaigns = campaignsData.map(campaign => ({
      ...campaign,
      userId: usersData[0].id,
    }));

    const insertedCampaigns = await db.insert(campaigns).values(baseCampaigns).returning();
    console.log("✅ Inserted Campaigns");

    const statusOptions: ("PENDING" | "CONTACTED" | "RESPONDED" | "CONVERTED" | "DO_NOT_CONTACT")[] = [
      "PENDING", "CONTACTED", "RESPONDED", "CONVERTED", "DO_NOT_CONTACT"
    ];

    const leadsData = Array.from({ length: 100 }).map(() => {
      const randomUser = faker.helpers.arrayElement(usersData);
      const randomCampaign = faker.helpers.arrayElement(insertedCampaigns);
      const randomStatus = faker.helpers.arrayElement(statusOptions);

      return {
        name: faker.person.fullName(),
        role: faker.person.jobTitle(), 
        email: faker.internet.email(),
        company: faker.company.name(),
        avatarUrl: faker.image.avatar(), 
        status: randomStatus,
        campaignId: randomCampaign.id, 
        userId: randomUser.id,
        lastContactDate: faker.date.recent({ days: 30 }),
      };
    });

    await db.insert(leads).values(leadsData).onConflictDoNothing();
    console.log("✅ Inserted 100 Leads");

    console.log("🎉 Database seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:");
    console.error(error);
    throw error;
  }
}

seed().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});