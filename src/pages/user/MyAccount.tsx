import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, User, Mail, Phone, MapPin, Pencil } from "lucide-react";

import { useAuth } from "@stores/useAuthStore";
import { getShippingAddress } from "@services/CustomerServices";
import type { ShippingAddress } from "@appTypes/index";

const MyAccount: React.FC = () => {
  const { user } = useAuth();

  const [address, setAddress] = useState<ShippingAddress>({});
  const [hasShippingAddress, setHasShippingAddress] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!user?._id || !user?.token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { shippingAddress, error } = await getShippingAddress({
        id: "",
        userId: user._id,
        token: user.token,
      });

      if (error) {
        setFetchError(error);
      } else if (shippingAddress && Object.keys(shippingAddress).length > 0) {
        setAddress(shippingAddress);
        setHasShippingAddress(true);
      }

      setLoading(false);
    };

    fetchAddress();
  }, [user?._id, user?.token]);

  if (loading) {
    return (
      <div className="overflow-hidden">
        <div className="animate-pulse">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-56 rounded bg-muted" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-40 rounded-xl bg-muted" />
            <div className="h-40 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  const editButtonClass =
    "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary";

  return (
    <div className="overflow-hidden">
      <div className="mx-auto max-w-screen-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-none text-foreground sm:text-xl">
              My Account
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage your profile details and shipping address.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Profile Card */}
          <div className="flex flex-col rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="h-4 w-4 text-primary" />
                Profile
              </span>
              <Link to="/user/update-profile" className={editButtonClass}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xl font-bold ring-2 ring-primary/15">
                {user?.image &&
                (user.image.startsWith("http://") ||
                  user.image.startsWith("https://")) ? (
                  <img
                    src={user.image}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                    alt={user?.name?.[0] ?? "U"}
                  />
                ) : (
                  <span>{user?.name?.charAt(0) ?? "U"}</span>
                )}
              </div>
              <div className="min-w-0">
                <h5 className="truncate text-base font-semibold text-foreground">
                  {user?.name}
                </h5>
                {user?.email && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                )}
                {user?.phone && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {user.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          {hasShippingAddress ? (
            <div className="flex flex-col rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Shipping Address
                </span>
                <Link
                  to={`/user/shipping-address?id=${user?._id}`}
                  className={editButtonClass}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </div>
              {fetchError ? (
                <p className="text-sm text-destructive">{fetchError}</p>
              ) : (
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="text-base font-semibold text-foreground">
                      {address?.name}
                    </h5>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      Default
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address?.contact}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address?.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address?.country}, {address?.city}, {address?.area} -{" "}
                    {address?.zipCode}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/user/add-shipping-address"
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Add a shipping address
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Set a default delivery address for faster checkout.
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
