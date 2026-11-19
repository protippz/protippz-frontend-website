import type { Metadata } from "next";
import { getTermsConditions } from "@/lib/api/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "The terms and conditions that govern your use of PROTIPPZ.",
  path: "/terms",
});

const page = async () => {
  const result = await getTermsConditions();
  if (!result?.data?.description) {
    return <>Terms Conditions</>;
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
