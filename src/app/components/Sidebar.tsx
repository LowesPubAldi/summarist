"use client";

import {
  HiOutlineHome,
  HiOutlineBookmark,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogin,
  HiOutlineLogout,
} from "react-icons/hi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SidebarProps = {
  showFontControls?: boolean;
  onLoginClick?: () => void;
};

export default function Sidebar({
  showFontControls = false,
  onLoginClick,
}: SidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      window.location.reload();
      return;
    }

    onLoginClick?.();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src="/logo.png" alt="Summarist" />
      </div>

      <ul className="sidebar__menu">
        <li>
          <Link href="/for-you">
            <HiOutlineHome />
            <span>For You</span>
          </Link>
        </li>

        <li>
          <Link href="/library">
            <HiOutlineBookmark />
            <span>My Library</span>
          </Link>
        </li>

        <li>
          <HiOutlinePencil />
          <span>Highlights</span>
        </li>

        <li>
          <HiOutlineSearch />
          <span>Search</span>
        </li>
      </ul>

      {showFontControls && (
    <div className="sidebar__font-size">
       <button>Aa</button>
       <button>Aa</button>
       <button>Aa</button>
       <button>Aa</button>
    </div>
    )}

      <ul className="sidebar__menu">
        <li>
          <Link href="/settings">
            <HiOutlineCog />
            <span>Settings</span>
          </Link>
        </li>

        <li>
          <HiOutlineQuestionMarkCircle />
          <span>Help & Support</span>
        </li>

        <li onClick={handleAuthClick}>
          {isLoggedIn ? <HiOutlineLogout /> : <HiOutlineLogin />}
          <span>{isLoggedIn ? "Logout" : "Login"}</span>
        </li>
      </ul>
    </aside>
  );
}