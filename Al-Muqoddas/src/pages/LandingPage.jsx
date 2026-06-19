import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   REBANA AL-MUQODDAS  — v3
   Fixes:
   • Hero bg = absolute, transparent/glossy frosted glass
   • "Al-Muqoddas" forced single line at all breakpoints
   • Bismillah left-aligned flush with title (no extra indent)
   • Stats (anggota aktif etc.) below description, above CTA
   • Photo = landscape (16:10), large model-style PNG slot
   • Fully fluid: mobile(320px) → phone → tablet → laptop → 4K
═══════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&family=Noto+Naskh+Arabic:wght@400;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --em900:#0D2B1E; --em800:#14432F; --em700:#1B5C40; --em600:#2D7A56;
  --em500:#3A9E6F; --em200:#A8D5BC; --em100:#D4EDE0; --em50:#EDF7F2;
  --gold:#D4AF37;  --gold3:#E8CC6A; --gold6:#B8860B;
  --ivory:#FDFBF5; --s1:#F3EFE5; --s2:#E2DBD0; --s5:#8C7F6E;
  --char:#1C1A16;
  --d:'Playfair Display',Georgia,serif;
  --b:'Inter',system-ui,sans-serif;
  --ar:'Noto Naskh Arabic',serif;
  --px:clamp(1rem,4vw,3.5rem);
  --py:clamp(3.5rem,7vw,6rem);
}

html{scroll-behavior:smooth}
body{
  font-family:var(--b);
  background:var(--ivory);
  color:var(--char);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--s1)}
::-webkit-scrollbar-thumb{background:var(--em600);border-radius:3px}

/* ─── NAV ─── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:300;
  height:60px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 var(--px);
  background:rgba(13,43,30,0.92);
  backdrop-filter:blur(24px) saturate(180%);
  -webkit-backdrop-filter:blur(24px) saturate(180%);
  border-bottom:1px solid rgba(212,175,55,0.18);
}
.nav-brand{
  font-family:var(--d);font-size:clamp(.95rem,2vw,1.2rem);
  font-weight:700;color:var(--gold);letter-spacing:.04em;
  cursor:pointer;white-space:nowrap;user-select:none;
}
.nav-links{display:flex;gap:clamp(.875rem,2.5vw,2rem);list-style:none}
.nav-links a{
  font-size:.72rem;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--em100);
  cursor:pointer;text-decoration:none;white-space:nowrap;
  opacity:0.75;
}
.ham{
  display:none;flex-direction:column;gap:5px;
  background:none;border:none;cursor:pointer;padding:4px;
}
.ham span{
  display:block;width:22px;height:1.5px;
  background:var(--gold);border-radius:2px;
  transition:transform .3s,opacity .3s;
}
.ham.open span:nth-child(1){transform:rotate(45deg) translate(4.5px,4.5px)}
.ham.open span:nth-child(2){opacity:0}
.ham.open span:nth-child(3){transform:rotate(-45deg) translate(4.5px,-4.5px)}
.drawer{
  position:fixed;top:60px;left:0;right:0;z-index:299;
  background:rgba(13,43,30,0.96);
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border-bottom:1px solid rgba(212,175,55,0.15);
  padding:1.5rem var(--px) 2rem;
  display:flex;flex-direction:column;gap:1.1rem;
  transform:translateY(-110%);
  transition:transform .35s cubic-bezier(.4,0,.2,1);
  pointer-events:none;
}
.drawer.open{transform:none;pointer-events:auto}
.drawer a{
  font-size:.9rem;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--em100);
  cursor:pointer;text-decoration:none;opacity:0.75;
}
@media(max-width:640px){
  .nav-links{display:none}
  .ham{display:flex}
}

/* ─── HERO ─── */
/* The page bg is visible through this section — the hero is essentially a
   frosted/glossy transparent layer sitting on top of whatever is "behind" it.
   We achieve this by making the hero itself very dark (em900) with a strong
   glass-morphism overlay so it reads as rich dark emerald glass. */
.hero{
  position:relative;
  min-height:100svh;min-height:100vh;
  display:flex;align-items:center;
  overflow:hidden;
  background:var(--em900);
}

