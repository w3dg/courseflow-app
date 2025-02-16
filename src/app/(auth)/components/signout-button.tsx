"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const onSignOut = async () => {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsPending(false);
          router.push("/");
        },
      },
    });
  };

  return (
    <Button disabled={isPending} onClick={onSignOut} variant={"secondary"}>
      Logout
    </Button>
  );
}
