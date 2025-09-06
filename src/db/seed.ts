// import { db } from "./index.ts";
import { db } from "./index.ts";
import { user } from "./auth-schema.ts";
import { leads, campaigns } from "./schema.ts"; // ✅ Import campaigns table
import { faker } from "@faker-js/faker";

async function seed() {
  console.log("🌱 Seeding database...");

  // --- Insert base users (owners of leads) ---
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

  // --- Insert Campaigns ---
  const campaignsData = [
    { id: 1, name: "Gynoveda" },
    { id: 2, name: "The Skin Story" },
    { id: 3, name: "KandidAI" },
    { id: 4, name: "Wellness360" },
  ];

  await db.insert(campaigns).values(campaignsData).onConflictDoNothing();
  console.log("✅ Inserted Campaigns");

  // --- Generate 100 dummy leads ---

  const statusMap: Record<
    string,
    "PENDING" | "CONTACTED" | "RESPONDED" | "CONVERTED"
  > = {
    Pending: "PENDING",
    Contacted: "CONTACTED",
    Responded: "RESPONDED",
    Converted: "CONVERTED",
  };

  const leadsData = Array.from({ length: 100 }).map(() => {
    const randomUser = faker.helpers.arrayElement(usersData);
    const randomCampaign = faker.helpers.arrayElement(campaignsData);
    const randomStatus = faker.helpers.arrayElement([
      "Pending",
      "Contacted",
      "Responded",
      "Converted",
    ]);

    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      company: faker.company.name(),
      campaignId: randomCampaign.id,
      status: statusMap[randomStatus],
      lastContactDate: faker.date.recent({ days: 30 }),
      userId: randomUser.id,
    };
  });

  await db.insert(leads).values(leadsData).onConflictDoNothing();
  console.log("✅ Inserted 100 Leads");

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
