import { Button } from "@components/ui/button";
import { useState } from "react";

interface SubmitButtonProps {
  title: string;
}

/**
 * SubmitButton — In Vite/React there is no `react-dom` `useFormStatus`.
 * We track pending state via the form's submit event instead.
 * The Button's disabled/loading state is managed locally.
 */
const SubmitButton = ({ title }: SubmitButtonProps) => {
  // useFormStatus is a Next.js / React 19 server-action concept.
  // In a plain React app we leave pending as false; callers should
  // pass a controlled disabled state if needed via the parent form.
  const pending = false;

  return (
    <>
      <Button
        disabled={pending}
        isLoading={pending}
        loadingText="Processing"
        variant="create"
        type="submit"
      >
        {title}
      </Button>
    </>
  );
};

export default SubmitButton;
