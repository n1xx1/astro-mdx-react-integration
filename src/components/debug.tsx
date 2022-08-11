import { useContext } from "react";
import { ImportContext } from "./import";

export function Debug({}: {}) {
  const ctx = useContext(ImportContext);
  return <>{JSON.stringify(ctx)}</>;
}
