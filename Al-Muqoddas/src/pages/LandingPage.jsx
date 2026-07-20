import { useState, useEffect, useRef } from "react";
import "./LandingPage.css";
import al from "../assets/header-rebana.webp";
import istiqomah from "../assets/header-rebana.webp";
import gema from "../assets/perform/GEMA.jpeg";
import latian_kolaborasi from "../assets/perform/Latian_kolaborasi.jpeg";
import ldk from "../assets/perform/ldk_rohis.jpeg";
import pelita from "../assets/perform/pelita.jpeg";
import uswah from "../assets/perform/uswah.jpeg";
import rutinan from "../assets/perform/kegiatan_rutin.jpeg";

const logo = "/logo-rebana.svg";

/* ─── SVG ORNAMENTS ─── */
const MosqueDome = ({ color = "currentColor", size = 120 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 10 C60 10 30 45 30 85 L30 130 L170 130 L170 85 C170 45 140 10 100 10Z" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M100 5 L100 15 M95 8 L105 8" stroke={color} strokeWidth="2"/>
    <path d="M55 130 L55 160 L145 160 L145 130" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="80" y="130" width="40" height="30" rx="20" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M30 130 L10 130 L10 160 L30 160 M170 130 L190 130 L190 160 L170 160" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="10" y1="160" x2="190" y2="160" stroke={color} strokeWidth="2.5"/>
    <circle cx="100" cy="60" r="18" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

const IslamicFlower = ({ color = "currentColor", size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="6" fill={color}/>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <ellipse key={i} cx="30" cy="17" rx="4" ry="8" fill={color} opacity="0.7"
        transform={`rotate(${deg} 30 30)`}/>
    ))}
    <circle cx="30" cy="30" r="9" stroke={color} strokeWidth="1" fill="none"/>
  </svg>
);

/* ============================================================
   DATA CONSTANTS
   ============================================================ */
const COMMENTS0 = [
  { id: 1, text: "Penampilan Al-Muqoddas di acara Haflah kemarin luar biasa! Memukau dan penuh semangat.", time: "2 jam lalu", ini: "AN" },
  { id: 2, text: "Saya sangat kagum dengan dedikasi adik-adik dalam melestarikan kesenian Islam ini.", time: "5 jam lalu", ini: "RH" },
  { id: 3, text: "Suara rebana mereka terdengar indah sekali waktu di Maulid Nabi. Masya Allah.", time: "1 hari lalu", ini: "MS" },
  { id: 4, text: "Ekstrakurikuler rebana yang paling solid di SMKN 8. Pertahankan terus ya!", time: "2 hari lalu", ini: "DP" },
];

const GALLERY = [
  { id: 1, cap: "Latihan Kolaborasi SMK 4", label: "Latihan", foto: latian_kolaborasi },
  { id: 2, cap: "Isra' Mi'raj 2025", label: "Event", foto: uswah },
  { id: 3, cap: "Kegiatan Rutinan", label: "Rutin", foto: rutinan },
  { id: 4, cap: "Pesantren Ramadhan 2025", label: "Event", foto: gema },
  { id: 5, cap: "Maulid Nabi 2025", label: "Event", foto: pelita },
  { id: 6, cap: "LDK Rohis", label: "Event", foto: ldk },
];

const FAQ_DATA = [
  { q: "Apa saja syarat untuk bergabung dengan Rebana Al-Muqoddas?", a: "Ekstrakurikuler ini terbuka untuk seluruh siswa SMKN 8 Semarang dari semua jurusan. Niat yang tulus dan kemauan untuk belajar bersama adalah syarat paling utama." },
  { q: "Kapan jadwal latihan rutin dilaksanakan?", a: "Latihan rutin diadakan dua kali seminggu, yaitu pada hari Selasa dan Jumat setelah jam pelajaran sekolah berakhir, bertempat di Mushola SMKN 8 Semarang." },
  { q: "Apakah harus bisa membaca notasi musik atau punya rebana sendiri?", a: "Tidak perlu. Kami belajar dari dasar secara bersama-sama, dan semua instrumen hadroh/rebana sudah disediakan oleh pihak sekolah untuk keperluan latihan dan tampil." },
  { q: "Apakah Al-Muqoddas melayani undangan penampilan di luar sekolah?", a: "Ya, kami menerima undangan penampilan untuk berbagai acara keagamaan, wisuda, pengajian, pernikahan, maupun festival seni hadroh di luar lingkungan SMKN 8 Semarang." },
];

