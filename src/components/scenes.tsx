/**
 * Built-in room illustrations, drawn as 1600×900 SVGs so beacon percentages
 * in src/content/site.ts line up with objects in the picture.
 */

import type { Room } from "@/content/site";

const W = 1600;
const H = 900;

/** Small deterministic PRNG so scenes render identically on server and client. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function Svg({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Vignette({ id }: { id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-vig`} cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.75" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-vig)`} />
    </>
  );
}

/* --------------------------------------------------------------- */
/* Interior shell: ceiling, three walls, floor in one-point view.   */
/* Back wall spans x 420–1180, y 170–640.                           */
/* --------------------------------------------------------------- */

type Palette = { ceiling: string; back: string; side: string; floor: string; plank: string; light: string };

function Shell({ id, p }: { id: string; p: Palette }) {
  const planks = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    return { x0: 420 + t * 760, x1: t * 1600 };
  });
  return (
    <>
      <defs>
        <linearGradient id={`${id}-back`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.back} stopOpacity="0.85" />
          <stop offset="1" stopColor={p.back} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.floor} />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="20%" r="55%">
          <stop offset="0" stopColor={p.light} stopOpacity="0.32" />
          <stop offset="1" stopColor={p.light} stopOpacity="0" />
        </radialGradient>
      </defs>
      <polygon points="0,0 1600,0 1180,170 420,170" fill={p.ceiling} />
      <rect x={420} y={170} width={760} height={470} fill={`url(#${id}-back)`} />
      <polygon points="0,0 420,170 420,640 0,900" fill={p.side} />
      <polygon points="1600,0 1180,170 1180,640 1600,900" fill={p.side} />
      <polygon points="0,900 420,640 1180,640 1600,900" fill={`url(#${id}-floor)`} />
      {planks.map((l, i) => (
        <line key={i} x1={l.x0} y1={640} x2={l.x1} y2={900} stroke={p.plank} strokeWidth={1.5} opacity={0.5} />
      ))}
      {/* baseboards */}
      <rect x={420} y={630} width={760} height={10} fill="#000" opacity={0.35} />
      <polygon points="0,880 420,630 420,640 0,900" fill="#000" opacity={0.3} />
      <polygon points="1600,880 1180,630 1180,640 1600,900" fill="#000" opacity={0.3} />
      {/* ceiling light */}
      <rect x={760} y={170} width={80} height={6} fill={p.light} opacity={0.9} />
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
    </>
  );
}

function Door({ fill = "#2a211b" }: { fill?: string }) {
  // On the right wall, in perspective.
  return (
    <g>
      <polygon points="1282,240 1428,190 1428,792 1282,712" fill="#000" opacity={0.5} />
      <polygon points="1290,250 1420,205 1420,780 1290,705" fill={fill} />
      <polygon points="1302,272 1408,236 1408,470 1302,486" fill="#000" opacity={0.18} />
      <polygon points="1302,512 1408,500 1408,740 1302,686" fill="#000" opacity={0.18} />
      <circle cx={1312} cy={485} r={6} fill="#c9a86a" />
    </g>
  );
}

/* --------------------------------------------------------------- */
/* Front: a house at night.                                          */
/* --------------------------------------------------------------- */

function WarmWindow({ x, y, w, h, id, cool = false }: { x: number; y: number; w: number; h: number; id: string; cool?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cool ? "#9fc3d6" : "#ffd7a0"} />
          <stop offset="1" stopColor={cool ? "#2d4e63" : "#b8692c"} />
        </linearGradient>
      </defs>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill="#0b0b0c" />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} opacity={0.92} />
    </g>
  );
}

