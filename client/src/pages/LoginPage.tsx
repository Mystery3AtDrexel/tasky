import { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

function LoginPage() {
  return (
    <div className="w-full h-full flex justify-center items-center p-4 bg-neutral-100">
      <div className="w-full h-[400px] sm:w-[400px] border border-neutral-200 shadow-xl p-8 rounded-xl bg-white flex flex-col gap-2">
        <div className="flex-1 w-full h-fit flex justify-center items-center">
          <img src="/logo-large.svg" alt="logo" />
        </div>
        <p className="text-lg font-bold">Login with social account</p>
        <AuthCard title="Login with Google" icon={<FcGoogle />} />
      </div>
    </div>
  );
}

type AuthCardProps = {
  title: string;
  icon: ReactNode;
};

const AuthCard = ({ title, icon }: AuthCardProps) => {
  return (
    <Link to={API_ENDPOINT + "/auth/google"}>
      <div className="w-full border border-neutral-200 shadow-md rounded-xl p-4 hover:bg-gray-50 flex gap-4 items-center text-2xl justify-center">
        {icon}
        {title}
      </div>
    </Link>
  );
};

export default LoginPage;
