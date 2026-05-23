import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type TranslationData = { [lang: string]: string } | string | undefined;

interface CMSkeletonTwoProps {
  count?: number;
  height?: number;
  width?: number;
  color?: string;
  highlightColor?: string;
  textAlign?: boolean;
  loading?: boolean;
  error?: string;
  data?: TranslationData;
}

function resolveDisplayValue(value: TranslationData): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value["en"] ?? Object.values(value)[0] ?? "";
}

const CMSkeletonTwo = ({
  count,
  height,
  width,
  color,
  highlightColor,
  textAlign,
  loading,
  error,
  data,
}: CMSkeletonTwoProps) => {
  if (loading) {
    return (
      <span
        className={`inline-block w-full ${
          textAlign ? "text-right" : "text-center"
        }`}
      >
        <Skeleton
          count={count || 6}
          height={height || 22}
          width={width ? `${width}%` : "100%"}
          baseColor={color || "#f1f5f9"}
          highlightColor={highlightColor || "#cbd5e1"}
          inline={true}
        />
      </span>
    );
  }

  if (error) {
    return <span className="text-center mx-auto text-red-500">{error}</span>;
  }

  if (data) {
    return <>{resolveDisplayValue(data)}</>;
  }

  return null;
};

export default CMSkeletonTwo;
