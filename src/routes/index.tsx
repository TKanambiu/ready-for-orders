import { socialMeta, canonicalLink, organizationLd, websiteLd } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { CATEGORIES, COMPANY } from "@/data/catalogue";
import { useEffect, useRef, useState } from "react";
import { CategoryMarquee } from "@/components/category-marquee";
import { WhatsAppButton } from "@/components/whatsapp-button";


const SLIDES = [
  {
    img: "/hero1.webp",
    eyebrow: "Molecular Diagnostics",
    title: "Yuanzan VQ-200",
    accent: "qPCR System.",
    body: "True diagnostic freedom — a high-precision, 96-well real-time PCR system that is completely open and affordable.",
    bullets: [
      "Consumable freedom: works with any brand of tubes, strips and plates",
      "Built-in 9\" touchscreen with embedded computer — no external PC",
      "Elite thermal uniformity ≤ ± 0.15°C, beating industry standards",
      "Motorized lid & auto-loading chamber — ready for robotic integration",
    ],
    waText: "Hello Zentramed Health, I'd like to order the Yuanzan VQ-200 qPCR System.",
  },
  {
    img: "/hero2.webp",
    eyebrow: "Ophthalmic Solutions",
    title: "Ophthalmic Refraction",
    accent: "Unit — Eye Exam Workshop.",
    body: "Complete ophthalmic refraction workstations for hospitals, clinics and optical centres — accurate, ergonomic and clinic-ready.",
    bullets: [
      "Integrated chair, stand and instrument arms for full eye exams",
      "Precision refraction, tonometry and slit-lamp mounting",
      "Smooth motorised height and positioning controls",
      "Installation, calibration and operator training included",
    ],
    waText: "Hello Zentramed Health, I'd like to order the Ophthalmic Refraction Unit.",
  },
  {
    img: "/hero3.webp",
    eyebrow: "Rapid Diagnostics",
    title: "HIV Rapid",
    accent: "Test Kit.",
    body: "Laboratory-grade accuracy right at the point of care — rapid, reliable and equipment-free screening.",
    bullets: [
      "100% accuracy — certified sensitivity and specificity",
      "Ultra-fast results in 15–25 minutes",
      "Micro sample: only 40µl whole blood, serum or plasma",
      "WHO PQ & CE IVDR compliant · stable 24 months at 4–30°C",
    ],
    waText: "Hello Zentramed Health, I'd like to order the HIV Rapid Test Kits.",
  },
  {
    img: "/hero4.webp",
    eyebrow: "Renal Care",
    title: "Wesley W-T6008S",
    accent: "Hemodialysis Machine.",
    body: "Advanced blood purification for acute and chronic renal failure — intelligent automation with rigorous real-time monitoring.",
    bullets: [
      "All-in-one therapy: HD, on-line HDF and isolated ultrafiltration",
      "Closed volume balance chamber for hyper-accurate fluid control",
      "15\" touchscreen with guided visual and audible alarms",
      "30-minute backup battery keeps the blood pump running on power loss",
    ],
    waText: "Hello Zentramed Health, I'd like to order the Wesley W-T6008S Hemodialysis Machine.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zentramed Health | Medical Equipment & Supplies in Nairobi, Kenya" },
      { name: "description", content: "Zentramed Health is a trusted Nairobi-based supplier of medical supplies, hospital equipment, laboratory diagnostics and humanitarian healthcare solutions across Africa." },
      { property: "og:title", content: "Zentramed Health | Medical Equipment Supplier in Nairobi" },
      { property: "og:description", content: "Quality medical supplies, hospital equipment and healthcare solutions across Africa." },
      ...socialMeta("/"),
    ],
    links: canonicalLink("/"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationLd) },
      { type: "application/ld+json", children: JSON.stringify(websiteLd) },
    ],
  }),
  component: HomePage,
});


