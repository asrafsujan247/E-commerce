import React, { useState } from "react";
import CopyToClipboard from "@components/common/CopyToClipboard";

interface CouponData {
  _id: string;
  couponCode: string;
  [key: string]: unknown;
}

interface CouponCodeButtonProps {
  coupon: CouponData;
}

const CouponCodeButton: React.FC<CouponCodeButtonProps> = ({ coupon }) => {
  const [copiedCode, setCopiedCode] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopied = (code: string): void => {
    setCopiedCode(code);
    setCopied(true);
  };

  return (
    <CopyToClipboard
      text={coupon.couponCode}
      onCopy={() => handleCopied(coupon.couponCode)}
    >
      <button className="block w-full">
        {copied && coupon.couponCode === copiedCode ? (
          <span className="text-primary text-sm leading-7 font-semibold">
            Copied!
          </span>
        ) : (
          <span className="uppercase font-semibold text-sm leading-7 text-primary">
            {coupon.couponCode}{" "}
          </span>
        )}
      </button>
    </CopyToClipboard>
  );
};

export default CouponCodeButton;