function FrontScene() {
  const r = rng(7);
  const stars = Array.from({ length: 110 }, () => ({ x: r() * W, y: r() * 430, s: r() * 1.4 + 0.3, o: r() * 0.7 + 0.2 }));
  return (
    <Svg label="The front of a modern house at night">
      <defs>
        <linearGradient id="f-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#03050a" />
          <stop offset="0.55" stopColor="#0d1424" />
          <stop offset="1" stopColor="#2a2131" />
        </linearGradient>
        <linearGradient id="f-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1210" />
          <stop offset="1" stopColor="#030303" />
        </linearGradient>
        <radialGradient id="f-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f4efe1" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f4efe1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="f-pool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1fa2bd" />
          <stop offset="1" stopColor="#0a3f4f" />
        </linearGradient>
        <radialGradient id="f-spill" cx="50%" cy="0%" r="70%">
          <stop offset="0" stopColor="#ffb86b" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffb86b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#f-sky)" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" opacity={s.o} />
      ))}
      <circle cx={1340} cy={140} r={120} fill="url(#f-moon)" />
      <circle cx={1340} cy={140} r={36} fill="#ece6d4" />
      {/* distant hills */}
      <path d="M0,600 C200,540 360,570 520,550 C700,525 860,580 1040,555 C1220,530 1400,570 1600,540 L1600,660 L0,660 Z" fill="#090c12" />
      <rect y={640} width={W} height={260} fill="url(#f-ground)" />
      {/* light spill on lawn */}
      <ellipse cx={800} cy={660} rx={600} ry={120} fill="url(#f-spill)" />
      {/* house: lower floor */}
      <rect x={300} y={400} width={1000} height={240} fill="#18191d" />
      <rect x={270} y={392} width={1060} height={16} fill="#0c0d10" />
      {/* upper floor */}
      <rect x={460} y={230} width={760} height={162} fill="#1f2025" />
      <rect x={420} y={214} width={840} height={18} fill="#0c0d10" />
      {/* windows */}
      <WarmWindow id="w1" x={340} y={440} w={300} h={180} />
      <WarmWindow id="w2" x={920} y={440} w={340} h={180} />
      <WarmWindow id="w3" x={500} y={262} w={260} h={112} />
      <WarmWindow id="w4" x={860} y={262} w={320} h={112} cool />
      {/* studio silhouette inside w1: desk + monitor glow */}
      <rect x={400} y={540} width={180} height={8} fill="#2b1b10" />
      <rect x={455} y={492} width={70} height={44} fill="#0e2a33" />
      <rect x={460} y={497} width={60} height={34} fill="#5fd3e6" opacity={0.7} />
      {/* library silhouette inside w3: shelves */}
      {[0, 1, 2].map((row) =>
        Array.from({ length: 14 }, (_, i) => (
          <rect key={`${row}-${i}`} x={512 + i * 17} y={276 + row * 32} width={12} height={24} fill={["#5a2a1c", "#2c3b2a", "#1f2a44", "#6b4a1f"][(i + row) % 4]} opacity={0.75} />
        )),
      )}
      {/* lab silhouette inside w2: screens */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={960 + i * 95} y={500} width={78} height={48} fill="#0e1b24" />
          <rect x={964 + i * 95} y={504} width={70} height={40} fill="#7fd6ff" opacity={0.55} />
        </g>
      ))}
      {/* mullions */}
      {[440, 540].map((x) => (
        <rect key={x} x={x} y={440} width={4} height={180} fill="#0b0b0c" />
      ))}
      {[1033, 1146].map((x) => (
        <rect key={x} x={x} y={440} width={4} height={180} fill="#0b0b0c" />
      ))}
      <rect x={628} y={262} width={4} height={112} fill="#0b0b0c" />
      <rect x={1018} y={262} width={4} height={112} fill="#0b0b0c" />
      {/* door + lights */}
      <rect x={752} y={462} width={96} height={178} fill="#0b0b0c" />
      <rect x={760} y={470} width={80} height={170} fill="#3a2a1e" />
      <rect x={826} y={548} width={4} height={26} fill="#c9a86a" />
      {[736, 864].map((x) => (
        <g key={x}>
          <circle cx={x} cy={500} r={18} fill="#ffcf8f" opacity={0.18} />
          <rect x={x - 4} y={492} width={8} height={16} fill="#ffe2b5" />
        </g>
      ))}
      {/* path */}
      <polygon points="770,640 830,640 900,900 700,900" fill="#1a1b1e" />
      {/* pool */}
      <polygon points="1060,700 1470,700 1540,820 1010,820" fill="url(#f-pool)" />
      <polygon points="1060,700 1470,700 1476,710 1054,710" fill="#9fe6f3" opacity={0.35} />
      {[730, 760, 790].map((y, i) => (
        <path key={y} d={`M${1060 - i * 10},${y} q60,-8 120,0 t120,0 t120,0`} stroke="#bff3fb" strokeOpacity={0.25} fill="none" />
      ))}
      {/* mailbox */}
      <rect x={1373} y={590} width={10} height={60} fill="#111" />
      <rect x={1352} y={562} width={52} height={32} rx={14} fill="#2b2b2f" />
      <rect x={1398} y={566} width={4} height={18} fill="#c0392b" />
      {/* trees */}
      <path d="M120,660 C60,560 110,420 190,380 C270,420 300,560 250,660 Z" fill="#06080a" />
      <rect x={180} y={640} width={14} height={40} fill="#06080a" />
      <path d="M1450,660 C1400,580 1430,470 1500,440 C1570,480 1590,580 1540,660 Z" fill="#06080a" />
      {/* window reflections on the ground */}
      <rect x={340} y={660} width={300} height={40} fill="#ffb86b" opacity={0.05} />
      <rect x={920} y={660} width={340} height={30} fill="#ffb86b" opacity={0.04} />
      <Vignette id="f" />
    </Svg>
  );
}

