import { requireAuth } from "@/app/utils/require-auth";
import { Badge } from "@/components/ui/badge";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-lg mt-2 md:text-xl lg:text-2xl ">
          Welcome, <span className="font-bold">{session?.user.name}</span>
        </h1>
        <Badge className={session?.user.role === "teacher" ? "bg-blue-400 text-white" : "bg-green-400 text-white"}>
          {session?.user.role === "teacher" ? "Teacher" : "Student"}
        </Badge>
      </div>
      {children}
    </>
  );
}

export default DashboardLayout;