/* GLOSSY ABSOLUTE BG — multi-layer frosted glass look */
.hero-abs-bg{
  position:absolute;inset:0;z-index:0;
  /* Main glass body */
  background:
    linear-gradient(135deg,
      rgba(27,92,64,0.55) 0%,
      rgba(13,43,30,0.72) 40%,
      rgba(13,43,30,0.85) 100%);
}
/* Gloss sheen — the "bening/glossy" effect */
.hero-gloss{
  position:absolute;inset:0;z-index:1;
  background:
    radial-gradient(ellipse 70% 55% at 30% 10%,
      rgba(255,255,255,0.06) 0%,
      transparent 60%),
    radial-gradient(ellipse 40% 30% at 80% 80%,
      rgba(212,175,55,0.06) 0%,
      transparent 55%);
  /* frosted shimmer */
  backdrop-filter:blur(0px);
}
/* Subtle top-edge highlight simulating glass bevel */
.hero-bevel{
  position:absolute;top:0;left:0;right:0;height:2px;z-index:2;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(255,255,255,0.18) 30%,
    rgba(212,175,55,0.22) 50%,
    rgba(255,255,255,0.18) 70%,
    transparent 100%);
}
/* Islamic geometric tile pattern */
.hero-pat{
  position:absolute;inset:0;z-index:1;
  opacity:.048;
  background-image:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4AF37' stroke-width='0.55'%3E%3Cpolygon points='40,4 76,22 76,58 40,76 4,58 4,22'/%3E%3Cpolygon points='40,16 64,29 64,51 40,64 16,51 16,29'/%3E%3Cline x1='40' y1='4' x2='40' y2='16'/%3E%3Cline x1='76' y1='22' x2='64' y2='29'/%3E%3Cline x1='76' y1='58' x2='64' y2='51'/%3E%3Cline x1='40' y1='76' x2='40' y2='64'/%3E%3Cline x1='4' y1='58' x2='16' y2='51'/%3E%3Cline x1='4' y1='22' x2='16' y2='29'/%3E%3C/g%3E%3C/svg%3E");
  background-size:80px 80px;
}

/* Hero content grid */
.hero-grid{
  position:relative;z-index:3;
  width:100%;max-width:1440px;margin:0 auto;
  padding:calc(60px + clamp(2.5rem,5vw,5rem)) var(--px) clamp(2.5rem,5vw,5rem);
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,1fr);
  gap:clamp(2rem,5vw,6rem);
  align-items:center;
  min-height:100svh;min-height:100vh;
}

/* ── LEFT ── */
.hleft{display:flex;flex-direction:column}

/* Bismillah — flush left, same as title */
.hbism{
  font-family:var(--ar);
  font-size:clamp(1.3rem,2.5vw,2rem);
  color:var(--gold);
  line-height:1.65;
  opacity:.88;
  margin-bottom:clamp(.625rem,1.5vw,1rem);
  /* Force exact same left-edge as the h1 below — no additional offset */
  padding-left:0;
}

.hew{
  display:inline-flex;align-items:center;gap:.55rem;
  font-size:clamp(.6rem,1vw,.7rem);font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;
  color:var(--gold3);margin-bottom:.75rem;
}
.hew::before{
  content:'';display:block;
  width:clamp(1rem,2vw,1.75rem);height:1px;background:var(--gold3);
}

/* SINGLE-LINE TITLE — clamp keeps it on one line across all viewports.
   On very small phones (<360px) we allow wrap but keep it readable. */
.htitle{
  font-family:var(--d);
  font-size:clamp(2.6rem,5.5vw,5.5rem);
  font-weight:700;
  line-height:1;
  color:var(--ivory);
  letter-spacing:-.02em;
  white-space:nowrap;          /* single line desktop & tablet */
  margin-bottom:clamp(.375rem,1vw,.75rem);
}
.htitle em{color:var(--gold);font-style:italic}
/* tiny phones: allow wrap to avoid overflow */
@media(max-width:380px){
  .htitle{white-space:normal;font-size:clamp(2.25rem,10vw,3rem)}
}

.htagline{
  font-family:var(--d);
  font-size:clamp(.82rem,1.5vw,1.1rem);
  font-style:italic;color:var(--em200);
  margin-bottom:clamp(.875rem,2vw,1.5rem);
  line-height:1.5;
}