/* --------------------------------------------------------------- */
/* Studio: desk, monitors, framed projects.                         */
/* --------------------------------------------------------------- */

function Frame({ x, i }: { x: number; i: number }) {
  const art = [
    // bars
    <g key="a">
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x={x + 22 + k * 20} y={340 - [40, 70, 55, 95, 120][k]} width={12} height={[40, 70, 55, 95, 120][k]} fill="#e8e4d8" opacity={0.85} />
      ))}
    </g>,
    // line
    <path key="b" d={`M${x + 18},330 L${x + 45},300 L${x + 70},312 L${x + 95},260 L${x + 122},240`} stroke="#e8e4d8" strokeWidth={4} fill="none" />,
    // scatter
    <g key="c">
      {[[30, 300], [48, 280], [60, 320], [80, 255], [95, 290], [110, 245], [70, 270], [40, 325]].map(([dx, y], k) => (
        <circle key={k} cx={x + dx} cy={y} r={6} fill="#e8e4d8" opacity={0.85} />
      ))}
    </g>,
    // donut
    <g key="d">
      <circle cx={x + 70} cy={290} r={40} stroke="#e8e4d8" strokeOpacity={0.3} strokeWidth={16} fill="none" />
      <circle cx={x + 70} cy={290} r={40} stroke="#e8e4d8" strokeWidth={16} fill="none" strokeDasharray="170 252" transform={`rotate(-90 ${x + 70} 290)`} />
    </g>,
  ][i % 4];
  const bg = ["#8a3b2b", "#2b4f6b", "#3e5a3a", "#6b5426"][i % 4];
  return (
    <g>
      <rect x={x - 6} y={214} width={152} height={172} fill="#000" opacity={0.4} />
      <rect x={x} y={220} width={140} height={160} fill="#e9e5da" />
      <rect x={x + 10} y={230} width={120} height={140} fill={bg} />
      {art}
    </g>
  );
}

function Monitor({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x + w / 2 - 6} y={y + h} width={12} height={22} fill="#18181b" />
      <rect x={x + w / 2 - 26} y={y + h + 18} width={52} height={6} fill="#18181b" />
      <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx={4} fill="#0a0a0b" />
      <rect x={x} y={y} width={w} height={h} fill="#0b1c25" />
      <path d={`M${x + 8},${y + h - 14} L${x + w * 0.3},${y + h * 0.55} L${x + w * 0.5},${y + h * 0.65} L${x + w * 0.75},${y + h * 0.3} L${x + w - 8},${y + h * 0.22}`} stroke="#5fd3e6" strokeWidth={3} fill="none" />
      <rect x={x} y={y} width={w} height={h} fill="#5fd3e6" opacity={0.08} />
    </g>
  );
}

