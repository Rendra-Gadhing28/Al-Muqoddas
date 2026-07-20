import { useState, useEffect, useRef } from "react";
import al from "../assets/header-rebana.webp";
import logo from "../../public/logo-rebana.svg"
import istiqomah from "../assets/header-rebana.webp";


/* ═══════════════════════════════════════════════════════
   REBANA AL-MUQODDAS  — v7
   Perubahan & Penyempurnaan:
   • Pembuatan Hamburger & Drawer Menu Mobile yang Responsif dan Animasi "X" yang Sempurna
   • Menambahkan Drawer Overlay (Backdrop buram ketika menu drawer aktif)
   • Desain ID Card Anggota dibersihkan: Barcode dan Status Aktif dihapus
   • Foto Anggota dibuat jauh lebih dominan, jelas, dan besar (ukuran pasfoto passport)
   • Layout Full-Bleed: Semua section dibuat full-width mentok ke tepi layar
   • Rotasi lingkaran dekoratif & animasi gspin di halaman home dihapus
   • Foto Hero diposisikan secara relatif & responsif dengan rasio 16:9 yang lebar
   • Integrasi Google Sheets Webhook (POST & GET) dengan input URL dinamis
   • Penyimpanan Komentar lokal di localStorage agar persisten
   • Opsi Input Nama pada form komentar (semi-anonim)
   • Modal Pendaftaran Anggota yang terhubung ke Webhook
═══════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Noto+Naskh+Arabic:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;700&family=Tajawal:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --em900:#061a12; /* Emerald ultra-gelap */
  --em800:#0b2419; 
  --em700:#113222; 
  --em600:#1b4a33; 
  --em500:#276b4a; 
  --em200:#83c09b; 
  --em100:#bfe3cd; 
  --em50:#e9f6ee;
  --gold:#d4af37;  --gold3:#f3e5ab; --gold6:#a77b10;
  --ivory:#fdfbf5; --s1:#f3efe5; --s2:#e2dbd0; --s5:#8c7f6e;
  --char:#1c1a16;
  --d:'Playfair Display',Georgia,serif;
  --b:'Inter',system-ui,sans-serif;
  --ar:'Noto Naskh Arabic',serif;
  --px:clamp(1rem,3vw,2rem); /* Dipersempit agar konten lebih mepet ke tepi */
  --py:clamp(3rem,6vw,5rem);
}

html{scroll-behavior:smooth}
body{
  font-family:var(--b);
  background:var(--ivory);
  color:var(--char);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:var(--s1)}
::-webkit-scrollbar-thumb{background:var(--em600);border-radius:3px}

/* ─── NAV ─── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:300;
  height:65px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 var(--px);
  background:rgba(6, 26, 18, 0.94);
  backdrop-filter:blur(24px) saturate(180%);
  -webkit-backdrop-filter:blur(24px) saturate(180%);
  border-bottom:1px solid rgba(212,175,55,0.22);
}
.nav-brand{
  font-family:var(--d);font-size:clamp(1.05rem,2.2vw,1.35rem);
  font-weight:700;color:white;letter-spacing:.04em;
  cursor:pointer;white-space:nowrap;user-select:none;
}
.nav-links{display:flex;gap:clamp(.875rem,2.5vw,2rem);list-style:none}
.nav-links a{
  font-size:.75rem;font-weight:600;letter-spacing:.1em;
  text-transform:uppercase;color:var(--em100);
  cursor:pointer;text-decoration:none;white-space:nowrap;
  opacity:0.75;
  transition: opacity 0.2s, color 0.2s;
}
.nav-links a:hover {
  opacity: 1;
  color: var(--gold3);
}

/* Tombol Hamburger dengan Animasi X Sempurna */
.ham{
  display:none;flex-direction:column;gap:5px;
  background:none;border:none;cursor:pointer;padding:6px;
  justify-content:center;
  align-items:center;
  z-index:301;
}
.ham span{
  display:block;width:22px;height:2px;
  background:var(--gold);border-radius:2px;
  transition:transform .3s ease, opacity .3s ease;
}
.ham.open span:nth-child(1){transform: translateY(7px) rotate(45deg)}
.ham.open span:nth-child(2){opacity:0; transform: scale(0)}
.ham.open span:nth-child(3){transform: translateY(-7px) rotate(-45deg)}

/* Drawer Menu Mobile */
.drawer{
  position:fixed;top:65px;left:0;right:0;z-index:299;
  background:rgba(6, 26, 18, 0.98);
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border-bottom:1px solid rgba(212,175,55,0.18);
  padding:1.5rem var(--px) 2.25rem;
  display:flex;flex-direction:column;gap:0.35rem;
  transform:translateY(-110%);
  transition:transform .35s cubic-bezier(.4,0,.2,1);
  pointer-events:none;
}
.drawer.open{transform:none;pointer-events:auto}
.drawer a{
  font-size:1rem;font-weight:600;letter-spacing:.1em;
  text-transform:uppercase;color:var(--em100);
  cursor:pointer;text-decoration:none;opacity:0.8;
  padding:0.75rem 0;
  border-bottom:1px solid rgba(255,255,255,0.04);
  transition:color 0.2s, padding-left 0.2s;
}
.drawer a:hover{
  color:var(--gold);
  padding-left:8px;
  opacity:1;
}
.drawer a:last-child{
  border-bottom:none;
}

/* Backdrop buram ketika menu drawer aktif */
.drawer-overlay {
  position:fixed;
  inset:0;
  top:65px;
  background:rgba(0,0,0,0.55);
  backdrop-filter:blur(4px);
  -webkit-backdrop-filter:blur(4px);
  z-index:298;
  opacity:0;
  pointer-events:none;
  transition:opacity 0.3s ease;
}
.drawer-overlay.open {
  opacity:1;
  pointer-events:auto;
}

@media(max-width:640px){
  .nav-links{display:none}
  .ham{display:flex}
}

/* ─── HERO ─── */
.hero{
  position:relative;
  min-height:100svh;min-height:100vh;
  display:flex;align-items:center;
  overflow:hidden;
  background:var(--em900);
  width:100%;
}

