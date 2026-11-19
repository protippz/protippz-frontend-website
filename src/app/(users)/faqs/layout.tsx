import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getFaqs } from "@/lib/api/queries";
import { buildMetadata, jsonLdFaq } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about tipping athletes and teams, rewards, payments and withdrawals on PROTIPPZ.",
  path: "/faqs",
});

export default async function FaqsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const faqs = await getFaqs();
  return (
    <>
      {faqs.length > 0 && <JsonLd data={jsonLdFaq(faqs)} />}
      {children}
    </>
  );
}
