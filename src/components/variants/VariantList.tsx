import { Button } from "@components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@components/ui/select";
import useUtilsFunction from "@hooks/useUtilsFunction";
import type { ProductVariant } from "@appTypes/index";

interface VariantListProps {
  att: string;
  option?: string | { [key: string]: unknown }[];
  variants?: ProductVariant[] | Array<Record<string, unknown>>;
  setValue: (value: string) => void;
  varTitle?: Record<string, string> | string | unknown[];
  selectVariant: Record<string, string> | Record<string, unknown>;
  setSelectVariant: (v: Record<string, string> | Record<string, unknown>) => void;
  setSelectVa: (v: Record<string, string> | Record<string, unknown>) => void;
  attributeValues?: Array<{ _id?: string; name: string }>;
}

const VariantList = ({
  att,
  option,
  variants,
  setValue,
  selectVariant,
  setSelectVariant,
  setSelectVa,
  attributeValues,
}: VariantListProps) => {

  const handleChange = (v: string) => {
    setValue(v);
    setSelectVariant({ ...(selectVariant as Record<string, unknown>), [att]: v } as Record<string, string>);
    setSelectVa({ [att]: v } as Record<string, string>);
  };

  const typedVariants = (variants ?? []) as ProductVariant[];
  const entries: [string, ProductVariant][] = typedVariants
    .map((v): [string, ProductVariant] => [v[att] as string, v])
    .filter(([k]) => k != null) as [string, ProductVariant][];
  const uniqueVariants: ProductVariant[] = [...new Map<string, ProductVariant>(entries).values()];

  if (option === "Dropdown") {
    return (
      <Select onValueChange={handleChange} value={(selectVariant as Record<string, string>)[att] ?? ""}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Variant" />
        </SelectTrigger>
        <SelectContent>
          {uniqueVariants.map((vl: ProductVariant) => {
            const val = vl[att] as string;
            const resolvedName = attributeValues?.find((av) => av._id === val)?.name;
            const label = resolvedName ?? (typeof vl.name === "object" ? String(vl.name ?? '') : val);
            return (
              <SelectItem key={val} value={val}>{label ?? val}</SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {uniqueVariants.map((vl: ProductVariant) => {
        const val = vl[att] as string;
        const resolvedName = attributeValues?.find((av) => av._id === val)?.name;
        return (
          <Button
            key={val}
            type="button"
            variant={(selectVariant as Record<string, string>)[att] === val ? "default" : "outline"}
            size="sm"
            onClick={() => handleChange(val)}
          >
            {resolvedName ?? val}
          </Button>
        );
      })}
    </div>
  );
};

export default VariantList;
