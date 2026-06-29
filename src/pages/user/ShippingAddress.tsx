import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiUser,
  FiPhone,
  FiGlobe,
  FiHome,
  FiMap,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

import { useAuth } from "@stores/useAuthStore";
import { getShippingAddress, addShippingAddress } from "@services/CustomerServices";
import { notifySuccess, notifyError } from "@utils/toast";
import { countries } from "@utils/countries";
import type { ShippingAddress as ShippingAddressType } from "@appTypes/index";
import type { City } from "@utils/countries";

// ---- Types ----

interface FormErrors {
  name?: string[];
  address?: string[];
  contact?: string[];
  country?: string[];
  city?: string[];
}

interface FormState {
  success: boolean;
  error: string | null;
  message: string | null;
  errors: FormErrors;
}

interface SelectedLocation {
  country: string;
  city: string;
  area: string;
}

// ---- Component ----

const ShippingAddress: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addressId = searchParams.get("id") ?? "";

  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddressType | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<FormState>({
    success: false,
    error: null,
    message: null,
    errors: {},
  });

  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<SelectedLocation>({
    country: "",
    city: "",
    area: "",
  });

  // Load shipping address
  useEffect(() => {
    const fetchAddress = async () => {
      if (!user?._id || !user?.token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { shippingAddress: addr, error } = await getShippingAddress({
        id: addressId,
        userId: user._id,
        token: user.token,
      });

      if (error) {
        setFetchError(error);
      } else if (addr) {
        setShippingAddress(addr);
      }
      setLoading(false);
    };

    fetchAddress();
  }, [user?._id, user?.token, addressId]);

  // Populate cascade dropdowns from existing address
  useEffect(() => {
    if (shippingAddress) {
      setSelectedValue({
        country: shippingAddress.country ?? "",
        city: shippingAddress.city ?? "",
        area: shippingAddress.area ?? "",
      });

      if (shippingAddress.country) {
        const countryData = countries.find(
          (c) => c.name === shippingAddress.country,
        );
        const citiesList = countryData?.cities ?? [];
        setCities(citiesList);

        if (shippingAddress.city) {
          const cityData = citiesList.find(
            (c) => c.name === shippingAddress.city,
          );
          setAreas(cityData?.areas ?? []);
        }
      }
    }
  }, [shippingAddress]);

  const handleInputChange = (name: keyof SelectedLocation, value: string) => {
    setSelectedValue((prev) => ({ ...prev, [name]: value }));

    if (name === "country") {
      const countryData = countries.find((c) => c.name === value);
      setCities(countryData?.cities ?? []);
      setAreas([]);
      setSelectedValue((prev) => ({ ...prev, country: value, city: "", area: "" }));
    }
    if (name === "city") {
      const cityData = cities.find((c) => c.name === value);
      setAreas(cityData?.areas ?? []);
      setSelectedValue((prev) => ({ ...prev, city: value, area: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?._id || !user?.token) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const contact = (formData.get("contact") as string)?.trim();

    const errors: FormErrors = {};
    if (!name) errors.name = ["Full name is required"];
    if (!address) errors.address = ["Address is required"];
    if (!contact) errors.contact = ["Contact number is required"];
    if (!selectedValue.country) errors.country = ["Country is required"];
    if (!selectedValue.city) errors.city = ["City is required"];

    if (Object.keys(errors).length > 0) {
      setState({ success: false, error: null, message: null, errors });
      return;
    }

    setIsPending(true);
    setState({ success: false, error: null, message: null, errors: {} });

    const shippingAddressData = {
      name,
      address,
      contact,
      country: selectedValue.country,
      city: selectedValue.city,
      area: selectedValue.area,
      shippingAddressId: shippingAddress?._id ?? "",
    };

    const { success, error } = await addShippingAddress({
      userId: user._id,
      shippingAddressData,
      token: user.token,
    });

    if (error) {
      setState({ success: false, error, message: null, errors: {} });
      notifyError(error);
    } else {
      setState({
        success: true,
        error: null,
        message: success ?? "Shipping address updated!",
        errors: {},
      });
      notifySuccess(success ?? "Shipping address updated!");
      navigate("/user/my-account");
    }

    setIsPending(false);
  };

  const isUpdate = !!shippingAddress?._id;

  if (loading) {
    return (
      <div className="max-w-screen-2xl animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded w-64" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <FiMapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isUpdate ? "Update Shipping Address" : "Add Shipping Address"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isUpdate
                ? "Update your delivery address details"
                : "Add a new delivery address"}
            </p>
          </div>
        </div>
      </div>

      {/* Fetch Error */}
      {fetchError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{fetchError}</p>
        </div>
      )}

      {/* Success Message */}
      {state.success && (
        <div className="mb-6 p-4 bg-accent border border-primary rounded-lg flex items-center gap-3">
          <FiCheck className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-primary">{state.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-background rounded-xl shadow-lg border border-border p-6 lg:p-8">
          <div className="space-y-5">
            {/* Full Name */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  defaultValue={shippingAddress?.name ?? ""}
                  placeholder="Enter your full name"
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                />
              </div>
              {state.errors.name && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {state.errors.name.join(" ")}
                </p>
              )}
            </div>

            {/* Full Address */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiHome className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="address"
                  defaultValue={shippingAddress?.address ?? ""}
                  placeholder="Street address, building, apartment"
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                />
              </div>
              {state.errors.address && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {state.errors.address.join(" ")}
                </p>
              )}
            </div>

            {/* Contact */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiPhone className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="tel"
                  name="contact"
                  defaultValue={shippingAddress?.contact ?? ""}
                  placeholder="+1 (555) 000-0000"
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                />
              </div>
              {state.errors.contact && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {state.errors.contact.join(" ")}
                </p>
              )}
            </div>

            {/* Country & City Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Country */}
              <div className="form-group">
                <label className="block text-muted-foreground font-medium text-sm mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiGlobe className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    value={selectedValue.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className="h-12 text-sm pl-11 pr-4 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="hidden"
                    name="country"
                    value={selectedValue.country}
                  />
                </div>
                {state.errors.country && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {state.errors.country.join(" ")}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="form-group">
                <label className="block text-muted-foreground font-medium text-sm mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMap className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    value={selectedValue.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={!selectedValue.country}
                    className="h-12 text-sm pl-11 pr-4 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer disabled:bg-muted disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="hidden"
                    name="city"
                    value={selectedValue.city}
                  />
                </div>
                {state.errors.city && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {state.errors.city.join(" ")}
                  </p>
                )}
              </div>
            </div>

            {/* Area */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Area (Optional)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMapPin className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <select
                  value={selectedValue.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  disabled={!selectedValue.city || areas.length === 0}
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer disabled:bg-muted disabled:cursor-not-allowed"
                >
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <input type="hidden" name="area" value={selectedValue.area} />
              </div>
            </div>

            {/* Hidden ID field */}
            <input
              type="hidden"
              name="shippingAddressId"
              value={shippingAddress?._id ?? ""}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  <span>{isUpdate ? "Update Address" : "Save Address"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddress;
