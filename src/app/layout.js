"use client"
import "./globals.css";
import { Inter } from "next/font/google";
import { GraphQLClient, ClientContext } from 'graphql-hooks';

const client = new GraphQLClient({
  url: 'https://graphql.datocms.com/',
  headers: {
      Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
  },
});

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "TimeFrame",
//   description: "",
//   manifest: "/manifest.json",
// };


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#202020" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/logo/Logomark_TimeFrame_Vit_T.png"/>
      </head>
      <ClientContext.Provider value={client}>
        <body className={inter.className}>{children}</body>
      </ClientContext.Provider>
    </html>
  );
}
