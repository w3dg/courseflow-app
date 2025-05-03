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
        name: $.custom(() => "Teacher Account"),
        email: $.custom(() => "teacher@uni.edu"),
        role: $.custom(() => "teacher"),
      },
      session: {
        ipAddress: $.ip(),
        userAgent: $.userAgent(),
      },
      account: {
        password: $.password(() => "teacher123"),
      },
    },
    { count: 1 }
  ),
});
