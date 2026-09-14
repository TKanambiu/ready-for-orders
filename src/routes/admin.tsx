import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, formatKES } from "@/data/catalogue";
import {
  BUCKET,
  STORAGE_PREFIX,
  productKey,
  resolveImage,
  useCatalogueDb,
  mergedProducts,
} from "@/lib/catalogue-db";
import {
  Loader2,
  LogOut,
  Lock,
  Search,
  ImagePlus,
  Save,
  PlusCircle,
  ShieldCheck,
  PackageSearch,
  Trash2,

} from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Zentramed Health" },
      { name: "description", content: "Private Zentramed Health admin area for managing product photos and prices." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Zentramed Health Admin" },
      { property: "og:description", content: "Private admin area." },
    ],
  }),
  component: AdminPage,
});

/* ---------------------------------------------------------------- shell */

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      if (!active) return;
      setAuthError("We could not verify administrator access. Please sign out and try again.");
      setIsAdmin(false);
    }, 8000);

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        window.clearTimeout(timer);
        if (error) {
          setAuthError("Administrator access could not be verified. Please try again.");
          setIsAdmin(false);
          return;
        }
        setAuthError(null);
        setIsAdmin(data?.role === "admin");
      });

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [session]);

  if (!session) {
    return (
      <LoginScreen
        initialError={authError}
        onSignedIn={(nextSession) => {
          setAuthError(null);
          setIsAdmin(null);
          setSession(nextSession);
        }}
      />
    );
  }
  if (isAdmin === null) return <FullScreenLoader />;
  if (!isAdmin) return <NotAuthorised email={session.user.email ?? ""} error={authError} />;
  return <Dashboard email={session.user.email ?? ""} />;
}

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Loader2 className="h-7 w-7 animate-spin text-brand" />
    </div>
  );
}

async function signOut() {
  await supabase.auth.signOut();
}

