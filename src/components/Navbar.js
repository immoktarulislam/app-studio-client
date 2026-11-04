"use client";

// import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Aperture, LayoutDashboard, LogOut, Menu, Plus, Building2, CalendarCheck, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ThemeToggle from "./ThemeToggle";
import Spinner from "./ui/Spinner";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-on-brand shadow-sm shadow-brand/30">
        <Aperture size={20} />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-ink">
        Studio<span className="text-brand">Space</span>
      </span>
    </Link>
  );
}

function NavLink({ href, label, onNavigate }) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "relative rounded-full px-3 py-2 text-sm font-medium transition",
        active ? "text-ink" : "text-muted hover:text-ink"
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand transition-transform duration-200",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />
    </Link>
  );
}

function UserMenu({ user, onNavigate }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      toast.success("You have been logged out.");
      router.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const items = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Add New Studio", href: "/add-studio", icon: Plus },
    { label: "My Studio Listings", href: "/my-listings", icon: Building2 },
    { label: "My Bookings", href: "/my-bookings", icon: CalendarCheck },
  ];

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface p-1 pr-3 transition hover:border-brand"
      >
        {user.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photo}
            alt={user.name || "Profile photo"}
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-strong dark:text-brand">
            {initials}
          </span>
        )}
        <span className="hidden max-w-[110px] truncate text-sm font-semibold text-ink sm:block">
          {user.name}
        </span>
      </button>

      {open && (
        <div className="card absolute right-0 z-50 mt-2 w-64 overflow-hidden p-2 shadow-xl">
          <div className="border-b border-line px-3 pb-3 pt-2">
            <p className="truncate text-sm font-bold text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="mt-1 flex flex-col">
            {items.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-2 hover:text-brand"
              >
                <Icon size={16} className="text-muted" />
                {label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl border-t border-line px-3 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <Suspense
          fallback={
            <div className="hidden h-9 items-center gap-1 lg:flex" aria-hidden="true" />
          }
        >
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </Suspense>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {loading ? (
            <span className="inline-flex w-[168px] justify-end">
              <Spinner size={18} />
            </span>
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-bg px-4 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </nav>
          {!loading && !user && (
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn btn-ghost w-full py-2.5"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary w-full py-2.5"
              >
                Sign up
              </Link>
            </div>
          )}
          {user && (
            <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full py-2.5">
                Dashboard
              </Link>
              <Link href="/my-listings" onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full py-2.5">
                My Studio Listings
              </Link>
              <Link href="/my-bookings" onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full py-2.5">
                My Bookings
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
