// app/index.tsx
import type { RootState } from "@/store";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
  const token = useSelector((s: RootState) => s.auth.token);
  return <Redirect href={token ? "/(tabs)" : "/login"} />;
}
