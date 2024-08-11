import { FC } from "react";

type ErrorMessageProps = {
  message: string | null;
};

export const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center my-8 lg:my-16">
      {message && (
        <span className="px-4 py-2 text-red-500 border rounded border-red-500/50 bg-red-500/10">
          {message}
        </span>
      )}
    </div>
  );
};
