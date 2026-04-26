"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBalance, useWalletConnection } from "@solana/react-hooks";
import { CopyCheckIcon, CopyIcon, LogOutIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";


function truncate(address?: string) {
  return !address ? "No Wallet" : `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletButton() {
  const { connectors, connect, disconnect, wallet, connected } = useWalletConnection();
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const { lamports } = useBalance(wallet?.account?.address);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyAddress = async (address?: string) => {
    if (!address || copySuccess) return;
    await navigator.clipboard.writeText(address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }


  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        className="text-xs px-5 font-medium w-full"
        onClick={() => connected ? setOpenWalletModal(true) : setOpenConnectModal(true)}
      >
        {connected ? truncate(wallet?.account.address.toString()) : "Connect Wallet"}
      </Button>

      <Dialog open={openWalletModal} onOpenChange={setOpenWalletModal}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Wallet Details</DialogTitle>
          <DialogDescription />

          <div className="flex flex-col w-full gap-4 py-2 items-center justify-center">
            {wallet?.connector.icon && (
              <img
                src={wallet.connector.icon}
                alt={wallet.connector.name}
                className="size-12"
              />
            )}

            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-medium">
                {truncate(wallet?.account.address.toString())}
              </p>

              <p className="font-medium">
                Balance: {(Number(lamports || "0") / 1e9)?.toString()} SOL
              </p>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => handleCopyAddress(wallet?.account.address.toString())}
                className="flex flex-col h-fit items-center justify-center py-2 gap-1 flex-1"
              >
                {copySuccess ? (
                  <>
                    <CopyCheckIcon />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    Copy Address
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={async () => {
                  await disconnect();
                  setOpenWalletModal(false);
                }}
                className="flex flex-col h-fit items-center justify-center py-2 gap-1 flex-1"
              >
                <LogOutIcon />
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openConnectModal} onOpenChange={setOpenConnectModal}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription />

          <div className="grid gap-1">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                variant="ghost"
                disabled={!connector.ready}
                onClick={async () => {
                  await connect(connector.id);
                  setOpenConnectModal(false);
                }}
                className="font-semibold items-center justify-start h-fit py-2.5"
              >
                {connector.icon && (
                  <img
                    src={connector.icon}
                    alt={connector.name}
                    className="size-7 mr-2"
                  />
                )}
                {connector.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
