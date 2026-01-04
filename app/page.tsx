// app/page.tsx
import Reveal from "./components/Reveal";

type Experience = {
  company: string;
  role: string;
  date: string;
  location: string;
  bullets: string[];
};

type Education = {
  school: string;
  program: string;
  details: string[];
};

type Project = {
  title: string;
  date: string;
  bullets: string[];
  tags: string[];
  link?: string;
};

type Certificate = {
  title: string;
  org: string;
  date: string;
  link?: string;
  note?: string;
};

const profile = {
  name: "Bünyamin Köksal",
  location: "Muğla, Türkiye",
  email: "bunyaminkoksal32@gmail.com",
  github: "https://github.com/bunyaminkoksal",
  headline:
    "Elektrik-Elektronik Mühendisliği öğrencisi • Görüntü işleme • Gömülü sistemler • PX4/ROS",
  summary:
    "Havacılık ve otonom sistemler odaklı projelerde; görüntü işleme (klasik yöntemler + sinir ağları), gömülü yazılım ve PX4/ROS ekosisteminde entegrasyon/test süreçlerinde çalışıyorum.",
};

const experiences: Experience[] = [
  {
    company: "myTECHNIC",
    role: "Stajyer",
    date: "Ağustos 2025",
    location: "İstanbul",
    bullets: [
      "Havacılık sektörüne yönelik Ar-Ge projelerinde görüntü işleme ve gömülü sistem geliştirme çalışmalarına katkı sağladım.",
      "Yapay sinir ağları ve klasik bilgisayarlı görü yöntemleri (ORB, SIFT) ile görüntü işleme prototipleri geliştirdim.",
      "ESP32 ve nRF52840 tabanlı mikrodenetleyici uygulamaları üzerinde çalıştım.",
      "Teknik dokümantasyon ve raporlama süreçlerini LaTeX ile yürüttüm.",
      "ISO 56001 İnovasyon Yönetim Sistemleri eğitimini tamamladım.",
    ],
  },
];

const education: Education[] = [
  {
    school: "Muğla Sıtkı Koçman Üniversitesi",
    program: "Elektrik-Elektronik Mühendisliği (Lisans)",
    details: ["2022 – 2027"],
  },
  {
    school: "Eskişehir Şehit Mehmet Şengül Fen Lisesi",
    program: "Sayısal",
    details: ["2017 – 2021"],
  },
];

const projects: Project[] = [
  {
    title:
      "Otonom İniş Simülasyonu — Hareketli platforma otonom iniş için kontrolcü tasarımı",
    date: "Eylül 2025",
    bullets: [
      "Hareketli platforma otonom iniş için kontrol algoritması geliştirdim; kontrolcü tasarımı, yazılım geliştirme ve simülasyon çalışmalarını yürüttüm.",
      "İniş yaklaşımı ve stabilizasyon için PID tabanlı hız/konum/irtifa kontrol döngülerini kurguladım ve simülasyonda test ettim.",
      "Platform tespiti ve takibi için OpenCV ile görüntü işleme akışı oluşturdum (özellik çıkarımı).",
      "PX4, ROS ve Linux ortamında uçuş yazılımı entegrasyonu ve testlerini gerçekleştirdim; kontrol ve algı bileşenlerini birlikte doğruladım.",
      "Sistem düzeyi geliştirmelerde elektronik bileşenler ve entegrasyon süreçlerinde aktif rol aldım.",
    ],
    tags: ["PX4", "ROS", "Linux", "OpenCV", "PID", "Simulation"],
    link: "https://github.com/bunyaminkoksal/autonomous-landing-sim",
  },
  {
    title: "Teknofest — Görüntü işleme ile hastalık tespiti yapan Quadcopter",
    date: "Proje",
    bullets: [
      "Görüntü işleme tabanlı quadcopter projesinde simülasyon, gömülü yazılım ve donanım entegrasyonu görevleri üstlendim.",
      "Python + OpenCV ile görüntü işleme akışları geliştirerek tespit sürecini prototipledim (klasik yöntemler).",
      "Simülasyon ortamında uçuş senaryoları oluşturup görüntü işleme çıktılarının sistem davranışına etkisini test ettim.",
      "PX4 / ROS ekosistemiyle uyumlu entegrasyon ve test süreçlerine destek oldum (Linux).",
      "Gömülü yazılım ve elektronik aksamlar ile sistem entegrasyonunu destekledim.",
    ],
    tags: ["Python", "OpenCV", "PX4", "ROS", "Embedded", "Simulation"],
  },
];

