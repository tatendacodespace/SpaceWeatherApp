// ========== CONFIGURATION ========== //
const MOON_API = 'https://api.farmsense.net/v1/moonphases/?d=';
const NASA_DONKI_API = 'https://api.nasa.gov/DONKI/FLR?api_key=DEMO_KEY';
const NOAA_KP_API = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json';
const QUOTES = [
  "To confine our attention to terrestrial matters would be to limit the human spirit. – Stephen Hawking",
  "The Earth is the cradle of humanity, but mankind cannot stay in the cradle forever. – Konstantin Tsiolkovsky",
  "That's one small step for man, one giant leap for mankind. – Neil Armstrong",
  "Somewhere, something incredible is waiting to be known. – Carl Sagan",
  "Across the sea of space, the stars are other suns. – Carl Sagan"
];

// ========== UTILITY FUNCTIONS ========== //
/**
 * Get current UTC date in YYYY-MM-DD format
 */
function getUTCDate() {
  const now = new Date();
  return now.getUTCFullYear() + '-' + String(now.getUTCMonth()+1).padStart(2, '0') + '-' + String(now.getUTCDate()).padStart(2, '0');
}

/**
 * Fade in an element
 * @param {HTMLElement} el
 */
function fadeIn(el) {
  el.style.opacity = 0;
  el.style.transition = 'opacity 1s';
  setTimeout(() => { el.style.opacity = 1; }, 100);
}

// ========== MOON PHASE ========== //
/**
 * Fetch and display the current moon phase
 */
async function updateMoonPhase() {
  const date = getUTCDate();
  try {
    const res = await fetch(MOON_API + Date.now()/1000);
    const data = await res.json();
    const phase = data[0]?.Phase || 'Unknown';
    document.getElementById('moon-phase').textContent = phase;
    setMoonIcon(phase);
  } catch (e) {
    document.getElementById('moon-phase').textContent = 'Error fetching data';
  }
}

/**
 * Set moon icon based on phase
 * @param {string} phase
 */
function setMoonIcon(phase) {
  const icon = document.getElementById('moon-icon');
  // Simple SVGs for demo; replace with custom/animated SVGs for production
  const icons = {
    'New Moon': '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#222" stroke="#fff" stroke-width="2"/></svg>',
    'Waxing Crescent': '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#222" stroke="#fff" stroke-width="2"/><path d="M30 2 A28 28 0 0 1 30 58" fill="#fff"/></svg>',
    'First Quarter': '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#222" stroke="#fff" stroke-width="2"/><rect x="30" y="2" width="28" height="56" fill="#fff"/></svg>',
    'Waxing Gibbous': '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#222" stroke="#fff" stroke-width="2"/><ellipse cx="40" cy="30" rx="18" ry="28" fill="#fff"/></svg>',
    'Full Moon': '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#fff" stroke="#fff" stroke-width="2"/></svg>',
    'Waning Gibbous': '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#222" stroke="#fff" stroke-width="2"/><ellipse cx="20" cy="30" rx="18" ry="28" fill="#fff"/></svg>',
    'Last Quarter': '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#222" stroke="#fff" stroke-width="2"/><rect x="2" y="2" width="28" height="56" fill="#fff"/></svg>',
    'Waning Crescent': '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#222" stroke="#fff" stroke-width="2"/><path d="M30 58 A28 28 0 0 1 30 2" fill="#fff"/></svg>'
  };
  icon.innerHTML = icons[phase] || icons['New Moon'];
}

// ========== SOLAR ACTIVITY ========== //
/**
 * Fetch and display current solar flare activity
 */
async function updateSolarActivity() {
  try {
    const res = await fetch(NASA_DONKI_API);
    const data = await res.json();
    let flare = 'No recent flares';
    if (Array.isArray(data) && data.length > 0) {
      const latest = data[data.length-1];
      flare = `${latest.classType || 'Flare'} at ${latest.beginTime?.slice(0,10)}`;
    }
    document.getElementById('solar-activity').textContent = flare;
  } catch (e) {
    document.getElementById('solar-activity').textContent = 'Error fetching data';
  }
}

// ========== GEOMAGNETIC STORM ========== //
/**
 * Fetch and display current Kp index
 */
async function updateKpIndex() {
  try {
    const res = await fetch(NOAA_KP_API);
    const data = await res.json();
    const latest = data[data.length-1];
    const kp = latest.kp_index;
    const el = document.getElementById('kp-index');
    el.textContent = `Kp Index: ${kp}`;
    el.style.color = kp >= 5 ? 'var(--danger)' : 'var(--success)';
    el.style.fontWeight = kp >= 5 ? 'bold' : 'normal';
  } catch (e) {
    document.getElementById('kp-index').textContent = 'Error fetching data';
  }
}

// ========== LIVE TIME ========== //
/**
 * Update the live time in UTC
 */
function updateTime() {
  const now = new Date();
  document.getElementById('live-time').textContent = now.toUTCString().slice(17, 25) + ' UTC';
}

// ========== QUOTE OF THE DAY ========== //
/**
 * Display a random quote
 */
function updateQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('quote').textContent = quote;
}

// ========== THEME TOGGLER ========== //
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('neon');
});

// ========== AMBIENT AUDIO ========== //
const audio = document.getElementById('ambient-audio');
const audioBtn = document.getElementById('audio-toggle');
audioBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    audioBtn.textContent = '🔈';
  } else {
    audio.pause();
    audioBtn.textContent = '🔊';
  }
});

// ========== SHOOTING STARS ANIMATION (IMPROVED) ========== //
/**
 * Improved shooting star: angled, glowing, random length and speed
 */
