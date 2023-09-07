"use client";
import React, { useEffect, useState } from "react";
import { Title } from "../components/Title";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ErrorMessage } from "../components/ErrorMessage";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function Saved() {
  const [data, setData] = useState<
    {
      iv: string;
      encrypted: string;
      remainingReads: number | null;
      id: string;
    }[]
  >([]);

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
        {data?.map((item, key) => (
          <ul
            key={key}
            className="text-white flex align-middle text-center items-center"
          >
            <li>ID:{item.id}</li>
            <li>encrypted:{item.encrypted}</li>
            <li>Remaining Reads:{item.remainingReads}</li>
          </ul>
        ))}
      </div>
    </div>
  );
}