.hdesc{
  font-size:clamp(.8rem,1.3vw,.9rem);
  color:rgba(212,237,224,.62);
  line-height:1.85;max-width:42ch;
  margin-bottom:clamp(1.25rem,3vw,2rem);
}

/* STATS — below desc, above CTA */
.hstats{
  display:flex;
  gap:clamp(1.25rem,3.5vw,3rem);
  flex-wrap:wrap;
  margin-bottom:clamp(1.5rem,3vw,2.25rem);
}
.stat{display:flex;flex-direction:column}
.stat-n{
  font-family:var(--d);
  font-size:clamp(1.6rem,3.5vw,2.75rem);
  font-weight:700;color:var(--gold);line-height:1;
}
.stat-l{
  font-size:clamp(.58rem,.9vw,.66rem);font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--em200);opacity:.6;margin-top:.25rem;
}

.hcta{display:flex;gap:.75rem;flex-wrap:wrap}

/* ── RIGHT ── */
.hright{
  position:relative;
  display:flex;justify-content:center;align-items:center;
}
.geo-wrap{
  position:relative;
  width:clamp(240px,44vw,500px);
  height:clamp(240px,44vw,500px);
  display:flex;justify-content:center;align-items:center;
}
.gr{ /* geo ring base */
  position:absolute;inset:0;border-radius:50%;
  border:1px solid rgba(212,175,55,.12);
  animation:gspin 70s linear infinite;
}
.gr2{inset:10%;border-color:rgba(212,175,55,.22);animation-duration:50s;animation-direction:reverse}
.gr3{inset:22%;border-color:rgba(45,122,86,.28);animation:none}
@keyframes gspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.goct{
  position:absolute;width:52%;height:52%;
  background:rgba(27,92,64,.22);
  clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%);
  border:1px solid rgba(212,175,55,.16);
}
.gdot{
  position:absolute;width:7px;height:7px;
  border-radius:50%;background:var(--gold);opacity:.5;
}

/* PHOTO FRAME — landscape 16:10, large model/performance PNG */
.hphoto{
  position:absolute;
  /* landscape container */
  width:clamp(210px,40vw,460px);
  aspect-ratio:16/10;
  border-radius:clamp(12px,2vw,22px);
  overflow:hidden;
  /* glossy frame */
  border:2px solid rgba(212,175,55,.45);
  box-shadow:
    0 0 0 6px rgba(212,175,55,.06),
    0 0 0 14px rgba(13,43,30,.12),
    0 28px 70px rgba(0,0,0,.6),
    inset 0 1px 0 rgba(255,255,255,.12),   /* top gloss bevel */
    inset 0 -1px 0 rgba(0,0,0,.3);
  z-index:5;
  /* shift slightly down-right so it overlaps nicely */
  transform:translate(4%, 6%);
}
.hphoto img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.hph-placeholder{
  width:100%;height:100%;
  background:linear-gradient(150deg,#1B5C40 0%,#0D2B1E 100%);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:.625rem;color:var(--em200);
}
.hph-placeholder p{
  font-size:clamp(.62rem,.9vw,.72rem);opacity:.45;
  text-align:center;padding:0 1rem;line-height:1.5;
}
/* Photo gloss overlay */
.hphoto::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(130deg,
    rgba(255,255,255,.07) 0%,
    transparent 45%,
    rgba(0,0,0,.08) 100%);
  pointer-events:none;
}

/* ── HERO RESPONSIVE ── */
@media(max-width:820px){
  .hero-grid{
    grid-template-columns:1fr;
    min-height:auto;
    padding-top:calc(60px + 2rem);
    padding-bottom:3rem;
    gap:2.5rem;
  }
  .hright{order:-1}
  .geo-wrap{
    width:clamp(200px,65vw,320px);
    height:clamp(200px,65vw,320px);
  }
  .hphoto{
    width:clamp(175px,58vw,290px);
    transform:translate(3%,5%);
  }
  .htitle{white-space:normal;font-size:clamp(2.4rem,7.5vw,4rem)}
  .hstats{gap:1.25rem 2rem}
}
@media(max-width:480px){
  .hstats{flex-wrap:wrap;gap:1rem 1.75rem}
  .hphoto{
    width:clamp(160px,62vw,260px);
  }
}

