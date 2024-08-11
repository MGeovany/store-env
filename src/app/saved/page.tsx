"use client";
import React, { useEffect, useState } from "react";
import { Title } from "../components/Title";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ErrorMessage } from "../components/ErrorMessage";
import {
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import * as Collapsible from "@radix-ui/react-collapsible";
import { BASE_URL } from "@/util/constants";

interface OpenStates {
  [key: string]: boolean;
}

export default function Saved() {
  const [data, setData] = useState<DatabaseStructure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openStates, setOpenStates] = useState<OpenStates>({});

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(`${BASE_URL}/unseal#${url}`);
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

  const handleOpenChange = (id: string, open: boolean) => {
    setOpenStates((prevStates) => ({
      ...prevStates,
      [id]: open,
    }));
  };

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/");
    },
  });
  const userId = session?.user?.email;

  useEffect(() => {
    async function fetchSaved() {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch(`/api/saved?userId=${userId}`);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const json = (await res.json()) as [
          {
            iv: string;
            encrypted: string;
            remainingReads: number | null;
            id: string;
          }
        ];

        setData(json);
      } catch (e) {
        console.error(e);
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, [userId]);

  return (
    <div className="container px-8 mx-auto mt-16 lg:mt-32 ">
      <div className="max-w-4xl mx-auto">
        <Title>Saved Env Files</Title>
        {error && data === null ? <ErrorMessage message={error} /> : null}
        <div className="flex justify-center w-full">
          {loading ? <Cog6ToothIcon className="w-5 h-5 animate-spin" /> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 my-4">
          {data?.map((item) => (
            <Collapsible.Root
              key={item.id}
              className="flex flex-col justify-center text-white border-zinc-600 border-2 text-ellipsis overflow-hidden p-4 mt-4 rounded-lg "
              open={openStates[item.id] || false}
              onOpenChange={(open) => handleOpenChange(item.id, open)}
            >
              <div className="flex align-middle flex-row justify-between  ">
                <div>
                  <h1 className="text-xl font-bold">ID: {item.id}</h1>
                  <h2 className="text-sm font-semibold text-zinc-400">
                    {item.date ? `${formatDistanceToNow(item.date)} ago` : null}
                  </h2>
                </div>
                <Collapsible.Trigger asChild>
                  <div className="flex flex-col justify-center">
                    {openStates[item.id] ? (
                      <ChevronUpIcon className="w-5 h-5 cursor-pointer" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 cursor-pointer" />
                    )}
                  </div>
                </Collapsible.Trigger>
              </div>
              <Collapsible.Content>
                <div className="relative flex items-stretch flex-grow mt-4 focus-within:z-10">
                  <pre className="px-4 py-3 font-mono text-center bg-transparent border rounded border-zinc-600 focus:border-zinc-100/80 focus:ring-0 sm:text-sm text-zinc-100">
                    {item.url
                      ? `${BASE_URL}/unseal#${item.url}`
                      : "No link found"}
                  </pre>
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium duration-150 border text-zinc-700 border-zinc-300 rounded-r-md bg-zinc-50 hover focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 hover:text-zinc-900 hover:bg-white"
                    onClick={() => handleCopy(item.id, item.url ?? "")}
                  >
                    {copiedStates[item.id] ? (
                      <ClipboardDocumentCheckIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <ClipboardDocumentIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    )}
                    <span>{copiedStates[item.id] ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          ))}
        </div>
      </div>
    </div>
  );
}