function NotAuthorised({ email, error }: { email: string; error?: string | null }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 px-4 text-center">
      <ShieldCheck className="h-10 w-10 text-brand" />
      <h1 className="font-display text-2xl font-bold">No admin access</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {error ?? `${email} is signed in but is not an administrator of this catalogue.`}
      </p>
      <button
        onClick={signOut}
        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
      >
        Sign out
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- login */

function LoginScreen({
  initialError,
  onSignedIn,
}: {
  initialError?: string | null;
  onSignedIn: (session: Session) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) {
        setError(signInError.message || "Those details did not match an account. Please check and try again.");
        return;
      }
      if (!data.session) {
        setError("The sign-in completed without an active session. Please try again.");
        return;
      }
      onSignedIn(data.session);
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "The sign-in service did not respond. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand via-brand/90 to-accent/60 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-background p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <img src="/logo-zentramed.png" alt="Zentramed Health" className="h-14 w-auto" />
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
            <Lock className="h-3.5 w-3.5" /> Admin area
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold">Sign in to the dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage product photos, prices and new listings.
          </p>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email address
            </label>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zentramedhealth.co.ke"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-bold text-brand-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs font-semibold text-muted-foreground hover:text-brand">
          ← Back to the website
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ dashboard */

type Tab = "catalogue" | "new";

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("catalogue");
  const { data: db, isLoading, isError, error, refetch } = useCatalogueDb();
  const products = useMemo(() => mergedProducts(db), [db]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <img src="/logo-zentramed.png" alt="Zentramed Health" className="h-9 w-auto" />
          <div className="mr-auto">
            <div className="font-display text-sm font-bold leading-tight">Catalogue Admin</div>
            <div className="text-[11px] text-muted-foreground">{email}</div>
          </div>
          <Link
            to="/products"
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"
          >
            View site
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-brand-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 px-4">
          {(
            [
              ["catalogue", "Products", PackageSearch],
              ["new", "Add product", PlusCircle],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                tab === key
                  ? "border-brand text-brand"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {isLoading ? (
          <FullScreenLoader />
        ) : isError ? (
          <div className="mx-auto max-w-xl rounded-xl border border-destructive/30 bg-background p-8 text-center shadow-sm">
            <PackageSearch className="mx-auto h-9 w-9 text-destructive" />
            <h2 className="mt-4 font-display text-xl font-bold">Catalogue could not be loaded</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Please check your connection and try again."}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Try again
            </button>
          </div>
        ) : tab === "catalogue" ? (
          <CatalogueTab products={products} />
        ) : (
          <NewProductTab />
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------ catalogue table */

type Row = ReturnType<typeof mergedProducts>[number];

function CatalogueTab({ products }: { products: Row[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = products.filter((p) => {
    const matchCat = cat === "all" || p.categorySlug === cat;
    const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div>
      <div className="mb-6 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-[1fr_260px]">
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 focus-within:border-brand">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {filtered.length} products
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.categorySlug + p.name} row={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-xl border border-border bg-background p-10 text-center text-sm text-muted-foreground">
          No products match your search.
        </div>
      )}
    </div>
  );
}

function ProductCard({ row }: { row: Row }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [price, setPrice] = useState(String(row.price));
  const [reseller, setReseller] = useState(row.reseller != null ? String(row.reseller) : "");
  const [preview, setPreview] = useState<string | undefined>(row.image);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setPrice(String(row.price));
    setReseller(row.reseller != null ? String(row.reseller) : "");
    setPreview(row.image);
  }, [row.price, row.reseller, row.image]);

  const dirty =
    file !== null ||
    price !== String(row.price) ||
    reseller !== (row.reseller != null ? String(row.reseller) : "");

  function pick(f: File | null) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      let imageUrl: string | undefined;
      if (file) imageUrl = await uploadImage(file, row.name);

      const payload = {
        product_key: productKey(row.name),
        name: row.name,
        category_slug: row.categorySlug,
        subcategory: row.subcategory,
        price: Number(price) || 0,
        reseller: reseller === "" ? null : Number(reseller),
        ...(imageUrl ? { image_url: imageUrl } : {}),
      };

      const { error } = await supabase
        .from("products")
        .upsert(payload, { onConflict: "product_key" });
      if (error) throw error;

      setFile(null);
      setStatus("Saved");
      await qc.invalidateQueries({ queryKey: ["catalogue-db"] });
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Could not save");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="relative aspect-[4/3] bg-white p-3">
        {preview ? (
          <img src={preview} alt={row.name} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
            No photo yet
          </div>
        )}
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-md bg-brand/95 px-2.5 py-1.5 text-[11px] font-bold text-brand-foreground shadow hover:bg-accent hover:text-accent-foreground"
        >
          <ImagePlus className="h-3.5 w-3.5" /> Change photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => pick(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="font-display text-sm font-semibold leading-snug">{row.name}</div>
          <div className="text-[11px] text-muted-foreground">
            {row.category} · {row.subcategory}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Retail (KES)
            </span>
            <input
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
              className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Trade (KES)
            </span>
            <input
              inputMode="numeric"
              value={reseller}
              onChange={(e) => setReseller(e.target.value.replace(/[^0-9]/g, ""))}
              className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm outline-none focus:border-brand"
            />
          </label>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            Live: {formatKES(row.price)}
          </span>
          <button
            onClick={save}
            disabled={!dirty || busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-brand-foreground disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save
          </button>
        </div>
        {status && (
          <div className={`text-xs font-semibold ${status === "Saved" ? "text-brand" : "text-destructive"}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- new products */

async function uploadImage(file: File, name: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${productKey(name) || "product"}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;
  return `${STORAGE_PREFIX}${path}`;
}

function NewProductTab() {
  const qc = useQueryClient();
  const { data: db } = useCatalogueDb();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState(CATEGORIES[0]?.slug ?? "");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [reseller, setReseller] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const subs = CATEGORIES.find((c) => c.slug === slug)?.subcategories ?? [];

  useEffect(() => {
    setSubcategory(subs[0]?.name ?? "General");
  }, [slug]);

  const customs = Object.values(db?.byKey ?? {}).filter((r) => r.is_custom);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      let imageUrl: string | null = null;
      if (file) imageUrl = await uploadImage(file, name);

      const { error } = await supabase.from("products").upsert(
        {
          product_key: productKey(name),
          name: name.trim(),
          category_slug: slug,
          subcategory: subcategory.trim() || "General",
          price: Number(price) || 0,
          reseller: reseller === "" ? null : Number(reseller),
          image_url: imageUrl,
          is_custom: true,
        },
        { onConflict: "product_key" },
      );
      if (error) throw error;

      setStatus({ ok: true, msg: `${name} is now live on the website.` });
      setName("");
      setPrice("");
      setReseller("");
      setFile(null);
      setPreview(undefined);
      await qc.invalidateQueries({ queryKey: ["catalogue-db"] });
    } catch (err) {
      setStatus({ ok: false, msg: err instanceof Error ? err.message : "Could not save product" });
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form
        onSubmit={submit}
        className="rounded-xl border border-border bg-background p-6 shadow-sm"
      >
        <h2 className="font-display text-xl font-bold">Add a new product</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          It appears on the website catalogue as soon as you save.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Product name
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Digital Otoscope"
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Category
            </span>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Range / subcategory
            </span>
            <input
              list="subcategory-options"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
            <datalist id="subcategory-options">
              {subs.map((s) => (
                <option key={s.name} value={s.name} />
              ))}
            </datalist>
          </label>

          <label>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Retail price (KES)
            </span>
            <input
              required
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Trade price (KES) — optional
            </span>
            <input
              inputMode="numeric"
              value={reseller}
              onChange={(e) => setReseller(e.target.value.replace(/[^0-9]/g, ""))}
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>

          <div className="sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Product photo
            </span>
            <div className="mt-1.5 flex items-center gap-4 rounded-lg border border-dashed border-border p-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-border">
                {preview ? (
                  <img src={preview} alt="" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                    No photo
                  </div>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-brand px-3 py-2 text-xs font-bold text-brand-foreground hover:bg-accent hover:text-accent-foreground">
                <ImagePlus className="h-4 w-4" /> Choose photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                    setPreview(f ? URL.createObjectURL(f) : undefined);
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {status && (
          <div
            className={`mt-5 rounded-lg px-3 py-2 text-sm font-semibold ${
              status.ok ? "bg-brand/10 text-brand" : "bg-destructive/10 text-destructive"
            }`}
          >
            {status.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
          Publish product
        </button>
      </form>

      <aside className="rounded-xl border border-border bg-background p-5 shadow-sm">
        <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Products you added
        </h3>
        <div className="mt-4 space-y-3">
          {customs.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing added yet.</p>
          )}
          {customs.map((c) => (
            <CustomProductRow key={c.id} row={c} signed={db?.signed ?? {}} />
          ))}
        </div>
      </aside>
    </div>
  );
}

function CustomProductRow({
  row,
  signed,
}: {
  row: { id: string; name: string; price: number; image_url: string | null };
  signed: Record<string, string>;
}) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const src = resolveImage(row.image_url, signed);

  async function remove() {
    if (!window.confirm(`Remove “${row.name}” from the website?`)) return;
    setBusy(true);
    setError(null);
    try {
      const { error: delError } = await supabase.from("products").delete().eq("id", row.id);
      if (delError) throw delError;
      if (row.image_url?.startsWith(STORAGE_PREFIX)) {
        await supabase.storage.from(BUCKET).remove([row.image_url.slice(STORAGE_PREFIX.length)]);
      }
      await qc.invalidateQueries({ queryKey: ["catalogue-db"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove this product");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border p-2">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-white ring-1 ring-border">
          {src ? <img src={src} alt="" className="h-full w-full object-contain" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{row.name}</div>
          <div className="text-[11px] text-muted-foreground">{formatKES(row.price)}</div>
        </div>
        <button
          onClick={remove}
          disabled={busy}
          aria-label={`Remove ${row.name}`}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-bold text-destructive hover:border-destructive disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Remove
        </button>
      </div>
      {error && <div className="mt-1.5 text-[11px] font-semibold text-destructive">{error}</div>}
    </div>
  );
}

