/* ====== EDIT HERE ====== */
const PASSWORD = "jerine";

const MESSAGE = [
	{ t: "Dear Ma'am Roan," },
	{ t: "Thank you po for being a great Prof to us po. Marami po akong natutunan sa inyo — hindi lang sa klase ninyo, kundi pati na rin sa kung sino ka po talaga, at pati sa buhay mismo." },
	{ t: "Sa klase mo po, na-eenjoy ko yung mga tinuturo mo po dahil sa galing mo pong magturo, mas madali ko pong naiintindihan bawat lesson po natin. Pangako po na babaunin ko to sa susunod na mga taon at pati narin kapag nagkatrabaho na ako." },
	{ t: "Para sa akin, lalong napadali ang subject na ITWS dahil sa way ng pagtuturo mo po. Noong mga unang linggo ng klase natin, akala ko po talaga masungit at super strict ka po dahil yun narinig ko sa iba. Pero ang totoo pala ay sobrang bait mo po, lagi mo lang po sinasabi na masungit ka pero ang lagi ko po nakikita sa inyo ay kung gaano ka ka-joy sa bawat klase, kalmado lang po ang presensya niyo kaya siguro nung na-meet ka po namin ay gumaan na rin ang pakiramdam ko. Nabawasan takot ko, pero nandon pa rin naman dahil natatakot pa rin po ako kapag nagagalit ka. Naiintindihan ko naman po sa tuwing nagagalit ka ay dahil lang din po sa amin. Pasensya na po Ma'am." },
	{ t: "Higit pa po sa natutunan ko sa klase at sa kung sino ka po. Isa po po ang na-inspire akong yumaman dahil sa mga kwento ninyo na kapag nagbibiro ka po about sa kung gaano ka na po ka-financial stable. Dahil po doon, mas ginaganahan akong magsipag, mangarap nang malaki, at balang araw, maabot ko rin ang mga pangarap na hindi na rin mamroblema pinansyal. At sana kapag naabot ko po yon ay magkita tayo para ipaalala sa iyo na isa ka po sa nagbigay ng motivation sa akin para magsikap at mangarap pa ng malaki." },
	{ t: "Salamat po sa tiyaga, sa mga payo, at sa mga aral na dadalhin ko habang buhay. Sana marami pa pong students ang matuto sa inyo tulad ng sa akin na 'di lang natututo sa klase kundi pati na rin sa buhay." },
	{ t: "Maraming, maraming salamat po, Ma'am Roan! Love you po! 🤍" },
	{ t: "Gumagalang,<br>Jerine 2D", cls: "sign" },
	{ t: "P.S. Pinakamabait na student sa 2D po ako, wag po sanang makalimutan (hahaha char) 😌", cls: "ps" }
];

// The game reveals one word of this hint per star caught (5 stars = 5 words)
const HINT_WORDS = [
	"Ang", "pinaka", "mabait", "sa", "2D 😇"
];
const HINT_END = 
	"<br><small>(yes, siya nga. walang duda.)</small>";

const WRONG = [
	"Oh no, that's wrong. 😭",
	"The answer is the kindest one, not the loudest 😌",
	"Think of the student who's seating at the front row ✨",
	"Ako po 'to Ma'am, si Jerine ang pinaka-mabait po sa 2D🥺"
];
const EXTRA_HINT = 
	"Okay fine: 6 letters, starts with “J” 😇";
/* ======================= */

