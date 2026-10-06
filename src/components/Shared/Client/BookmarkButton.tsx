"use client";

import { post, remove } from "@/ApisRequests/server";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const BookmarkButton = ({
  isBookmark,
  type,
  _id,
  className,
  children,
}: {
  isBookmark: boolean;
  type: string;
  _id: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const BookmarkHandler = async () => {
    if (isBookmark) {
      const res = await remove(
        type == "team"
          ? `/team-bookmark/delete/${_id}`
          : `/player-bookmark/delete/${_id}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (res?.success) {
        toast.success(res?.message);
        router.refresh();
      } else {
        toast.error(res?.message);
      }
    } else {
      const data = type == "team" ? { teamId: _id } : { playerId: _id };
      const res = await post(
        type == "team" ? "/team-bookmark/create" : "/player-bookmark/create",
        data,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (res?.success) {
        toast.success(res?.message);
        // router.push(type == 'team' ? '/teamz' : '/playerz', { scroll: false })
        router.refresh();
      } else {
        toast.error(res?.message);
      }
    }
  };
  return (
    <span
      onClick={BookmarkHandler}
      className={className || "text-4xl cursor-pointer select-none"}
    >
      {children !== undefined ? children : (isBookmark ? "★" : "☆")}
    </span>
  );
};

export default BookmarkButton;
