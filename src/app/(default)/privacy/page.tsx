import type { Metadata } from "next";
import { getPrivacyPolicy } from "@/lib/api/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How PROTIPPZ collects, uses and protects your personal information.",
  path: "/privacy",
});

const page = async () => {
  const result = await getPrivacyPolicy();
  if (!result?.data?.description) {
    return <>privacy policy</>;
  } else {
    return (
      <div
      className="px-12"
        dangerouslySetInnerHTML={{ __html: result?.data?.description }}
      ></div>
    );
  }
};

export default page;
