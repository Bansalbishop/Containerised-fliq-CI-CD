import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessagesSquare, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessagesSquare className="size-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Fliq</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn bg-black/60 btn-sm text-white  gap-2 transition-colors"
            >
              <Settings className="size-6" />
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="btn btn-sm bg-black/60 text-white  gap-2 transition-colors"
                >
                  <User className="size-6" />
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
