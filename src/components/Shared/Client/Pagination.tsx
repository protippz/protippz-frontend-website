"use client";

import { Pagination } from "antd";
import { useRouter } from "next/navigation";

interface PaginationInterface {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
const PaginationComponents = ({
  paginationData,
}: {
  paginationData: PaginationInterface;
}) => {
  const router = useRouter();

  return (
    <Pagination
      className="my-3 mb-10 text-center"
      showSizeChanger
      pageSizeOptions={["12", "24", "36", "48"]}
      current={Number(paginationData?.page) || 1}
      total={paginationData?.total || 0}
      pageSize={Number(paginationData?.limit) || 12}
      onChange={(page, pageSize) => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set("page", page?.toString());
        if (pageSize) {
          currentParams.set("limit", pageSize?.toString());
        }
        router.replace(`?${currentParams?.toString()}`, { scroll: false });
      }}
    />
  );
};

export default PaginationComponents;
