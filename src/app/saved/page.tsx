"use client";
import React, { useEffect, useState } from "react";
import { Title } from "../components/Title";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ErrorMessage } from "../components/ErrorMessage";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

export default function Saved() {
  const [data, setData] = useState<DatabaseStructure[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <span>
          {loading ? <Cog6ToothIcon className="w-5 h-5 animate-spin" /> : null}
        </span>
        <div className="grid grid-cols-2 gap-4 my-4">
          {data?.map((item, key) => (
            <ul
              key={key}
              className="text-white flex align-middle border-zinc-400  border-2 flex-col p-4 mt-4 text-ellipsis overflow-hidden "
            >
              <li>ID: {item.id}</li>
              <li>
                URL: <span className="text-blue-500">{item.url}</span>
              </li>
              <li>Encrypted: {item.encrypted.length}</li>
              <li>Remaining Reads: {item.remainingReads}</li>
              <li>
                Date:
                {item.date ? (
                  <span className="text-green-500 pl-2 font-bold ">
                    {formatDistanceToNow(item.date)}
                  </span>
                ) : (
                  <span className="text-red-500 pl-2 ">no date</span>
                )}
              </li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
