"use strict";

const CATEGORIES = [
  "Bible Trivia",
  "Scripture Scramble",
  "Sword Drill",
  "Name That Verse"
];

const COLORS = ["#FF1744", "#FFD000", "#168BFF", "#00C853"];
const ROUND_SECONDS = 26;

// Edit or add questions here. Keep question text paraphrased;
// references and source links let players look up the passage.
const QUESTIONS = [
  {
    category: "Bible Trivia", difficulty: "Easy",
    question: "Who built an ark to survive the great flood?",
    answer: "Noah.",
    reference: "Genesis 6–9",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Genesis%206-9&version=NIV"
  },
  {
    category: "Bible Trivia", difficulty: "Medium",
    question: "Which young shepherd defeated Goliath with a sling?",
    answer: "David.",
    reference: "1 Samuel 17",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=1%20Samuel%2017&version=NIV"
  },
  {
    category: "Bible Trivia", difficulty: "Hard",
    question: "Which judge made a vow involving the first thing to come out of his house?",
    answer: "Jephthah.",
    reference: "Judges 11:30–40",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Judges%2011%3A30-40&version=NIV"
  },
  {
    category: "Scripture Scramble", difficulty: "Easy",
    question: "PEOPLE: Unscramble this Bible name: HANO.",
    answer: "Noah.",
    reference: "Genesis 6–9",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Genesis%206-9&version=NIV"
  },
  {
    category: "Scripture Scramble", difficulty: "Medium",
    question: "PLACES: Unscramble this Bible place: HETBHELEB.",
    answer: "Bethlehem.",
    reference: "Luke 2:4–7",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Luke%202%3A4-7&version=NIV"
  },
  {
    category: "Scripture Scramble", difficulty: "Hard",
    question: "EVENTS: Unscramble the event: HET RDEASURTIRNO.",
    answer: "The resurrection.",
    reference: "Luke 24:1–8",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Luke%2024%3A1-8&version=NIV"
  },
  {
    category: "Scripture Scramble", difficulty: "Easy",
    question: "THINGS: Unscramble this Bible object: KRA.",
    answer: "Ark.",
    reference: "Genesis 6:14",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Genesis%206%3A14&version=NIV"
  },
  {
    category: "Sword Drill", difficulty: "Easy",
    question: "Find Psalm 23:1. What does the verse say the Lord is?",
    answer: "The shepherd.",
    reference: "Psalm 23:1",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Psalm%2023%3A1&version=NIV"
  },
  {
    category: "Sword Drill", difficulty: "Medium",
    question: "Find Matthew 5:9. What are the people who make peace called?",
    answer: "Children of God (wording varies by translation).",
    reference: "Matthew 5:9",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Matthew%205%3A9&version=NIV"
  },
  {
    category: "Sword Drill", difficulty: "Hard",
    question: "Find Micah 6:8. Name one of the three things God requires.",
    answer: "Act justly, love mercy, or walk humbly with God.",
    reference: "Micah 6:8",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Micah%206%3A8&version=NIV"
  },
  {
    category: "Name That Verse", difficulty: "Easy",
    question: "Which verse is often called the shortest verse in many English Bible translations? (Clue: Jesus wept.)",
    answer: "John 11:35.",
    reference: "John 11:35",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=John%2011%3A35&version=NIV"
  },
  {
    category: "Name That Verse", difficulty: "Medium",
    question: "Which verse says that love is patient and kind?",
    answer: "1 Corinthians 13:4.",
    reference: "1 Corinthians 13:4",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=1%20Corinthians%2013%3A4&version=NIV"
  },
  {
    category: "Name That Verse", difficulty: "Hard",
    question: "Which verse describes God's word as a lamp for our feet and a light on our path?",
    answer: "Psalm 119:105.",
    reference: "Psalm 119:105",
    source: "BibleGateway",
    url: "https://www.biblegateway.com/passage/?search=Psalm%20119%3A105&version=NIV"
  }
];

const canvas = document.querySelector("#wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.querySelector("#spinButton");
const revealButton = document.querySelector("#revealButton");
const correctButton = document.querySelector("#correctButton");
const nextButton = document.querySelector("#nextButton");
const timerDisplay = document.querySelector("#timer");
const categoryBadge = document.querySelector("#categoryBadge");
const roundContent = document.querySelector("#roundContent");
const answerBox = document.querySelector("#answerBox");
const teamsElement = document.querySelector("#teams");
const teamCountSelect = document.querySelector("#teamCount");
const countdownOverlay = document.querySelector("#countdownOverlay");
const countdownNumber = document.querySelector("#countdownNumber");
const wheelHint = document.querySelector("#wheelHint");

let rotation = 0;
let spinning = false;
let timerId = null;
let timeLeft = ROUND_SECONDS;
let currentQuestion = null;
let activeTeam = 0;
let roundOpen = false;
let lastQuestionIndex = -1;
let teams = [];

function fitCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawWheel();
}

