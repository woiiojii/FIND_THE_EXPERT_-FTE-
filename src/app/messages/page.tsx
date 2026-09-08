import { Suspense } from "react";
import MessagesClient from "./MessagesClient";

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] rounded-3xl flex items-center justify-center border border-slate-200 bg-white">
          <p className="text-sm text-slate-500">Loading messages...</p>
        </div>
      }
    >
      <MessagesClient />
    </Suspense>
  );
}