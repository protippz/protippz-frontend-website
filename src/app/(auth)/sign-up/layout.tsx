import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Join PROTIPPZ as a fan or athlete – tip your favorite players and teams and earn rewards.",
};

export default function SignUpLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
