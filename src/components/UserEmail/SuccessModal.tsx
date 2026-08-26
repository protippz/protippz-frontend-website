import { Typography } from "antd";
import Image from "next/image";
import React from "react";

const { Title } = Typography;

function SuccessModal() {
  return (
    <div>
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <div className="flex flex-col justify-center text-center items-center">
          <Image alt="Success Icon" width={120} height={120} src={"/ok.svg"} />
          <Title level={3}>Email Verified Successfully!</Title>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
