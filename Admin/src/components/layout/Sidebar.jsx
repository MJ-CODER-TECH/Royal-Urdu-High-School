import { useMemo, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Settings,
} from "lucide-react";

import { sidebarMenu } from "../../constants/sidebarMenu";
import usePermission from "../../hooks/usePermission";
import { useSelector } from "react-redux";
import schoolLogo from "../../assets/logo/logo.png";

const Sidebar = ({ mobileOpen: mobileOpenProp, setMobileOpen: setMobileOpenProp }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false); // desktop icon-only mode

  // Fallback to internal state if parent doesn't control it (keeps Sidebar reusable standalone)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileOpen = mobileOpenProp ?? internalMobileOpen;
  const setMobileOpen = setMobileOpenProp ?? setInternalMobileOpen;

  const { hasPermission } = usePermission();

  /*
    |--------------------------------------------------------------------------
    | Filter Menu According To Permission
    |--------------------------------------------------------------------------
    */

  const menu = useMemo(() => {
    return sidebarMenu.reduce((acc, item) => {
      // Parent Menu With Children

      if (item.children) {
        // Parent permission check

        if (item.permission && !hasPermission(item.permission)) {
          return acc;
        }

        const allowedChildren = item.children.filter(
          (child) => !child.permission || hasPermission(child.permission),
        );

        if (allowedChildren.length > 0) {
          acc.push({
            ...item,

            children: allowedChildren,
          });
        }

        return acc;
      }

      // Single Menu

      if (!item.permission || hasPermission(item.permission)) {
        acc.push(item);
      }

      return acc;
    }, []);
  }, [hasPermission]);

  /*
    |--------------------------------------------------------------------------
    | Auto Expand Active Parent Menu
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    const activeParent = menu.find((item) => {
      if (!item.children) return false;

      return item.children.some(
        (child) =>
          location.pathname === child.path ||
          location.pathname.startsWith(`${child.path}/`),
      );
    });

    if (activeParent) {
      setOpenMenu(activeParent.title);
    }
  }, [location.pathname, menu]);

  // Close the mobile drawer on every route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleMenu = (title, isCollapsed) => {
    if (isCollapsed) {
      // Clicking a parent item while collapsed expands the sidebar
      // and opens that submenu, instead of doing nothing.
      setCollapsed(false);
      setOpenMenu(title);
      return;
    }
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  /*
    |--------------------------------------------------------------------------
    | Sidebar Body — shared between the desktop rail and the mobile drawer.
    | isCollapsed only ever applies to the desktop rail; the mobile drawer
    | always renders expanded regardless of the desktop collapse state.
    |--------------------------------------------------------------------------
    */

  const renderSidebar = (isCollapsed) => {
    const showLabels = !isCollapsed;

    return (
      <aside
        className={`
          relative flex h-full flex-col overflow-x-hidden
          border border-slate-200 bg-white
          transition-[width] duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-72"}
        `}
      >
        {/* Soft pill toggle — desktop only */}
        {!mobileOpen && (
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="
              absolute right-1 top-1/2 z-30 hidden h-9 w-5 -translate-y-1/2
              items-center justify-center rounded-full
              border border-slate-200 bg-white text-slate-400 shadow-sm
              transition-all duration-200 ease-in-out
              hover:bg-slate-50 hover:text-slate-600 hover:shadow-md
              active:scale-90
              md:flex
            "
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full  bg-white">
            <img
              src={schoolLogo}
              alt="School Logo"
              className="h-9 w-9 object-contain"
            />
          </div>

          {showLabels && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-slate-900">
                Royal Urdu High School
              </p>
              <p className="truncate text-xs text-slate-500">
                School Management System
              </p>
            </div>
          )}

          {/* Close drawer — mobile only */}
          {mobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="ml-auto shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Menu */}

        <nav
          className="
            flex-1 overflow-y-auto px-3 py-4
            [-ms-overflow-style:none] [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <ul className="flex flex-col gap-1">
            {menu.map((item, index) => {
              const Icon = item.icon;

              const isDivider = item.dividerBefore && index !== 0;

              // Dropdown Menu

              if (item.children) {
                const opened = !isCollapsed && openMenu === item.title;

                const childActive = item.children.some(
                  (child) =>
                    location.pathname === child.path ||
                    location.pathname.startsWith(`${child.path}/`),
                );

                return (
                  <li key={item.title}>
                    {isDivider && <div className="my-3 border-t border-slate-100" />}

                    <div className="group relative">
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.title, isCollapsed)}
                        className={`
                          flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
                          ${childActive ? "text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50"}
                          ${isCollapsed ? "justify-center" : "justify-between"}
                        `}
                      >
                        <span className="flex items-center gap-3">
                          {Icon && <Icon size={20} strokeWidth={1.75} />}
                          {showLabels && <span>{item.title}</span>}
                        </span>

                        {showLabels &&
                          (opened ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          ))}
                      </button>

                      {/* Tooltip / flyout when collapsed */}
                      {isCollapsed && (
                        <div
                          className="
                            invisible absolute left-full top-0 z-20 ml-2 min-w-[10rem]
                            rounded-lg border border-slate-200 bg-white p-1.5 opacity-0 shadow-lg
                            transition-all group-hover:visible group-hover:opacity-100
                          "
                        >
                          <p className="px-2 pb-1 pt-1 text-xs font-semibold text-slate-400">
                            {item.title}
                          </p>
                          {item.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              end
                              onClick={() => setCollapsed(false)}
                              className={({ isActive }) =>
                                `block rounded-md px-2 py-1.5 text-sm transition ${
                                  isActive
                                    ? "bg-slate-800 text-white font-medium"
                                    : "text-slate-600 hover:bg-slate-50"
                                }`
                              }
                            >
                              {child.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>

                    {opened && (
                      <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-slate-100 pl-4">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;

                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              end
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                                  isActive
                                    ? "bg-slate-800 font-semibold text-white"
                                    : "text-slate-600 hover:bg-slate-50"
                                }`
                              }
                            >
                              {ChildIcon && <ChildIcon size={16} strokeWidth={1.75} />}
                              {child.title}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              }

              // Single item

              return (
                <li key={item.path}>
                  {isDivider && <div className="my-3 border-t border-slate-100" />}

                  <div className="group relative">
                    <NavLink
                      to={item.path}
                      end
                      onClick={() => isCollapsed && setCollapsed(false)}
                      className={({ isActive }) => `
                        relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
                        ${isCollapsed ? "justify-center" : "justify-between"}
                        ${
                          isActive
                            ? "bg-slate-800 font-semibold text-white"
                            : "text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {/* active indicator bar for collapsed mode */}
                          {isCollapsed && isActive && (
                            <span className="absolute left-0 h-6 w-1 rounded-r-full bg-slate-800" />
                          )}

                          <span className="flex items-center gap-3">
                            {Icon && <Icon size={20} strokeWidth={1.75} />}
                            {showLabels && <span>{item.title}</span>}
                          </span>

                          {showLabels && item.badge && (
                            <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-green-500 px-1.5 text-[11px] font-semibold text-white">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>

                    {/* Tooltip when collapsed */}
                    {isCollapsed && (
                      <div
                        className="
                          invisible absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 whitespace-nowrap
                          rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 opacity-0
                          shadow-lg transition-all group-hover:visible group-hover:opacity-100
                        "
                      >
                        {item.title}
                        {item.badge && (
                          <span className="ml-2 rounded-full bg-green-500 px-1.5 text-[11px] font-semibold text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User footer */}

        <div className="border-t border-slate-100 p-3">
          <div
            className={`flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}`}
              alt={user?.name || "Admin"}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />

            {showLabels && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.name || "Administrator"}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            )}

            {showLabels && (
              <button
                type="button"
                className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Settings"
              >
                <Settings size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    );
  };

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 self-start overflow-x-hidden   md:block">
        {renderSidebar(collapsed)}
      </div>

      {/* Mobile off-canvas drawer — always mounted so open/close animates
          smoothly instead of popping in and out. Triggered by Header's
          hamburger button via mobileOpen/setMobileOpen. */}
      <div
        className={`
          fixed inset-0 z-40 overflow-x-hidden md:hidden
          transition-opacity duration-300 ease-in-out
          ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-slate-900/40"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`
            absolute inset-y-0 left-0 w-72 max-w-[85vw] p-
            transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {renderSidebar(false)}
        </div>
      </div>
    </>
  );
};

export default Sidebar;