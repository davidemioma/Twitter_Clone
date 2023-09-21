import "./globals.css";
import type { Metadata } from "next";
import Widgets from "@/components/Widgets";
import { Nunito_Sans } from "next/font/google";
import Container from "@/components/Container";
import Sidebar from "@/components/sidebar/Sidebar";
import { getCurrentUser } from "./actions/getCurrentUser";
import ModalProvider from "@/components/providers/modal-provider";
import QueryProvider from "@/components/providers/query-provider";
import ToasterProvider from "@/components/providers/toaster-provider";

const font = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter-Clone",
  description: "Twitter Clone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ModalProvider currentUser={currentUser} />

        <ToasterProvider />

        <QueryProvider>
          <Container>
            <Sidebar currentUser={currentUser} />

            <div className="col-span-3 lg:col-span-2 border-x border-neutral-800">
              {children}
            </div>

            <Widgets />
          </Container>
        </QueryProvider>
      </body>
    </html>
  );
}
