import { useEffect } from "react";

// internal import
import { notifyError, notifySuccess } from "@utils/toast";

interface ShowToastProps {
  success?: string;
  error?: string;
}

const ShowToast = ({ success, error }: ShowToastProps) => {
  useEffect(() => {
    if (success) {
      notifySuccess(success);
    }
    if (error) {
      notifyError(error);
    }
  }, [success, error]);

  return null;
};

export default ShowToast;