const skills = [
  "Python",
  "OpenCV (ORB, SIFT)",
  "PX4",
  "Robot Operating System (ROS)",
  "Linux",
  "Mikrodenetleyici (ESP32, nRF52840)",
  "LaTeX",
  "PLCNext Office programları",
];

const certificates: Certificate[] = [
  {
    title: "Code in Place",
    org: "Stanford University",
    date: "Haziran 2023",
    link: "https://codeinplace.stanford.edu/cip3/certificate/p298sn",
    note: "Algoritma ve Python eğitimi (uluslararası cohort).",
  },
  {
    title: "ISO 56001",
    org: "SOCAR – myTECHNIC",
    date: "Ağustos 2025",
    note: "İnovasyon yönetim sistemleri eğitimi.",
  },
];

const interests = [
  "Model uçak tasarımı",
  "Geleneksel Türk Okçuluğu",
  "Model araba tasarımı ve koleksiyonu",
];

const languages = ["İngilizce", "Almanca"];

/** ✅ Premium kart stili: glow + lift */
const card =
  "relative overflow-hidden rounded-2xl border border-[rgba(var(--border),0.18)] " +
  "bg-[rgba(var(--surface),0.72)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur " +
  "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)] " +
  "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 " +
  "hover:before:opacity-100 " +
  "before:bg-[radial-gradient(900px_circle_at_30%_10%,rgba(34,211,238,0.10),transparent_50%),radial-gradient(900px_circle_at_80%_30%,rgba(129,140,248,0.08),transparent_55%)]";

const chip =
  "rounded-full border border-[rgba(var(--border),0.22)] bg-[rgba(var(--surface2),0.55)] " +
  "px-3 py-1 text-sm text-[rgb(var(--text))]";

const tag =
  "rounded-full border border-[rgba(var(--border),0.22)] bg-[rgba(var(--surface2),0.45)] " +
  "px-2 py-0.5 text-xs text-[rgba(var(--text),0.92)]";

