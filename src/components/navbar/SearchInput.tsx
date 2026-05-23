import { Input } from "@components/ui/input";
import { MagnifyingGlassIcon, CameraIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface SearchInputProps {
  variant?: "default" | "electronic";
}

const SearchInput: React.FC<SearchInputProps> = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchText) {
      navigate(`/search?query=${searchText}`);
      setSearchText("");
    } else {
      navigate(`/`);
      setSearchText("");
    }
  };

  if (variant === "electronic") {
    return (
      <form
        onSubmit={handleSearch}
        className="relative overflow-hidden w-full flex bg-primary-foreground rounded-full p-1"
      >
        <label className="flex items-center w-full">
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchText(e.target.value)
            }
            value={searchText}
            className="form-input w-full appearance-none transition ease-in-out text-sm font-sans focus:ring-0 outline-none border-none focus:outline-none pl-5 h-9 bg-transparent focus:bg-transparent text-foreground placeholder:text-muted-foreground rounded-l-full"
            placeholder="Search for products (e.g. shirt, pant)"
          />
        </label>
        <button
          aria-label="Search"
          type="submit"
          className="outline-none flex items-center justify-center transition duration-200 ease-in-out focus:outline-none w-9 h-9 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shrink-0"
        >
          <MagnifyingGlassIcon className="h-5 w-5 stroke-2" aria-hidden="true" />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-stretch border-2 border-primary rounded-full overflow-hidden h-11 bg-white w-full"
    >
      <button
        type="button"
        className="flex items-center gap-1 px-4 bg-white text-xs xl:text-sm font-medium text-gray-700 border-r border-gray-200 hover:bg-gray-50 shrink-0 whitespace-nowrap"
      >
        Products
        <ChevronDownIcon className="h-3.5 w-3.5 text-gray-500 ml-0.5" />
      </button>

      <div className="flex-1 relative flex items-center bg-white min-w-0">
        <input
          type="text"
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          className="w-full h-full px-4 text-xs xl:text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400 pr-10"
          placeholder="Enter a keyword to search products"
        />
        <button
          type="button"
          aria-label="Search by image"
          className="absolute right-2 text-gray-400 hover:text-gray-600 p-1"
        >
          <CameraIcon className="h-5 w-5" />
        </button>
      </div>

      <button
        type="submit"
        aria-label="Search"
        className="flex items-center justify-center px-5 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 transition-colors"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  );
};

export default SearchInput;