/* GLOSSY ABSOLUTE BG */
.hero-abs-bg{
  position:absolute;inset:0;z-index:0;
  background:
    linear-gradient(135deg,
      rgba(27,92,64,0.58) 0%,
      rgba(6,26,18,0.8) 40%,
      rgba(6,26,18,0.92) 100%);
}
.hero-gloss{
  position:absolute;inset:0;z-index:1;
  background:
    radial-gradient(ellipse 70% 55% at 30% 10%,
      rgba(255,255,255,0.08) 0%,
      transparent 60%),
    radial-gradient(ellipse 45% 35% at 80% 80%,
      rgba(212,175,55,0.08) 0%,
      transparent 55%);
  backdrop-filter:blur(0px);
}
.hero-bevel{
  position:absolute;top:0;left:0;right:0;height:2px;z-index:2;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(255,255,255,0.2) 30%,
    rgba(212,175,55,0.25) 50%,
    rgba(255,255,255,0.2) 70%,
    transparent 100%);
}
.hero-pat{
  position:absolute;inset:0;z-index:1;
  opacity:.06;
  background-image:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4AF37' stroke-width='0.55'%3E%3Cpolygon points='40,4 76,22 76,58 40,76 4,58 4,22'/%3E%3Cpolygon points='40,16 64,29 64,51 40,64 16,51 16,29'/%3E%3Cline x1='40' y1='4' x2='40' y2='16'/%3E%3Cline x1='76' y1='22' x2='64' y2='29'/%3E%3Cline x1='76' y1='58' x2='64' y2='51'/%3E%3Cline x1='40' y1='76' x2='40' y2='64'/%3E%3Cline x1='4' y1='58' x2='16' y2='51'/%3E%3Cline x1='4' y1='22' x2='16' y2='29'/%3E%3C/g%3E%3C/svg%3E");
  background-size:80px 80px;
}

.hero-grid{
  position:relative;z-index:3;
  width:100%;
  max-width:100%; /* Dibuat mentok ke tepi */
  margin:0;
  padding:calc(65px + clamp(2rem,4vw,3.5rem)) var(--px) clamp(2rem,4vw,3.5rem);
  display:grid;
  gap:clamp(2rem,4vw,5rem);
  align-items:center;
  min-height:100svh;min-height:100vh;
}
@media(min-width:821px){
  .hero-grid{
    grid-template-columns: 1fr 1.3fr; /* Memberikan porsi lebih lebar untuk kanan */
  }
}

/* ── LEFT ── */
.hleft{display:flex;flex-direction:column}

.hbism{
  font-family:var(--ar);
  font-size:clamp(1.4rem,2.8vw,2.2rem);
  color:var(--gold);
  line-height:1.65;
  opacity:.92;
  margin-bottom:clamp(.625rem,1.5vw,1rem);
  padding-left:0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hew{
  display:inline-flex;align-items:center;gap:.55rem;
  font-size:clamp(.62rem,1vw,.75rem);font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;
  color:var(--gold3);margin-bottom:.75rem;
}
.hew::before{
  content:'';display:block;
  width:clamp(1rem,2vw,1.75rem);height:1px;background:var(--gold3);
}

.htitle{
  font-family:var(--d);
  font-size:clamp(2.8rem,5.8vw,6rem);
  font-weight:700;
  line-height:1.05;
  color:var(--ivory);
  letter-spacing:-.02em;
  white-space:nowrap;
  margin-bottom:clamp(.375rem,1vw,.75rem);
}
.htitle em{color:var(--gold);font-style:italic}
@media(max-width:380px){
  .htitle{white-space:normal;font-size:clamp(2.25rem,10vw,3rem)}
}

.htagline{
  font-family:var(--d);
  font-size:clamp(.88rem,1.5vw,1.25rem);
  font-style:italic;color:var(--em200);
  margin-bottom:clamp(.875rem,2vw,1.5rem);
  line-height:1.5;
}

.hdesc{
  font-size:clamp(.82rem,1.3vw,.95rem);
  color:rgba(212,237,224,.7);
  line-height:1.85;max-width:44ch;
  margin-bottom:clamp(1.25rem,3vw,2.25rem);
}

/* STATS */
.hstats{
  display:flex;
  gap:clamp(1.25rem,3.5vw,3rem);
  flex-wrap:wrap;
  margin-bottom:clamp(1.75rem,3.5vw,2.5rem);
}
.stat{display:flex;flex-direction:column}
.stat-n{
  font-family:var(--d);
  font-size:clamp(1.75rem,3.5vw,3rem);
  font-weight:700;color:var(--gold);line-height:1;
}
.stat-l{
  font-size:clamp(.6rem,.9vw,.7rem);font-weight:600;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--em200);opacity:.75;margin-top:.25rem;
}

.hcta{display:flex;gap:.9rem;flex-wrap:wrap}

/* ── RIGHT (16:9 PHOTO EXPANSION) ── */
.hright{
  position:relative;
  display:flex;justify-content:center;align-items:center;
  width: 100%;
}