/* ── BUTTONS ── */
.btn-g{
  display:inline-flex;align-items:center;gap:.5rem;
  padding:clamp(.6rem,1.4vw,.85rem) clamp(1.1rem,2.5vw,2rem);
  background:var(--gold);color:var(--em900);
  font-weight:600;font-size:clamp(.68rem,1.1vw,.8rem);
  letter-spacing:.07em;text-transform:uppercase;
  border:none;border-radius:100px;cursor:pointer;
  text-decoration:none;white-space:nowrap;
  transition:all .25s;
}
.btn-g:hover{background:var(--gold3);transform:translateY(-2px);box-shadow:0 8px 22px rgba(212,175,55,.3)}
.btn-gh{
  display:inline-flex;align-items:center;gap:.5rem;
  padding:clamp(.6rem,1.4vw,.85rem) clamp(1.1rem,2.5vw,2rem);
  background:rgba(255,255,255,.04);
  /* glossy ghost border */
  border:1px solid rgba(168,213,188,.3);
  backdrop-filter:blur(8px);
  color:var(--em200);
  font-weight:500;font-size:clamp(.68rem,1.1vw,.8rem);
  letter-spacing:.07em;text-transform:uppercase;
  border-radius:100px;cursor:pointer;
  text-decoration:none;white-space:nowrap;
  transition:all .25s;
}
.btn-gh:hover{border-color:var(--gold);color:var(--gold3);transform:translateY(-2px);background:rgba(255,255,255,.07)}

/* ── SECTION COMMON ── */
.swrap{padding:var(--py) var(--px)}
.sin{max-width:1340px;margin:0 auto}
.sew{
  display:inline-flex;align-items:center;gap:.55rem;
  font-size:clamp(.58rem,.9vw,.66rem);font-weight:600;
  letter-spacing:.2em;text-transform:uppercase;
  color:var(--em600);margin-bottom:.6rem;
}
.sew::before,.sew::after{content:'';display:block;height:1px;width:1.1rem;background:currentColor}
.stitle{
  font-family:var(--d);
  font-size:clamp(1.75rem,4vw,3rem);
  font-weight:700;color:var(--em900);
  line-height:1.1;letter-spacing:-.015em;
}
.stitle em{font-style:italic;color:var(--em600)}
.sdiv{
  width:2.5rem;height:3px;
  background:linear-gradient(90deg,var(--gold),transparent);
  border-radius:2px;margin:1.1rem 0 2.25rem;
}

/* ── ANGGOTA ── */
.abg{background:var(--s1)}
.mgrid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(min(100%,190px),1fr));
  gap:clamp(.75rem,2vw,1.4rem);
}
.mc{
  background:var(--ivory);border:1px solid var(--s2);
  border-radius:18px;overflow:hidden;
  transition:transform .3s,box-shadow .3s,border-color .3s;
}
.mc:hover{
  transform:translateY(-6px);
  box-shadow:0 18px 44px rgba(13,43,30,.11);
  border-color:rgba(212,175,55,.38);
}
.mc-bar{height:3px;background:linear-gradient(90deg,var(--em600),var(--gold))}
.mc-ph{
  aspect-ratio:3/4;overflow:hidden;
  background:linear-gradient(160deg,var(--em100),var(--s2));
  display:flex;align-items:center;justify-content:center;
  color:var(--em600);
}
.mc-ph img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.mc:hover .mc-ph img{transform:scale(1.05)}
.mc-body{padding:clamp(.75rem,2vw,1.1rem)}
.mc-name{
  font-family:var(--d);
  font-size:clamp(.83rem,1.4vw,.95rem);
  font-weight:600;color:var(--em900);margin-bottom:.18rem;
}
.mc-kelas{
  font-size:.66rem;font-weight:500;color:var(--em600);
  letter-spacing:.06em;text-transform:uppercase;margin-bottom:.65rem;
}
.mc-q{
  font-size:.76rem;font-style:italic;
  color:var(--s5);line-height:1.62;
  border-left:2px solid var(--gold);padding-left:.575rem;
}

