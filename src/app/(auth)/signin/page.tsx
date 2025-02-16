import { type Metadata } from "next";
// import SignInForm from "./form";
import Link from "next/link";
import SignInForm from "./signin-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div className="w-full grid place-items-center py-10">
      <div className="flex flex-col items-center rounded-2xl border px-8 py-5 max-w-lg">
        <h1 className="text-2xl font-semibold">Sign In</h1>
        <p>Sign in to access your Courseflow account</p>
        <SignInForm />
        <div className="flex items-center justify-center gap-2">
          <small>Don&apos;t have account?</small>
          <Link href={"/signup"} className="text-sm font-bold leading-none">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
