import { type Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-10">
      <div className="flex items-center w-full flex-col rounded-2xl border border-foreground/10 px-8 py-5 md:w-96">
        <h1 className="text-2xl font-semibold mb-1">Sign Up</h1>
        <p>Sign up for a Courseflow account</p>
        <SignUpForm />
        <div className="flex items-center justify-center gap-2">
          <small>Already have account?</small>
          <Link href={"/signin"} className="text-sm font-bold leading-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