/* ── Icons ── */
const IgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
  </svg>
);
const CamIcon = () => (
  <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
    <rect x="3" y="9" width="32" height="22" rx="3.5" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="19" cy="20" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="19" cy="20" r="3" fill="currentColor" opacity=".2"/>
    <path d="M14 9L16 5H22L24 9" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <circle cx="31" cy="14" r="1.5" fill="currentColor" opacity=".4"/>
  </svg>
);
const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function RebanaAlMuqoddas() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [err, setErr] = useState(null);

  const API_URL = import.meta.env.DEV
    ? "/api/sheets"
    : "https://script.google.com/macros/s/AKfycbwXca_pg69ssnx6bupPqXoe7Uw-TiFnXtPbst0cW8rOhe0JZUAxhzIaIYmJE-HKix-K/exec";

  const [anggota, setAnggota] = useState([]);
  const wali = [{ nama: "Istiqomah S.Ag", Jabatan: "Pembina", Url: istiqomah }];
  const [loadingAnggota, setLoadingAnggota] = useState(true);

  // Scroll variables
  const [scrollPercent, setScrollPercent] = useState(0);

  // Gallery and Lightbox
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollPercent((window.scrollY / total) * 100);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingAnggota(true);
      setErr(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get("content-type");
        if (!ct?.includes("application/json")) throw new Error("Bukan JSON");
        const json = await res.json();
        if (!json || json.status !== "success") throw new Error(json?.message || "Gagal");
        if (!json.data?.length) {
          setErr("Belum ada data anggota");
          setAnggota([]);
          return;
        }
        setAnggota(json.data.map((m, i) => ({
          ...m,
          id: m.id || i + 1,
          name: (m.name || "").toLowerCase(),
          kelas: (m.kelas || "").toLowerCase(),
          quote: m.quote || "Bersama Al-Muqoddas, kami merawat warisan leluhur.",
          photo: getPhotoUrl(m.photo),
        })));
      } catch (e) {
        setErr(e.message || "Gagal mengambil data");
        setAnggota([]);
        flash("Gagal memuat data anggota");
      } finally {
        setLoadingAnggota(false);
      }
    })();
  }, []);

  function getPhotoUrl(photo) {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    if (/^[a-zA-Z0-9_-]{25,}$/.test(photo)) return `https://drive.google.com/thumbnail?id=${photo}&sz=w400`;
    return photo;
  }

  const [comments, setComments] = useState(() => {
    try {
      const s = localStorage.getItem("almuqoddas_comments");
      return s ? JSON.parse(s) : COMMENTS0;
    } catch {
      return COMMENTS0;
    }
  });
  const [draft, setDraft] = useState("");
  const [commentName, setCommentName] = useState("");
  const [toast, setToast] = useState({ on: false, msg: "" });
  const cid = useRef(comments.length + 1);
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem("almuqoddas_webhook_url") || "https://script.google.com/macros/s/AKfycbylR02HVul7SljYbgkULvK4onBuXDQ-L3IxoeBYHpdQPRYVFXMdWTvwTE2zxdY-VIY9/exec");
  const [showWebhook, setShowWebhook] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [revealed, setRevealed] = useState({ home: true });

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setRevealed(p => p[e.target.id] ? p : { ...p, [e.target.id]: true });
      }), { threshold: 0.05 }
    );
    ["nilai", "instrumen", "anggota", "komentar", "galeri", "faq"].forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("almuqoddas_comments", JSON.stringify(comments));
    } catch {}
  }, [comments]);

  const formatTime = (d) => {
    if (!d) return "Baru saja";
    try {
      const dt = new Date(d);
      if (isNaN(dt)) return "Beberapa saat lalu";
      const m = (Date.now() - dt) / 60000;
      if (m < 1) return "Baru saja";
      if (m < 60) return `${Math.floor(m)} menit lalu`;
      if (m < 1440) return `${Math.floor(m / 60)} jam lalu`;
      return `${Math.floor(m / 1440)} hari lalu`;
    } catch {
      return "Beberapa saat lalu";
    }
  };

  const fetchComments = async (url) => {
    if (!url) return;
    try {
      const res = await fetch(`${url}?sheet=Komentar`);
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.data))
        setComments(data.data.map(i => ({
          id: i.id || Math.random(),
          text: i.pesan || "",
          time: formatTime(i.tanggal),
          ini: (i.nama || "AN").substring(0, 2).toUpperCase(),
        })));
    } catch {}
  };

  useEffect(() => {
    if (webhookUrl) fetchComments(webhookUrl);
  }, [webhookUrl]);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };
  const flash = (msg) => {
    setToast({ on: true, msg });
    setTimeout(() => setToast({ on: false, msg: "" }), 3200);
  };

  const submitComment = async () => {
    if (!draft.trim()) return;
    const name = commentName.trim() || "Anonim";
    const ini = name.substring(0, 2).toUpperCase();
    setComments(p => [{ id: cid.current++, text: draft.trim(), time: "Baru saja", ini }, ...p]);
    setDraft("");
    setCommentName("");
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "addComment", nama: name, pesan: draft.trim() })
        });
        flash("Komentar terkirim!");
        setTimeout(() => fetchComments(webhookUrl), 1000);
      } catch {
        flash("Komentar disimpan lokal");
      }
    } else {
      flash("Komentar disimpan lokal");
    }
  };

  const NAV_LINKS = [
    ["home", "Beranda"],
    ["nilai", "Filosofi"],
    ["instrumen", "Instrumen"],
    ["anggota", "Tim"],
    ["komentar", "Kesan"],
    ["galeri", "Galeri"],
    ["faq", "FAQ"],
  ];

  const filteredGallery = activeFilter === "Semua" 
    ? GALLERY 
    : GALLERY.filter(g => g.label === activeFilter);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === 0 ? filteredGallery.length - 1 : prev - 1));
  };
  const nextLightbox = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === filteredGallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollPercent}%` }} />
      </div>

      {/* Toast Notification */}
      <div className={`skeuo-toast${toast.on ? " show" : ""}`}>
        <div className="toast-icon-check">✓</div>
        <span className="toast-message-text">{toast.msg}</span>
      </div>

      {/* ── NAV ── */}
      <nav className={`nav-container${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo-box" onClick={() => go("home")}>
          <div className="logo-circle">
            <img src={logo} alt="Al-Muqoddas Logo" />
          </div>
          <div className="nav-brand-box">
            <span className="nav-brand-title gold-text-emboss">Al-Muqoddas</span>
            <span className="nav-brand-sub">Rebana &amp; Hadroh</span>
          </div>
        </div>
        <ul className="nav-menu">
          {NAV_LINKS.map(([id, lbl]) => (
            <li key={id}>
              <a onClick={() => go(id)} className={id === "home" && !scrolled ? "active" : ""}>
                {lbl}
              </a>
            </li>
          ))}
        </ul>
        <button className="btn-skeuo-3d btn-skeuo-primary" onClick={() => setShowRegModal(true)} style={{ padding: "8px 20px", fontSize: "12px" }}>
          Bergabung
        </button>
        <button className={`ham-button${menu ? " open" : ""}`} onClick={() => setMenu(v => !v)} aria-label="Menu Toggle">
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-drawer-overlay${menu ? " open" : ""}`} onClick={() => setMenu(false)} />
      <div className={`mobile-drawer${menu ? " open" : ""}`}>
        {NAV_LINKS.map(([id, lbl]) => (
          <a key={id} onClick={() => go(id)}>
            {lbl}
          </a>
        ))}
        <button className="btn-skeuo-3d btn-skeuo-primary" onClick={() => { setMenu(false); setShowRegModal(true); }} style={{ marginTop: "20px" }}>
          Bergabung
        </button>
      </div>

      {/* ── HERO ── */}
      <section id="home" className="hero-sec">
        <div className="pattern-overlay" />
        <div className="hero-deco-ring" />
        <div className="hero-layout">
          {/* LEFT */}
          <div className="hero-text-content">
            <div className="bismillah-banner">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <span className="hero-eyebrow">Ekstrakurikuler Rebana SMKN 8 Semarang</span>
            <h1 className="hero-title text-engraved-light">
              Al&#8209;<span className="gold-text-emboss">Muqoddas</span>
            </h1>
            <p className="hero-tagline">Kesenian Islam Yang Memukau Hati</p>
            <span className="hero-arabic-calligraphy">الْمُقَدَّس</span>
            <p className="hero-desc">
              Membawa warisan seni rebana Islam dengan semangat generasi muda SMKN 8 Semarang — memadukan keindahan, iman, dan harmoni dalam setiap penampilan.
            </p>
            <div className="hero-buttons">
              <button className="btn-skeuo-3d btn-skeuo-primary" onClick={() => setShowRegModal(true)}>
                Daftar Anggota
              </button>
              <button className="btn-skeuo-3d btn-skeuo-secondary" onClick={() => go("galeri")}>
                Lihat Galeri
              </button>
            </div>
            <div className="hero-stats-panel">
              <div className="stat-item">
                <span className="stat-number gold-text-emboss">15+</span>
                <span className="stat-label">Anggota Aktif</span>
              </div>
              <div className="stat-item">
                <span className="stat-number gold-text-emboss">2+</span>
                <span className="stat-label">Tahun Berdiri</span>
              </div>
              <div className="stat-item">
                <span className="stat-number gold-text-emboss">10+</span>
                <span className="stat-label">Event Diikuti</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Skeuomorphic Arch photo frame */}
          <div className="hero-visual-box">
            <div className="skeuo-arch-container">
              <div className="skeuo-arch-inner">
                <img src={al} alt="Rebana Al-Muqoddas Performance" />
                <div className="skeuo-arch-glow" />
              </div>
              <div className="floating-status-plate">
                <span className="status-dot" />
                <span className="status-text">Aktif Berlatih · Est. 2022</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NILAI / FILOSOFI ── */}
      <section id="nilai" className={`sec-spacing section-light${revealed.nilai ? " vis" : ""}`}>
        <div className="section-inner">
          <div className="sec-header rv">
            <span className="sec-eyebrow">01 · Filosofi</span>
            <h2 className="sec-title text-engraved-dark">Pilar Utama Al-Muqoddas</h2>
            <div className="sec-divider">
              <span className="sec-divider-line" />
              <span className="sec-divider-ornament">✦</span>
              <span className="sec-divider-line rev" />
            </div>
            <p className="sec-desc-text text-engraved-dark">Tiga pilar utama yang menjadi fondasi setiap langkah kami dalam memainkan rebana dan menyebarkan cahaya sholawat.</p>
          </div>
          <div className="filosofi-grid">
            {[
              { num: "01", icon: "🕌", title: "Syi'ar Melalui Seni", desc: "Menyebarkan nilai-nilai keislaman dan kecintaan kepada Nabi Muhammad SAW melalui lantunan sholawat yang indah dan penuh makna." },
              { num: "02", icon: "🤝", title: "Ukhuwah Islamiyah", desc: "Membangun persaudaraan yang kokoh antar anggota berlandaskan nilai Islam, saling mendukung dalam kebaikan dan disiplin bersama.", delay: "100ms" },
              { num: "03", icon: "✨", title: "Warisan Budaya", desc: "Melestarikan seni hadroh rebana agar tetap relevan dan dicintai generasi kini, tanpa menghilangkan esensi keaslian tradisinya.", delay: "200ms" },
            ].map((v, i) => (
              <div key={i} className="arched-parchment-card parchment-card rv" style={v.delay ? { transitionDelay: v.delay } : {}}>
                <span className="pilar-num">PILAR {v.num}</span>
                <div className="pilar-icon-frame">
                  <span>{v.icon}</span>
                </div>
                <h3 className="pilar-title text-engraved-dark">{v.title}</h3>
                <p className="pilar-desc text-engraved-dark">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTRUMEN ── */}
      <section id="instrumen" className={`sec-spacing section-dark${revealed.instrumen ? " vis" : ""}`}>
        <div className="pattern-overlay" />
        <div className="section-inner">
          <div className="sec-header rv">
            <span className="sec-eyebrow">02 · Instrumen</span>
            <h2 className="sec-title text-engraved-light">Harmoni Instrumen</h2>
            <div className="sec-divider">
              <span className="sec-divider-line" />
              <span className="sec-divider-ornament">✦</span>
              <span className="sec-divider-line rev" />
            </div>
            <p className="sec-desc-text text-engraved-light">Tiga jenis instrumen rebana yang berpadu menciptakan satu harmoni utuh dalam setiap penampilan Al-Muqoddas.</p>
          </div>
          <div className="instrumen-grid">
            {[
              { n: "01", icon: "🥁", name: "Hadroh (Terbang)", desc: "Rebana berdiameter sedang dengan kencer logam. Memainkan pola ritmis utama dengan ketukan dinamis sebagai tulang punggung irama." },
              { n: "02", icon: "🎵", name: "Bass Hadroh", desc: "Rebana besar berpiringan tebal. Menghasilkan nada rendah yang memberi fondasi berat dan kedalaman pada aransemen musik.", delay: "120ms" },
              { n: "03", icon: "✨", name: "Kepak (Keprak)", desc: "Rebana mungil bernada nyaring. Mengisi celah ketukan dengan aksen cepat yang memperindah tekstur irama musik.", delay: "240ms" },
            ].map((item, i) => (
              <div key={i} className="skeuo-instrument-card rv" style={item.delay ? { transitionDelay: item.delay } : {}}>
                <span className="instrumen-num-tag">{item.n}</span>
                <div className="instrumen-icon-box">
                  {item.icon}
                </div>
                <h3 className="instrumen-title gold-text-emboss">{item.name}</h3>
                <p className="instrumen-desc">{item.desc}</p>
                <div className="soundwave-box">
                  <span className="soundwave-bar" />
                  <span className="soundwave-bar" />
                  <span className="soundwave-bar" />
                  <span className="soundwave-bar" />
                  <span className="soundwave-bar" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANGGOTA / TIM ── */}
      <section id="anggota" className={`sec-spacing section-light${revealed.anggota ? " vis" : ""}`}>
        <div className="section-inner">
          <div className="sec-header rv">
            <span className="sec-eyebrow">03 · Tim Kami</span>
            <h2 className="sec-title text-engraved-dark">Keluarga Besar Al-Muqoddas</h2>
            <div className="sec-divider">
              <span className="sec-divider-line" />
              <span className="sec-divider-ornament">✦</span>
              <span className="sec-divider-line rev" />
            </div>
            <p className="sec-desc-text text-engraved-dark">Setiap anggota adalah bagian penting yang saling mendukung dalam perjalanan seni dan spiritualitas.</p>
          </div>

          {/* Pembina Spotlight */}
          {wali.map((w, i) => (
            <div key={i} className="pembina-card-layout parchment-card rv">
              <div className="pembina-img-box">
                <div className="pembina-img-inner">
                  <img src={w.Url} alt={w.nama} />
                </div>
              </div>
              <div className="pembina-quote-box">
                <span className="pembina-badge">{w.Jabatan} Utama</span>
                <h3 className="pembina-title text-engraved-dark">{w.nama}</h3>
                <div className="pembina-quote text-engraved-dark">
                  "Membimbing generasi muda berkarakter Islami, memadukan prestasi akademik dengan kedalaman spiritual melalui media seni rebana sholawat."
                </div>
              </div>
            </div>
          ))}

          {/* Members Portraits */}
          <div className="members-grid">
            {loadingAnggota ? (
              <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Memuat data anggota…
              </p>
            ) : err ? (
              <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                {err}
              </p>
            ) : anggota.length === 0 ? (
              <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Belum ada data anggota.
              </p>
            ) : (
              anggota.map((m, i) => (
                <div key={m.id} className="member-skeuo-card rv" style={{ transitionDelay: `${(i % 5) * 80}ms` }}>
                  <div className="member-card-inner">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} className="member-photo" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="member-photo-placeholder"><CamIcon /></div>
                    )}
                    {/* Hover Info Overlay */}
                    <div className="member-hover-overlay">
                      <span className="member-name-tag">{m.name}</span>
                      <span className="member-role-tag">{m.kelas}</span>
                      <p className="member-quote-tag">"{m.quote}"</p>
                    </div>
                    {/* Default Static Info (slides away on hover) */}
                    <div className="member-static-info">
                      <span className="member-static-name">{m.name}</span>
                      <span className="member-static-role">{m.kelas}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── KOMENTAR / KESAN ── */}
      <section id="komentar" className={`sec-spacing section-dark${revealed.komentar ? " vis" : ""}`}>
        <div className="pattern-overlay" />
        <div className="section-inner">
          <div className="sec-header rv">
            <span className="sec-eyebrow">04 · Kesan &amp; Pesan</span>
            <h2 className="sec-title text-engraved-light">Kesan &amp; Apresiasi</h2>
            <div className="sec-divider">
              <span className="sec-divider-line" />
              <span className="sec-divider-ornament">✦</span>
              <span className="sec-divider-line rev" />
            </div>
            <p className="sec-desc-text text-engraved-light">Bagikan apresiasi dan tanggapanmu. Setiap kata adalah semangat bagi syiar kami.</p>
          </div>

          <div className="testimonial-layout">
            {/* Input Form Box (Ledger style parchment) */}
            <div className="ledger-panel parchment-card rv">
              <div className="ledger-hdr">
                <h3 className="ledger-title text-engraved-dark">Tulis Kesan</h3>
                <button className="webhook-admin-btn" onClick={() => setShowWebhook(v => !v)} title="Pengaturan Webhook Admin">
                  <GearIcon />
                </button>
              </div>

              {showWebhook && (
                <div className="webhook-config-box">
                  <label className="ledger-label">Webhook URL (Sinkronisasi)</label>
                  <input type="text" className="ledger-input" value={webhookUrl}
                    onChange={e => {
                      setWebhookUrl(e.target.value);
                      localStorage.setItem("almuqoddas_webhook_url", e.target.value);
                    }}
                    placeholder="https://script.google.com/macros/s/.../exec" />
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                    {webhookUrl ? "✓ Mode awan sinkron aktif" : "⚠ Hanya penyimpanan lokal"}
                  </p>
                </div>
              )}

              <div className="ledger-field">
                <label className="ledger-label">Nama Lengkap (Opsional)</label>
                <input type="text" className="ledger-input" value={commentName}
                  onChange={e => setCommentName(e.target.value)} placeholder="Anonim..." />
              </div>

              <div className="ledger-field">
                <label className="ledger-label">Pesan / Kesan</label>
                <textarea className="ledger-textarea" value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Tuliskan apresiasimu di sini..."
                  onKeyDown={e => { if (e.ctrlKey && e.key === "Enter") submitComment(); }} />
              </div>

              <button className="btn-skeuo-3d btn-skeuo-primary" onClick={submitComment} style={{ width: "100%" }}>
                Kirim Kesan
              </button>
            </div>

            {/* Testimonials Wall Feed */}
            <div className="testimonial-wall rv" style={{ transitionDelay: "150ms" }}>
              {comments.slice(0, 4).map(c => (
                <div key={c.id} className="paper-note">
                  <p className="paper-note-text">"{c.text}"</p>
                  <div className="paper-note-meta">
                    <div className="avatar-circle">{c.ini}</div>
                    <span className="note-author">{c.ini === "AN" ? "Anonim" : `User (${c.ini})`}</span>
                    <span className="note-time">{c.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALERI ── */}
      <section id="galeri" className={`sec-spacing section-light${revealed.galeri ? " vis" : ""}`}>
        <div className="section-inner">
          <div className="sec-header rv">
            <span className="sec-eyebrow">05 · Galeri</span>
            <h2 className="sec-title text-engraved-dark">Galeri Kegiatan</h2>
            <div className="sec-divider">
              <span className="sec-divider-line" />
              <span className="sec-divider-ornament">✦</span>
              <span className="sec-divider-line rev" />
            </div>
            <p className="sec-desc-text text-engraved-dark">Setiap momen sholawat dan ukhuwah diabadikan sebagai bagian sejarah Rebana Al-Muqoddas.</p>
          </div>

          {/* Filter Switching Tabs */}
          <div className="filter-tabs rv">
            {["Semua", "Latihan", "Event", "Rutin"].map(lbl => (
              <button key={lbl} 
                className={`filter-tab-btn${activeFilter === lbl ? " active" : ""}`}
                onClick={() => { setActiveFilter(lbl); closeLightbox(); }}>
                {lbl}
              </button>
            ))}
          </div>

          {/* Gallery Items Grid */}
          <div className="gallery-skeuo-grid">
            {filteredGallery.map((g, i) => (
              <div key={g.id} className="gallery-skeuo-item rv" 
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                onClick={() => openLightbox(i)}>
                <div className="gallery-img-inner">
                  <img src={g.foto} alt={g.cap} />
                  <div className="gallery-item-glow">
                    <span className="gallery-item-label">{g.label}</span>
                    <span className="gallery-item-caption">{g.cap}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Overlay Modal */}
      <div className={`lightbox-overlay${lightboxIndex !== null ? " open" : ""}`} onClick={closeLightbox}>
        {lightboxIndex !== null && (
          <div className="lightbox-container" onClick={e => e.stopPropagation()}>
            <div className="lightbox-content-box">
              <button className="lightbox-close-btn" onClick={closeLightbox}>×</button>
              
              <button className="lightbox-btn prev" onClick={prevLightbox}>❮</button>
              <div className="lightbox-img-inner">
                <img src={filteredGallery[lightboxIndex].foto} alt={filteredGallery[lightboxIndex].cap} />
                <div className="lightbox-caption-strip">
                  <div className="lightbox-caption-tag">{filteredGallery[lightboxIndex].label}</div>
                  <div className="lightbox-caption-title">{filteredGallery[lightboxIndex].cap}</div>
                </div>
              </div>
              <button className="lightbox-btn next" onClick={nextLightbox}>❯</button>
            </div>
          </div>
        )}
      </div>

      {/* ── FAQ ── */}
      <section id="faq" className={`sec-spacing section-dark${revealed.faq ? " vis" : ""}`}>
        <div className="pattern-overlay" />
        <div className="section-inner">
          <div className="sec-header rv">
            <span className="sec-eyebrow">06 · Tanya Jawab</span>
            <h2 className="sec-title text-engraved-light">Pertanyaan Umum</h2>
            <div className="sec-divider">
              <span className="sec-divider-line" />
              <span className="sec-divider-ornament">✦</span>
              <span className="sec-divider-line rev" />
            </div>
            <p className="sec-desc-text text-engraved-light">Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai ekstrakurikuler Al-Muqoddas.</p>
          </div>

          <div className="faq-box">
            {FAQ_DATA.map((f, idx) => {
              const open = activeFaq === idx;
              return (
                <div key={idx} className={`faq-panel-item rv${open ? " active" : ""}`} style={{ transitionDelay: `${idx * 70}ms` }}>
                  <button className="faq-panel-hdr" onClick={() => setActiveFaq(open ? null : idx)} aria-expanded={open}>
                    <span>{f.q}</span>
                    <div className="faq-chevron-box">▼</div>
                  </button>
                  <div className="faq-panel-body" style={{ maxHeight: open ? "200px" : "0" }}>
                    <p className="faq-answer-text">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-sec">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo-row">
              <div className="footer-logo-circle">
                <img src={logo} alt="logo" />
              </div>
              <span className="footer-brand-title gold-text-emboss">Al-Muqoddas</span>
            </div>
            <span className="footer-brand-arabic">الْمُقَدَّس</span>
            <p className="footer-brand-desc">
              Ekstrakurikuler Rebana resmi SMKN 8 Semarang. Melestarikan nilai sholawat dan seni hadroh berlandaskan ukhuwah Islamiyah.
            </p>
          </div>
          <div>
            <h4 className="footer-col-title">Navigasi Halaman</h4>
            <ul className="footer-menu-links">
              {NAV_LINKS.map(([id, lbl]) => (
                <li key={id}>
                  <a onClick={() => go(id)}>{lbl}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Instagram Kami</h4>
            <a className="footer-social-card" href="https://instagram.com/rebana.almuqoddas" target="_blank" rel="noopener noreferrer">
              <div className="social-logo-box">
                <IgIcon />
              </div>
              <div>
                <div className="social-title">@rebana.almuqoddas</div>
                <div className="social-sub">Media Instagram Resmi</div>
              </div>
            </a>
            <div className="footer-address-box">
              SMKN 8 Semarang<br />
              Jl. Pandanaran II No. 12<br />
              Semarang, Jawa Tengah
            </div>
          </div>
        </div>
        <div className="footer-bottom-row">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Rebana Al-Muqoddas · SMKN 8 Semarang. All Rights Reserved.
          </p>
          <span className="footer-bismillah-end">بِسْمِ اللَّهِ</span>
        </div>
      </footer>

      {/* ── REGISTER MODAL ── */}
      <div className={`skeuo-modal-overlay${showRegModal ? " open" : ""}`} onClick={() => setShowRegModal(false)}>
        <div className="skeuo-modal-box" onClick={e => e.stopPropagation()}>
          <div className="skeuo-modal-hdr">
            <h3 className="skeuo-modal-title">Pendaftaran Anggota</h3>
            <button className="skeuo-modal-close-btn" onClick={() => setShowRegModal(false)}>×</button>
          </div>
          <div className="skeuo-modal-body">
            <p>
              Mari bergabung dengan keluarga besar Rebana Al-Muqoddas SMKN 8 Semarang. Di sini, kamu bisa melatih kedisiplinan diri, meningkatkan spiritualitas, dan melestarikan hadroh.
            </p>
            <div className="skeuo-modal-action-box">
              <span className="action-box-lbl">Klik link di bawah untuk mengisi form pendaftaran:</span>
              <a href="https://forms.gle/JE4zXgrzFouqwsAF8" target="_blank" rel="noopener noreferrer" className="action-box-link">
                → Google Forms Pendaftaran Al-Muqoddas
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
