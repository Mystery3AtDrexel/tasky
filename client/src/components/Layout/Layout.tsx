import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { getAuthState } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Layout() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth-state"],
    queryFn: getAuthState,
  });
  if (isLoading) return null;
  if (!data?.isAuthenticated) return <Navigate to="/login" />;
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      <Navbar />
      <main className="h-full w-full px-4">
        <Outlet />
      </main>
    </div>
  );
}