function SectionTitle({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <h2 id={id} className="text-2xl font-semibold scroll-mt-24">
        {children}
      </h2>
      <div className="ml-4 hidden h-[2px] flex-1 bg-[linear-gradient(90deg,rgba(34,211,238,0.0),rgba(34,211,238,0.35),rgba(129,140,248,0.35),rgba(129,140,248,0.0))] sm:block" />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className={chip}>{children}</span>;
}

export default function Home() {
  return (
    <main className="min-h-screen text-[rgb(var(--text))]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* ✅ Arka glow katmanı (sayfa nefes alsın) */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_10%,rgba(34,211,238,0.10),transparent_55%),radial-gradient(900px_circle_at_85%_25%,rgba(129,140,248,0.10),transparent_60%)]" />
        </div>

        {/* TOP NAV */}
        <Reveal delay={40}>
          <nav className="mb-8 flex flex-wrap gap-2 text-sm text-[rgb(var(--muted))]">
            {[
              { label: "Deneyim", href: "#deneyim" },
              { label: "Projeler", href: "#projeler" },
              { label: "Eğitim", href: "#egitim" },
              { label: "Yetenekler", href: "#yetenekler" },
              { label: "Sertifikalar", href: "#sertifikalar" },
            ].map((i) => (
              <a
                key={i.href}
                href={i.href}
                className="rounded-full border border-[rgba(var(--border),0.18)] bg-white/5 px-3 py-1 hover:bg-white/10 transition"
              >
                {i.label}
              </a>
            ))}
          </nav>
        </Reveal>

        {/* HERO */}
        <Reveal delay={80}>
          <header className={`${card} p-8`}>
            <p className="text-sm text-[rgb(var(--muted))]">{profile.location}</p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {profile.name}
            </h1>

            <p className="mt-3 text-[rgba(var(--text),0.88)]">{profile.headline}</p>

            <p className="mt-4 max-w-3xl leading-relaxed text-[rgba(var(--text),0.86)]">
              {profile.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="rounded-xl bg-[rgba(var(--accent),0.92)] px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition"
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>

              <a
                className="rounded-xl border border-[rgba(var(--border),0.22)] bg-[rgba(var(--surface2),0.55)] px-4 py-2 text-sm font-medium hover:bg-[rgba(var(--surface2),0.75)] transition"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </header>
        </Reveal>

        {/* EXPERIENCE */}
        <Reveal delay={120}>
          <section className={`${card} mt-10 p-8`}>
            <SectionTitle id="deneyim">Deneyim</SectionTitle>

            <div className="mt-5 space-y-6">
              {experiences.map((e) => (
                <div key={`${e.company}-${e.date}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold">{e.company}</h3>
                    <p className="text-sm text-[rgb(var(--muted))]">
                      {e.role} • {e.date} • {e.location}
                    </p>
                  </div>

                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[rgba(var(--text),0.86)]">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* SKILLS */}
        <Reveal delay={140}>
          <section className={`${card} mt-8 p-8`}>
            <SectionTitle id="yetenekler">Yetenekler</SectionTitle>

            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-[rgba(var(--text),0.92)]">
                Diller
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {languages.map((l) => (
                  <Chip key={l}>{l}</Chip>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* PROJECTS */}
        <Reveal delay={160}>
          <section className="mt-10">
            <SectionTitle id="projeler">Projeler</SectionTitle>

            <div className="mt-5 grid gap-4 grid-cols-1">
              {projects.map((p, idx) => (
                <Reveal key={p.title} delay={120 + idx * 60}>
                  <article className={`${card} p-6`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <p className="text-sm text-[rgb(var(--muted))]">{p.date}</p>
                    </div>

                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[rgba(var(--text),0.86)]">
                      {p.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className={tag}>
                          {t}
                        </span>
                      ))}
                    </div>

                    {p.link ? (
                      <a
                        className="mt-5 inline-block text-sm text-[rgba(var(--accent),0.95)] hover:opacity-90 transition"
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub →
                      </a>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        {/* EDUCATION */}
        <Reveal delay={180}>
          <section className={`${card} mt-10 p-8`}>
            <SectionTitle id="egitim">Eğitim</SectionTitle>

            <div className="mt-5 space-y-6">
              {education.map((ed) => (
                <div key={ed.school}>
                  <h3 className="text-lg font-semibold">{ed.school}</h3>
                  <p className="mt-1 text-sm text-[rgba(var(--text),0.86)]">
                    {ed.program}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {ed.details.map((d) => (
                      <Chip key={d}>{d}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* CERTIFICATES */}
        <Reveal delay={200}>
          <section className={`${card} mt-8 p-8`}>
            <SectionTitle id="sertifikalar">Sertifikalar</SectionTitle>

            <div className="mt-5 space-y-5">
              {certificates.map((c) => (
                <div
                  key={`${c.title}-${c.org}`}
                  className="rounded-xl border border-[rgba(var(--border),0.18)] bg-white/5 p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                    <p className="text-sm text-[rgb(var(--muted))]">{c.date}</p>
                  </div>

                  <p className="mt-1 text-sm text-[rgba(var(--text),0.86)]">
                    {c.org}
                  </p>

                  {c.note ? (
                    <p className="mt-3 text-sm text-[rgba(var(--text),0.86)]">
                      {c.note}
                    </p>
                  ) : null}

                  {c.link ? (
                    <a
                      className="mt-3 inline-block text-sm text-[rgba(var(--accent),0.95)] hover:opacity-90 transition"
                      href={c.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Sertifika linki →
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* INTERESTS */}
        <Reveal delay={220}>
          <section className={`${card} mt-10 p-8`}>
            <SectionTitle>İlgiler</SectionTitle>

            <div className="mt-5 flex flex-wrap gap-2">
              {interests.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={260}>
          <footer className="mt-14 border-t border-[rgba(var(--border),0.18)] pt-8 text-sm text-[rgb(var(--muted))]">
            © {new Date().getFullYear()} {profile.name}
          </footer>
        </Reveal>
      </div>
    </main>
  );
}