/* 16:9 Photo Frame (Tanpa rotasi dan ornamen melingkar) */
.hphoto{
  position:relative;
  width: 100%;
  max-width: 720px;
  aspect-ratio:16/9;
  border-radius:clamp(16px,2.5vw,28px);
  overflow:hidden;
  border:3px solid rgba(212,175,55,.6);
  box-shadow:
    0 0 0 8px rgba(212,175,55,.08),
    0 0 0 16px rgba(6,26,18,.25),
    0 35px 80px rgba(0,0,0,.7),
    inset 0 1px 0 rgba(255,255,255,.2);
  z-index:5;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease;
}
.hphoto img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.hph-placeholder{
  width:100%;height:100%;
  background:linear-gradient(150deg,#1B5C40 0%,#0D2B1E 100%);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:.625rem;color:var(--em200);
}
.hphoto::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(130deg,
    rgba(255,255,255,.08) 0%,
    transparent 45%,
    rgba(0,0,0,.1) 100%);
  pointer-events:none;
}
.hphoto:hover {
  transform: scale(1.02);
  box-shadow:
    0 0 0 8px rgba(212,175,55,0.12),
    0 0 0 16px rgba(6,26,18,0.35),
    0 45px 90px rgba(0,0,0,.85),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

/* Ambient light dots di belakang foto */
.hright-glow {
  position: absolute;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
  z-index: 1;
  pointer-events: none;
}

/* ── HERO RESPONSIVE ── */
@media(max-width:820px){
  .hero-grid{
    grid-template-columns:1fr;
    min-height:auto;
    padding-top:calc(65px + 2rem);
    padding-bottom:4rem;
    gap:3rem;
  }
  .hright{order:-1; margin-bottom:1.5rem}
  .hphoto{
    width:100%;
    max-width: 580px;
  }
  .htitle{white-space:normal;font-size:clamp(2.5rem,8vw,4.2rem)}
  .hstats{gap:1.25rem 2rem; justify-content:center}
  .hleft{text-align:center; align-items:center}
  .hbism{text-align:center; width:100%}
  .hdesc{max-width:50ch}
  .hcta{justify-content:center}
}
@media(max-width:480px){
  .hstats{flex-wrap:wrap;gap:1rem 1.75rem}
  .hphoto{
    width:100%;
  }
}

/* ── BUTTONS ── */
.btn-g{
  display:inline-flex;align-items:center;gap:.5rem;
  padding:clamp(.65rem,1.4vw,.9rem) clamp(1.2rem,2.5vw,2.2rem);
  background:var(--gold);color:var(--em900);
  font-weight:700;font-size:clamp(.72rem,1.1vw,.85rem);
  letter-spacing:.08em;text-transform:uppercase;
  border:none;border-radius:100px;cursor:pointer;
  text-decoration:none;white-space:nowrap;
  transition:all .25s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(212,175,55,.15);
}
.btn-g:hover{
  background:var(--gold3);
  transform:translateY(-3px);
  box-shadow:0 10px 24px rgba(212,175,55,.35);
}
.btn-gh{
  display:inline-flex;align-items:center;gap:.5rem;
  padding:clamp(.65rem,1.4vw,.9rem) clamp(1.2rem,2.5vw,2.2rem);
  background:rgba(255,255,255,.05);
  border:1px solid rgba(168,213,188,.35);
  backdrop-filter:blur(8px);
  color:var(--em200);
  font-weight:600;font-size:clamp(.72rem,1.1vw,.85rem);
  letter-spacing:.08em;text-transform:uppercase;
  border-radius:100px;cursor:pointer;
  text-decoration:none;white-space:nowrap;
  transition:all .25s;
}
.btn-gh:hover{
  border-color:var(--gold);
  color:var(--gold3);
  transform:translateY(-2px);
  background:rgba(255,255,255,.08);
}

/* ── SECTION COMMON ── */
.swrap{
  padding:var(--py) var(--px);
  width: 100%;
}
.sin{
  width: 100%;
  max-width: 100%; /* Bener-bener mentok penuh */
  margin: 0;
}
.sew{
  display:inline-flex;align-items:center;gap:.55rem;
  font-size:clamp(.6rem,.9vw,.72rem);font-weight:600;
  letter-spacing:.2em;text-transform:uppercase;
  color:var(--em600);margin-bottom:.6rem;
}
.sew::before,.sew::after{content:'';display:block;height:1px;width:1.2rem;background:currentColor}
.stitle{
  font-family:var(--d);
  font-size:clamp(1.85rem,4vw,3.25rem);
  font-weight:700;color:var(--em900);
  line-height:1.15;letter-spacing:-.015em;
}
.stitle em{font-style:italic;color:var(--em600)}
.sdiv{
  width:3rem;height:3.5px;
  background:linear-gradient(90deg,var(--gold),transparent);
  border-radius:2px;margin:1.1rem 0 2.5rem;
}

/* ── ANGGOTA (ID CARD SECTION) ── */
.abg{
  background: radial-gradient(circle at 10% 20%, var(--s1) 0%, rgba(226,219,208,0.4) 90%);
}
.mgrid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr)); /* Kolom disesuaikan agar card lebih lega */
  gap:clamp(1.5rem,3.2vw,2.5rem);
  padding-top: 3.5rem;
}

/* Badge Holder Wrapper */
.badge-holder {
  position: relative;
  padding-top: 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
  perspective: 1000px;
}

/* Tali Lanyard */
.id-strap {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 60px;
  background: linear-gradient(90deg, 
    var(--em800) 0%, 
    var(--em600) 25%, 
    var(--gold) 45%, 
    var(--gold) 55%, 
    var(--em600) 75%, 
    var(--em800) 100%);
  border-radius: 3px 3px 0 0;
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  z-index: 1;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
  transition: transform 0.4s ease;
}

/* Metal Clip */
.id-clip {
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 18px;
  background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 45%, #94a3b8 55%, #475569 100%);
  border: 1px solid #94a3b8;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.25);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.id-clip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  width: 7px;
  height: 9px;
  border: 2px solid var(--gold);
  border-top: none;
  border-radius: 0 0 3px 3px;
}

/* ID Card (Diberi padding bawah lebih seimbang karena barcode dihapus) */
.mc {
  background: var(--ivory);
  width: 100%;
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: 16px;
  outline: 4px solid rgba(255, 255, 255, 0.45);
  box-shadow: 
    0 12px 28px -5px rgba(13,43,30,0.14), 
    0 8px 12px -6px rgba(13,43,30,0.12),
    inset 0 1px 0 rgba(255,255,255,0.7);
  position: relative;
  overflow: hidden;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease, outline-color 0.3s ease;
  transform-style: preserve-3d;
}

/* Lubang Tali ID Card */
.id-slot {
  width: 24px;
  height: 7px;
  background: #1c1a16;
  border-radius: 10px;
  margin: 12px auto 6px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
  opacity: 0.85;
}

.id-hdr {
  text-align: center;
  padding: 4px 10px;
  background: linear-gradient(90deg, var(--em900), var(--em700), var(--em900));
  border-top: 1px solid rgba(212, 175, 55, 0.15);
  border-bottom: 2px solid var(--gold);
  color: var(--gold);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Body kartu ID dengan padding bawah yang proporsional */
.id-body {
  padding: 1.25rem 1.25rem 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Foto Anggota Dibuat Jauh Lebih Besar & Dominan (Passport style 4:5) */
.mc-ph {
  width: 140px; 
  height: 175px; 
  aspect-ratio: auto;
  border-radius: 8px;
  border: 2px solid var(--gold);
  box-shadow: 0 6px 14px rgba(0,0,0,0.18);
  background: linear-gradient(135deg, var(--em100) 0%, var(--s2) 100%);
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--em600);
}
.mc-ph img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s;
}

