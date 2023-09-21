import Form from "@/components/form/Form";
import Header from "@/components/Header";
import { getCurrentUser } from "./actions/getCurrentUser";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <Header label="Home" />

      <Form currentUser={currentUser} placeholder="What's happening?" />
    </div>
  );
}
