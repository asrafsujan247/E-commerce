import { Link } from "react-router-dom";
import { FiUnlock, FiUser } from "react-icons/fi";

//internal imports
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useAuth } from "@stores/useAuthStore";
import type { StoreCustomizationSetting } from "@appTypes/index";

interface LogoutButtonProps {
  storeCustomization?: StoreCustomizationSetting | null;
}

const LogoutButton = ({ storeCustomization }: LogoutButtonProps) => {
  const { user, logout } = useAuth();

  return (
    <>
      <Link
        to={
          user
            ? "/user/my-account"
            : "/auth/login?redirectUrl=user/my-account"
        }
        className="font-medium hover:text-primary"
      >
        {String(storeCustomization?.navbar?.my_account ?? '')}
      </Link>
      <span className="mx-2">|</span>
      {user?.email ? (
        <button
          onClick={logout}
          type="submit"
          className="flex items-center font-medium hover:text-primary"
        >
          <span className="mr-1">
            <FiUnlock />
          </span>
          {String(storeCustomization?.navbar?.logout ?? '')}
        </button>
      ) : (
        <Link
          to="/auth/login"
          className="flex items-center font-medium hover:text-primary"
        >
          <span className="mr-1">
            <FiUser />
          </span>
          {String(storeCustomization?.navbar?.login ?? '')}
        </Link>
      )}
    </>
  );
};

export default LogoutButton;
