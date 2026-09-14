import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Search, ChevronDown, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { COMPANY, CATEGORIES } from "@/data/catalogue";
import { WhatsAppButton } from "@/components/whatsapp-button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<{ slug: string; name: string } | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!catOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [catOpen]);

  const submitSearch = () => {
    if (selectedCat) {
      navigate({ to: "/products/$slug", params: { slug: selectedCat.slug }, search: query ? { q: query } : {} });
    } else {
      navigate({ to: "/products", search: query ? { q: query } : {} });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background">
      {/* Contact strip — stacks cleanly on phones, row on desktop */}
      <div className="bg-topbar text-topbar-foreground">
        <div className="mx-auto max-w-7xl px-4 py-2.5 text-[13px] sm:py-3 sm:text-sm">
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-w-0 items-center gap-2 font-medium hover:text-accent"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 group-hover:bg-accent/20 sm:h-7 sm:w-7">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>
              </span>
              <span className="truncate tracking-wide">{COMPANY.address}</span>
            </a>
            <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
              <a href={`mailto:${COMPANY.email}`} className="group inline-flex min-w-0 items-center gap-2 font-medium hover:text-accent">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 group-hover:bg-accent/20 sm:h-7 sm:w-7">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                </span>
                <span className="truncate tracking-wide">{COMPANY.email}</span>
              </a>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div className="flex w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1 backdrop-blur-sm sm:w-auto">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground shadow-sm sm:h-7 sm:w-7">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/></svg>
                </span>
                <div className="flex min-w-0 flex-col leading-none">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">Sales &amp; Support</span>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {COMPANY.phones.slice(0, 2).map((p, idx) => (
                      <span key={p} className="flex items-center gap-2">
                        {idx > 0 && <span className="h-3 w-px bg-white/25" />}
                        <a href={`tel:${p.replace(/\s/g, "")}`} className="text-[12px] font-bold tracking-wide text-white transition hover:text-accent sm:text-[13px]">
                          {p}
                        </a>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 md:gap-6 md:py-2">
          <Link to="/" className="flex h-16 w-[12.5rem] shrink-0 items-center sm:w-[15rem] lg:w-[17rem]" aria-label="Zentramed Health home">
            <img
              src="/logo-x-clean.png"
              alt="Zentramed Health — Advancing Healthcare and Humanitarian Solutions"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="h-full w-full object-contain object-left"
            />
          </Link>
          <form
            onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
            className="hidden flex-1 md:block"
          >
            <div className="relative flex items-stretch rounded-md border-2 border-brand bg-background shadow-sm ring-4 ring-brand/10 transition focus-within:ring-brand/25">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={selectedCat ? `Search in ${selectedCat.name}` : "Search for products"}
                className="min-w-0 flex-1 rounded-l-sm bg-transparent px-4 py-2.5 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div ref={catRef} className="relative border-l border-border">
                <button
                  type="button"
                  onClick={() => setCatOpen((o) => !o)}
                  aria-expanded={catOpen}
                  aria-haspopup="listbox"
                  className="flex h-full items-center gap-2 whitespace-nowrap px-4 text-sm font-semibold text-brand hover:bg-muted"
                >
                  {selectedCat?.name ?? "Select Category"}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {catOpen && (
                  <div role="listbox" aria-label="Product categories" className="absolute right-0 top-full z-[60] mt-2 max-h-80 w-72 overflow-auto rounded-md border border-border bg-background text-foreground shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCat(null);
                        setCatOpen(false);
                      }}
                      className={`block w-full border-b border-border px-4 py-2.5 text-left text-sm hover:bg-muted ${selectedCat ? "text-muted-foreground" : "font-semibold text-brand"}`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c.slug}
                        onClick={() => {
                          setSelectedCat({ slug: c.slug, name: c.name });
                          setCatOpen(false);
                        }}
                        className={`block w-full border-b border-border px-4 py-2.5 text-left text-sm hover:bg-muted hover:text-brand ${selectedCat?.slug === c.slug ? "bg-muted font-semibold text-brand" : ""}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                aria-label="Search"
                className="flex items-center justify-center rounded-r-sm bg-brand px-5 text-brand-foreground hover:bg-brand/90"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
          <div className="hidden shrink-0 lg:block">
            <WhatsAppButton size="sm" badge={null} />
          </div>
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <nav className="border-b border-border bg-brand text-brand-foreground">
        <div className="mx-auto hidden max-w-7xl items-center gap-1 px-4 md:flex">
          <div
            onMouseEnter={() => setCats(true)}
            onMouseLeave={() => setCats(false)}
            className="relative"
          >
            <button className="flex items-center gap-2 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
              <Menu className="h-4 w-4" /> Browse Categories
            </button>
            {cats && (
              <div className="absolute left-0 top-full z-50 w-72 bg-background text-foreground shadow-xl">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to="/products/$slug"
                    params={{ slug: c.slug }}
                    className="block border-b border-border px-4 py-2.5 text-sm hover:bg-muted hover:text-brand"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-3 text-sm font-medium hover:text-accent"
              activeProps={{ className: "px-4 py-3 text-sm font-medium text-accent" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/featured-products"
            className="ml-auto flex animate-pulse-ring items-center gap-2 rounded-full bg-featured px-5 py-2 text-sm font-bold uppercase tracking-widest text-featured-foreground shadow-md transition hover:brightness-105"
            activeProps={{ className: "ml-auto flex animate-pulse-ring items-center gap-2 rounded-full bg-featured px-5 py-2 text-sm font-bold uppercase tracking-widest text-featured-foreground shadow-md ring-2 ring-white/70" }}
          >
            <span className="inline-block h-2 w-2 animate-blink rounded-full bg-white" />
            Offers
          </Link>

        </div>

        {open && (
          <div className="md:hidden">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="block border-b border-brand-foreground/10 px-4 py-3 text-sm" onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
            <Link
              to="/featured-products"
              className="block border-b border-brand-foreground/10 bg-featured px-4 py-3 text-sm font-bold text-featured-foreground"
              onClick={() => setOpen(false)}
            >
              Offers
            </Link>
            <div className="p-3">
              <WhatsAppButton size="sm" badge={null} className="w-full justify-center" />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-footer-surface text-footer-muted">
      <div className="border-b border-brand-soft/15 bg-topbar">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase text-brand-soft">Procurement support / East Africa</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-topbar-foreground md:text-3xl">Source the right equipment with confidence.</h2>
            <p className="mt-2 max-w-xl text-sm text-topbar-foreground/65">Tell our specialists what your facility needs. We respond within one business day.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton size="sm" label="WhatsApp Us" badge={null} />
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-brand-soft/35 px-5 py-2.5 text-sm font-semibold text-topbar-foreground transition hover:border-brand-soft hover:bg-brand-soft/10">
              Contact sales <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-4 lg:pr-10">
          <Link
            to="/"
            aria-label="Zentramed Health home"
            className="inline-flex w-full max-w-sm items-center"
          >
            <img src="/logo-x-clean.png" alt="Zentramed Health — Advancing Healthcare" loading="lazy" decoding="async" className="h-auto w-full object-contain object-left" />
          </Link>
          <p className="mt-7 max-w-sm text-sm leading-7 text-footer-muted">
            Medical supplies, clinical equipment and humanitarian healthcare solutions for hospitals, clinics, NGOs and institutions across Africa.
          </p>
          <div className="mt-7 flex items-center gap-3 border-t border-topbar-foreground/10 pt-5">
            <span className="h-2 w-2 rounded-full bg-brand-soft" />
            <span className="font-mono text-[10px] uppercase text-footer-muted">Nairobi base / Regional delivery</span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-display text-xs font-bold uppercase text-topbar-foreground">Company</h3>
          <nav className="mt-5 divide-y divide-topbar-foreground/10 text-sm" aria-label="Footer company links">
            {NAV.map((n, index) => (
              <Link key={n.to} to={n.to} className="group flex items-center gap-3 py-3 transition hover:text-brand-soft">
                <span className="font-mono text-[9px] text-brand-soft/70">0{index + 1}</span>
                <span className="flex-1 font-medium">{n.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-display text-xs font-bold uppercase text-topbar-foreground">Clinical categories</h3>
          <nav className="mt-5 divide-y divide-topbar-foreground/10 text-sm" aria-label="Footer product categories">
            {CATEGORIES.slice(0, 5).map((c, index) => (
              <Link key={c.slug} to="/products/$slug" params={{ slug: c.slug }} className="group flex items-center gap-3 py-3 transition hover:text-brand-soft">
                <span className="grid h-5 w-5 shrink-0 place-items-center border border-brand-soft/25 font-mono text-[8px] text-brand-soft">{index + 1}</span>
                <span className="flex-1 font-medium">{c.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-display text-xs font-bold uppercase text-topbar-foreground">Contact desk</h3>
          <div className="mt-6 space-y-4 text-sm">
            <a href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}`} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-brand-soft"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" /><span>{COMPANY.address}</span></a>
            <div className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" /><div>{COMPANY.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block font-medium text-topbar-foreground transition hover:text-brand-soft">{p}</a>)}</div></div>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 break-all transition hover:text-brand-soft"><Mail className="h-4 w-4 shrink-0 text-brand-soft" />{COMPANY.email}</a>
          </div>
        </div>
      </div>

      <div className="border-y border-topbar-foreground/10 bg-topbar/35">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 font-mono text-[10px] uppercase text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-7 gap-y-2"><span>Certified global brands</span><span>Institutional supply</span><span>Pan-African delivery</span></div>
          <span>{COMPANY.social}</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 font-mono text-[10px] uppercase text-footer-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright © {new Date().getFullYear()} Zentramed Health. All Rights Reserved.</p>
        <p>Nairobi, Kenya</p>
      </div>
    </footer>
  );
}
