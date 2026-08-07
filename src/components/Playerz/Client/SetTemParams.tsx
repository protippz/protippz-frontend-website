"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SetTemParams = ({
  ParamKey,
  value,
}: {
  ParamKey: string;
  value: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams?.toString() || "");
    setIsActive(currentParams.get(ParamKey) === value);
  }, [searchParams, ParamKey, value]);

  const handleButtonClick = () => {
    const currentParams = new URLSearchParams(searchParams?.toString() || "");

    for (const [paramKey, paramValue] of currentParams.entries()) {
      if (paramValue === "undefined") {
        currentParams.delete(paramKey);
      }
    }

    currentParams.set(ParamKey, value);
    currentParams.set("page", "1");
    router.replace(`?${currentParams?.toString()}`, { scroll: false });
  };

  return (
    <div
      onClick={handleButtonClick}
      className={`w-full absolute h-full left-0 flex items-start justify-center top-0 `}
    >
      {/* {isActive && (
        <div className="bg-slate-500/40  text-white font-semibold flex items-center justify-center w-full h-full"></div>
      )} */}
    </div>
  );
};

export default SetTemParams;
