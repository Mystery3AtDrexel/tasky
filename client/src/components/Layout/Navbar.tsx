import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getMe, postLogout } from "../../lib/api";
import {
  PiArrowLineLeft,
  PiCalendarBlank,
  PiGear,
  PiHouse,
} from "react-icons/pi";
import Avatar from "../Common/Avatar";
import { ReactNode } from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";

type NavItemProps = {
  to: string;
  children: ReactNode;
};

function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-3xl ${isActive ? "text-pink-600" : "text-gray-800"}`
      }
    >
      {children}
    </NavLink>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const onLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/login");
  };

  return (
    <nav className="flex gap-6 w-full h-[80px] z-10 items-end justify-between text-lg px-4 py-2 sticky top-0 bg-white border-b border-gray-400">
      <div className="flex-1 flex-grow w-full h-full justify-center flex items-center">
        <img src="/logo-small.svg" alt="logo" />
      </div>
      <div className="flex-1 flex w-full h-full justify-center items-center gap-10 text-xl">
        <NavItem to="/">
          <PiHouse />
        </NavItem>
        <NavItem to="/calendar">
          <PiCalendarBlank />
        </NavItem>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button className="outline-none text-gray-800 flex h-full gap-3 justify-center items-center">
              <Avatar
                firstName={data?.user.name.split("")[0] ?? ""}
                lastName={data?.user.name.split(" ")[1] ?? ""}
              />
              <p className="text-2xl hidden md:block">{data?.user.name}</p>
            </button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content className="min-w-[220px] z-20 bg-white rounded-lg shadow-md border divide-y outline-none">
              <Dropdown.Item asChild>
                <Link
                  to="#"
                  className="w-full p-3 flex gap-2 items-center hover:bg-gray-50 outline-none"
                >
                  <PiGear /> Settings
                </Link>
              </Dropdown.Item>
              <Dropdown.Item asChild>
                <button
                  onClick={onLogout}
                  className="w-full p-3 flex gap-2 items-center hover:bg-gray-50 outline-none"
                >
                  <PiArrowLineLeft /> Logout
                </button>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      </div>
    </nav>
  );
}

export default Navbar;