function StudioScene() {
  const r = rng(11);
  const city = Array.from({ length: 22 }, () => ({ x: 110 + r() * 230, w: 14 + r() * 26, h: 60 + r() * 220 }));
  return (
    <Svg label="A home studio with a desk, three monitors, and framed projects on the wall">
      <Shell id="s" p={{ ceiling: "#0a0a0c", back: "#1c1d22", side: "#141519", floor: "#16130f", plank: "#2b241c", light: "#f6e7cf" }} />
      <defs>
        <clipPath id="s-win">
          <polygon points="120,150 330,215 330,520 120,560" />
        </clipPath>
        <linearGradient id="s-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060a14" />
          <stop offset="1" stopColor="#1d2238" />
        </linearGradient>
        <radialGradient id="s-screen" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#5fd3e6" stopOpacity="0.25" />
          <stop offset="1" stopColor="#5fd3e6" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* window with city */}
      <polygon points="112,140 338,208 338,528 112,570" fill="#0a0a0b" />
      <g clipPath="url(#s-win)">
        <rect x={100} y={140} width={260} height={440} fill="url(#s-night)" />
        {city.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={560 - b.h} width={b.w} height={b.h} fill="#0c0f18" />
            {Array.from({ length: Math.floor(b.h / 22) }, (_, k) => (
              <rect key={k} x={b.x + 4} y={566 - b.h + k * 22} width={4} height={6} fill="#ffd28a" opacity={r() > 0.55 ? 0.8 : 0} />
            ))}
          </g>
        ))}
      </g>
      <line x1={225} y1={182} x2={225} y2={540} stroke="#0a0a0b" strokeWidth={5} />
      {[475, 645, 815, 985].map((x, i) => (
        <Frame key={x} x={x} i={i} />
      ))}
      {/* screen glow on wall */}
      <ellipse cx={800} cy={500} rx={320} ry={120} fill="url(#s-screen)" />
      {/* desk */}
      <polygon points="560,560 1040,560 1080,590 520,590" fill="#3b2c20" />
      <rect x={520} y={590} width={560} height={14} fill="#241a12" />
      <rect x={540} y={604} width={10} height={120} fill="#121214" />
      <rect x={1050} y={604} width={10} height={120} fill="#121214" />
      <Monitor x={720} y={448} w={160} h={92} />
      <Monitor x={592} y={466} w={112} h={76} />
      <Monitor x={896} y={466} w={112} h={76} />
      <rect x={760} y={566} width={90} height={12} rx={2} fill="#1d1d20" />
      {/* chair */}
      <ellipse cx={800} cy={830} rx={260} ry={40} fill="#000" opacity={0.4} />
      <rect x={735} y={620} width={130} height={140} rx={18} fill="#0b0b0d" />
      <rect x={715} y={740} width={170} height={36} rx={12} fill="#0f0f12" />
      <rect x={795} y={776} width={10} height={44} fill="#0b0b0d" />
      <polygon points="740,830 860,830 820,812 780,812" fill="#0b0b0d" />
      {/* plant */}
      <polygon points="438,600 482,600 476,650 444,650" fill="#2a2a2e" />
      {[[-30, -80], [-10, -110], [15, -95], [35, -70], [0, -60]].map(([dx, dy], i) => (
        <path key={i} d={`M460,600 Q${460 + dx / 2},${600 + dy / 2} ${460 + dx},${600 + dy}`} stroke="#2f5a3a" strokeWidth={10} strokeLinecap="round" fill="none" />
      ))}
      <Door />
      <Vignette id="s" />
    </Svg>
  );
}

/* --------------------------------------------------------------- */
/* Library: bookshelves, armchair, lamp.                            */
/* --------------------------------------------------------------- */

