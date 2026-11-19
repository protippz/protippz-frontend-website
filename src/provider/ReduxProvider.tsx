"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  // One store per browser session (and per request during SSR) – never shared
  // between users on the server.
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
