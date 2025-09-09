import { auth } from "@/lib/auth";
import { headers as nextHeaders } from "next/headers";
import Image from "next/image";

export default async function DashboardPage() {
  // Convert ReadonlyHeaders → Headers
  const reqHeaders = new Headers();
  const headers = await nextHeaders();
  headers.forEach((value, key) => {
    reqHeaders.append(key, value);
  });

  // Get session from BetterAuth
  const session = await auth.api.getSession({ headers: reqHeaders });
  const user = session?.user;

  return (
    <div className="p-8 space-y-6 flex flex-col">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {user ? (
        <div className="flex items-center gap-4 p-4 rounded-lg border shadow-sm max-w-md">
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No user session found</p>
      )}
    </div>
  );
}