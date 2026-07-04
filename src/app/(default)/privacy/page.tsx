import { get } from "@/ApisRequests/server";

const page = async () => {
  const result = await get(`/manage/get-privacy-policy`);
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
