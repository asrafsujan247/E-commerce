import type { Category } from "@appTypes/index";
import departmentsData from "@localdata/categories.json";

interface Department {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: string;
  categories: Category[];
}

interface ShowingCategoryResult {
  categories: Category[];
  error: string | null;
  loading: boolean;
}

const getShowingCategory = async (): Promise<ShowingCategoryResult> => {
  const departments = departmentsData as unknown as Department[];
  const categories = departments.flatMap((dept) => dept.categories ?? []);
  return { categories, error: null, loading: false };
};

export { getShowingCategory };
export type { Department };
