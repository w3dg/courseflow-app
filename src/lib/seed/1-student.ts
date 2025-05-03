import { User } from "@/db/schema";
import { Seed, users, $ } from "@better-auth-kit/seed";
import type { Account, Session } from "better-auth";

type SeedUser = {
  user: User;
  session: Session;
  account: Account;
};

export const seed = Seed({
  ...users<SeedUser>(
    {
      user: {
        name: $.custom(() => "Student Account"),
        email: $.custom(() => "student@uni.edu"),
        role: $.custom(() => "student"),
      },
      session: {
        ipAddress: $.ip(),
        userAgent: $.userAgent(),
      },
      account: {
        password: $.password(() => "student123"),
      },
    },
    { count: 1 }
  ),
});