function spawnShootingStar() {
  const star = document.createElement('div');
  star.className = 'shooting-star';
  // Randomize start position and length
  const left = Math.random() * window.innerWidth * 0.8;
  const top = Math.random() * window.innerHeight * 0.2;
  const length = 80 + Math.random() * 80;
  const duration = 900 + Math.random() * 700;
  star.style.left = left + 'px';
  star.style.top = top + 'px';
  star.style.width = length + 'px';
  star.style.animationDuration = duration + 'ms';
  document.body.appendChild(star);
  setTimeout(() => star.remove(), duration + 100);
}
setInterval(() => {
  if (Math.random() < 0.5) spawnShootingStar();
}, 1800);

// ========== FLOATING ASTEROIDS ========== //
function spawnAsteroid() {
  const asteroid = document.createElement('img');
  asteroid.src = 'assets/asteroid.svg';
  asteroid.className = 'asteroid';
  // Randomize start position and direction
  const side = Math.random() < 0.5 ? 'left' : 'right';
  const startY = Math.random() * window.innerHeight * 0.8 + 20;
  const duration = 9000 + Math.random() * 7000;
  const scale = 0.7 + Math.random() * 0.8;
  asteroid.style.top = `${startY}px`;
  asteroid.style.transform = `scale(${scale})`;
  if (side === 'left') {
    asteroid.style.left = '-40px';
    asteroid.style.animation = `floatAsteroid ${duration}ms linear forwards`;
    asteroid.animate([
      { left: '-40px', top: `${startY}px`, transform: `scale(${scale}) rotate(-10deg)` },
      { left: `${window.innerWidth + 40}px`, top: `${startY + (Math.random() * 80 - 40)}px`, transform: `scale(${scale}) rotate(30deg)` }
    ], { duration, fill: 'forwards' });
  } else {
    asteroid.style.left = `${window.innerWidth + 40}px`;
    asteroid.style.animation = `floatAsteroid ${duration}ms linear forwards`;
    asteroid.animate([
      { left: `${window.innerWidth + 40}px`, top: `${startY}px`, transform: `scale(${scale}) rotate(10deg)` },
      { left: '-40px', top: `${startY + (Math.random() * 80 - 40)}px`, transform: `scale(${scale}) rotate(-30deg)` }
    ], { duration, fill: 'forwards' });
  }
  document.body.appendChild(asteroid);
  setTimeout(() => asteroid.remove(), duration + 200);
}
setInterval(() => {
  if (Math.random() < 0.7) spawnAsteroid();
}, 3500);

// ========== CONSTELLATION MODE ========== //
const CONSTELLATIONS = [
  { name: 'Orion', file: 'assets/constellations/orion.svg' },
  { name: 'Ursa Major', file: 'assets/constellations/ursa_major.svg' },
  { name: 'Cassiopeia', file: 'assets/constellations/cassiopeia.svg' }
];
let currentConstellation = 0;

function showConstellationOverlay() {
  let overlay = document.querySelector('.constellation-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'constellation-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<img src="${CONSTELLATIONS[currentConstellation].file}" style="width:40vw;min-width:260px;max-width:600px;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:0.95;filter:drop-shadow(0 0 24px #fff8);" alt="${CONSTELLATIONS[currentConstellation].name} constellation" />`;
}

function toggleConstellationMode() {
  document.body.classList.toggle('constellation-mode');
  if (document.body.classList.contains('constellation-mode')) {
    showConstellationOverlay();
  } else {
    const overlay = document.querySelector('.constellation-overlay');
    if (overlay) overlay.remove();
  }
}

function nextConstellation() {
  currentConstellation = (currentConstellation + 1) % CONSTELLATIONS.length;
  showConstellationOverlay();
}

// ========== FINAL POLISH: BUTTON INIT AND ACCESSIBILITY ========== //
function addConstellationToggle() {
  let btn = document.querySelector('.constellation-toggle');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'constellation-toggle';
    btn.setAttribute('aria-label', 'Toggle constellation overlay');
    btn.innerHTML = '✨ Constellation';
    btn.onclick = () => {
      toggleConstellationMode();
      if (document.body.classList.contains('constellation-mode')) {
        btn.innerHTML = '🔄 Next Constellation';
        btn.onclick = nextConstellation;
      } else {
        btn.innerHTML = '✨ Constellation';
        btn.onclick = addConstellationToggle;
      }
    };
    document.body.appendChild(btn);
  }
}

// Ensure theme and audio buttons are always visible and accessible
function ensureButtonPlacement() {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.setAttribute('tabindex', '0');
    themeBtn.setAttribute('aria-label', 'Toggle theme');
    themeBtn.style.position = 'absolute';
    themeBtn.style.top = '2.2rem';
    themeBtn.style.right = '2.2rem';
    themeBtn.style.zIndex = 30;
  }
  const audioBtn = document.getElementById('audio-toggle');
  if (audioBtn) {
    audioBtn.setAttribute('tabindex', '0');
    audioBtn.setAttribute('aria-label', 'Toggle ambient sound');
    audioBtn.style.position = 'absolute';
    audioBtn.style.bottom = '1.5rem';
    audioBtn.style.right = '2.2rem';
    audioBtn.style.zIndex = 30;
  }
}
document.addEventListener('DOMContentLoaded', ensureButtonPlacement);

// ========== INIT ========== //
function init() {
  updateMoonPhase();
  updateSolarActivity();
  updateKpIndex();
  updateQuote();
  updateTime();
  setInterval(updateTime, 1000);
  // Refresh data every 10 minutes
  setInterval(() => {
    updateMoonPhase();
    updateSolarActivity();
    updateKpIndex();
  }, 600000);
}

document.addEventListener('DOMContentLoaded', init);
