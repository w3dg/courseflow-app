"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  const onSignOut = async () => {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsPending(false);
          redirect("/");
        },
      },
    });
  };

  return (
    <Button disabled={isPending} onClick={onSignOut} variant={"destructive"}>
      Logout
    </Button>
  );
}
