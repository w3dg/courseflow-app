import { requireAuth } from "@/app/utils/require-auth";

async function Dashboard() {
  const session = await requireAuth();

  return (
    <div>
      <h1 className="text-2xl">
        Welcome to Dashboard, <span className="font-bold">{session?.user.name}</span>
      </h1>
    </div>
  );
}

export default Dashboard;
