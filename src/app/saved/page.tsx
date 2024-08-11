"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Title } from "@/components/Title";
import { ErrorMessage } from "@/components/ErrorMessage";
import { CopyInput } from "@/components/CopyInput";

export default function Saved() {
  const [data, setData] = useState<DatabaseStructure[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

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
      if (!userId) return;
      try {
        setError(null);
        setLoading(true);

        const res = await fetch(`/api/saved?userId=${userId}`);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const json = (await res.json()) as DatabaseStructure[];

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
        {loading && (
          <div className="flex justify-center w-full">
            <Cog6ToothIcon className="w-5 h-5 animate-spin" />
          </div>
        )}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && data.length === 0 && (
          <ErrorMessage message={error} />
        )}
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
                  <h1 className="text-xl font-bold truncate w-[250px] md:w-full">
                    ID: {item.id}
                  </h1>
                  <h2 className="text-sm font-semibold text-zinc-400">
                    {item.createdAt
                      ? `${formatDistanceToNow(item.createdAt)} ago`
                      : null}
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
                <CopyInput id={item.id} text={item.url} />
              </Collapsible.Content>
            </Collapsible.Root>
          ))}
        </div>
      </div>
    </div>
  );
}
