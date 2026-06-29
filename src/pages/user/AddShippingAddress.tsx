import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiCheck,
  FiAlertCircle,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";

import { useAuth } from "@stores/useAuthStore";
import { Button } from "@components/ui/button";
import { addShippingAddress } from "@services/CustomerServices";
import { notifySuccess, notifyError } from "@utils/toast";
import { countries } from "@utils/countries";
import type { City } from "@utils/countries";

// ---- Types ----

interface FormErrors {
  name?: string[];
  address?: string[];
  contact?: string[];
  country?: string[];
  city?: string[];
  area?: string[];
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

const AddShippingAddress: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleInputChange = (name: keyof SelectedLocation, value: string) => {
    if (name === "country") {
      const countryData = countries.find((c) => c.name === value);
      setCities(countryData?.cities ?? []);
      setAreas([]);
      setSelectedValue({ country: value, city: "", area: "" });
    } else if (name === "city") {
      const cityData = cities.find((c) => c.name === value);
      setAreas(cityData?.areas ?? []);
      setSelectedValue((prev) => ({ ...prev, city: value, area: "" }));
    } else {
      setSelectedValue((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Redirect to my-account after success
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => navigate("/user/my-account"), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, navigate]);

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

    const { success, error } = await addShippingAddress({
      userId: user._id,
      shippingAddressData: {
        name,
        address,
        contact,
        country: selectedValue.country,
        city: selectedValue.city,
        area: selectedValue.area,
      },
      token: user.token,
    });

    if (error) {
      setState({ success: false, error, message: null, errors: {} });
      notifyError(error);
    } else {
      setState({
        success: true,
        error: null,
        message: success ?? "Shipping address added successfully!",
        errors: {},
      });
      notifySuccess(success ?? "Shipping address added successfully!");
    }

    setIsPending(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FiPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-none text-foreground sm:text-xl">
              Add New Shipping Address
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Add a new delivery address to your account
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {state.success && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <FiCheck className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-primary">{state.message}</p>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <FiAlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Hidden user ID field */}
        <input type="hidden" name="userId" value={user?._id ?? ""} />

        <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
          <div className="space-y-5">
            {/* Name & Contact Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    placeholder="Enter full name"
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
                    placeholder="Phone/Mobile number"
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
            </div>

            {/* Full Address */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMapPin className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Street address, building, apartment, etc."
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
                  name="country"
                  value={selectedValue.country}
                  onChange={(e) =>
                    handleInputChange("country", e.target.value)
                  }
                  className="h-12 text-sm pl-11 pr-10 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <FiChevronDown className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              {state.errors.country && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {state.errors.country.join(" ")}
                </p>
              )}
            </div>

            {/* City & Area Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* City */}
              <div className="form-group">
                <label className="block text-muted-foreground font-medium text-sm mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMapPin className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    name="city"
                    value={selectedValue.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={!selectedValue.country}
                    className="h-12 text-sm pl-11 pr-10 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer disabled:bg-muted disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                {state.errors.city && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {state.errors.city.join(" ")}
                  </p>
                )}
              </div>

              {/* Area */}
              <div className="form-group">
                <label className="block text-muted-foreground font-medium text-sm mb-2">
                  Area
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMapPin className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    name="area"
                    value={selectedValue.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    disabled={!selectedValue.city}
                    className="h-12 text-sm pl-11 pr-10 w-full rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer disabled:bg-muted disabled:cursor-not-allowed"
                  >
                    <option value="">Select Area</option>
                    {areas.map((area, index) => (
                      <option key={index} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                {state.errors.area && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {state.errors.area.join(" ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              size="lg"
              isLoading={isPending}
              loadingText="Adding..."
            >
              <FiPlus className="h-4 w-4" />
              Add Shipping Address
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddShippingAddress;
