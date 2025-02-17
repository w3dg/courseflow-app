import { Badge } from "@/components/ui/badge";
import { requireAuth } from "@/app/utils/require-auth";
import React from "react";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <main className="px-6 md:px-16 pt-6">
      <div className="flex items-center gap-2">
        <h1 className="text-lg mt-2 md:text-xl lg:text-2xl ">
          Welcome, <span className="font-bold">{session?.user.name}</span>
        </h1>
        <Badge className={session?.user.role === "teacher" ? "bg-blue-400 text-white" : "bg-green-400 text-white"}>
          {session?.user.role === "teacher" ? "Teacher" : "Student"}
        </Badge>
      </div>
      {children}
    </main>
  );
}

export default DashboardLayout;
