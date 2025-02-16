import { requireNoAuth } from "../utils/require-auth";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireNoAuth();

  return <>{children}</>;
};

export default AuthLayout;
