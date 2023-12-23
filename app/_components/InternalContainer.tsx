"use client";
import React from "react";
import InternalHeader from "./InternalHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "react-query";
import { useNavStore } from "@/store/NavStore";
import { getDevice } from "@/lib/deviceHelper";

const queryClient = new QueryClient();

function InternalContainer({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [isOpen] = useNavStore((state) => [state.isOpen]);

  const [device, setDevice] = React.useState<any>();

  React.useEffect(() => {
    if (getDevice()) {
      setDevice(getDevice());
    }
  }, []);

  React.useEffect(() => {
    if (device) {
      try {
        fetch("https://api.ipify.org/?format=json")
          .then((data) => data.json())
          .then((json) => {
            fetch("/api/siteVisit?ip=" + json.ip, {
              method: "POST",
              body: JSON.stringify(device),
            });
          })
          .catch((e) => {});
      } catch (err) {
        fetch("/api/siteVisit", {
          method: "POST",
          body: JSON.stringify(device),
        });
      }
    }
  }, [device, session]);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`flex max-w-[100vw] grow flex-col rounded-l-3xl bg-gray-50 ${
          isOpen === true
            ? "lg:max-w-[calc(100vw-250px)]"
            : "lg:max-w-[calc(100vw-64px)]"
        }`}
      >
        <InternalHeader session={session} />
        <ScrollArea className="max-h-[calc(100vh-150px)] min-h-[calc(100vh-150px)] bg-gray-100 lg:max-h-[calc(100vh-145px)] lg:min-h-[calc(100vh-145px)]">
          {children}
        </ScrollArea>
      </div>
    </QueryClientProvider>
  );
}

export default InternalContainer;
