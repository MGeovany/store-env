import { BASE_URL } from "@/util/constants";
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import React, { FC, useState } from "react";

interface CopyInputProps {
  id: string;
  text: string;
  gradient?: boolean;
}
export const CopyInput: FC<CopyInputProps> = ({ id, text, gradient }) => {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const urlPath = (hash: string): string => {
    return `${BASE_URL}/unseal#${hash}`;
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(urlPath(url));
    setCopiedStates((prevStates) => ({
      ...prevStates,
      [id]: true,
    }));

    setTimeout(() => {
      setCopiedStates((prevStates) => ({
        ...prevStates,
        [id]: false,
      }));
    }, 2000);
  };

  return (
    <div className=" flex items-stretch flex-grow mt-4 focus-within:z-10">
      <pre
        className={`${
          gradient ? "border-gradient border-gradient-orange " : ""
        }flex justify-start px-4 py-3 font-mono text-center bg-transparent border rounded border-zinc-600 focus:border-zinc-100/80 focus:ring-0 sm:text-sm text-zinc-100 w-[200px] md:w-full truncate`}
      >
        {urlPath(text)}
      </pre>

      <button
        type="button"
        className=" inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium duration-150 border text-zinc-700 border-zinc-300 rounded-r-md bg-zinc-50 hover focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 hover:text-zinc-900 hover:bg-white"
        onClick={() => handleCopy(id, text)}
      >
        {copiedStates[id] ? (
          <ClipboardDocumentCheckIcon className="w-5 h-5" aria-hidden="true" />
        ) : (
          <ClipboardDocumentIcon className="w-5 h-5" aria-hidden="true" />
        )}
        <span>{copiedStates[id] ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
};
