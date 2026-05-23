import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import parse from "html-react-parser";

type TranslationData = { [lang: string]: string } | string | undefined;

interface CMSkeletonProps {
  html?: boolean;
  count?: number;
  height?: number;
  color?: string;
  loading?: boolean;
  error?: string;
  data?: TranslationData;
  highlightColor?: string;
}

function resolveDisplayValue(value: TranslationData): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value["en"] ?? Object.values(value)[0] ?? "";
}

const CMSkeleton = ({
  html,
  count,
  height,
  color,
  loading,
  error,
  data,
  highlightColor,
}: CMSkeletonProps) => {
  return (
    <>
      {loading ? (
        <Skeleton
          count={count || 6}
          height={height || 25}
          baseColor={color || "#f1f5f9"}
          highlightColor={highlightColor || "#cbd5e1"}
        />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : data ? (
        html ? (
          parse(resolveDisplayValue(data))
        ) : (
          resolveDisplayValue(data)
        )
      ) : null}
    </>
  );
};

export default CMSkeleton;
