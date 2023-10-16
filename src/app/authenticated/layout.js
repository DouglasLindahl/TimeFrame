"use client";
import { supabase } from "../../../supabase";
import { useRouter } from "next/navigation";
import react, { useEffect, useState } from "react";
import { GraphQLClient, ClientContext } from 'graphql-hooks';

const client = new GraphQLClient({
  url: 'https://graphql.datocms.com/',
  headers: {
      Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
  },
});

export default function ProtectedLayout({ children }) {
  const [session, setSession] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkUserSession = async () => {
      const session = supabase.auth.getSession();
      if (session) {
        if ((await session).data.session == null) {
          router.push("/login");
        } else {
          setSession(true);
        }
      }
    };
    setIsSuccess(true);
    checkUserSession();
  }, [router]);
  if (!isSuccess) {
    <p>Loading...</p>;
  } else {
    return (
      <ClientContext.Provider value={client}>
        <main>{children}</main>
      </ClientContext.Provider>
    );
  }
}
