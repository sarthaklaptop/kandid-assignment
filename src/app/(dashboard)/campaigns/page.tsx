import { db } from "@/db"; 
import { campaigns } from "@/db/schema";
import Link from "next/link";

export default async function CampaignsPage() {
  const allCampaigns = await db.select().from(campaigns);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {allCampaigns.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">
                <Link href={`/campaigns/${c.id}`} className="text-blue-600 hover:underline">
                  {c.name}
                </Link>
              </td>
              <td className="p-2">{c.status}</td>
              <td className="p-2">{new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
