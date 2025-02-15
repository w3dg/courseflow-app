// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
import SignOutButton from "../../(auth)/components/signout-button";

function Dashboard() {
  // async function Dashboard() {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  // if (!session) {
  //   redirect("/signup");
  // }
  return (
    <div>
      {/* <h1>Welcome {session.user.name}</h1> */}
      <h1>Welcome to Dashboard</h1>
      <SignOutButton />
    </div>
  );
}

export default Dashboard;