.mc-name {
  font-family: var(--d);
  font-size: 0.95rem; 
  font-weight: 700;
  color: var(--em900);
  margin-bottom: 0.25rem;
  text-align: center;
  line-height: 1.25;
  text-transform: capitalize;
}
.mc-kelas {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--em600);
  background: var(--em50);
  border: 1px solid var(--em200);
  padding: 2px 10px;
  border-radius: 100px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.mc-q {
  font-size: 0.72rem;
  font-style: italic;
  color: var(--s5);
  line-height: 1.45;
  text-align: center;
  padding: 0 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.id-div {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent);
  margin: 0.6rem 0;
}

/* Badge Hover Animation */
.badge-holder:hover .id-strap {
  transform: translateX(-50%) translateY(-2px) scaleY(1.02);
}
.badge-holder:hover .mc {
  transform: translateY(-8px) rotateX(6deg) rotateY(-4deg);
  box-shadow: 
    0 22px 45px -10px rgba(13,43,30,0.3), 
    0 12px 18px -8px rgba(13,43,30,0.2),
    inset 0 1px 0 rgba(255,255,255,0.8);
  border-color: var(--gold);
  outline-color: rgba(212,175,55,0.18);
}
.mc:hover .mc-ph img{transform:scale(1.05)}

/* ── KOMENTAR ── */
.kbg{background:var(--em900)}
.kbg .sew{color:var(--gold3)}
.kbg .sew::before,.kbg .sew::after{background:var(--gold3)}
.kbg .stitle{color:var(--ivory)}
.kgrid{
  display:grid;
  grid-template-columns:1fr 1.15fr;
  gap:clamp(1.5rem,4vw,2.75rem);
  align-items:start;
}
.kform{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.1);
  border-radius:20px;
  padding:clamp(1.1rem,3vw,1.875rem);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07);
}
.kform h3{
  font-family:var(--d);
  font-size:clamp(1rem,1.8vw,1.25rem);
  font-weight:600;color:var(--ivory);
}
.kform p{font-size:.8rem;color:rgba(212,237,224,.52);line-height:1.65;margin-bottom:1.1rem}

.flbl{
  display:block;font-size:.65rem;font-weight:600;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--em200);margin-bottom:.375rem;
}
.kform-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.9rem;
}
@media(max-width: 480px) {
  .kform-row {
    flex-direction: column;
    gap: 0.75rem;
  }
}
.finp {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: .7rem .85rem;
  font-family: var(--b);
  font-size: .85rem;
  color: var(--ivory);
  outline: none;
  transition: border-color .2s, background-color .2s;
}
.finp:focus {
  border-color: rgba(212, 175, 55, 0.4);
  background: rgba(255, 255, 255, 0.08);
}
.finp::placeholder {
  color: rgba(212, 237, 224, 0.25);
}

.fta{
  width:100%;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.1);
  border-radius:10px;
  padding:.7rem .85rem;
  font-family:var(--b);font-size:.85rem;
  color:var(--ivory);resize:vertical;min-height:96px;
  outline:none;transition:border-color .2s;
  margin-bottom:.9rem;
}
.fta:focus{border-color:rgba(212,175,55,.42)}
.fta::placeholder{color:rgba(212,237,224,.26)}

/* Webhook Setup Button */
.webhook-btn {
  background: none;
  border: none;
  color: var(--em200);
  opacity: 0.4;
  cursor: pointer;
  padding: 5px;
  transition: opacity 0.2s, color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.webhook-btn:hover {
  opacity: 1;
  color: var(--gold);
}

.cfeed{display:flex;flex-direction:column;gap:.8rem}
.cc{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.07);
  border-radius:12px;padding:1.1rem;
  position:relative;transition:border-color .2s;
}
.cc:hover{border-color:rgba(212,175,55,.22)}
.ccq{
  position:absolute;top:.2rem;right:.8rem;
  font-family:var(--d);font-size:2.2rem;font-weight:700;
  color:var(--gold);opacity:.12;line-height:1;pointer-events:none;
}
.cctxt{font-size:.82rem;color:rgba(212,237,224,.82);line-height:1.7;margin-bottom:.7rem;font-style:italic}
.ccmeta{display:flex;align-items:center;gap:.55rem}
.ccav{
  width:26px;height:26px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--em500),var(--gold6));
  display:flex;align-items:center;justify-content:center;
  font-size:.62rem;font-weight:700;color:#fff;
}
.ccanon{font-size:.72rem;color:var(--em200);font-weight:600}
.cctime{font-size:.62rem;color:rgba(212,237,224,.3);margin-left:auto}
@media(max-width:680px){.kgrid{grid-template-columns:1fr}}

/* ── GALERI ── */
.gbg{background:var(--s1);overflow:hidden}
.pgrid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(min(100%,175px),1fr));
  gap:clamp(1.2rem,3vw,2rem);
  padding-bottom:1.25rem;
}
.pol{
  background:#fff;
  padding:clamp(.55rem,1.5vw,.8rem) clamp(.55rem,1.5vw,.8rem) 2.2rem;
  border-radius:3px;
  box-shadow:0 6px 20px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.06);
  position:relative;cursor:pointer;
  transition:transform .35s cubic-bezier(.22,.68,0,1.25),box-shadow .35s;
}
.pol::before{
  content:'';position:absolute;top:-7px;left:50%;transform:translateX(-50%);
  width:34px;height:14px;background:rgba(212,175,55,.32);border-radius:1px;
}
.pol:nth-child(odd){transform:rotate(-1.8deg)}
.pol:nth-child(even){transform:rotate(1.5deg)}
.pol:nth-child(3n){transform:rotate(-0.8deg)}
.pol:hover{
  transform:rotate(0deg) translateY(-8px) scale(1.05)!important;
  box-shadow:0 18px 45px rgba(0,0,0,.16),0 4px 12px rgba(0,0,0,.08);
  z-index:10;
}
.pol-img{aspect-ratio:4/3;overflow:hidden;display:flex;align-items:center;justify-content:center}
.pol-img img{width:100%;height:100%;object-fit:cover}
.pol-cap{
  position:absolute;bottom:.45rem;left:.55rem;right:.55rem;
  font-size:.7rem;color:var(--s5);text-align:center;
  font-weight:500;
}

