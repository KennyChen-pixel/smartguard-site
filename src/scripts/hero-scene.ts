/* ============================================================
   首頁主視覺：長輩行走 → 感測波向前擴散、碰到門檻產生回波 → 震動預警 → 放慢 → 安全
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
  const gc = root.querySelector<HTMLCanvasElement>('[data-gait]')!;
  const gx = gc.getContext('2d')!;

  const freezeParam = new URLSearchParams(location.search).get('t');
  const frozen = freezeParam !== null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = frozen || reduce;

  // ── 世界設定（單位：任意長度）──
  const S: V2 = { x: 0, z: 2.2 };                       // 感測器位置
  const FWD: V2 = { x: Math.SQRT1_2, z: Math.SQRT1_2 };  // 行走方向
  const SIDE: V2 = { x: FWD.z, z: -FWD.x };
  const CAM_H = 1.0;
  const DU0 = 10.5, DET = 5.2, V1 = 1.9, V2 = 0.4, TAU = 0.35;
  const T_DET = (DU0 - DET) / V1;          // 秒
  const SAFE_AFTER = 1.6;
  const CYCLE = 8.0;
  const BOX = { half: 0.85, depth: 0.16, h: 0.22 };

  let W = 0, H = 0, DPR = 1, F = 0, HZ = 0, CX = 0, XS = 1;
  let shoeW = 200, gW = 0, hudText = '';   // 快取：避免每格讀取版面或重寫 DOM
  const cam = { x: 0, y: 0 }, camT = { x: 0, y: 0 };

  const traveled = (t: number) =>
    t < T_DET ? V1 * t : V1 * T_DET + V2 * (t - T_DET) + (V1 - V2) * TAU * (1 - Math.exp(-(t - T_DET) / TAU));

  function resize() {
    W = cv.clientWidth; H = cv.clientHeight;
    const narrow = W < 820;
    // 手機：降低繪圖解析度與點陣密度，確保流暢
    DPR = Math.min(devicePixelRatio || 1, narrow ? 1.5 : 2);
    GRID = narrow ? 0.56 : 0.42;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    XS = narrow ? 0.42 : 1;
    fitScene(narrow);
    const gw = gc.clientWidth, gh = gc.clientHeight;
    gW = gw;
    gc.width = Math.round(gw * DPR); gc.height = Math.round(gh * DPR);
    gx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  /* 依可用高度自適應場景：
     1) 鞋子寬度同時受視窗寬、高限制；2) 鞋底固定在步態波形上方；
     3) 由「鞋子感測點」與「提示卡最高可放位置」之間的空間，反推透視焦距 F 與地平線 HZ，
        保證提示卡不壓到文字、鞋子與波形不被切掉。 */
  const copyEl = root.querySelector<HTMLElement>('[data-copy]');
  const stripEl = root.querySelector<HTMLElement>('[data-strip]');
  const stageEl = root.querySelector<HTMLElement>('[data-stage]')!;
  const stackedMQ = matchMedia('(max-width: 767px)');   // 手機：場景為按鈕下方的獨立區塊
  // 投影係數：感測點（高 0.1，距 2.2）與偵測當下門檻頂（高 0.22，距 S.z+DET·√½）
  const K_SENSOR = (CAM_H - 0.1) / S.z;
  const K_OBST = (CAM_H - 0.22) / (S.z + (DET) * Math.SQRT1_2);
  function fitScene(narrow: boolean) {
    if (stackedMQ.matches) {
      // 手機：場景區塊自成一格（不與文字重疊），只需讓鞋子、門檻、提示卡完整落在區塊內
      const sw = Math.round(Math.max(160, Math.min(W * 0.5, H * 0.62, 240)));
      shoe.style.width = `${sw}px`; shoeW = sw;
      CX = Math.max(W * 0.32, sw * 352 / 554 + 12);
      const below = sw * (248 - 88) / 554;
      const sensorY = H - below - 6;
      const fMax = (sensorY - 8 - 70) / (K_SENSOR - K_OBST);
      F = Math.max(H * 0.3, Math.min(W * 1.45, fMax));   // 盡量放大填滿場景區塊（提示卡仍保留在區塊內）
      HZ = sensorY - K_SENSOR * F;
      return;
    }
    const stripH = stripEl?.offsetHeight ?? 90;
    const sw = Math.round(narrow
      ? Math.max(170, Math.min(W * 0.55, H * 0.27, W < 600 ? 240 : 320))
      : Math.max(190, Math.min(W * 0.25, H * 0.36, 390)));
    shoe.style.width = `${sw}px`; shoeW = sw;
    // 場景中心：確保鞋子左緣（感測點左側約 0.64 個鞋寬）不超出畫面
    CX = Math.max(W * (narrow ? 0.34 : 0.4), sw * 352 / 554 + (narrow ? 12 : 24));
    const below = sw * (248 - 88) / 554;               // 感測點以下的鞋身高度
    const sensorY = H - stripH - below + (narrow ? 4 : 10);
    const stageTop = stageEl.getBoundingClientRect().top;
    const copyBottom = copyEl ? copyEl.getBoundingClientRect().bottom - stageTop : H * 0.5;
    const hudSpace = narrow ? 74 : 96;                  // 提示卡＋連接線＋間距
    const topLimit = narrow ? copyBottom + 10 : 92;     // 平板：文字下方；桌機：導覽列下方（門檻在右側，不與文字重疊）
    const fMax = (sensorY - topLimit - hudSpace) / (K_SENSOR - K_OBST);
    const fPref = H * (narrow ? 0.85 : 0.9);       // 空間足夠時（平板）場景放大填滿，不留大片空白
    F = Math.max(H * (narrow ? 0.3 : 0.45), Math.min(fPref, fMax));
    HZ = sensorY - K_SENSOR * F;
  }
  const P = (x: number, y: number, z: number) => ({
    x: CX + (x * XS - cam.x) * F / z,
    y: HZ + cam.y + (CAM_H - y) * F / z,
    s: F / z,
  });
  const along = (d: number, side = 0) => ({ x: S.x + FWD.x * d + SIDE.x * side, z: S.z + FWD.z * d + SIDE.z * side });

  // ── 聲波：由感測器向前方扇形擴散，碰到障礙物產生回波 ──
  const EMIT = 0.5;          // 每 0.5 秒發出一道波
  const C = 2.4;             // 波速（世界單位／秒）：波紋間距約 1.2，畫面上同時可見 3～4 道
  const HALF = 0.32;         // 地面照射扇形半角（弧度）
  const RMAX = DET + 0.3;    // 無障礙時的最大傳播距離
  type Wave = { r: number; fade: number; echo: number; echoFade: number };

  function wavesAt(t: number, du: number): Wave[] {
    const hitD = du - BOX.depth;
    const inRange = hitD <= DET;
    const out: Wave[] = [];
    const k1 = Math.floor(t / EMIT), k0 = Math.max(0, k1 - 10);
    for (let k = k0; k <= k1; k++) {
      const r = (t - k * EMIT) * C;
      if (inRange) {
        if (r < hitD) out.push({ r, fade: Math.pow(1 - r / (hitD * 1.15), 1.1), echo: -1, echoFade: 0 });
        else if (r < hitD * 2) out.push({ r: -1, fade: 0, echo: r - hitD, echoFade: Math.pow(1 - (r - hitD) / hitD, 1.2) });
      } else if (r < RMAX) {
        out.push({ r, fade: Math.pow(1 - r / RMAX, 1.3), echo: -1, echoFade: 0 });
      }
    }
    return out;
  }

  // ── 地面點陣（被波前照亮）──
  let GRID = 0.42;
  const COS_CONE = Math.cos(HALF + 0.12);
  /* 效能：同一排（同深度）的點顏色、大小、畫面高度都相同 → 一排只 fill 一次；
     每排直接解出畫面內的 x 範圍，不計算畫面外的點；被照亮的點依亮度分 10 組合併繪製。
     （原本每點各 beginPath/fill，手機 CPU 4x 降速時每格 30～60ms。） */
  const LIT_BUCKETS = 10;
  const litPaths: number[][] = Array.from({ length: LIT_BUCKETS }, () => []);
  function drawFloor(s: number, waves: Wave[]) {
    const ox = ((-(FWD.x * s)) % GRID + GRID) % GRID;
    const oz = ((-(FWD.z * s)) % GRID + GRID) % GRID;
    const fronts = waves.filter((w) => w.r > 0);
    for (const b of litPaths) b.length = 0;
    for (let z = 1.1 + oz; z < 19; z += GRID) {
      const k = F / z;
      const qy = HZ + cam.y + CAM_H * k;
      if (qy > H + 4) continue;
      const depth = Math.max(0, 1 - (z - 1.1) / 17);
      const base = 0.07 + 0.2 * depth;
      const r0 = Math.max(0.55, k * 0.011);
      // 本排在畫面內的世界 x 範圍
      const xLo = ((-8 - CX) / k + cam.x) / XS, xHi = ((W + 8 - CX) / k + cam.x) / XS;
      const xStart = -12 + ox + Math.max(0, Math.ceil((xLo - (-12 + ox)) / GRID)) * GRID;
      const xEnd = Math.min(26, xHi);
      ctx.fillStyle = `rgba(16,108,128,${base.toFixed(3)})`;
      ctx.beginPath();
      for (let x = xStart; x < xEnd; x += GRID) {
        const qx = CX + (x * XS - cam.x) * k;
        let lit = 0;
        if (fronts.length) {
          const dx = x - S.x, dz = z - S.z, d = Math.sqrt(dx * dx + dz * dz);
          const cos = d > 0 ? (dx * FWD.x + dz * FWD.z) / d : 0;
          if (cos > COS_CONE) {
            const edge = Math.min(1, (cos - COS_CONE) / 0.08);
            for (const w of fronts) { const e = d - w.r; if (e > -0.6 && e < 0.6) lit += Math.exp(-(e * e) / 0.03) * w.fade * edge; }
          }
        }
        if (lit > 0.05) {
          const a = Math.min(1, base + lit * 0.8);
          litPaths[Math.min(LIT_BUCKETS - 1, Math.floor(a * LIT_BUCKETS))].push(qx, qy, Math.max(0.55, r0 + lit * 1.3));
        } else if (r0 < 1.2) {
          ctx.rect(qx - r0, qy - r0, r0 * 2, r0 * 2);   // 小點用方形，比圓弧快很多，肉眼無差
        } else {
          ctx.moveTo(qx + r0, qy); ctx.arc(qx, qy, r0, 0, 6.2832);
        }
      }
      ctx.fill();
    }
    for (let i = 0; i < LIT_BUCKETS; i++) {
      const b = litPaths[i];
      if (!b.length) continue;
      ctx.fillStyle = `rgba(79,192,225,${((i + 0.5) / LIT_BUCKETS).toFixed(2)})`;
      ctx.beginPath();
      for (let j = 0; j < b.length; j += 3) { ctx.moveTo(b[j] + b[j + 2], b[j + 1]); ctx.arc(b[j], b[j + 1], b[j + 2], 0, 6.2832); }
      ctx.fill();
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

  // 聲波波前：沿行進方向、立在地面上的「)」形弧（球面波的縱切面），世界座標取樣後投影
  function arcPath(cx: number, cz: number, dir: V2, r: number, half: number, y0: number) {
    const n = 22;
    const hh = Math.min(0.1 + r * 0.14, 0.42);   // 弧的半高：近處小、遠處有上限，不會衝進標題區
    const bow = Math.min(r * 0.18, 0.5);           // 弧的彎曲深度
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= n; i++) {
      const u = -1 + (2 * i) / n;                  // -1 … 1
      const a = u * half;
      const d = r - bow * (1 - Math.cos(a)) / (1 - Math.cos(half));
      const wx = cx + dir.x * d, wz = cz + dir.z * d;
      const wy = y0 + u * hh;
      if (wy < 0.005 || wz < 0.6) continue;
      const q = P(wx, wy, wz);
      if (started) ctx.lineTo(q.x, q.y); else { ctx.moveTo(q.x, q.y); started = true; }
    }
  }

  function drawWaves(du: number, waves: Wave[], state: 'idle' | 'alert' | 'safe', t: number, alpha: number) {
    const s = P(S.x, 0.1, S.z);
    ctx.save();
    ctx.lineCap = 'round';

    // 感測範圍：極淡的扇形底色
    const reach = Math.min(du - BOX.depth, DET);
    const l = along(reach * Math.cos(HALF), -reach * Math.sin(HALF)), r = along(reach * Math.cos(HALF), reach * Math.sin(HALF));
    const lq = P(l.x, 0, l.z), rq = P(r.x, 0, r.z), mq = P(along(reach).x, 0, along(reach).z);
    const fan = ctx.createLinearGradient(s.x, s.y, mq.x, mq.y);
    fan.addColorStop(0, 'rgba(79,192,225,.16)'); fan.addColorStop(1, 'rgba(102,194,174,0)');
    ctx.fillStyle = fan;
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(lq.x, lq.y); ctx.lineTo(rq.x, rq.y); ctx.closePath(); ctx.fill();

    // 發射波（天青）
    for (const w of waves) {
      if (w.r <= 0.05) continue;
      const a = w.fade * 0.9;
      arcPath(S.x, S.z, FWD, w.r, 0.62, 0.1);
      ctx.strokeStyle = `rgba(79,192,225,${a * 0.2})`; ctx.lineWidth = 10; ctx.stroke();   // 柔光
      ctx.strokeStyle = `rgba(79,192,225,${a})`; ctx.lineWidth = 2.6; ctx.stroke();
    }

    // 回波（由障礙物反射回感測器）
    if (state !== 'idle') {
      const back = { x: -FWD.x, z: -FWD.z };
      const o = along(du - BOX.depth);
      const col = state === 'alert' ? '224,138,30' : '63,174,148';
      for (const w of waves) {
        if (w.echo < 0) continue;
        const a = w.echoFade * 0.85 * alpha;
        arcPath(o.x, o.z, back, Math.max(0.04, w.echo), 0.55, BOX.h * 0.5);
        ctx.strokeStyle = `rgba(${col},${a * 0.22})`; ctx.lineWidth = 8; ctx.stroke();
        ctx.strokeStyle = `rgba(${col},${a})`; ctx.lineWidth = 2.2; ctx.setLineDash([6, 5]); ctx.stroke(); ctx.setLineDash([]);
      }
      // 碰撞點的反射亮點
      const hq = P(o.x, BOX.h * 0.5, o.z);
      const pulse = 0.6 + 0.4 * Math.abs(Math.sin(t * 5));
      const hit = ctx.createRadialGradient(hq.x, hq.y, 0, hq.x, hq.y, 22);
      hit.addColorStop(0, `rgba(255,255,255,${0.9 * pulse * alpha})`); hit.addColorStop(0.35, `rgba(${col},${0.45 * pulse * alpha})`); hit.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = hit; ctx.beginPath(); ctx.arc(hq.x, hq.y, 22, 0, 6.2832); ctx.fill();
    }

    // 感測器：發射時的小圓環 ＋ 呼吸光點
    const phase = (t % EMIT) / EMIT;
    ctx.strokeStyle = `rgba(79,192,225,${0.6 * (1 - phase)})`; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(s.x, s.y, 5 + phase * 16, 0, 6.2832); ctx.stroke();
    const br = 5 + (still ? 0 : 1.4 * Math.sin(t * 2.6));
    ctx.fillStyle = 'rgba(79,192,225,.28)'; ctx.beginPath(); ctx.arc(s.x, s.y, br * 2.2, 0, 6.2832); ctx.fill();
    ctx.fillStyle = '#0d6a86'; ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, 6.2832); ctx.fill();
    ctx.restore();
    return s;
  }

  // ── 步態訊號：頻率固定、振幅不規則 ──
  const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const PERIOD = 88;
  const GAIT_SPEED = 64;   // 波形捲動速度（px／秒）；偵測標記以同速移動，與主動畫同一時間軸
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
  // 偵測標記與主動畫同步：位置直接由「偵測後經過的秒數」算出——
  // 偵測當下出現在最右端（＝現在），之後與波形同速往左；只顯示本輪的標記，門檻淡出時一起淡出。
  function drawGait(total: number, since: number, detected: boolean, safe: boolean, alpha: number) {
    const gw = gc.clientWidth, gh = gc.clientHeight;
    gx.clearRect(0, 0, gw, gh);
    const mid = gh * 0.56;
    const v = total * GAIT_SPEED;
    const markX = detected ? gw - 3 - since * GAIT_SPEED : Infinity;

    gx.strokeStyle = 'rgba(18,38,45,.1)'; gx.lineWidth = 1;
    gx.beginPath(); gx.moveTo(0, mid); gx.lineTo(gw, mid); gx.stroke();
    if (detected && markX > -30) {
      gx.save();
      gx.globalAlpha = alpha;
      const col = safe ? '102,194,174' : '224,138,30';
      const band = gx.createLinearGradient(markX - 26, 0, markX + 26, 0);
      band.addColorStop(0, `rgba(${col},0)`); band.addColorStop(0.5, `rgba(${col},.22)`); band.addColorStop(1, `rgba(${col},0)`);
      gx.fillStyle = band; gx.fillRect(markX - 26, 0, 52, gh);
      gx.strokeStyle = '#e08a1e'; gx.lineWidth = 1.6;
      gx.beginPath(); gx.moveTo(markX, 3); gx.lineTo(markX, gh - 3); gx.stroke();
      gx.restore();
    }
    const grad = gx.createLinearGradient(0, 0, gw, 0);
    grad.addColorStop(0, 'rgba(79,192,225,0)'); grad.addColorStop(0.15, 'rgba(79,192,225,.9)'); grad.addColorStop(1, 'rgba(102,194,174,1)');
    gx.strokeStyle = grad; gx.lineWidth = 1.8; gx.lineJoin = 'round';
    gx.beginPath();
    for (let x = 0; x <= gw; x += 1.25) {
      const w = (x + v) / PERIOD;
      const i = Math.floor(w);
      const slowed = x > markX;                       // 預警之後的步伐：放慢、振幅變小
      const y = mid + stepShape(w - i, i, slowed ? 0.62 : 1) * gh * 0.44;
      x ? gx.lineTo(x, y) : gx.moveTo(x, y);
    }
    gx.stroke();
    const w = (gw + v) / PERIOD, i = Math.floor(w);
    const ye = mid + stepShape(w - i, i, detected ? 0.62 : 1) * gh * 0.44;
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

    const state = !detected ? 'idle' : safe ? 'safe' : 'alert';
    const waves = wavesAt(t, du);

    ctx.clearRect(0, 0, W, H);
    drawFloor(s, waves);
    const top = drawObstacle(du, alpha, state, since);
    const sq = drawWaves(du, waves, state, total, alpha);

    // 鞋子對位：感測模組在示意圖中約位於 (352, 88)／(554, 248)（寬度取自 fitScene 快取，避免每格讀取版面）
    const sw = shoeW, sh = sw * 248 / 554;
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
    const title = safe ? '已於跌倒前預警' : '偵測到前方障礙物';
    if (title !== hudText) { hudTitle.textContent = title; hudText = title; }   // 只在改變時寫入，避免每格重排

    drawGait(total, since, detected, safe, alpha);
    if (!still && running) raf = requestAnimationFrame(frame);
  }

  resize();
  const kick = () => { cancelAnimationFrame(raf); if (running || still) raf = requestAnimationFrame(frame); };
  // 手機上下滑動時網址列伸縮會觸發 resize：只有畫布實際尺寸改變才重新配置（避免回拉卡頓）
  let resizeQueued = false;
  addEventListener('resize', () => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      if (cv.clientWidth !== W || cv.clientHeight !== H || gc.clientWidth !== gW) { resize(); kick(); }
    });
  }, { passive: true });
  // 文字區高度變化（字體載入、換行）時重新計算場景位置
  if (copyEl && 'ResizeObserver' in window) {
    let last = 0;
    new ResizeObserver(() => { const h = copyEl.offsetHeight; if (h !== last) { last = h; resize(); kick(); } }).observe(copyEl);
  }
  if (!still) {
    // 游標視差 ＋ 捲動景深（只在有滑鼠的裝置；觸控裝置不監聽捲動，維持原生捲動零負擔）
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer) {
      let pointerY = 0;
      const updateCamY = () => { camT.y = pointerY - Math.min(scrollY, H) * 0.12; };
      addEventListener('pointermove', (e) => {
        camT.x = (e.clientX / innerWidth - 0.5) * -0.5;
        pointerY = (e.clientY / innerHeight - 0.5) * -16;
        updateCamY();
      }, { passive: true });
      addEventListener('scroll', updateCamY, { passive: true });
    }
    // 畫面外暫停：場景與步態波形都離開畫面才停；分頁隱藏也停
    const seen = new Set<Element>();
    const update = () => {
      const next = seen.size > 0 && !document.hidden;
      if (next !== running) { running = next; if (running) kick(); else cancelAnimationFrame(raf); }
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? seen.add(e.target) : seen.delete(e.target);
      update();
    });
    io.observe(stageEl);
    if (stripEl) io.observe(stripEl);
    document.addEventListener('visibilitychange', update);
  }
  if (document.fonts?.ready) document.fonts.ready.then(() => { resize(); kick(); });
  kick();
}
