import { requireNoAuth } from "@/app/utils/require-auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import studyPng from "./study.png";

export default async function Home() {
  await requireNoAuth();

  return (
    <main className="flex flex-col items-center justify-center space-y-4 my-10">
      <h1 className="text-3xl md:text-5xl font-bold">Courseflow</h1>
      <p className="text-foreground/85">Your hub for digital learning.</p>
      <section className="flex gap-2">
        <Link href="/signin">
          <Button size="lg">Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button size="lg" variant={"outline"}>
            Sign up
          </Button>
        </Link>
      </section>
      <section className="py-8">
        <Image src={studyPng} alt="Illustration of a person reading a book."></Image>
      </section>
    </main>
  );
}
