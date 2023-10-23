"use client";
import { supabase } from "../../../supabase";
import { useRouter } from "next/navigation";
import react, { useEffect, useState } from "react";
import { GraphQLClient, ClientContext } from 'graphql-hooks';
import Header from "@/components/header/page";

const client = new GraphQLClient({
  url: 'https://graphql.datocms.com/',
  headers: {
      Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
  },
});

export default function UnauthenticatedLayout({ children }) {

return (
  <ClientContext.Provider value={client}>
    <main>{children}</main>
  </ClientContext.Provider>
);
}