/* ── KOMENTAR ── */
.kbg{background:var(--em900)}
.kbg .sew{color:var(--gold3)}
.kbg .sew::before,.kbg .sew::after{background:var(--gold3)}
.kbg .stitle{color:var(--ivory)}
.kgrid{
  display:grid;
  grid-template-columns:1fr 1.1fr;
  gap:clamp(1.25rem,4vw,2.75rem);
  align-items:start;
}
.kform{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.1);
  border-radius:20px;
  padding:clamp(1.1rem,3vw,1.875rem);
  /* subtle gloss */
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07);
}
.kform h3{
  font-family:var(--d);
  font-size:clamp(.95rem,1.8vw,1.2rem);
  font-weight:600;color:var(--ivory);margin-bottom:.3rem;
}
.kform p{font-size:.8rem;color:rgba(212,237,224,.52);line-height:1.65;margin-bottom:1.1rem}
.flbl{
  display:block;font-size:.63rem;font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--em200);margin-bottom:.375rem;
}
.fta{
  width:100%;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.11);
  border-radius:10px;
  padding:.7rem .85rem;
  font-family:var(--b);font-size:.85rem;
  color:var(--ivory);resize:vertical;min-height:96px;
  outline:none;transition:border-color .2s;
  margin-bottom:.9rem;
}
.fta:focus{border-color:rgba(212,175,55,.42)}
.fta::placeholder{color:rgba(212,237,224,.26)}
.cfeed{display:flex;flex-direction:column;gap:.8rem}
.cc{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.07);
  border-radius:12px;padding:1rem;
  position:relative;transition:border-color .2s;
}
.cc:hover{border-color:rgba(212,175,55,.2)}
.ccq{
  position:absolute;top:.2rem;right:.8rem;
  font-family:var(--d);font-size:2rem;font-weight:700;
  color:var(--gold);opacity:.14;line-height:1;pointer-events:none;
}
.cctxt{font-size:.78rem;color:rgba(212,237,224,.76);line-height:1.7;margin-bottom:.7rem;font-style:italic}
.ccmeta{display:flex;align-items:center;gap:.55rem}
.ccav{
  width:24px;height:24px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--em600),var(--gold6));
  display:flex;align-items:center;justify-content:center;
  font-size:.58rem;font-weight:700;color:#fff;
}
.ccanon{font-size:.68rem;color:var(--em200);font-weight:500}
.cctime{font-size:.6rem;color:rgba(212,237,224,.28);margin-left:auto}
@media(max-width:680px){.kgrid{grid-template-columns:1fr}}

/* ── GALERI ── */
.gbg{background:var(--s1);overflow:hidden}
.pgrid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr));
  gap:clamp(1rem,3vw,1.875rem);
  padding-bottom:1.25rem;
}
.pol{
  background:#fff;
  padding:clamp(.55rem,1.5vw,.8rem) clamp(.55rem,1.5vw,.8rem) 2.1rem;
  border-radius:2px;
  box-shadow:0 4px 18px rgba(0,0,0,.1),0 1px 4px rgba(0,0,0,.07);
  position:relative;cursor:pointer;
  transition:transform .35s cubic-bezier(.22,.68,0,1.2),box-shadow .35s;
}
.pol::before{
  content:'';position:absolute;top:-7px;left:50%;transform:translateX(-50%);
  width:32px;height:13px;background:rgba(212,175,55,.28);border-radius:1px;
}
.pol:nth-child(odd){transform:rotate(-1.6deg)}
.pol:nth-child(even){transform:rotate(1.3deg)}
.pol:nth-child(3n){transform:rotate(-.7deg)}
.pol:hover{
  transform:rotate(0deg) translateY(-8px) scale(1.04)!important;
  box-shadow:0 16px 42px rgba(0,0,0,.18),0 4px 12px rgba(0,0,0,.1);
  z-index:10;
}
.pol-img{aspect-ratio:4/3;overflow:hidden;display:flex;align-items:center;justify-content:center}
.pol-img img{width:100%;height:100%;object-fit:cover}
.pol-cap{
  position:absolute;bottom:.35rem;left:.55rem;right:.55rem;
  font-size:.68rem;color:var(--s5);text-align:center;
}

