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
  HiMenu,
  HiX,
} from "react-icons/hi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SidebarProps = {
  showFontControls?: boolean;
  onLoginClick?: () => void;
  fontSize?: number;
  setFontSize?: React.Dispatch<React.SetStateAction<number>>;
};

export default function Sidebar({
  showFontControls = false,
  onLoginClick,
  fontSize,
  setFontSize,
}: SidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSiderOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <>
    <button 
      className="sidebar__toggle"
      onClick={() => setIsSiderOpen(!isSidebarOpen)}
      aria-label="Toggle sidebar"
    >
      {isSidebarOpen ? <HiX /> : <HiMenu />}
    </button>  

    <div 
      className={`sidebar__overlay ${
        isSidebarOpen ? "sidebar__overlay--open" : ""
        }`}
        onClick={() => setIsSiderOpen(false)}
      />
      
      <aside className={`sidebar ${isSidebarOpen ? "sidebar--open" : ""}`}>

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
        <button
          className={fontSize === 14 ? "sidebar__font-size--active" : ""}
          onClick={() => setFontSize?.(14)}
          >
          Aa
        </button>

        <button
          className={fontSize === 16 ? "sidebar__font-size--active" : ""}
          onClick={() => setFontSize?.(16)}
          >
          Aa
        </button>

        <button
          className={fontSize === 18 ? "sidebar__font-size--active" : ""}
          onClick={() => setFontSize?.(18)}
          >
          Aa
        </button>

        <button
          className={fontSize === 20 ? "sidebar__font-size--active" : ""}
          onClick={() => setFontSize?.(20)}
          >
          Aa
        </button>
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
    </>
  );
}