import {
  HiOutlineHome,
  HiOutlineBookmark,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import Link from "next/link";

export default function Sidebar () {
    return (
        <aside className="sidebar">
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
        
        <div className="sidebar__font-size">
          <button className="sidebar__font sidebar__font--active">Aa</button>
          <button className="sidebar__font">Aa</button>
          <button className="sidebar__font">Aa</button>
          <button className="sidebar__font">Aa</button>
        </div>
        
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
          </ul>
              </aside>
    );
}