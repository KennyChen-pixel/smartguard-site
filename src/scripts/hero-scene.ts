/* ============================================================
   首頁主視覺：長輩行走 → 雷射測距鎖定前方門檻 → 震動預警 → 放慢 → 安全
   以 Canvas 2D 繪製 3D 透視地面。尊重 prefers-reduced-motion，畫面外自動暫停。
   網址加 ?t=毫秒 可凍結在指定時間點（截圖用）。
   ============================================================ */

type V2 = { x: number; z: number };

export function initHeroScene(root: HTMLElement) {
  const cv = root.querySelector<HTMLCanvasElement>('[data-floor]')!;
  const ctx = cv.getContext('2d')!;
  const shoe = root.querySelector<HTMLElement>('[data-shoe]')!;
  const vib = root.querySelector<HTMLElement>('[data-vib]')!;
  const hud = root.querySelector<HTMLElement>('[data-hud]')!;
  const hudTitle = hud.querySelector<HTMLElement>('[data-hud-title]')!;
  const hudDist = hud.querySelector<HTMLElement>('[data-hud-dist]')!;
  const gc = root.querySelector<HTMLCanvasElement>('[data-gait]')!;
  const gx = gc.getContext('2d')!;

  const freezeParam = new URLSearchParams(location.search).get('t');
  const frozen = freezeParam !== null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = frozen || reduce;

  // ── 世界設定（單位：任意長度；顯示距離 = 世界距離 / M_PER）──
  const S: V2 = { x: 0, z: 2.2 };                       // 感測器位置
  const FWD: V2 = { x: Math.SQRT1_2, z: Math.SQRT1_2 };  // 行走方向
  const SIDE: V2 = { x: FWD.z, z: -FWD.x };
  const CAM_H = 1.0;
  const M_PER = 2.6;
  const DU0 = 10.5, DET = 5.2, V1 = 1.9, V2 = 0.4, TAU = 0.35;
  const T_DET = (DU0 - DET) / V1;          // 秒
  const SAFE_AFTER = 1.6;
  const CYCLE = 8.0;
  const BOX = { half: 0.85, depth: 0.16, h: 0.22 };

  let W = 0, H = 0, DPR = 1, F = 0, HZ = 0, CX = 0, XS = 1;
  const cam = { x: 0, y: 0 }, camT = { x: 0, y: 0 };

  const traveled = (t: number) =>
    t < T_DET ? V1 * t : V1 * T_DET + V2 * (t - T_DET) + (V1 - V2) * TAU * (1 - Math.exp(-(t - T_DET) / TAU));

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    const narrow = W < 820;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    F = H * (narrow ? 0.55 : 0.9);
    HZ = H * (narrow ? 0.665 : 0.44);
    CX = W * (narrow ? 0.34 : 0.4);
    XS = narrow ? 0.42 : 1;
    const gw = gc.clientWidth, gh = gc.clientHeight;
    gc.width = Math.round(gw * DPR); gc.height = Math.round(gh * DPR);
    gx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  const P = (x: number, y: number, z: number) => ({
    x: CX + (x * XS - cam.x) * F / z,
    y: HZ + cam.y + (CAM_H - y) * F / z,
    s: F / z,
  });
  const along = (d: number, side = 0) => ({ x: S.x + FWD.x * d + SIDE.x * side, z: S.z + FWD.z * d + SIDE.z * side });

  // ── 地面點陣 ──
  const GRID = 0.42;
  function drawFloor(s: number, du: number, t: number, detected: boolean) {
    const ox = ((-(FWD.x * s)) % GRID + GRID) % GRID;
    const oz = ((-(FWD.z * s)) % GRID + GRID) % GRID;
    const beamLen = detected ? du - BOX.depth : DET;
    for (let z = 1.1 + oz; z < 19; z += GRID) {
      const depth = Math.max(0, 1 - (z - 1.1) / 17);
      for (let x = -12 + ox; x < 26; x += GRID) {
        const q = P(x, 0, z);
        if (q.y > H + 4 || q.x < -8 || q.x > W + 8) continue;
        // 雷射照射範圍：前方窄扇形
        const dx = x - S.x, dz = z - S.z;
        const a = dx * FWD.x + dz * FWD.z;          // 沿行進方向距離
        const b = Math.abs(dx * SIDE.x + dz * SIDE.z); // 側向距離
        let lit = 0;
        if (a > 0 && a < beamLen) {
          const spread = 0.12 + a * 0.2;
          lit = Math.max(0, 1 - b / spread) * (0.55 + 0.45 * Math.sin(a * 3 - t * 9) ** 2);
        }
        const base = 0.07 + 0.2 * depth;
        const r = Math.max(0.55, q.s * 0.011 + lit * 1.4);
        ctx.fillStyle = lit > 0.05
          ? `rgba(79,192,225,${Math.min(1, base + lit * 0.75)})`
          : `rgba(16,108,128,${base})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, 6.2832); ctx.fill();
      }
    }
  }

  // ── 門檻（木質）＋ 陰影 ──
  function boxCorners(c: V2) {
    const pts: { x: number; y: number; z: number }[] = [];
    for (const dd of [-BOX.depth, BOX.depth]) for (const ss of [-BOX.half, BOX.half]) for (const yy of [0, BOX.h])
      pts.push({ x: c.x + FWD.x * dd + SIDE.x * ss, y: yy, z: c.z + FWD.z * dd + SIDE.z * ss });
    return pts;
  }
  function drawObstacle(du: number, alpha: number, state: 'idle' | 'alert' | 'safe', since: number) {
    const c = along(du);
    // 地面柔和陰影
    const cq = P(c.x, 0, c.z);
    const w = BOX.half * 2 * cq.s * XS;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cq.x, cq.y + 4);
    ctx.scale(1, 0.28);
    const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.75);
    sg.addColorStop(0, 'rgba(12,46,54,.22)'); sg.addColorStop(1, 'rgba(12,46,54,0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, w * 0.75, 0, 6.2832); ctx.fill();
    ctx.restore();

    // 狀態光暈（地面）
    if (state !== 'idle') {
      const col = state === 'alert' ? '224,138,30' : '102,194,174';
      const pulse = state === 'alert' ? 0.55 + 0.45 * Math.abs(Math.sin(since * 7)) : 0.8;
      ctx.save(); ctx.globalAlpha = alpha * pulse; ctx.translate(cq.x, cq.y); ctx.scale(1, 0.3);
      const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
      gg.addColorStop(0, `rgba(${col},.45)`); gg.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, w, 0, 6.2832); ctx.fill(); ctx.restore();
    }

    // 方塊各面（背面剔除 + 由遠到近）
    const k = boxCorners(c).map((p) => ({ ...p, q: P(p.x, p.y, p.z) }));
    // 索引：dd(0近/1遠)*4 + ss*2 + yy
    const faces = [
      { idx: [0, 2, 3, 1], n: { x: -FWD.x, y: 0, z: -FWD.z }, tone: 0.86 },  // 近面（朝鞋）
      { idx: [4, 5, 7, 6], n: { x: FWD.x, y: 0, z: FWD.z }, tone: 0.7 },     // 遠面
      { idx: [0, 1, 5, 4], n: { x: -SIDE.x, y: 0, z: -SIDE.z }, tone: 0.76 }, // 側面
      { idx: [2, 6, 7, 3], n: { x: SIDE.x, y: 0, z: SIDE.z }, tone: 0.76 },
      { idx: [1, 3, 7, 5], n: { x: 0, y: 1, z: 0 }, tone: 1 },                // 頂面
    ];
    const camPos = { x: cam.x / XS, y: CAM_H, z: 0 };
    const visible = faces
      .map((f) => {
        const pts = f.idx.map((i) => k[i]);
        const cx = pts.reduce((a, p) => a + p.x, 0) / 4, cy = pts.reduce((a, p) => a + p.y, 0) / 4, cz = pts.reduce((a, p) => a + p.z, 0) / 4;
        const dot = f.n.x * (camPos.x - cx) + f.n.y * (camPos.y - cy) + f.n.z * (camPos.z - cz);
        return { ...f, pts, dist: Math.hypot(camPos.x - cx, camPos.y - cy, camPos.z - cz), dot };
      })
      .filter((f) => f.dot > 0)
      .sort((a, b) => b.dist - a.dist);

    ctx.save();
    ctx.globalAlpha = alpha;
    for (const f of visible) {
      const g = ctx.createLinearGradient(f.pts[0].q.x, f.pts[0].q.y, f.pts[2].q.x, f.pts[2].q.y);
      const base = [217, 194, 160];           // 淺木色
      const c1 = base.map((v) => Math.round(v * f.tone));
      const c2 = base.map((v) => Math.round(v * f.tone * 0.9));
      g.addColorStop(0, `rgb(${c1.join(',')})`); g.addColorStop(1, `rgb(${c2.join(',')})`);
      ctx.fillStyle = g;
      ctx.beginPath(); f.pts.forEach((p, i) => (i ? ctx.lineTo(p.q.x, p.q.y) : ctx.moveTo(p.q.x, p.q.y))); ctx.closePath(); ctx.fill();
      // 木紋細線
      if (f.n.y === 1) {
        ctx.strokeStyle = 'rgba(140,110,76,.25)'; ctx.lineWidth = 0.8;
        for (let i = 1; i < 4; i++) {
          const t = i / 4;
          const a = { x: f.pts[0].q.x + (f.pts[3].q.x - f.pts[0].q.x) * t, y: f.pts[0].q.y + (f.pts[3].q.y - f.pts[0].q.y) * t };
          const b = { x: f.pts[1].q.x + (f.pts[2].q.x - f.pts[1].q.x) * t, y: f.pts[1].q.y + (f.pts[2].q.y - f.pts[1].q.y) * t };
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.strokeStyle = 'rgba(110,84,56,.45)'; ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // 偵測框角標
    if (state !== 'idle') {
      const xs = k.map((p) => p.q.x), ys = k.map((p) => p.q.y);
      const ease = 1 - Math.pow(1 - Math.min(1, since / 0.35), 3);
      const pad = 34 - 22 * ease;
      const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
      const L = 16;
      ctx.save();
      ctx.globalAlpha = alpha * ease;
      ctx.strokeStyle = state === 'alert' ? '#e08a1e' : '#3fae94';
      ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      const corner = (x: number, y: number, dx: number, dy: number) => {
        ctx.beginPath(); ctx.moveTo(x + dx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * L); ctx.stroke();
      };
      corner(x0, y0, 1, 1); corner(x1, y0, -1, 1); corner(x0, y1, 1, -1); corner(x1, y1, -1, -1);
      ctx.restore();
    }
    return P(c.x, BOX.h, c.z);
  }

  // ── 雷射光束 ──
  function drawBeam(du: number, detected: boolean, since: number, t: number) {
    const s = P(S.x, 0.1, S.z);
    const len = detected ? du - BOX.depth : DET;
    const tip = along(len);
    const spreadEnd = 0.12 + len * 0.2;
    const l = along(len, -spreadEnd), r = along(len, spreadEnd);
    const tq = P(tip.x, detected ? BOX.h * 0.55 : 0.02, tip.z), lq = P(l.x, 0.02, l.z), rq = P(r.x, 0.02, r.z);

    // 光錐
    const cone = ctx.createLinearGradient(s.x, s.y, tq.x, tq.y);
    cone.addColorStop(0, `rgba(79,192,225,${detected ? 0.34 : 0.22})`);
    cone.addColorStop(1, `rgba(102,194,174,${detected ? 0.12 : 0})`);
    ctx.fillStyle = cone;
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(lq.x, lq.y); ctx.lineTo(rq.x, rq.y); ctx.closePath(); ctx.fill();

    // 中心雷射線（天青 → 薄荷）
    const g = ctx.createLinearGradient(s.x, s.y, tq.x, tq.y);
    g.addColorStop(0, 'rgba(79,192,225,.95)');
    g.addColorStop(1, detected ? 'rgba(102,194,174,.95)' : 'rgba(102,194,174,0)');
    ctx.save();
    ctx.shadowColor = 'rgba(79,192,225,.8)'; ctx.shadowBlur = detected ? 10 : 4;
    ctx.strokeStyle = g; ctx.lineWidth = detected ? 2.2 : 1.4;
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tq.x, tq.y); ctx.stroke();
    ctx.restore();

    // 行進中的脈衝光點
    for (let i = 0; i < 3; i++) {
      const u = ((t * 0.9 + i / 3) % 1);
      const p = { x: s.x + (tq.x - s.x) * u, y: s.y + (tq.y - s.y) * u };
      const rr = 2.2 + 2.2 * (1 - u);
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr * 4);
      glow.addColorStop(0, 'rgba(255,255,255,.95)'); glow.addColorStop(0.3, 'rgba(79,192,225,.7)'); glow.addColorStop(1, 'rgba(79,192,225,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, rr * 4, 0, 6.2832); ctx.fill();
    }

    // 量測刻度（鎖定後）
    if (detected) {
      const k = Math.min(1, since / 0.4);
      ctx.save(); ctx.globalAlpha = k;
      ctx.strokeStyle = 'rgba(13,106,134,.7)'; ctx.lineWidth = 1.2;
      const n = 6;
      const ang = Math.atan2(tq.y - s.y, tq.x - s.x) + Math.PI / 2;
      for (let i = 1; i < n; i++) {
        const u = i / n, px = s.x + (tq.x - s.x) * u, py = s.y + (tq.y - s.y) * u, L = i % 2 ? 4 : 7;
        ctx.beginPath(); ctx.moveTo(px - Math.cos(ang) * L, py - Math.sin(ang) * L); ctx.lineTo(px + Math.cos(ang) * L, py + Math.sin(ang) * L); ctx.stroke();
      }
      // 命中光點
      const hit = ctx.createRadialGradient(tq.x, tq.y, 0, tq.x, tq.y, 18);
      hit.addColorStop(0, 'rgba(255,255,255,.95)'); hit.addColorStop(0.35, 'rgba(79,192,225,.55)'); hit.addColorStop(1, 'rgba(79,192,225,0)');
      ctx.fillStyle = hit; ctx.beginPath(); ctx.arc(tq.x, tq.y, 18, 0, 6.2832); ctx.fill();
      ctx.restore();
    }

    // 感測器光點（呼吸）
    const br = 5 + (still ? 0 : 1.6 * Math.sin(t * 2.6));
    ctx.fillStyle = 'rgba(79,192,225,.28)'; ctx.beginPath(); ctx.arc(s.x, s.y, br * 2.4, 0, 6.2832); ctx.fill();
    ctx.fillStyle = '#0d6a86'; ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, 6.2832); ctx.fill();
    return s;
  }

  // ── 步態訊號：頻率固定、振幅不規則 ──
  const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const PERIOD = 88;
  let marks: number[] = [];
  let lastCycle = -1;
  function stepShape(u: number, i: number, damp: number) {
    const a1 = (0.62 + 0.38 * hash(i)) * damp;
    const a2 = (0.28 + 0.22 * hash(i + 17)) * damp;
    const skew = 0.06 + 0.03 * hash(i + 31);
    let y = 0;
    if (u < skew) y = -Math.sin((u / skew) * Math.PI) * a1;
    else if (u < skew + 0.07) y = Math.sin(((u - skew) / 0.07) * Math.PI) * a2;
    else if (u > 0.46 && u < 0.56) y = -Math.sin(((u - 0.46) / 0.1) * Math.PI) * 0.12 * (0.5 + hash(i + 5));
    return y + (hash(i * 7 + Math.floor(u * 40)) - 0.5) * 0.04;
  }
  function drawGait(t: number, cycleIndex: number, detected: boolean) {
    const gw = gc.clientWidth, gh = gc.clientHeight;
    gx.clearRect(0, 0, gw, gh);
    const mid = gh * 0.56;
    const v = t * 64 + cycleIndex * CYCLE * 64;
    if (detected && cycleIndex !== lastCycle && !still) { marks.push(v); lastCycle = cycleIndex; }
    if (still && !marks.length) marks = [v - gw * 0.18];
    marks = marks.filter((m) => gw - (v - m) > -40);

    gx.strokeStyle = 'rgba(18,38,45,.1)'; gx.lineWidth = 1;
    gx.beginPath(); gx.moveTo(0, mid); gx.lineTo(gw, mid); gx.stroke();
    for (const m of marks) {
      const x = gw - (v - m);
      const band = gx.createLinearGradient(x - 26, 0, x + 26, 0);
      band.addColorStop(0, 'rgba(102,194,174,0)'); band.addColorStop(0.5, 'rgba(102,194,174,.22)'); band.addColorStop(1, 'rgba(102,194,174,0)');
      gx.fillStyle = band; gx.fillRect(x - 26, 0, 52, gh);
      gx.strokeStyle = '#e08a1e'; gx.lineWidth = 1.6;
      gx.beginPath(); gx.moveTo(x, 3); gx.lineTo(x, gh - 3); gx.stroke();
    }
    const grad = gx.createLinearGradient(0, 0, gw, 0);
    grad.addColorStop(0, 'rgba(79,192,225,0)'); grad.addColorStop(0.15, 'rgba(79,192,225,.9)'); grad.addColorStop(1, 'rgba(102,194,174,1)');
    gx.strokeStyle = grad; gx.lineWidth = 1.8; gx.lineJoin = 'round';
    gx.beginPath();
    for (let x = 0; x <= gw; x += 1.25) {
      const w = (x + v) / PERIOD;
      const i = Math.floor(w);
      const recentSlow = marks.some((m) => { const mx = gw - (v - m); return x > mx && x - mx < 260; });
      const y = mid + stepShape(w - i, i, recentSlow ? 0.62 : 1) * gh * 0.44;
      x ? gx.lineTo(x, y) : gx.moveTo(x, y);
    }
    gx.stroke();
    const w = (gw + v) / PERIOD, i = Math.floor(w);
    const ye = mid + stepShape(w - i, i, 1) * gh * 0.44;
    gx.fillStyle = '#66c2ae'; gx.beginPath(); gx.arc(gw - 3, ye, 3.6, 0, 6.2832); gx.fill();
  }

  // ── 主迴圈 ──
  const start = performance.now() + 700;
  let running = true, raf = 0, vibUntil = -1, lastDetCycle = -1;

  function frame(now: number) {
    cam.x += (camT.x - cam.x) * 0.05; cam.y += (camT.y - cam.y) * 0.05;
    const total = frozen ? Number(freezeParam) / 1000 : reduce ? T_DET + SAFE_AFTER + 0.4 : Math.max(0, (now - start) / 1000);
    const cycleIndex = Math.floor(total / CYCLE);
    const t = total % CYCLE;
    const s = traveled(t);
    const du = DU0 - s;
    const detected = t >= T_DET;
    const since = t - T_DET;
    const safe = detected && since >= SAFE_AFTER;
    const alpha = Math.min(1, t / 0.6) * (t > 7.0 ? Math.max(0, 1 - (t - 7.0) / 0.7) : 1);

    ctx.clearRect(0, 0, W, H);
    drawFloor(s, du, total, detected);
    const top = drawObstacle(du, alpha, !detected ? 'idle' : safe ? 'safe' : 'alert', since);
    const sq = drawBeam(du, detected, since, total);

    // 鞋子對位：感測模組在示意圖中約位於 (352, 88)／(554, 248)
    const sw = shoe.clientWidth, sh = sw * 248 / 554;
    shoe.style.transform = `translate3d(${sq.x - sw * 352 / 554}px, ${sq.y - sh * 88 / 248}px, 0)`;

    // 震動預警（偵測後 1.3 秒）
    if (detected && lastDetCycle !== cycleIndex) { lastDetCycle = cycleIndex; vibUntil = total + 1.3; }
    const vibOn = !still && total < vibUntil;
    vib.style.transform = `translate3d(${sq.x}px, ${sq.y}px, 0)`;
    vib.classList.toggle('on', vibOn || (still && detected && !safe));
    shoe.classList.toggle('shake', vibOn);

    // 狀態標籤
    const showHud = detected && alpha > 0.4;
    hud.classList.toggle('on', showHud);
    hud.classList.toggle('safe', safe);
    hud.style.transform = `translate3d(${top.x}px, ${top.y - 18}px, 0) translate(-50%, -100%)`;
    hudTitle.textContent = safe ? '已於跌倒前預警' : '偵測到前方障礙物';
    hudDist.textContent = `${(Math.max(0, du - BOX.depth) / M_PER).toFixed(1)} m`;

    drawGait(total, cycleIndex, detected);
    if (!still && running) raf = requestAnimationFrame(frame);
  }

  resize();
  const kick = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };
  addEventListener('resize', () => { resize(); kick(); });
  if (!still) {
    addEventListener('pointermove', (e) => {
      camT.x = (e.clientX / innerWidth - 0.5) * -0.5;
      camT.y = (e.clientY / innerHeight - 0.5) * -16;
    }, { passive: true });
    new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) kick(); }).observe(root);
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) kick(); });
  }
  if (document.fonts?.ready) document.fonts.ready.then(() => { resize(); kick(); });
  kick();
}