/* ── FOOTER ── */
.footer{background:var(--em900);padding:var(--py) var(--px) clamp(1.25rem,3vw,2rem)}
.fin{
  max-width:1340px;margin:0 auto;
  display:grid;
  grid-template-columns:1.3fr 1fr 1.1fr;
  gap:clamp(1.25rem,4vw,3rem);
  margin-bottom:clamp(1.75rem,4vw,2.75rem);
}
.fbrand{font-family:var(--d);font-size:1.3rem;font-weight:700;color:var(--gold);margin-bottom:.4rem}
.fsub{font-size:.78rem;color:var(--em200);line-height:1.7;margin-bottom:1.1rem;opacity:.62}
.far{font-family:var(--ar);font-size:1.25rem;color:var(--gold);opacity:.48}
.fhead{font-size:.6rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold3);margin-bottom:1rem}
.flinks{list-style:none;display:flex;flex-direction:column;gap:.5rem}
.flinks a{font-size:.8rem;color:var(--em200);text-decoration:none;opacity:.58;transition:all .2s;cursor:pointer}
.flinks a:hover{opacity:1;color:var(--gold3)}
.igcard{
  display:flex;align-items:center;gap:.75rem;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.1);
  border-radius:12px;padding:.8rem;
  text-decoration:none;margin-bottom:.875rem;
  transition:all .25s;
}
.igcard:hover{border-color:rgba(212,175,55,.3);background:rgba(255,255,255,.07);transform:translateX(3px)}
.igico{
  width:40px;height:40px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);
  display:flex;align-items:center;justify-content:center;
}
.igh{font-size:.82rem;font-weight:600;color:var(--ivory)}
.igl{font-size:.68rem;color:rgba(212,237,224,.42);margin-top:.1rem}
.faddr{font-size:.75rem;color:rgba(212,237,224,.38);line-height:1.75}
.fbot{
  max-width:1340px;margin:0 auto;
  padding-top:clamp(1rem,2.5vw,1.75rem);
  border-top:1px solid rgba(255,255,255,.07);
  display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;gap:.625rem;
}
.fcopy{font-size:.73rem;color:rgba(212,237,224,.26)}
@media(max-width:768px){.fin{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.fin{grid-template-columns:1fr}}

/* ── REVEAL ── */
.rv{opacity:0;transform:translateY(20px);transition:opacity .65s ease,transform .65s ease}
.rv.vis{opacity:1;transform:none}

/* ── TOAST ── */
.toast{
  position:fixed;bottom:clamp(1rem,3vw,2rem);right:clamp(1rem,3vw,2rem);z-index:999;
  background:var(--em700);border:1px solid rgba(212,175,55,.3);
  border-radius:12px;padding:.75rem 1rem;
  color:var(--ivory);font-size:.8rem;
  display:flex;align-items:center;gap:.5rem;
  box-shadow:0 8px 28px rgba(0,0,0,.35);
  opacity:0;transform:translateY(10px);
  transition:all .35s;pointer-events:none;
}
.toast.show{opacity:1;transform:none;pointer-events:auto}
`;

/* ─── DATA ─── */
const MEMBERS = [
  {id:1,name:"Aisyah Nur Fadilah",kelas:"XI MM 1",quote:"Menabuh rebana adalah doa yang berbunyi."},
  {id:2,name:"Muhammad Rizky",kelas:"XI RPL 2",quote:"Setiap ketukan adalah syukur yang berirama."},
  {id:3,name:"Siti Rahmawati",kelas:"X AK 1",quote:"Seni islami mengangkat jiwa menuju cahaya."},
  {id:4,name:"Ahmad Fauzi",kelas:"XI TKJ 3",quote:"Musik yang baik mendekatkan kita pada Tuhan."},
  {id:5,name:"Nur Hidayah",kelas:"XII MM 2",quote:"Bersama Al-Muqoddas, kami merawat warisan leluhur."},
  {id:6,name:"Farhan Maulana",kelas:"X RPL 1",quote:"Rebana mengajarkan harmoni dalam perbedaan."},
  {id:7,name:"Zahra Putri",kelas:"XI AK 2",quote:"Setiap latihan adalah perjalanan menuju sempurna."},
  {id:8,name:"Ilham Pratama",kelas:"X TKJ 2",quote:"Di sini saya menemukan ketenangan dan persaudaraan."},
];
const COMMENTS0 = [
  {id:1,text:"Penampilan Al-Muqoddas di acara Haflah kemarin luar biasa! Memukau dan penuh semangat.",time:"2 jam lalu",ini:"AN"},
  {id:2,text:"Saya sangat kagum dengan dedikasi adik-adik dalam melestarikan kesenian Islam ini.",time:"5 jam lalu",ini:"RH"},
  {id:3,text:"Suara rebana mereka terdengar indah sekali waktu di Maulid Nabi. Masya Allah.",time:"1 hari lalu",ini:"MS"},
  {id:4,text:"Ekstrakurikuler rebana yang paling solid di SMKN 8. Pertahankan terus ya!",time:"2 hari lalu",ini:"DP"},
];
const GALLERY = [
  {id:1,cap:"Maulid Nabi 2024",c:"#1B5C40"},{id:2,cap:"Haflah Al-Quran",c:"#2D7A56"},
  {id:3,cap:"Festival Budaya",c:"#14432F"},{id:4,cap:"Pesantren Kilat",c:"#0D2B1E"},
  {id:5,cap:"Perpisahan XII",c:"#1B5C40"},{id:6,cap:"HUT SMKN 8",c:"#2D7A56"},
  {id:7,cap:"Isra Mi'raj 2024",c:"#14432F"},{id:8,cap:"Bazar Ramadan",c:"#3A9E6F"},
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

/* ─── REVEAL HOOK ─── */
function useReveal() {
  useEffect(() => {
    const run = () => {
      const els = document.querySelectorAll(".rv:not(.vis)");
      const io = new IntersectionObserver(
        es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
        {threshold: 0.07}
      );
      els.forEach(el => io.observe(el));
      return () => io.disconnect();
    };
    run();
  });
}

/* ─── COMPONENT ─── */
export default function RebanaAlMuqoddas() {
  const [menu, setMenu]       = useState(false);
  const [comments, setComments] = useState(COMMENTS0);
  const [draft, setDraft]     = useState("");
  const [toast, setToast]     = useState({on:false,msg:""});
  const cid = useRef(COMMENTS0.length + 1);

  useReveal();



  const go = id => {
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setMenu(false);
  };

  const flash = msg => {
    setToast({on:true,msg});
    setTimeout(() => setToast({on:false,msg}), 3200);
  };

  const submit = () => {
    if (!draft.trim()) return;
    const pool = ["AM","BK","CL","DW","EF","GR","HN","IZ"];
    setComments(prev => [{
      id: cid.current++,
      text: draft.trim(),
      time: "Baru saja",
      ini: pool[Math.floor(Math.random()*pool.length)],
    }, ...prev]);
    setDraft("");
    flash("Komentar berhasil dikirim!");
  };

  const GEO_DEGS = [0,45,90,135,180,225,270,315];

  return (
    <>
      <style>{CSS}</style>

      {/* Toast */}
      <div className={`toast${toast.on?" show":""}`}>
        <span style={{color:"#D4AF37"}}>✓</span> {toast.msg}
      </div>

      {/* ════ NAV ════ */}
      <nav className="nav">
        <span className="nav-brand" onClick={() => go("home")}>Al-Muqoddas</span>
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

      {/* Mobile drawer */}
      <div className={`drawer${menu?" open":""}`}>
        {[["home","Beranda"],["anggota","Anggota"],["komentar","Komentar"],["galeri","Galeri"]].map(([id,lbl]) => (
          <a key={id} onClick={() => go(id)}>{lbl}</a>
        ))}
      </div>

      {/* ════ HERO ════ */}
      <section id="home" className="hero">
        {/* Absolute glossy background layers */}
        <div className="hero-abs-bg" />
        <div className="hero-gloss"  />
        <div className="hero-bevel"  />
        <div className="hero-pat"    />

        <div className="hero-grid">

          {/* LEFT COLUMN */}
          <div className="hleft">
            {/* Bismillah — flush-left, same margin as title */}
            <p className="hbism">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

            <div className="hew">Ekstrakurikuler Rebana · SMKN 8 Semarang</div>

            {/* Single-line title */}
            <h1 className="htitle">Al&#8209;<em>Muqoddas</em></h1>

            <p className="htagline">Kesenian Islam Yang Memukau Hati</p>

            <p className="hdesc">
              Membawa warisan seni rebana Islam dengan semangat generasi muda SMKN&nbsp;8 Semarang — memadukan keindahan, iman, dan harmoni dalam setiap penampilan.
            </p>

            {/* Stats — below desc, above CTA */}
            <div className="hstats">
              <div className="stat">
                <span className="stat-n">30+</span>
                <span className="stat-l">Anggota Aktif</span>
              </div>
              <div className="stat">
                <span className="stat-n">5+</span>
                <span className="stat-l">Tahun Berdiri</span>
              </div>
              <div className="stat">
                <span className="stat-n">20+</span>
                <span className="stat-l">Event Diikuti</span>
              </div>
            </div>

            <div className="hcta">
              <button className="btn-g" onClick={() => go("anggota")}>Kenali Kami</button>
              <button className="btn-gh" onClick={() => go("galeri")}>Lihat Galeri</button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hright">
            <div className="geo-wrap">
              {/* Outer ring with gold dots */}
              <div className="gr" style={{position:"absolute",inset:0}}>
                {GEO_DEGS.map(deg => (
                  <div key={deg} className="gdot" style={{
                    top:`calc(50% + ${Math.sin(deg*Math.PI/180)*49}% - 3.5px)`,
                    left:`calc(50% + ${Math.cos(deg*Math.PI/180)*49}% - 3.5px)`,
                  }}/>
                ))}
              </div>
              <div className="gr gr2" />
              <div className="gr gr3" />
              <div className="goct" />

              {/* Landscape photo slot */}
              <div className="hphoto">
                {/* Replace <div className="hph-placeholder"> with <img src="your-photo.png" alt="Rebana Al-Muqoddas"/> */}
                <div className="hph-placeholder">
                  <CamIcon size={40} />
                  <p>Foto Penampilan Rebana<br />(landscape PNG di sini)</p>
                </div>
              </div>

              {/* Ambient dots */}
              {[{t:"11%",l:"16%",s:6,o:.45},{t:"72%",r:"28%",s:4,o:.28},{t:"44%",l:"3%",s:5,o:.33}].map((d,i) => (
                <div key={i} style={{
                  position:"absolute",width:d.s,height:d.s,borderRadius:"50%",
                  background:"#D4AF37",opacity:d.o,
                  top:d.t,left:d.l,right:d.r,
                }}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ ANGGOTA ════ */}
      <div id="anggota" className="abg">
        <div className="swrap">
          <div className="sin">
            <div className="rv">
              <div className="sew"><span/>Tim Kami<span/></div>
              <h2 className="stitle">Para <em>Anggota</em></h2>
              <div className="sdiv"/>
            </div>
            <div className="mgrid">
              {MEMBERS.map((m,i) => (
                <div key={m.id} className="mc rv" style={{transitionDelay:`${i*50}ms`}}>
                  <div className="mc-bar"/>
                  <div className="mc-ph"><CamIcon size={30}/></div>
                  <div className="mc-body">
                    <p className="mc-name">{m.name}</p>
                    <p className="mc-kelas">{m.kelas}</p>
                    <p className="mc-q">"{m.quote}"</p>
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
                <h3>Tinggalkan Pesan</h3>
                <p>Bagikan kesan dan pendapatmu secara anonim. Kami senang mendengar dari kalian!</p>
                <label className="flbl">Pesan kamu</label>
                <textarea
                  className="fta"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Tuliskan kesanmu di sini..."
                  onKeyDown={e => { if(e.ctrlKey && e.key==="Enter") submit(); }}
                />
                <button className="btn-g" onClick={submit} style={{width:"100%",justifyContent:"center"}}>
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
          <p className="fcopy">© 2025 Rebana Al-Muqoddas · SMKN 8 Semarang</p>
          <span className="far" style={{fontSize:".85rem"}}>بِسْمِ اللَّهِ</span>
        </div>
      </footer>
    </>
  );
} 