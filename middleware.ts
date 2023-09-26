export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/notifications", "/messages", "/messages/:path*"],
};