function HomePage() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useRef<number | null>(null);

  const go = (d: number) => setI((v) => (v + d + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 8000);
    return () => clearInterval(t);
  }, [paused]);

  const onDown = (x: number) => { dragX.current = x; setPaused(true); };
  const onUp = (x: number) => {
    const start = dragX.current;
    dragX.current = null;
    if (start === null) return;
    const dx = x - start;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <div>
      <SiteHeader />

      {/* Hero slider — press to pause, swipe or arrows to navigate */}
      <section
        className="relative max-w-full cursor-grab select-none overflow-hidden bg-topbar active:cursor-grabbing"
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseUp={(e) => onUp(e.clientX)}
        onMouseLeave={() => { dragX.current = null; setPaused(false); }}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchEnd={(e) => { onUp(e.changedTouches[0].clientX); setPaused(false); }}
      >
        <div
          className="flex w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {SLIDES.map((s, idx) => (
            <div key={idx} className="relative w-full min-w-full shrink-0 overflow-hidden bg-topbar md:h-[clamp(540px,calc(100svh-185px),720px)] h-[540px]">
              <img
                src={s.img}
                alt={`${s.title} ${s.accent}`}
                loading="eager"
                decoding="async"
                draggable={false}
                fetchPriority={idx === 0 ? "high" : "low"}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-topbar via-topbar/85 to-transparent md:bg-gradient-to-t md:from-topbar md:via-topbar/70 md:to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-7 pt-24 md:px-[clamp(2rem,3.5vw,4.5rem)] md:pb-10 md:pt-32">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0 max-w-2xl text-topbar-foreground">
                    <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-brand-soft/50 bg-topbar/35 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-soft backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {s.eyebrow}
                    </div>
                    <h1 className="font-display text-[2.25rem] font-extrabold leading-[0.98] md:text-[clamp(2.75rem,4vw,3.75rem)]">
                      <span className="block text-topbar-foreground">{s.title}</span>
                      <span className="mt-1 block font-normal text-brand-soft">{s.accent}</span>
                    </h1>
                    <p className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-topbar-foreground/80 md:text-[17px]">
                      {s.body}
                    </p>
                    <ul className="mt-4 hidden max-w-xl divide-y divide-topbar-foreground/15 border-y border-topbar-foreground/15 sm:block">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 py-2 text-[13.5px] font-medium leading-snug text-topbar-foreground/90 md:text-[14px]">
                          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <WhatsAppButton text={s.waText} />
                      <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full border border-topbar-foreground/35 bg-topbar/20 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-topbar-foreground backdrop-blur-sm transition hover:border-accent hover:text-accent">
                        Contact Sales
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-2 md:mb-3">
                    {SLIDES.map((_, idx2) => (
                      <button
                        key={idx2}
                        onClick={() => setI(idx2)}
                        className={`h-2 rounded-full transition-all ${idx2 === i ? "w-10 bg-accent" : "w-2 bg-topbar-foreground/60 hover:bg-topbar-foreground/90"}`}
                        aria-label={`Slide ${idx2 + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        <button
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-topbar/45 p-3 text-topbar-foreground backdrop-blur transition hover:bg-topbar/75 md:block"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button
          aria-label="Next slide"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-topbar/45 p-3 text-topbar-foreground backdrop-blur transition hover:bg-topbar/75 md:block"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:left-[21%]">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-10 bg-accent" : "w-2 bg-topbar-foreground/60 hover:bg-topbar-foreground/90"}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>


      {/* Trust bar — animated counters */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {[
            { value: 500, suffix: "+", label: "Products in catalogue" },
            { value: 9, suffix: "", label: "Specialised categories" },
            { value: 24, suffix: "/7", label: "WhatsApp response" },
            { value: 100, suffix: "%", label: "Certified sourcing" },
          ].map((f) => (
            <div key={f.label} className="group px-6 py-8 transition hover:bg-muted/40">
              <div className="font-display text-3xl font-bold text-brand md:text-4xl">
                <CountUp end={f.value} />{f.suffix}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{f.label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* Categories grid */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                <span className="h-px w-10 bg-accent" /> What We Supply
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand md:text-4xl">Explore Our Categories</h2>
            </div>
            <Link to="/products" className="text-sm font-semibold text-brand hover:text-accent">
              View all products →
            </Link>
          </div>
          <div className="mt-10">
            <CategoryMarquee categories={CATEGORIES} />
          </div>

        </div>
      </section>

      {/* About — image-led institutional story */}
      <section className="overflow-hidden border-y border-border bg-background py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-6">
            <div className="absolute -left-4 -top-4 hidden h-full w-full border border-brand-soft md:block" />
            <img
              src="/zentramed-warehouse.png"
              alt="Zentramed medical-grade storage facility"
              className="relative aspect-[5/4] w-full object-cover shadow-xl"
              loading="lazy"
            />
            <div className="absolute bottom-0 right-0 bg-brand px-6 py-5 text-brand-foreground shadow-xl">
              <div className="font-display text-3xl font-bold">15+ Years</div>
              <div className="mt-1 font-mono text-[10px] uppercase">Industry expertise</div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase text-brand">
              <span className="h-px w-10 bg-brand" /> About Zentramed Health
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
              Advancing healthcare, together.
            </h2>
            <div className="mt-6 border-l-2 border-brand pl-5">
              <p className="leading-7 text-muted-foreground">
                Zentramed Health is a trusted supplier of high-quality medical supplies, equipment and
                solutions to hospitals, clinics, NGOs, government institutions and humanitarian organizations
                across Africa. Our mission is to improve health outcomes by delivering quality, innovation
                and exceptional service.
              </p>
            </div>
            <dl className="mt-7 grid border-y border-border sm:grid-cols-2">
              {[
                { t: "Quality Assured Sourcing", d: "ISO-certified suppliers only." },
                { t: "Wide Product Range", d: "9 categories, 500+ SKUs." },
                { t: "Reliable Delivery", d: "Nationwide, cold-chain ready." },
                { t: "Customer-First Support", d: "Dedicated account managers." },
              ].map((v) => (
                <div key={v.t} className="border-b border-border py-4 sm:odd:border-r sm:odd:pr-5 sm:even:pl-5 sm:[&:nth-last-child(-n+2)]:border-b-0">
                  <dt className="font-display text-sm font-bold text-foreground">{v.t}</dt>
                  <dd className="mt-1.5 text-xs text-muted-foreground">{v.d}</dd>
                </div>
              ))}
            </dl>
            <Link to="/about" className="mt-7 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-bold text-brand-foreground shadow-md transition hover:bg-brand/90">
              Learn more about us →
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand to-topbar" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
              <span className="h-px w-10 bg-accent" /> Our Services <span className="h-px w-10 bg-accent" />
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-5xl">
              Beyond supply — <span className="text-accent">end-to-end support</span>
            </h2>
            <p className="mt-4 text-brand-foreground/80">
              From procurement to installation, training and maintenance — we stand behind every product we deliver.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { image: "/svc-installation.webp", title: "Equipment Installation", body: "Professional installation of hospital, laboratory and imaging equipment." },
              { image: "/svc-maintenance.webp", title: "Maintenance & Repair", body: "Preventive maintenance contracts and rapid on-site repair services." },
              { image: "/svc-training.webp", title: "Training & Commissioning", body: "Operator training and commissioning to get your team confident from day one." },
              { image: "/svc-humanitarian.webp", title: "Humanitarian Supply", body: "Bulk supply to NGOs and government programs with reliable logistics." },
              { image: "/svc-custom-sourcing.webp", title: "Custom Sourcing", body: "Can't find what you need? We source certified products globally on request." },
              { image: "/svc-delivery.webp", title: "Regional Delivery", body: "Timely and secure delivery across Kenya and East Africa." },
            ].map((s, idx) => (
                <div
                  key={s.title}
                  className="group relative overflow-hidden rounded-2xl bg-white/[0.06] shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition hover:-translate-y-1.5 hover:ring-accent/60"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/40 to-transparent" />
                    <span className="absolute right-4 top-4 font-display text-3xl font-black text-white/30">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-foreground/80">{s.body}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us — stats layout */}
      <WhyChooseUsSection />

      {/* Brand Partnerships */}
      <PartnershipsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="relative overflow-hidden bg-topbar text-topbar-foreground">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-4 py-20 md:grid-cols-[1.15fr_auto]">
          <div>
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.32em] text-accent">
              <span className="h-px w-10 bg-accent" /> Let's Talk
            </div>
            <h2 className="mt-5 max-w-2xl font-display text-[2.1rem] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[3.2rem]">
              Ready to equip
              <span className="block font-normal text-white/55">your facility?</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-white/70">
              Tailored quotes, bulk orders and technical advice — from a team that answers within the hour.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:justify-end">
            <WhatsAppButton />
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:border-accent hover:text-accent">
              Contact Sales
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>


      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "Zentramed has been our go-to partner for theatre consumables for over three years. Their response time and product quality are simply unmatched in the region.",
    name: "Dr. Aisha Wanjiru",
    role: "Medical Director, Nairobi Surgical Centre",
    initials: "AW",
    avatar: "/avatar-woman-1.webp",
  },
  {
    quote:
      "We equipped a 60-bed county hospital with Zentramed — from beds to imaging. Installation was seamless and their after-sales support is world-class.",
    name: "Eng. Peter Kimani",
    role: "Biomedical Lead, County Health Services",
    initials: "PK",
    avatar: "/avatar-man-1.webp",
  },
  {
    quote:
      "Reliable, transparent and fast. Zentramed supplied a full humanitarian PPE order for our field mission in under a week. A truly professional team.",
    name: "Sarah Odhiambo",
    role: "Logistics Coordinator, International NGO",
    initials: "SO",
    avatar: "/avatar-woman-2.webp",
  },
  {
    quote:
      "Their lab team helped us specify, install and train our staff on new hematology analyzers. The precision and follow-through is exceptional.",
    name: "Dr. Michael Otieno",
    role: "Head of Laboratory, Regional Referral Hospital",
    initials: "MO",
    avatar: "/avatar-man-2.webp",
  },
];

function TestimonialsSection() {
  // Duplicate for seamless marquee loop
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="relative overflow-hidden bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-10 bg-accent" /> Trusted by Healthcare Leaders <span className="h-px w-10 bg-accent" />
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand md:text-5xl">
            What our clients say
          </h2>
        </div>

        {/* Animated marquee of client "passports" */}
        <div
          className="group relative mt-14 overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex w-max gap-6 animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
            {loop.map((t, i) => (
              <article
                key={i}
                className="w-[320px] shrink-0 rounded-2xl bg-background p-6 shadow-sm ring-1 ring-border md:w-[380px]"
              >
                <div className="flex items-center gap-3 border-b border-dashed border-border pb-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand to-topbar p-0.5 ring-2 ring-accent/40 transition group-hover:scale-105">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      loading="eager"
                      decoding="async"
                      width={56}
                      height={56}
                      className="h-full w-full rounded-full bg-background object-cover object-top transition duration-500 hover:rotate-6"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#25D366] ring-2 ring-background">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-sm font-semibold text-brand">{t.name}</div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{t.role}</div>
                  </div>
                  <span className="rounded border border-accent/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-accent">
                    Verified
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-border pt-10 sm:grid-cols-3">
          {[
            { value: 1200, suffix: "+", label: "Hospitals & clinics served" },
            { value: 350, suffix: "+", label: "NGO & humanitarian partners" },
            { value: 98, suffix: "%", label: "On-time delivery rate" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-bold text-brand md:text-6xl">
                <CountUp end={s.value} />{s.suffix}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ end, duration = 1800 }: { end: number; duration?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(end * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return <span ref={ref} className="tabular-nums">{n.toLocaleString()}</span>;
}


const PARTNER_LOGOS = [
  "acon", "air", "anios", "cami", "dabi", "dia", "drge", "eden", "fkg", "fona",
  "haier", "inn", "labo", "med", "mind", "nsk", "omeg", "omron", "ormco", "poly",
  "reis", "rey", "runyes", "seca", "tutt", "united", "vadi", "vat",
].map((f) => `/partners/${f}.png`);

function PartnershipsSection() {
  const loop = [...PARTNER_LOGOS, ...PARTNER_LOGOS];
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-10 bg-accent" /> Global Manufacturers <span className="h-px w-10 bg-accent" />
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand md:text-4xl">Our Brand Partnerships</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            We partner with ISO-certified global manufacturers to bring you trusted medical technology.
          </p>
        </div>
      </div>
      <div
        className="group relative mt-10 overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max gap-6 animate-marquee-right group-hover:[animation-play-state:paused]">
          {loop.map((src, i) => (
            <div
              key={i}
              className="flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-border bg-background px-6 shadow-sm transition hover:border-accent/50 hover:shadow-md"
            >
              <img
                src={src}
                alt="Partner brand logo"
                loading="lazy"
                decoding="async"
                className="max-h-14 max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  const stats = [
    { value: 15, suffix: "+", label: "Years" },
    { value: 2500, suffix: "+", label: "Happy Clients" },
    { value: 500, suffix: "+", label: "Products" },
    { value: 5, suffix: "", label: "Countries" },
  ];
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          <div>
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.32em] text-accent">
              <span className="h-px w-10 bg-accent" /> Why Choose Us
            </div>
            <h2 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-brand md:text-[2.9rem]">
              Depth, scale
              <span className="block font-normal text-muted-foreground/70">and follow-through.</span>
            </h2>
          </div>
          <div className="md:pt-3">
            <p className="text-[15.5px] font-light leading-[1.85] text-muted-foreground md:text-[17px]">
              As a trusted supplier of{" "}
              <span className="font-semibold text-brand">end-to-end medical equipment and solutions</span>{" "}
              across East Africa, Zentramed Health is your comprehensive source for healthcare supplies.
              Whether you're outfitting a rural clinic, equipping a referral hospital or managing a
              humanitarian program, our depth of experience and adaptability allow us to meet healthcare
              demands at every scale.
            </p>
            <p className="mt-5 text-[15.5px] font-light leading-[1.85] text-muted-foreground md:text-[17px]">
              With operations reaching five countries and a dedicated team of specialists and biomedical
              engineers, we strive to be your trusted partner in delivering superior care through timely,
              high-quality solutions.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 divide-border border-t border-border md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-8 md:px-8">
              <div className="font-display text-[2.75rem] font-extrabold leading-none tracking-[-0.04em] text-brand md:text-[3.4rem]">
                <CountUp end={s.value} /><span className="text-accent">{s.suffix}</span>
              </div>
              <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