function LibraryScene() {
  const r = rng(23);
  const colors = ["#5a2a1c", "#2c3b2a", "#1f2a44", "#6b4a1f", "#3b1f2c", "#5c5a4a", "#7a3a22"];
  const shelves = [210, 296, 382, 468, 554];
  const books: { x: number; y: number; w: number; h: number; c: string }[] = [];
  for (const sy of shelves) {
    let x = 444;
    while (x < 1150) {
      const w = 10 + r() * 14;
      const h = 52 + r() * 22;
      if (r() > 0.93) {
        x += 30;
        continue;
      }
      books.push({ x, y: sy + 74 - h, w, h, c: colors[Math.floor(r() * colors.length)] });
      x += w + 2;
    }
  }
  return (
    <Svg label="A library with tall bookshelves, a leather armchair, and a floor lamp">
      <Shell id="l" p={{ ceiling: "#0b0907", back: "#211912", side: "#18120d", floor: "#1a120c", plank: "#2e2116", light: "#ffd9a0" }} />
      <defs>
        <radialGradient id="l-lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffcf86" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffcf86" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="l-leather" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b3b22" />
          <stop offset="1" stopColor="#3a1e10" />
        </linearGradient>
      </defs>
      {/* shelving */}
      <rect x={430} y={196} width={740} height={440} fill="#2d2016" />
      {shelves.map((y) => (
        <rect key={y} x={430} y={y + 74} width={740} height={12} fill="#3c2b1d" />
      ))}
      {books.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />
      ))}
      {[430, 795, 1158].map((x) => (
        <rect key={x} x={x} y={196} width={12} height={440} fill="#3c2b1d" />
      ))}
      {/* diploma on left wall */}
      <polygon points="132,282 328,312 328,452 132,448" fill="#0a0806" />
      <polygon points="140,290 320,318 320,444 140,440" fill="#e9e1cc" />
      <polygon points="160,312 300,334 300,422 160,420" fill="none" stroke="#9a7b45" strokeWidth={2} />
      <line x1={180} y1={350} x2={280} y2={362} stroke="#6b5a3a" strokeWidth={3} />
      <line x1={190} y1={378} x2={270} y2={386} stroke="#6b5a3a" strokeWidth={2} />
      <circle cx={276} cy={404} r={9} fill="#9b2c2c" />
      {/* rug */}
      <ellipse cx={790} cy={790} rx={430} ry={72} fill="#3a1414" />
      <ellipse cx={790} cy={790} rx={380} ry={56} fill="none" stroke="#a0763a" strokeOpacity={0.5} strokeWidth={3} />
      {/* lamp */}
      <circle cx={420} cy={440} r={230} fill="url(#l-lamp)" />
      <rect x={417} y={440} width={6} height={340} fill="#1a1410" />
      <ellipse cx={420} cy={782} rx={34} ry={8} fill="#1a1410" />
      <polygon points="375,440 465,440 450,392 390,392" fill="#f2d3a0" />
      {/* armchair */}
      <ellipse cx={610} cy={790} rx={140} ry={20} fill="#000" opacity={0.45} />
      <rect x={510} y={560} width={200} height={170} rx={28} fill="url(#l-leather)" />
      <rect x={490} y={640} width={50} height={130} rx={18} fill="#4f2a17" />
      <rect x={680} y={640} width={50} height={130} rx={18} fill="#4f2a17" />
      <rect x={530} y={690} width={160} height={60} rx={14} fill="#5d321b" />
      <rect x={515} y={770} width={10} height={20} fill="#1a1410" />
      <rect x={695} y={770} width={10} height={20} fill="#1a1410" />
      {/* side table + frame */}
      <rect x={920} y={680} width={150} height={10} fill="#2b1f15" />
      <rect x={935} y={690} width={8} height={90} fill="#1a1410" />
      <rect x={1047} y={690} width={8} height={90} fill="#1a1410" />
      <rect x={960} y={630} width={52} height={50} fill="#c9a86a" />
      <rect x={966} y={636} width={40} height={38} fill="#3a4b5c" />
      <rect x={1030} y={656} width={16} height={24} rx={3} fill="#e9e1cc" />
      <Door fill="#32261c" />
      <Vignette id="l" />
    </Svg>
  );
}

export function Scene({ room }: { room: Room }) {
  if (room.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={room.image} alt="" className="absolute inset-0 h-full w-full object-cover" />;
  }
  switch (room.scene) {
    case "front":
      return <FrontScene />;
    case "studio":
      return <StudioScene />;
    case "library":
      return <LibraryScene />;
  }
}