function drawWheel() {
  const rect = canvas.getBoundingClientRect();
  const size = rect.width;
  if (!size) return;

  const center = size / 2;
  const radius = size * 0.47;
  const slice = (Math.PI * 2) / CATEGORIES.length;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  CATEGORIES.forEach((category, index) => {
    const start = -Math.PI / 2 + index * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = COLORS[index];
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(3, size * 0.009);
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + slice / 2);

    const fontSize = Math.max(12, Math.min(18, size * 0.035));
    const lines = {
      "Bible Trivia": ["Bible", "Trivia"],
      "Scripture Scramble": ["Scripture", "Scramble"],
      "Sword Drill": ["Sword", "Drill"],
      "Name That Verse": ["Name That", "Verse"]
    }[category] || [category];

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#20264a";
    ctx.font = `800 ${fontSize}px system-ui, sans-serif`;

    const textX = radius * 0.60;
    const lineGap = fontSize * 1.2;

    lines.forEach((line, lineIndex) => {
      const y = (lineIndex - (lines.length - 1) / 2) * lineGap;
      ctx.fillText(line, textX, y, radius * 0.58);
    });

    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.13, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#20264a";
  ctx.stroke();
  ctx.restore();
}

function renderTeams() {
  const count = Number(teamCountSelect.value);
  teams = Array.from({ length: count }, (_, i) => teams[i] || {
    name: `Team ${i + 1}`,
    score: 0
  });
  activeTeam = Math.min(activeTeam, count - 1);

  teamsElement.innerHTML = "";
  teams.forEach((team, index) => {
    const card = document.createElement("div");
    card.className = `team-card${index === activeTeam ? " active" : ""}`;
    card.innerHTML = `
      <input class="team-name" aria-label="Team ${index + 1} name"
        maxlength="18" value="${escapeHtml(team.name)}">
      <span class="team-score" aria-label="${team.score} points">${team.score}</span>
    `;
    const nameInput = card.querySelector("input");

    card.addEventListener("click", event => {
      if (event.target === nameInput) return;

      activeTeam = index;
      teamsElement.querySelectorAll(".team-card").forEach((teamCard, i) => {
        teamCard.classList.toggle("active", i === activeTeam);
      });
    });

    nameInput.addEventListener("focus", () => {
      activeTeam = index;
      teamsElement.querySelectorAll(".team-card").forEach((teamCard, i) => {
        teamCard.classList.toggle("active", i === activeTeam);
      });
    });

    nameInput.addEventListener("input", event => {
      teams[index].name = event.target.value;
    });

    teamsElement.append(card);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[char]);
}

function chooseQuestion(category) {
  let pool = QUESTIONS.filter(item => item.category === category);
  if (!pool.length) pool = QUESTIONS;

  let index;
  do {
    index = Math.floor(Math.random() * pool.length);
  } while (pool.length > 1 && index === lastQuestionIndex);

  lastQuestionIndex = index;
  return pool[index];
}

function spinWheel() {
  if (spinning || roundOpen) return;
  spinning = true;
  spinButton.disabled = true;
  wheelHint.textContent = "Spinning…";

  const startRotation = rotation;
  const extraTurns = 5 + Math.random() * 3;
  const targetRotation = startRotation + extraTurns * Math.PI * 2 + Math.random() * Math.PI * 2;
  const duration = 4200;
  const startTime = performance.now();

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    rotation = startRotation + (targetRotation - startRotation) * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    rotation %= Math.PI * 2;
    spinning = false;
    const categoryIndex = getSelectedCategory();
    const category = CATEGORIES[categoryIndex];
    currentQuestion = chooseQuestion(category);
    wheelHint.textContent = `${category} selected!`;
    runCountdown();
  }

  requestAnimationFrame(animate);
}

function getSelectedCategory() {
  const slice = (Math.PI * 2) / CATEGORIES.length;
  const normalized = ((-rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return Math.floor(normalized / slice) % CATEGORIES.length;
}

function runCountdown() {
  countdownOverlay.hidden = false;
  let count = 3;
  countdownNumber.textContent = count;

  const tick = () => {
    if (count > 1) {
      count -= 1;
      countdownNumber.textContent = count;
      setTimeout(tick, 750);
    } else {
      countdownNumber.textContent = "GO!";
      setTimeout(() => {
        countdownOverlay.hidden = true;
        showQuestion();
      }, 550);
    }
  };

  setTimeout(tick, 750);
}

function showQuestion() {
  roundOpen = true;
  timeLeft = ROUND_SECONDS;
  categoryBadge.textContent = currentQuestion.category;
  timerDisplay.textContent = timeLeft;
  timerDisplay.classList.remove("low");
  answerBox.hidden = true;
  answerBox.textContent = "";

  const showReference = currentQuestion.category !== "Name That Verse";

  const referenceLine = showReference
    ? `<p class="source-line">
         Reference: <strong>${escapeHtml(currentQuestion.reference)}</strong>
         · Source:
         <a href="${escapeHtml(currentQuestion.url)}" target="_blank" rel="noopener noreferrer">
           ${escapeHtml(currentQuestion.source)}
         </a>
       </p>`
    : "";

  roundContent.innerHTML = `
    <h1>${escapeHtml(currentQuestion.question)}</h1>
    <div class="question-meta">
      <span class="meta-chip">${escapeHtml(currentQuestion.difficulty)} difficulty</span>
      <span class="meta-chip">Team: ${escapeHtml(teams[activeTeam].name || `Team ${activeTeam + 1}`)}</span>
    </div>
    ${referenceLine}
  `;

  revealButton.disabled = false;
  correctButton.disabled = false;
  nextButton.disabled = true;
  spinButton.disabled = true;
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = Math.max(timeLeft, 0);
    timerDisplay.setAttribute("aria-label", `${Math.max(timeLeft, 0)} seconds remaining`);
    if (timeLeft <= 5) timerDisplay.classList.add("low");
    if (timeLeft <= 0) {
      clearInterval(timerId);
      wheelHint.textContent = "Time’s up! Reveal the answer or start the next round.";
      finishRound();
    }
  }, 1000);
}

function revealAnswer() {
  if (!currentQuestion) return;

  answerBox.innerHTML = `
    <strong>Answer</strong>
    ${escapeHtml(currentQuestion.answer)}
    <p class="source-line">
      Reference: <strong>${escapeHtml(currentQuestion.reference)}</strong>
      · Source:
      <a href="${escapeHtml(currentQuestion.url)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(currentQuestion.source)}
      </a>
    </p>
  `;
  answerBox.hidden = false;
  finishRound();
}


function finishRound() {
  clearInterval(timerId);
  revealButton.disabled = false;
  correctButton.disabled = false;
  nextButton.disabled = false;
}

function awardPoint() {
  if (!currentQuestion) return;
  teams[activeTeam].score += 1;
  renderTeams();
  finishRound();
  correctButton.disabled = true;
  wheelHint.textContent = `Point awarded to ${teams[activeTeam].name || `Team ${activeTeam + 1}`}!`;
}

function nextRound() {
  clearInterval(timerId);
  currentQuestion = null;
  roundOpen = false;
  timeLeft = ROUND_SECONDS;
  timerDisplay.textContent = timeLeft;
  timerDisplay.classList.remove("low");
  categoryBadge.textContent = "Your next challenge";
  answerBox.hidden = true;
  roundContent.innerHTML = `
    <div class="welcome-icon" aria-hidden="true">✨</div>
    <h1>Next round!</h1>
    <p>Select the team that will play, then spin the wheel.</p>
  `;
  revealButton.disabled = true;
  correctButton.disabled = true;
  nextButton.disabled = true;
  spinButton.disabled = false;
  wheelHint.textContent = "Ready when you are!";
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    wheelHint.textContent = "Fullscreen isn’t available in this browser.";
  }
}

document.querySelector("#tvModeButton").addEventListener("click", event => {
  const enabled = document.body.classList.toggle("tv-mode");
  event.currentTarget.setAttribute("aria-pressed", String(enabled));
  event.currentTarget.textContent = enabled ? "📺 Exit TV mode" : "📺 TV mode";
});

document.querySelector("#fullscreenButton").addEventListener("click", toggleFullscreen);
teamCountSelect.addEventListener("change", renderTeams);
spinButton.addEventListener("click", spinWheel);
revealButton.addEventListener("click", revealAnswer);
correctButton.addEventListener("click", awardPoint);
nextButton.addEventListener("click", nextRound);
window.addEventListener("resize", fitCanvas);

renderTeams();
fitCanvas();