// cartoon canary (own drawing). held = carrying the letter in its beak
const BIRD = (held) => `<svg viewBox="0 0 200 220" aria-hidden="true">
<path d="M92 36C86 16 80 10 76 2M100 34C100 16 104 8 110 0M108 36C116 22 124 18 132 16" fill="none" stroke="#1b1b1b" stroke-width="4" stroke-linecap="round"/>
<path d="M92 204v12m-6 0h14M114 204v12m-6 0h14" stroke="#ff8a00" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="104" cy="166" rx="38" ry="40" fill="#ffe21f" stroke="#1b1b1b" stroke-width="4"/>
<ellipse cx="100" cy="96" rx="72" ry="62" fill="#ffe21f" stroke="#1b1b1b" stroke-width="4"/>
<circle class="cheek" cx="56" cy="118" r="10" fill="#ff9db8" opacity=".7"/><circle class="cheek" cx="146" cy="118" r="10" fill="#ff9db8" opacity=".7"/>
<g class="eyes"><ellipse cx="76" cy="90" rx="19" ry="27" fill="#fff" stroke="#1b1b1b" stroke-width="3.5"/><ellipse cx="124" cy="90" rx="19" ry="27" fill="#fff" stroke="#1b1b1b" stroke-width="3.5"/>
<ellipse cx="80" cy="95" rx="11" ry="17" fill="#2f86f0"/><ellipse cx="120" cy="95" rx="11" ry="17" fill="#2f86f0"/>
<ellipse cx="81" cy="97" rx="5" ry="9" fill="#111"/><ellipse cx="119" cy="97" rx="5" ry="9" fill="#111"/>
<circle cx="84" cy="88" r="3.5" fill="#fff"/><circle cx="122" cy="88" r="3.5" fill="#fff"/></g>
<g class="brows"><path d="M52 58L98 84M148 58L102 84" stroke="#1b1b1b" stroke-width="7" stroke-linecap="round"/></g>
<path d="M90 120Q100 112 112 120Q110 134 100 136Q90 134 90 120Z" fill="#ff9a1f" stroke="#1b1b1b" stroke-width="3.5" stroke-linejoin="round"/>
${held ? `<g id="held" transform="rotate(14 120 150)"><rect x="98" y="134" width="50" height="34" rx="3" fill="#ffb3c7" stroke="#1b1b1b" stroke-width="3.5"/><path d="M98 134L123 154L148 134" fill="none" stroke="#1b1b1b" stroke-width="3"/><circle cx="123" cy="154" r="5" fill="#e0243c" stroke="#1b1b1b" stroke-width="2"/></g>` : ""}
<path class="wing" d="M70 156C38 146 24 176 34 198C54 194 68 186 78 176Z" fill="#ffd21a" stroke="#1b1b1b" stroke-width="4" stroke-linejoin="round"/></svg>`;
document.querySelectorAll("[data-bird]").forEach((el) => (el.innerHTML = BIRD(el.dataset.bird === "held")));

const $ = (id) => document.getElementById(id);
const gate = $("gate"), scene = $("scene"), bird = $("bird"), env = $("envelope"), arena = $("arena");
let tries = 0, opened = false, busy = false, caught = 0;

/* ---------- hint + star-catching game ---------- */
const SUNFLOWER_CHANCE = 0.25;   // amount of 🌻 to avoid (0 = none)
const pal = arena.querySelector(".pal"), note = $("note");
let items = [], raf = 0, last = 0, spawnT = 0, palX = 0, target = 0, playing = false, madT = 0;
const keys = {};

function renderHint(n) {
  $("hint").innerHTML = n >= HINT_WORDS.length
    ? "Hint: " + HINT_WORDS.map((w) => (w === "kindest" ? `<b>${w}</b>` : w)).join(" ") + HINT_END
    : "Hint: " + HINT_WORDS.map((w, i) => (i < n ? `<b>${w}</b>` : `<span class="q">???</span>`)).join(" ");
}
renderHint(0);

$("hintBtn").addEventListener("click", () => {
	caught = 0; $("count").textContent = "0/" + HINT_WORDS.length; renderHint(0);
	items.forEach((i) => i.el.remove()); items = [];
	$("form").hidden = true; $("hintBtn").hidden = true; $("game").hidden = false; $("err").textContent = "";
	palX = target = arena.clientWidth / 2; pal.style.left = palX + "px";
	playing = true; spawnT = 0.3; last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
});
function stopGame() { playing = false; cancelAnimationFrame(raf); }

// controls: drag / move pointer in the arena, or arrow keys
const aim = (e) => { target = e.clientX - arena.getBoundingClientRect().left; };
arena.addEventListener("pointermove", (e) => playing && aim(e));
arena.addEventListener("pointerdown", (e) => playing && aim(e));
addEventListener("keydown", (e) => { if (playing && e.key.startsWith("Arrow")) { keys[e.key] = true; e.preventDefault(); } });
addEventListener("keyup", (e) => { keys[e.key] = false; });

