import Form from "@/components/Form";
import Header from "@/components/Header";
import { getCurrentUser } from "./actions/getCurrentUser";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-screen overflow-y-auto">
      <Header label="Home" />

      <Form currentUser={currentUser} placeholder="What's happening?" />
    </div>
  );
}
