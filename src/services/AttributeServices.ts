import type { ProductAttribute } from "@appTypes/index";
import attributesData from "@localdata/attributes.json";

type RawAttribute = {
  _id: string;
  type?: string;
  status?: string;
  title?: { en?: string; [k: string]: string | undefined };
  name?: { en?: string; [k: string]: string | undefined } | string;
  variants?: Array<{ _id?: string; name?: { en?: string; [k: string]: string | undefined } | string; status?: string }>;
  option?: string;
  [k: string]: unknown;
};

function normalizeAttribute(a: RawAttribute): ProductAttribute {
  const name = typeof a.name === "object" ? (a.name?.en ?? Object.values(a.name ?? {})[0] ?? "") : (a.name ?? "");
  const values = (a.variants ?? []).map((v) => ({
    _id: v._id ?? "",
    name: typeof v.name === "object" ? (v.name?.en ?? Object.values(v.name ?? {})[0] ?? "") : (v.name ?? ""),
  }));
  return { _id: a._id, name, type: a.type, option: a.option, values };
}

interface ShowingAttributesResult {
  attributes: ProductAttribute[];
  error: string | null;
}

const getShowingAttributes = async (): Promise<ShowingAttributesResult> => {
  const attributes = (attributesData as RawAttribute[]).map(normalizeAttribute);
  return { attributes, error: null };
};

export { getShowingAttributes };
