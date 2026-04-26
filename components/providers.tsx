"use client"

import { ThemeProvider } from "next-themes"
import { autoDiscover, createClient } from "@solana/client";
import { SolanaProvider } from "@solana/react-hooks";

const client = createClient({
  endpoint: "https://api.devnet.solana.com",
  websocketEndpoint: "wss://api.devnet.solana.com",
  walletConnectors: autoDiscover()
});

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SolanaProvider client={client}>
        {children}
      </SolanaProvider>
    </ThemeProvider>
  )
}
