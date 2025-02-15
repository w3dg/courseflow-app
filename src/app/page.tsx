import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return (
      <>
        <h1>Welcome!</h1>
        <div className="flex gap-2">
          <Link href="/signin">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant={"outline"}>
              Sign up
            </Button>
          </Link>
        </div>
      </>
    );
  } else {
    redirect("/dashboard");
  }
}