function spawn() {
	const star = Math.random() >= SUNFLOWER_CHANCE;
	const el = document.createElement("div");
	el.className = "item"; el.innerHTML = `<span class="${star ? "spin" : ""}">${star ? "⭐" : "🌻"}</span>`;
	arena.appendChild(el);
	items.push({ el, star, x: 26 + Math.random() * (arena.clientWidth - 52), y: -36 });
}
function mad(msg) {
	sfx("bad");
	pal.classList.add("mad"); note.textContent = msg; note.classList.add("show");
	clearTimeout(madT); madT = setTimeout(() => { pal.classList.remove("mad"); note.classList.remove("show"); }, 1300);
}
function gotStar() {
	sfx("star"); renderHint(++caught); $("count").textContent = caught + "/" + HINT_WORDS.length;
	arena.classList.remove("hop"); void arena.offsetWidth; arena.classList.add("hop");
	if (caught < HINT_WORDS.length) return;
	stopGame(); $("count").textContent = "Yey! 🎉";
	setTimeout(() => {
		$("game").hidden = true; $("form").hidden = false; $("pw").focus();
		items.forEach((i) => i.el.remove()); items = []; pal.classList.remove("mad");
	}, 1100);
}
function tick(now) {
	if (!playing) return;
	const dt = Math.min(0.05, (now - last) / 1000); last = now;
	const w = arena.clientWidth, h = arena.clientHeight;
	if (keys.ArrowLeft) target -= 300 * dt;
	if (keys.ArrowRight) target += 300 * dt;
	target = Math.max(37, Math.min(w - 37, target));
	const prev = palX; palX += (target - palX) * Math.min(1, dt * 12);
	pal.style.left = palX + "px";
	pal.firstChild.style.transform = `rotate(${Math.max(-14, Math.min(14, ((palX - prev) / dt) * 0.02))}deg)`;
	spawnT -= dt;
	if (spawnT <= 0 && items.length < 4) { spawn(); spawnT = 1.1; }
	for (const it of [...items]) {
		it.y += 85 * dt;
		it.el.style.transform = `translate(${it.x - 18}px,${it.y}px)`;
		const gone = () => { items.splice(items.indexOf(it), 1); it.el.remove(); };
		if (it.y > h - 100 && it.y < h - 24 && Math.abs(it.x - palX) < 50) { gone(); it.star ? gotStar() : mad("I don't like sunflowers! 😤"); }
			else if (it.y > h - 6) { gone(); if (it.star) mad("Hmph! You missed the star! 😠"); }
	}
  if (playing) raf = requestAnimationFrame(tick);
}

/* ---------- password ---------- */
$("form").addEventListener("submit", (e) => {
	e.preventDefault();
	if ($("pw").value.trim().toLowerCase() === PASSWORD) return unlock();
	$("err").textContent = WRONG[tries % WRONG.length];
	if (++tries === 3) $("err").insertAdjacentHTML("afterend", `<p class="hint"><strong>${EXTRA_HINT}</strong></p>`);
	gate.classList.remove("shake"); void gate.offsetWidth; gate.classList.add("shake");
	$("pw").select();
});

function unlock() {
	stopGame(); sfx("win"); gate.classList.add("leave");
	setTimeout(() => {
		gate.hidden = true; scene.hidden = false; spawnMotes();
		setTimeout(() => bird.classList.add("dropped"), 1500);
		setTimeout(() => { env.classList.add("ready"); $("tap").classList.add("show"); }, 2800);
		setTimeout(() => { bird.classList.add("perched"); $("bubble").classList.add("show"); }, 4400);
		setTimeout(() => $("bubble").classList.remove("show"), 8500);
	}, 650);
}

/* ---------- envelope + letter ---------- */
function openEnvelope() {
	if (!env.classList.contains("ready") || busy) return;
	if (opened) return showLetter();
	busy = true; $("tap").classList.remove("show"); env.classList.add("open");
	setTimeout(() => env.classList.add("pull"), 800);
	setTimeout(() => { opened = true; busy = false; showLetter(); }, 1900);
}
env.addEventListener("click", openEnvelope);
env.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); } });

function showLetter() {
	const body = $("body"); body.innerHTML = "";
	MESSAGE.forEach((m, i) => {
		const p = document.createElement("p");
		p.className = "line " + (m.cls || ""); p.innerHTML = m.t;
		p.style.animationDelay = 0.8 + i * 0.8 + "s"; body.appendChild(p);
	});
	if (!window.__c) { window.__c = 1; confetti(); sfx("win"); }
	$("letterWrap").hidden = false; $("paper").scrollTop = 0;
}
$("close").addEventListener("click", () => { $("letterWrap").hidden = true; });
addEventListener("keydown", (e) => { if (e.key === "Escape") $("letterWrap").hidden = true; });

