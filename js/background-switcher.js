
// Simplified Background Switcher - 4 backgrounds, randomly loaded on init
// Code refactored by Claude.ai

const buttons = {
  1: document.querySelector('#bg_switcher_button1 img'),
  2: document.querySelector('#bg_switcher_button2 img'),
  3: document.querySelector('#bg_switcher_button3 img'),
  4: document.querySelector('#bg_switcher_button4 img')
};

// Your 4 best backgrounds - one per button
const backgrounds = {
  1: {
    title: "Beacon Rock State Park<br>Columbia River Gorge, Washington",
    image: "beacon-rock.jpg"
  },
  2: {
    title: "Fort Rock State Natural Area<br>Lake County, Oregon",
    image: "fort-rock.jpg"
  },
  3: {
    title: "No Name Lake and Bend Glacier<br>Three Sisters Wilderness, Central Oregon",
    image: "no-name-lake-bg.jpg"
  },
  4: {
    title: "Lewiston Highway/Oregon Route 3<br>Paradise, Oregon",
    image: "lewiston-hwy-oregon.jpg"
  }
};

const BASE_URL = "https://www.roadtripsandhikes.org/images/";
const ACTIVE_IMG = "https://www.roadtripsandhikes.org/images/active.png";
const INACTIVE_IMG = "https://www.roadtripsandhikes.org/images/inactive.png";

// Track current background
let currentBgId = null;

// Initialize: randomly pick one background on page load
function initializeBackground() {
  // Pick random background (1-4)
  const isMobile = window.matchMedia('(max-width: 414px)').matches;
  const randomBgId = isMobile ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 4) + 1;

  // Set it without animation (page load)
  const bgConfig = backgrounds[randomBgId];
  const imageUrl = `url(${BASE_URL}${bgConfig.image})`;

  document.getElementById('backgroundFixed').style.backgroundImage = imageUrl;
  document.getElementById('hero_title_card').innerHTML = bgConfig.title;

  // Set active button
  updateButtons(randomBgId);
  currentBgId = randomBgId;
}

// Change background with smooth crossfade
function changeBackgroundImageCrossfade(bgId) {
  // Don't do anything if clicking current background
  if (bgId === currentBgId) return;

  const bgConfig = backgrounds[bgId];
  if (!bgConfig) return;

  // Update title immediately
  document.getElementById('hero_title_card').innerHTML = bgConfig.title;

  const newImageUrl = `url(${BASE_URL}${bgConfig.image})`;
  const backgroundFixed = document.getElementById('backgroundFixed');

  // Create overlay for smooth transition
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.backgroundImage = newImageUrl;
  overlay.style.backgroundSize = 'cover';
  overlay.style.backgroundPosition = 'center';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.6s ease-in-out';
  overlay.style.zIndex = '1';

  backgroundFixed.style.position = 'fixed';
  backgroundFixed.appendChild(overlay);

  // Trigger fade-in
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 10);

  // After fade completes, swap images and remove overlay
  setTimeout(() => {
    backgroundFixed.style.backgroundImage = newImageUrl;
    backgroundFixed.removeChild(overlay);
  }, 650);

  // Update buttons
  updateButtons(bgId);
  currentBgId = bgId;
}

// Update button states
function updateButtons(activeBgId) {
  Object.entries(buttons).forEach(([id, img]) => {
    img.src = Number(id) === activeBgId ? ACTIVE_IMG : INACTIVE_IMG;
  });
}

// Run on page load
initializeBackground();
