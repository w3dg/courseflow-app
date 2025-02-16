import { requireAuth } from "../utils/require-auth";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAuth();
  return <>{children}</>;
};

export default ProtectedLayout;