function spawnMotes() {
	for (let i = 0; i < 14; i++) {
		const m = document.createElement("span"), s = 3 + Math.random() * 5;
		m.className = "mote";
		m.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 12}s`;
		scene.appendChild(m);
  }
}

/* ---------- 🎵 music + sound effects (synthesized, no files needed) ---------- */
const MUSIC_ON_KEY = "ecard-music";
let ac, master, musicOn = true, musicStarted = false, nextT = 0, step = 0, timer = 0;
const EIGHTH = 0.3;
const MEL = [
	[76,79,76,72,76,79,84,79],
	[69,72,76,72,69,72,76,0],
	[77,81,77,72,77,81,84,81],
	[74,79,83,79,74,79,83,0],
	[84,83,84,79,76,79,84,0],
	[81,79,81,76,72,76,81,0],
	[77,79,81,84,81,77,74,72],
	[71,74,79,83,79,74,71,67]
];
const BASS = [[48,55],[45,52],[41,48],[43,50]];
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
function tone(m, t, dur, type, vol) {
	const o = ac.createOscillator(), g = ac.createGain();
	o.type = type; o.frequency.value = hz(m);
	g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
	g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
	o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
function schedule() {
	while (nextT < ac.currentTime + 0.6) {
		const bar = Math.floor(step / 8) % 8, i = step % 8, m = MEL[bar][i], b = BASS[bar % 4];
		if (m) tone(m, nextT, 0.9, "triangle", 0.16);
		if (i % 4 === 0) tone(b[0], nextT, 1.1, "sine", 0.2);
		if (i === 2 || i === 6) tone(b[1] + 12, nextT, 0.5, "sine", 0.07);
		nextT += EIGHTH; step++;
  }
}
function startMusic() {
	if (musicStarted) { if (ac.state === "suspended") ac.resume(); return; }
	try {
		ac = new (window.AudioContext || window.webkitAudioContext)();
		master = ac.createGain(); master.gain.value = musicOn ? 1 : 0; master.connect(ac.destination);
		musicStarted = true; nextT = ac.currentTime + 0.1; timer = setInterval(schedule, 150); schedule();
	} 
		catch (e) { /* audio not supported */ }
}
function sfx(kind) {
	if (!ac || !musicOn) return; const t = ac.currentTime;
	const seq = { star: [88, 93], bad: [52, 47], win: [72, 76, 79, 84, 88] }[kind] || [];
	seq.forEach((m, k) => tone(m, t + k * (kind === "win" ? 0.09 : 0.07), 0.35, kind === "bad" ? "square" : "triangle", kind === "bad" ? 0.08 : 0.2));
}
const mbtn = document.createElement("button");
mbtn.className = "btn musicbtn"; mbtn.type = "button"; mbtn.textContent = "🎵"; mbtn.setAttribute("aria-label", "Music on/off");
document.querySelector("main").appendChild(mbtn);
mbtn.addEventListener("click", (e) => {
	e.stopPropagation(); startMusic(); musicOn = !musicOn;
	if (master) master.gain.setTargetAtTime(musicOn ? 1 : 0, ac.currentTime, 0.1);
	mbtn.textContent = musicOn ? "🎵" : "🔇";
});
addEventListener("pointerdown", startMusic);
addEventListener("keydown", startMusic);

/* ---------- ✨ tap sparkles + confetti ---------- */
addEventListener("pointerdown", (e) => {
	const s = document.createElement("span"); s.className = "pop"; s.textContent = ["✨", "💛", "⭐", "🌸"][Math.floor(Math.random() * 4)];
	s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px"; document.body.appendChild(s);
	setTimeout(() => s.remove(), 900);
});
function confetti() {
	const em = ["🎉", "💛", "⭐", "🌸", "✨", "🐤", "🎈", "🤍"];
	for (let i = 0; i < 46; i++) {
    const c = document.createElement("span"); c.className = "confetti"; c.textContent = em[i % em.length];
    c.style.cssText = `left:${Math.random() * 100}%;font-size:${16 + Math.random() * 18}px;animation-duration:${2.8 + Math.random() * 2.4}s;animation-delay:${Math.random() * 0.9}s`;
    document.body.appendChild(c); setTimeout(() => c.remove(), 6500);
  }
}