/* ── FOOTER ── */
.footer{background:var(--em900);padding:var(--py) var(--px) clamp(1.25rem,3vw,2rem);border-top: 1px solid rgba(212,175,55,0.15);}
.fin{
  max-width:100%;
  margin: 0;
  display:grid;
  grid-template-columns:1.3fr 1fr 1.1fr;
  gap:clamp(1.5rem,4vw,3rem);
  margin-bottom:clamp(1.75rem,4vw,2.75rem);
}
.fbrand{font-family:var(--d);font-size:1.45rem;font-weight:700;color:var(--gold);margin-bottom:.4rem}
.fsub{font-size:.8rem;color:var(--em200);line-height:1.75;margin-bottom:1.1rem;opacity:.65}
.far{font-family:var(--ar);font-size:1.35rem;color:var(--gold);opacity:.5}
.fhead{font-size:.65rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold3);margin-bottom:1rem}
.flinks{list-style:none;display:flex;flex-direction:column;gap:.6rem}
.flinks a{font-size:.82rem;color:var(--em200);text-decoration:none;opacity:.6;transition:all .2s;cursor:pointer}
.flinks a:hover{opacity:1;color:var(--gold3)}
.igcard{
  display:flex;align-items:center;gap:.75rem;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.1);
  border-radius:12px;padding:.8rem;
  text-decoration:none;margin-bottom:.875rem;
  transition:all .25s;
}
.igcard:hover{border-color:rgba(212,175,55,.35);background:rgba(255,255,255,.08);transform:translateX(4px)}
.igico{
  width:40px;height:40px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);
  display:flex;align-items:center;justify-content:center;
}
.igh{font-size:.85rem;font-weight:600;color:var(--ivory)}
.igl{font-size:.7rem;color:rgba(212,237,224,.45);margin-top:.1rem}
.faddr{font-size:.78rem;color:rgba(212,237,224,.4);line-height:1.8}
.fbot{
  max-width:100%;
  margin: 0;
  padding-top:clamp(1rem,2.5vw,1.75rem);
  border-top:1px solid rgba(255,255,255,.07);
  display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;gap:.625rem;
}
.fcopy{font-size:.75rem;color:rgba(212,237,224,.3)}
@media(max-width:768px){.fin{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.fin{grid-template-columns:1fr}}

/* ── REVEAL ── */
.rv{opacity:0;transform:translateY(25px);transition:opacity .65s ease,transform .65s ease}
.rv.vis{opacity:1;transform:none}

/* ── TOAST ── */
.toast{
  position:fixed;bottom:clamp(1rem,3vw,2rem);right:clamp(1rem,3vw,2rem);z-index:999;
  background:var(--em700);border:1px solid rgba(212,175,55,.45);
  border-radius:12px;padding:.8rem 1.2rem;
  color:var(--ivory);font-size:.82rem;
  display:flex;align-items:center;gap:.6rem;
  box-shadow:0 10px 30px rgba(0,0,0,.4);
  opacity:0;transform:translateY(12px);
  transition:all .35s;pointer-events:none;
}
.toast.show{opacity:1;transform:none;pointer-events:auto}

/* ── REGISTRATION MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 26, 18, 0.78);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}
.modal-card {
  background: var(--em900);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 
    0 25px 50px -12px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.1);
  overflow: hidden;
  transform: translateY(30px) scale(0.95);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-overlay.open .modal-card {
  transform: translateY(0) scale(1);
}
.modal-header {
  padding: 1.25rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
}
.modal-title {
  font-family: var(--d);
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  font-weight: 700;
  color: var(--gold);
}
.modal-close {
  background: none;
  border: none;
  color: var(--em200);
  font-size: 1.75rem;
  cursor: pointer;
  line-height: 1;
  padding: 2px;
  transition: color 0.2s;
}
.modal-close:hover {
  color: var(--gold);
}
.modal-body {
  padding: 1.5rem 1.75rem 1.75rem;
}
.modal-body p {
  font-size: 0.8rem;
  color: rgba(212, 237, 224, 0.6);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}
`;


/* ─── DATA ─── */


const COMMENTS0 = [
  {id:1,text:"Penampilan Al-Muqoddas di acara Haflah kemarin luar biasa! Memukau dan penuh semangat.",time:"2 jam lalu",ini:"AN"},
  {id:2,text:"Saya sangat kagum dengan dedikasi adik-adik dalam melestarikan kesenian Islam ini.",time:"5 jam lalu",ini:"RH"},
  {id:3,text:"Suara rebana mereka terdengar indah sekali waktu di Maulid Nabi. Masya Allah.",time:"1 hari lalu",ini:"MS"},
  {id:4,text:"Ekstrakurikuler rebana yang paling solid di SMKN 8. Pertahankan terus ya!",time:"2 hari lalu",ini:"DP"},
];

const GALLERY = [
  {id:1,cap:"Maulid Nabi 2025",c:"#1B5C40"},{id:2,cap:"Haflah Al-Quran",c:"#2D7A56"},
  {id:3,cap:"Festival Budaya",c:"#14432F"},{id:4,cap:"Pesantren Kilat",c:"#0D2B1E"},
  {id:5,cap:"Perpisahan XII",c:"#1B5C40"},{id:6,cap:"HUT SMKN 8",c:"#2D7A56"},
  {id:7,cap:"Isra Mi'raj 2025",c:"#14432F"},{id:8,cap:"Bazar Ramadan",c:"#3A9E6F"},
];

/* ─── ICONS ─── */
const IgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8"/>
    <circle cx="17.5" cy="6.5" r="1" fill="white"/>
  </svg>
);
const CamIcon = ({size=38}) => (
  <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
    <rect x="3" y="9" width="32" height="22" rx="3.5" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="19" cy="20" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="19" cy="20" r="3" fill="currentColor" opacity=".25"/>
    <path d="M14 9 L16 5 H22 L24 9" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <circle cx="31" cy="14" r="1.5" fill="currentColor" opacity=".4"/>
  </svg>
);
const GalPH = ({c}) => (
  <div style={{width:"100%",height:"100%",
    background:`linear-gradient(155deg,${c}CC,${c}44)`,
    display:"flex",alignItems:"center",justifyContent:"center"}}>
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="6" width="28" height="20" rx="3" stroke="#D4AF37" strokeWidth="1.1" opacity=".5"/>
      <circle cx="16" cy="16" r="5" stroke="#D4AF37" strokeWidth="1.1" opacity=".5"/>
      <circle cx="16" cy="16" r="2.5" fill="#D4AF37" opacity=".22"/>
    </svg>
  </div>
);

