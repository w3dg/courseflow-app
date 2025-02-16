import { requireAuth } from "@/app/utils/require-auth";
import { Badge } from "@/components/ui/badge";

async function Dashboard() {
  const session = await requireAuth();

  return (
    <main className="px-6 md:px-16 pt-6">
      <div className="flex items-center gap-2">
        <h1 className="text-lg mt-2 md:text-xl lg:text-2xl ">
          Welcome, <span className="font-bold">{session?.user.name}</span>
        </h1>
        <Badge variant={"secondary"}>{session?.user.role === "teacher" ? "Teacher" : "Student"}</Badge>
      </div>
      <div className="mt-6">
        <h2>Your classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"></div>
      </div>
    </main>
  );
}

export default Dashboard;
