import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

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
        <div className="animate-pulse grid gap-4 mb-8 sm:grid-cols-2 grid-cols-1">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="grid gap-4 mb-8 sm:grid-cols-2 grid-cols-1">
        {/* User Info Card */}
        <div className="flex h-full relative">
          <div className="flex items-center border border-border w-full rounded-xl p-5 relative bg-muted/30">
            <Link
              to="/user/update-profile"
              className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Edit
            </Link>
            <div className="flex items-center justify-center rounded-full text-xl text-center mr-4 bg-muted">
              {user?.image &&
              (user.image.startsWith("http://") ||
                user.image.startsWith("https://")) ? (
                <img
                  src={user.image}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full bg-muted"
                  alt={user?.name?.[0] ?? "U"}
                />
              ) : (
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted text-xl font-bold text-center mr-4">
                  {user?.name?.charAt(0) ?? "U"}
                </div>
              )}
            </div>
            <div>
              <h5 className="leading-none mb-2 text-base font-medium text-muted-foreground">
                {user?.name}
              </h5>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address Card */}
        {hasShippingAddress ? (
          <div className="flex h-full relative">
            <div className="flex items-center border border-border w-full rounded-xl p-5 relative bg-muted/30">
              <Link
                to={`/user/shipping-address?id=${user?._id}`}
                className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Edit
              </Link>
              <div className="flex-grow">
                {fetchError ? (
                  <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
                    {fetchError}
                  </h2>
                ) : (
                  <>
                    <h5 className="leading-none mb-2 text-base font-medium text-muted-foreground">
                      {address?.name}{" "}
                      <span className="text-xs text-muted-foreground">
                        (Default Shipping Address)
                      </span>
                    </h5>
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
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full relative">
            <Link
              to="/user/add-shipping-address"
              className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-3 px-4 text-center relative transition-colors"
            >
              <Plus className="text-xl font-bold text-center mr-4" /> Add
              Default Shipping Address
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