function extractDriveId(url) {
  if (!url) return null;
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

function getPhotoUrl(rawUrl) {
  const id = extractDriveId(rawUrl);
  if (!id) return null;
  return `/api/photo?id=${id}`; // lewat proxy Vercel
}

/* ─── REVEAL HOOK ─── */
function useReveal(dependency) {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
          }
        });
      },
      { threshold: 0.07 }
    );
    els.forEach(el => io.observe(el));
    return () => {
      io.disconnect();
    };
  }, [dependency]);
}

/* ─── COMPONENT ─── */
export default function RebanaAlMuqoddas() {
  const [menu, setMenu] = useState(false);
  const IdPenerepan = "AKfycbxzC5Hv3l-X0q78gW0XVu4LA4AI3ZjXfQmobi2HCjlQqDnZSXVGkGTLJFypMy-0uH5L"
  const [err, setErr] = useState(null);
const URL = import.meta.env.DEV 
  ? "https://script.google.com/macros/s/AKfycbxzC5Hv3l-X0q78gW0XVu4LA4AI3ZjXfQmobi2HCjlQqDnZSXVGkGTLJFypMy-0uH5L/exec": "/api/sheets"  // pakai proxy saat localhost
const [anggota, setAnggota] = useState([]);
const wali = [
  {
    nama : "Istiqomah S.Ag",
    Jabatan : "Pembina",
    Url : istiqomah
  }
]
const [loadingAnggota, setLoadingAnggota] = useState(true);

useEffect(() => {
  fetch(URL, {
    method : "GET",
    redirect: "follow",
  })
    .then(res => {
      console.log("Status:", res.status, "URL:", res.url); // cek kemana redirect
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Bukan JSON, dapat: ${contentType}`);
      }
      return res.json();
    })
    .then(json => {
       console.log("Data dari sheet:", json.data);
      if(json.data && Array.isArray(json.data)) {

       if (json.data.length === 0) {
        setErr("Data sheet sedang kosong");
        setAnggota([]);
        setLoadingAnggota(false);
        return;
      }

  const normalized = json.data.map(m => ({
    ...m,
    name: m.name.toLowerCase(),
    kelas: m.kelas.toLowerCase(),
    photo: getPhotoUrl(m.photo), 
  }));
  setAnggota(normalized);
  setErr('');
}
else {
  setErr("Format data sheet tidak valid");
  setAnggota([]);
  setLoadingAnggota(false);
}
    })
    .catch(err => console.error("Gagal fetch anggota:", err))
    .finally(() => setLoadingAnggota(false));
}, []);
  // Ambil Komentar dari localStorage jika ada
  const [comments, setComments] = useState(() => {
    try {
      const stored = localStorage.getItem("almuqoddas_comments");
      return stored ? JSON.parse(stored) : COMMENTS0;
    } catch (e) {
      return COMMENTS0;
    }
  });

  const [draft, setDraft] = useState("");
  const [commentName, setCommentName] = useState("");
  const [toast, setToast] = useState({on:false,msg:""});
  const cid = useRef(comments.length + 1);

  // Webhook Spreadsheet URL Setup
  const [webhookUrl, setWebhookUrl] = useState(
  "https://script.google.com/macros/s/AKfycbxiL8o6C5Yn5WrrGITe8FfJYaAnWFgNN_e7FG-Mb_Lfhg3HC4FR2RfOI1uDtEFTtxcoKg/exec"
);
  const [showWebhookSettings, setShowWebhookSettings] = useState(false);

  // Modal Pendaftaran State
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({
    nama: "",
    kelas: "",
    kontak: "",
    catatan: ""
  });
  const [regStatus, setRegStatus] = useState("idle"); // idle, loading, success, error

  // Jalankan scroll reveal hook
  useReveal(comments.length + anggota.length);

  // Simpan Komentar ke localStorage setiap terjadi perubahan
  useEffect(() => {
    try {
      localStorage.setItem("almuqoddas_comments", JSON.stringify(comments));
    } catch (e) {
      console.error("Gagal menyimpan komentar ke localStorage", e);
    }
  }, [comments]);

  // Fetch komentar terbaru dari Google Sheets jika webhookUrl di-set
  const fetchComments = async (url) => {
    if (!url) return;
    try {
      const res = await fetch(`${url}?sheet=Komentar`);
      const resData = await res.json();
      if (resData.status === "success" && Array.isArray(resData.data)) {
        const mapped = resData.data.map(item => {
          const senderName = item.nama || "Anonim";
          return {
            id: item.id || Math.random(),
            text: item.pesan || "",
            time: formatTime(item.tanggal),
            ini: senderName.substring(0, 2).toUpperCase()
          };
        });
        setComments(mapped);
      }
    } catch (e) {
      console.error("Gagal memuat data dari Spreadsheet:", e);
    }
  };

  useEffect(() => {
    if (webhookUrl) {
      fetchComments(webhookUrl);
    }
  }, [webhookUrl]);

  // Helper pemformat waktu relatif
  const formatTime = (dateStr) => {
    if (!dateStr) return "Baru saja";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Beberapa saat lalu";
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      return `${diffDays} hari lalu`;
    } catch (e) {
      return "Beberapa saat lalu";
    }
  };

  const go = id => {
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setMenu(false);
  };

  const flash = msg => {
    setToast({on:true,msg});
    setTimeout(() => setToast({on:false,msg}), 3200);
  };

  // Kirim Komentar (Mendukung Webhook Spreadsheet & Fallback Lokal)
  const submitComment = async () => {
    if (!draft.trim()) return;
    const name = commentName.trim() || "Anonim";
    const inisial = name.substring(0, 2).toUpperCase();
    
    const newCommentLocal = {
      id: cid.current++,
      text: draft.trim(),
      time: "Baru saja",
      ini: inisial
    };

    // Update state lokal dulu secara optimis
    setComments(prev => [newCommentLocal, ...prev]);
    setDraft("");
    setCommentName("");
    
    if (webhookUrl) {
      try {
        const payload = {
          action: "addComment",
          nama: name,
          pesan: draft.trim()
        };

        // Mengirim data menggunakan content-type text/plain untuk melewati CORS OPTIONS preflight
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain"
          },
          body: JSON.stringify(payload)
        });
        
        flash("Komentar terkirim ke Google Sheets!");
        // Refresh komentar dari sheet setelah 1 detik
        setTimeout(() => fetchComments(webhookUrl), 1000);
      } catch (e) {
        console.error("Gagal mengirim ke webhook, disimpan secara lokal.", e);
        flash("Komentar disimpan secara lokal!");
      }
    } else {
      flash("Komentar disimpan secara lokal!");
    }
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Toast Alert */}
      <div className={`toast${toast.on?" show":""}`}>
        <span style={{color:"#D4AF37"}}>✓</span> {toast.msg}
      </div>

      {/* ════ NAV ════ */}
      <nav className="nav">
        <div style={{
          display: "flex", gap : "0.75rem",
          justifyContent: "center", alignItems : "center"
        }}>
            <img src={logo} height={36} width={36} style={{
        }}/>
        <span className="nav-brand" style={{
          fontFamily : "'Amiri'"
        }} onClick={() => go("home")}>Al-Muqoddas</span>
        </div>
        
        <ul className="nav-links">
          {[["home","Beranda"],["anggota","Anggota"],["komentar","Komentar"],["galeri","Galeri"]].map(([id,lbl]) => (
            <li key={id}>
              <a onClick={() => go(id)}>{lbl}</a>
            </li>
          ))}
        </ul>
        <button className={`ham${menu?" open":""}`} onClick={() => setMenu(v=>!v)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      <div className={`drawer-overlay${menu?" open":""}`} onClick={() => setMenu(false)} />

      {/* Mobile drawer */}
      <div className={`drawer${menu?" open":""}`}>
        {[["home","Beranda"],["anggota","Anggota"],["komentar","Komentar"],["galeri","Galeri"]].map(([id,lbl]) => (
          <a key={id} onClick={() => go(id)}>{lbl}</a>
        ))}
      </div>

      {/* ════ HERO ════ */}
      <section id="home" className="hero">
        <div className="hero-abs-bg" />
        <div className="hero-gloss"  />
        <div className="hero-bevel"  />
        <div className="hero-pat"    />

        <div className="hero-grid">
          {/* LEFT COLUMN */}
          <div className="hleft">
            <p className="hbism">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

            <div className="hew">Ekstrakurikuler Rebana · SMKN 8 Semarang</div>

            <h1 className="htitle">Al&#8209;<em>Muqoddas</em></h1>

            <p className="htagline">Kesenian Islam Yang Memukau Hati</p>

            <p className="hdesc">
              Membawa warisan seni rebana Islam dengan semangat generasi muda SMKN&nbsp;8 Semarang — memadukan keindahan, iman, dan harmoni dalam setiap penampilan.
            </p>

            {/* Stats */}
            <div className="hstats">
              <div className="stat">
                <span className="stat-n">15+</span>
                <span className="stat-l">Anggota Aktif</span>
              </div>
              <div className="stat">
                <span className="stat-n">2+</span>
                <span className="stat-l">Tahun Berdiri</span>
              </div>
              <div className="stat">
                <span className="stat-n">10+</span>
                <span className="stat-l">Event Diikuti</span>
              </div>
            </div>

            <div className="hcta">
              <button className="btn-g" onClick={() => setShowRegModal(true)}>Daftar</button>
              <button className="btn-gh" onClick={() => go("galeri")}>Lihat Galeri</button>
            </div>
          </div>

          {/* RIGHT COLUMN (16:9 EXPANDED FRAME) */}
          <div className="hright">
            <div className="hright-glow" />
            {/* Landscape photo slot 16:9 (Tanpa rotasi lingkaran) */}
            <div className="hphoto">
              <div className="hph-placeholder">
                <img src={al} alt="Rebana Al-Muqoddas SMKN 8 Semarang" /> 
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ ANGGOTA (ID CARD SECTION) ════ */}
      <div id="anggota" className="abg">
        <div className="swrap">
          <div className="sin">
            <div className="rv">
              <div className="sew"><span/>Tim Kami<span/></div>
              <h2 className="stitle">Para <em>Anggota</em></h2>
              <div className="sdiv"/>
            </div>
            <div className="mgrid">
                  {loadingAnggota ? (
                          <p style={{ color: "var(--em200)", textAlign: "center", padding: "2rem" }}>
                            Memuat data anggota...
                          </p>
                        ) : err ? (
                          <p className="text-center text-gray-500">{err}</p>
                        ) : anggota.length === 0 ? (
                          <p className="" style={{
                            textAlign: "center", 
                            color : "red", 
                            fontFamily : "monospace", 
                            fontWeight : "lighter"
                          }}>Data Anggota Masih Kosong</p>
                        ) : anggota.map((m, i) => (
                          <div key={m.id} className="badge-holder rv" style={{ transitionDelay: `${i * 45}ms` }}>
                            <div className="id-strap" />
                            <div className="id-clip" />
                            <div className="mc">
                              <div className="id-slot" />
                              <div className="id-hdr">AL-MUQODDAS · MEMBER</div>
                              <div className="id-body">
                                <div className="mc-ph">
                                  {m.photo ? (
                                    <img src={m.photo} alt={m.name} referrerPolicy="no-referrer" />
                                  ) : (
                                    <CamIcon size={32} />
                                  )}
                                </div>
                                <h4 className="mc-name">{m.name}</h4>
                                <span className="mc-kelas">{m.kelas}</span>
                                <div className="id-div" />
                                <p className="mc-q">"{m.quote}"</p>
                              </div>
                            </div>
                          </div>
                        ))}
            </div>
          </div>
        </div>
      </div>
      {/* ════ KOMENTAR ════ */}
      <div id="komentar" className="kbg">
        <div className="swrap">
          <div className="sin">
            <div className="rv" style={{textAlign:"center",marginBottom:"2rem"}}>
              <div className="sew"><span/>Suara Kalian<span/></div>
              <h2 className="stitle">Komentar &amp; <em style={{color:"var(--gold3)"}}>Kesan</em></h2>
              <div className="sdiv" style={{margin:"1rem auto 0",background:"linear-gradient(90deg,transparent,var(--gold),transparent)"}}/>
            </div>
            
            <div className="kgrid">
              <div className="kform rv">
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".3rem"}}>
                  <h3>Tinggalkan Pesan</h3>
                  <button className="webhook-btn" onClick={() => setShowWebhookSettings(!showWebhookSettings)} title="Webhook Spreadsheet Setup">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </button>
                </div>
                <p>Bagikan kesan dan pendapatmu. Hubungkan ke Google Sheets dengan mengklik tombol gir di atas jika Anda admin.</p>
                
                {/* Webhook Settings Panel */}
                {showWebhookSettings && (
                  <div style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:"10px", padding:"0.8rem", marginBottom:"1rem"}}>
                    <label className="flbl" style={{color:"var(--gold)"}}>Spreadsheet Webhook URL</label>
                    <input 
                      type="text" 
                      className="finp" 
                      style={{fontSize:"0.75rem", marginBottom:"0.5rem"}}
                      value={webhookUrl}
                      onChange={e => {
                        setWebhookUrl(e.target.value);
                        localStorage.setItem("almuqoddas_webhook_url", e.target.value);
                      }}
                      placeholder="https://script.google.com/macros/s/.../exec"
                    />
                    <p style={{fontSize:"0.65rem", margin:0, color:"var(--em200)"}}>
                      {webhookUrl ? "✓ Webhook Terdeteksi" : "⚠ Menggunakan database lokal offline"}
                    </p>
                  </div>
                )}

                <div className="kform-row">
                  <div style={{flex:1}}>
                    <label className="flbl">Nama Kamu (Opsional)</label>
                    <input
                      type="text"
                      className="finp"
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      placeholder="Anonim..."
                    />
                  </div>
                </div>

                <label className="flbl">Pesan kamu</label>
                <textarea
                  className="fta"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Tuliskan kesanmu di sini..."
                  onKeyDown={e => { if(e.ctrlKey && e.key==="Enter") submitComment(); }}
                />
                <button className="btn-g" onClick={submitComment} style={{width:"100%",justifyContent:"center"}}>
                  Kirim Komentar
                </button>
              </div>

              <div className="cfeed">
                {comments.slice(0,4).map((c,i) => (
                  <div key={c.id} className="cc rv" style={{transitionDelay:`${i*65}ms`}}>
                    <div className="ccq">"</div>
                    <p className="cctxt">{c.text}</p>
                    <div className="ccmeta">
                      <div className="ccav">{c.ini}</div>
                      <span className="ccanon">Anonim</span>
                      <span className="cctime">{c.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ GALERI ════ */}
      <div id="galeri" className="gbg">
        <div className="swrap">
          <div className="sin">
            <div className="rv">
              <div className="sew"><span/>Momen Berharga<span/></div>
              <h2 className="stitle">Galeri <em>Event</em></h2>
              <div className="sdiv"/>
            </div>
            <div className="pgrid">
              {GALLERY.map((g,i) => (
                <div key={g.id} className="pol rv" style={{transitionDelay:`${i*60}ms`}}>
                  <div className="pol-img"><GalPH c={g.c}/></div>
                  <p className="pol-cap">{g.cap}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════ FOOTER ════ */}
      <footer className="footer">
        <div className="fin">
          <div>
            <p className="fbrand">Al-Muqoddas</p>
            <p className="fsub">Ekstrakurikuler Rebana resmi SMKN 8 Semarang — melestarikan seni Islam dengan semangat dan kebanggaan generasi muda.</p>
            <span className="far">الْمُقَدَّس</span>
          </div>
          <div>
            <p className="fhead">Navigasi</p>
            <ul className="flinks">
              {[["home","Beranda"],["anggota","Anggota"],["komentar","Komentar"],["galeri","Galeri"]].map(([id,lbl]) => (
                <li key={id}><a onClick={() => go(id)}>{lbl}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="fhead">Ikuti Kami</p>
            <a className="igcard" href="https://instagram.com/rebana.almuqoddas" target="_blank" rel="noopener noreferrer">
              <div className="igico"><IgIcon/></div>
              <div>
                <p className="igh">@rebana.almuqoddas</p>
                <p className="igl">Instagram Resmi</p>
              </div>
            </a>
            <p className="faddr">SMKN 8 Semarang<br/>Jl. Pandanaran II No. 12<br/>Semarang, Jawa Tengah</p>
          </div>
        </div>
        <div className="fbot">
          <p className="fcopy">© 2026 Rebana Al-Muqoddas · SMKN 8 Semarang</p>
          <span className="far" style={{fontSize:".85rem"}}>بِسْمِ اللَّهِ</span>
        </div>
      </footer>

      {/* ════ REGISTRATION MODAL ════ */}
      <div className={`modal-overlay${showRegModal ? " open" : ""}`} onClick={() => setShowRegModal(false)}>
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Pendaftaran Anggota</h3>
            <button className="modal-close" onClick={() => setShowRegModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <p>Bergabunglah dengan keluarga besar Rebana Al-Muqoddas SMKN 8 Semarang. Lengkapi data di bawah ini untuk mendaftar!</p>
            
            
            <div style={{marginTop:"1.5rem", paddingTop:"1rem", borderTop:"1px dashed rgba(255,255,255,0.1)", textAlign:"center"}}>
              <span style={{fontSize:"0.7rem", color:"rgba(212, 237, 224, 0.4)"}}>Isi form online resmi di </span>
              <a href="https://forms.gle/JE4zXgrzFouqwsAF8" target="_blank" rel="noopener noreferrer" style={{color:"var(--gold)", fontSize:"0.72rem", fontWeight:"600", textDecoration:"underline"}}>
                Google Forms Pendaftaran
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}