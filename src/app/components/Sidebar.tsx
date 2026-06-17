import {
  HiOutlineHome,
  HiOutlineBookmark,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

export default function Sidebar () {
    return (
        <aside className="sidebar">
                <img className="sidebar__logo" src="/logo.png" alt="Summarist" />
        
              <ul className="sidebar__menu">
          <li><HiOutlineHome />
            <span>For You</span></li>
          <li><HiOutlineBookmark />
            <span>My Library</span></li>
          <li>
            <HiOutlinePencil />
            <span>Highlights</span>
            </li>
          <li><HiOutlineSearch />
            <span>Search</span></li>
        </ul>
        
        <div className="sidebar__font-size">
          <button className="sidebar__font sidebar__font--active">Aa</button>
          <button className="sidebar__font">Aa</button>
          <button className="sidebar__font">Aa</button>
          <button className="sidebar__font">Aa</button>
        </div>
        
        <ul className="sidebar__menu">
          <li><HiOutlineCog />
            <span>Settings</span></li>
          <li><HiOutlineQuestionMarkCircle />
            <span>Help & Support</span></li>
        </ul>
              </aside>
    );
}