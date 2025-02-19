import { requireAuth } from "../utils/require-auth";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAuth();
  return <main className="px-6 md:px-16 pt-6">{children}</main>;
};

export default ProtectedLayout;
