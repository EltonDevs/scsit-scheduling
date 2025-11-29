"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  LayoutGrid,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  List,
  FileText,
  PieChart,
 
  Users,
  Building,
  BookOpenCheck,
  Book,
  Layers,
  MapPin,
  InstagramIcon,
  FacebookIcon,
  Globe2Icon,
  CircleFadingPlus,
  User,
  UserCog2,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutGrid size={20} />,
    name: "Dashboard",
    path: "/admin",
  },
  {
    icon: <Building size={20} />,
    name: "Departments",
    path: "/admin/DepartmentPage",
  },
  {
    icon: <Users size={20} />,
    name: "Users",
    subItems: [
      { name: "Dean", path: "/admin/DeanPage", pro: false, icon: <User size={18} /> },
      { name: "Teachers", path: "/admin/TeacherPage", pro: false, icon: <UserCog2 size={18} /> },
    ],
  },
  {
    icon: <BookOpenCheck size={20} />,
    name: "Courses",
    path: "/admin/CoursePage",
  },
  {
    icon: <Book size={20} />,
    name: "Subjects",
    path: "/admin/SubjectPage",
  },
  {
    icon: <Layers size={20} />,
    name: "Sections",
    path: "/admin/SectionPage",
  },
  {
    icon: <MapPin size={20} />,
    name: "Rooms",
    path: "/admin/RoomPage",
  },
  {
    name: "Schedules",
    icon: <FileText size={20} />,
    subItems: [
      { name: "Lists", path: "/admin/calendarList", icon: <List size={18} />, pro: false },
      { name: "Calendar", path: "/admin/calendar", pro: false, icon: <Calendar size={18} /> },
    ],
  },
];

const othersItems: NavItem[] = [

   {
    icon: <PieChart size={20} />,
    name: "SCSIT Info",
    subItems: [
      { name: "About SCSIT", path: "https://www.scsit.edu.ph/about-us", pro: false, icon: <PieChart size={18} /> },
      { name: "Community", path: "https://www.scsit.edu.ph/our-community", pro: false, icon: <PieChart size={18} /> },
      { name: "Contacts", path: "https://www.scsit.edu.ph/contact", pro: false, icon: <PieChart size={18} /> },
    ],
  },
  // {
  //   icon: <PieChart size={20} />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false, icon: <PieChart size={18} /> },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false, icon: <PieChart size={18} /> },
  //   ],
  // },
   {
    icon: <CircleFadingPlus size={20} />,
    name: "Socials",
    subItems: [
      { name: "Facebook", path: "https://www.facebook.com/p/Salazar-Colleges-of-Science-and-Institute-of-Technology-100057380082638/", pro: false, icon: <FacebookIcon size={18} /> },
      { name: "Instagram", path: "https://www.instagram.com/explore/locations/346682301/salazar-colleges-of-science-and-institute-of-technology/", pro: false, icon: <InstagramIcon size={18} /> },
      { name: "Website", path: "https://www.scsit.edu.ph/", pro: false, icon: <Globe2Icon size={18} /> },
    ],
  },
  {
    icon: <BookOpenCheck size={20} />,
    name: "Enrollments",
    path: "https://www.scsit.edu.ph/enrollment",
  },
  


  // {
  //   icon: <Box size={20} />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false, icon: <Box size={18} /> },
  //     { name: "Avatar", path: "/avatars", pro: false, icon: <Box size={18} /> },
  //     { name: "Badge", path: "/badge", pro: false, icon: <Box size={18} /> },
  //     { name: "Buttons", path: "/buttons", pro: false, icon: <Box size={18} /> },
  //     { name: "Images", path: "/images", pro: false, icon: <Box size={18} /> },
  //     { name: "Videos", path: "/videos", pro: false, icon: <Box size={18} /> },
  //   ],
  // },
  // {
  //   icon: <Plug size={20} />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false, icon: <Plug size={18} /> },
  //     { name: "Sign Up", path: "/signup", pro: false, icon: <Plug size={18} /> },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item flex items-center gap-2 ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.icon && (
                        <span
                          className={`${
                            isActive(subItem.path)
                              ? "menu-item-icon-active"
                              : "menu-item-icon-inactive"
                          }`}
                        >
                          {subItem.icon}
                        </span>
                      )}
                      <span>{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {(isExpanded || isHovered) && !isMobileOpen ? (
              <>
                <Image className="dark:hidden" src="/images/logo/light-logo.svg" alt="Logo" width={200} height={80} priority />
                <Image className="hidden dark:block" src="/images/logo/dark-logo.svg" alt="Logo" width={200} height={80} priority />
              </>
            ) : !isMobileOpen ? (
              <Image src="/images/logo/ICON-SCSIT.svg" alt="Logo" width={45} height={45} priority />
            ) : null}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <MoreHorizontal />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;