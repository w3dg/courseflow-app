"use client";

import SignOutButton from "@/app/(auth)/components/signout-button";
import { authClient } from "@/lib/auth-client";
import { CircleUser, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  {
    label: "Home",
    href: "/",
    requiresAuth: false,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    requiresAuth: true,
  },
];

export default function AppNavbar() {
  const { data: session, error } = authClient.useSession();

  return (
    <>
      <nav className="border-b w-full h-14">
        <div className="container mx-auto flex items-center justify-between h-full">
          <Link href="/" className="font-bold text-lg px-2">
            Courseflow
          </Link>
          <div className="flex items-center">
            {session
              ? menuItems.map((item) => (
                  <Link href={item.href} key={item.href} className="mx-4 hidden md:block">
                    {" "}
                    {item.label}
                  </Link>
                ))
              : menuItems
                  .filter((item) => !item.requiresAuth)
                  .map((item) => (
                    <Link href={item.href} key={item.href} className="mx-4 hidden md:block">
                      {item.label}
                    </Link>
                  ))}
            <Sheet>
              <SheetTrigger asChild>
                <Button className="md:hidden" variant={"ghost"}>
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"}>
                <SheetHeader className="text-left">
                  <SheetTitle className="text-xl">Courseflow</SheetTitle>
                  <SheetDescription>Where learning happens</SheetDescription>
                  {session && (
                    <>
                      <div className="flex flex-col gap-4 pb-8 pt-4">
                        {menuItems.map((item) => (
                          <Link href={item.href} key={item.href} className="block md:hidden">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="flex items-center text-accent-foreground w-full justify-between">
                        <p>{session.user.name}</p>
                        <CircleUser className="w-4 h-4" />
                      </div>
                      <SignOutButton></SignOutButton>
                    </>
                  )}
                  {!session && (
                    <>
                      <Link href="/signin">
                        <Button size="lg">Sign In</Button>
                      </Link>
                    </>
                  )}
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {session && (
              <>
                <div className="flex items-center gap-1">
                  <CircleUser className="w-4 h-4" />
                  {session.user.name}
                </div>
                <SignOutButton></SignOutButton>
              </>
            )}
            {!session && (
              <>
                <Link href="/signin">
                  <Button size="lg">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
