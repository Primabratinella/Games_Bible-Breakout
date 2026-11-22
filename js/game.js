"use strict";

const STORAGE_KEY = "breakoutBibleGameState";
const ROUND_SECONDS = 26;

const categories = [
  { id: "trivia", label: "Bible Trivia", color: "#FF1744" },
  { id: "scramble", label: "Scripture Scramble", color: "#FFD000" },
  { id: "sword", label: "Sword Drill", color: "#168BFF" },
  { id: "verse", label: "Name That Verse", color: "#00C853" }
];

const questions = [
  {
    id: "t1", category: "trivia", type: "Bible Trivia",
    question: "Who built an ark because God said a great flood was coming?",
    answer: "Noah.",
    reference: "Genesis 6:13–22",
    source: "BibleGateway"
  },
  {
    id: "t2", category: "trivia", type: "Bible Trivia",
    question: "Which young shepherd defeated the giant Goliath?",
    answer: "David.",
    reference: "1 Samuel 17:41–50",
    source: "BibleGateway"
  },
  {
    id: "t3", category: "trivia", type: "Bible Trivia",
    question: "What was the name of Jesus’ mother?",
    answer: "Mary.",
    reference: "Luke 1:26–31",
    source: "BibleGateway"
  },
  {
    id: "t4", category: "trivia", type: "Bible Trivia",
    question: "Who was swallowed by a great fish?",
    answer: "Jonah.",
    reference: "Jonah 1:17",
    source: "BibleGateway"
  },
  {
    id: "t5", category: "trivia", type: "Bible Trivia",
    question: "How many days and nights did Jesus fast in the wilderness?",
    answer: "Forty days and forty nights.",
    reference: "Matthew 4:1–2",
    source: "BibleGateway"
  },
  {
    id: "t6", category: "trivia", type: "Bible Trivia",
    question: "What did Jesus use to feed five thousand men?",
    answer: "Five loaves of bread and two fish.",
    reference: "John 6:8–13",
    source: "BibleGateway"
  },
  {
    id: "s1", category: "scramble", type: "Scripture Scramble — People",
    question: "Unscramble this Bible person: H A R A S.",
    answer: "Sarah.",
    reference: "Genesis 17:15",
    source: "BibleGateway"
  },
  {
    id: "s2", category: "scramble", type: "Scripture Scramble — People",
    question: "Unscramble this Bible person: S E M O S.",
    answer: "Moses.",
    reference: "Exodus 2:10",
    source: "BibleGateway"
  },
  {
    id: "s3", category: "scramble", type: "Scripture Scramble — Places",
    question: "Unscramble this Bible place: H E B T L E H E M.",
    answer: "Bethlehem.",
    reference: "Matthew 2:1",
    source: "BibleGateway"
  },
  {
    id: "s4", category: "scramble", type: "Scripture Scramble — Places",
    question: "Unscramble this Bible place: H E J O R I C.",
    answer: "Jericho.",
    reference: "Joshua 6:1–20",
    source: "BibleGateway"
  },
  {
    id: "s5", category: "scramble", type: "Scripture Scramble — Events",
    question: "Unscramble this Bible event: S U S E J S R I B E S.",
    answer: "Jesus rises (the resurrection).",
    reference: "Luke 24:1–7",
    source: "BibleGateway"
  },
  {
    id: "s6", category: "scramble", type: "Scripture Scramble — Things",
    question: "Unscramble this Bible object: K R A.",
    answer: "Ark.",
    reference: "Genesis 6:14",
    source: "BibleGateway"
  },
  {
    id: "d1", category: "sword", type: "Sword Drill",
    question: "Find Philippians 4:13. What does Paul say he can do through Christ?",
    answer: "Paul says he can do all things through Christ who strengthens him.",
    reference: "Philippians 4:13",
    source: "BibleGateway"
  },
  {
    id: "d2", category: "sword", type: "Sword Drill",
    question: "Find Psalm 23:1. What does David say the Lord is to him?",
    answer: "The Lord is David’s shepherd.",
    reference: "Psalm 23:1",
    source: "BibleGateway"
  },
  {
    id: "d3", category: "sword", type: "Sword Drill",
    question: "Find Ephesians 6:1. Who are children told to obey?",
    answer: "Their parents in the Lord.",
    reference: "Ephesians 6:1",
    source: "BibleGateway"
  },
  {
    id: "d4", category: "sword", type: "Sword Drill",
    question: "Find Matthew 5:9. Who does Jesus call blessed?",
    answer: "The peacemakers.",
    reference: "Matthew 5:9",
    source: "BibleGateway"
  },
  {
    id: "v1", category: "verse", type: "Name That Verse",
    question: "Complete the verse: “In the beginning God created the heaven and the earth.” What book and chapter is this from?",
    answer: "Genesis 1:1 — “In the beginning God created the heaven and the earth.”",
    reference: "Genesis 1:1",
    source: "BibleGateway"
  },
  {
    id: "v2", category: "verse", type: "Name That Verse",
    question: "Complete the verse: “The Lord is my shepherd; I shall not want.” What book and verse is this?",
    answer: "Psalm 23:1.",
    reference: "Psalm 23:1",
    source: "BibleGateway"
  },
  {
    id: "v3", category: "verse", type: "Name That Verse",
    question: "Complete the verse: “Rejoice in the Lord alway: and again I say, Rejoice.” Name the book and verse.",
    answer: "Philippians 4:4.",
    reference: "Philippians 4:4",
    source: "BibleGateway"
  },
  {
    id: "v4", category: "verse", type: "Name That Verse",
    question: "Complete the verse: “Be strong and of a good courage; be not afraid…” Name the book and chapter.",
    answer: "Joshua 1:9.",
    reference: "Joshua 1:9",
    source: "BibleGateway"
  }
];

const leadIns = [
  "New challenge: ",
  "Think carefully: ",
  "Here comes a fresh one: ",
  "Ready for this? ",
  "Your next challenge: "
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const tvToggle = document.getElementById("tvToggle");
const countdownEl = document.getElementById("countdown");
const timerEl = document.getElementById("timer");

let state = loadState();
let rotation = 0;
let spinning = false;
let currentQuestion = null;
let timerInterval = null;

function defaultState() {
  return {
    used: [],
    cycles: 0,
    scores: [0, 0, 0, 0],
    names: ["Team 1", "Team 2", "Team 3", "Team 4"]
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return defaultState();
    const fresh = defaultState();
    return {
      ...fresh,
      ...saved,
      used: Array.isArray(saved.used) ? saved.used : [],
      scores: Array.isArray(saved.scores) ? saved.scores : fresh.scores,
      names: Array.isArray(saved.names) ? saved.names : fresh.names
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function drawWheel() {
  const size = canvas.width;
  const center = size / 2;
  const radius = size / 2 - 12;
  const arc = (Math.PI * 2) / categories.length;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  categories.forEach((category, i) => {
    const start = -Math.PI / 2 + i * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = category.color;
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = category.id === "scramble" ? "#17324d" : "#ffffff";
    ctx.font = "bold 43px Trebuchet MS, Arial";
    ctx.shadowColor = "#0003";
    ctx.shadowBlur = 3;

    const words = category.label.split(" ");
    if (words.length > 1) {
      ctx.fillText(words.slice(0, -1).join(" "), radius * 0.61, -18);
      ctx.fillText(words[words.length - 1], radius * 0.61, 28);
    } else {
      ctx.fillText(category.label, radius * 0.61, 0);
    }
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#17324d";
  ctx.stroke();

  ctx.restore();
}

function questionPool(categoryId) {
  return questions.filter(q => !categoryId || q.category === categoryId);
}

function pickQuestion(categoryId) {
  let fresh = questionPool(categoryId).filter(q => !state.used.includes(q.id));

  // If the landed category is exhausted, use any fresh question.
  if (!fresh.length) {
    fresh = questionPool(null).filter(q => !state.used.includes(q.id));
  }

  // Start a new cycle only after every question has been used.
  if (!fresh.length) {
    state.used = [];
    state.cycles += 1;
    fresh = questionPool(categoryId);
    if (!fresh.length) fresh = questionPool(null);
  }

  const chosen = fresh[Math.floor(Math.random() * fresh.length)];
  state.used.push(chosen.id);
  saveState();

  return {
    ...chosen,
    displayQuestion: state.cycles > 0
      ? leadIns[Math.floor(Math.random() * leadIns.length)] + chosen.question
      : chosen.question
  };
}

function getCategoryAtPointer() {
  const arc = (Math.PI * 2) / categories.length;
  const pointerAngle = -Math.PI / 2;
  let relative = (pointerAngle - rotation) % (Math.PI * 2);
  if (relative < 0) relative += Math.PI * 2;
  const index = Math.floor(relative / arc) % categories.length;
  return categories[index];
}

function spinWheel() {
  if (spinning) return;

  spinning = true;
  spinButton.disabled = true;
  document.getElementById("status").textContent = "Spinning…";

  const startRotation = rotation;
  const extraTurns = 5 + Math.random() * 4;
  const destination = startRotation + extraTurns * Math.PI * 2 + Math.random() * Math.PI * 2;
  const duration = 3300;
  const startTime = performance.now();

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    rotation = startRotation + (destination - startRotation) * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const landed = getCategoryAtPointer();
      currentQuestion = pickQuestion(landed.id);
      document.getElementById("status").textContent = `Landed on ${landed.label}!`;
      startCountdown();
    }
  }

  requestAnimationFrame(animate);
}

function startCountdown() {
  let count = 3;
  countdownEl.hidden = false;
  countdownEl.textContent = count;

  const tick = () => {
    count -= 1;
    if (count > 0) {
      countdownEl.textContent = count;
      window.setTimeout(tick, 700);
    } else {
      countdownEl.textContent = "GO!";
      window.setTimeout(() => {
        countdownEl.hidden = true;
        showQuestion();
      }, 500);
    }
  };

  window.setTimeout(tick, 700);
}

function showQuestion() {
  clearInterval(timerInterval);

  document.getElementById("categoryBadge").textContent =
    categories.find(c => c.id === currentQuestion.category)?.label || "Question";
  document.getElementById("questionType").textContent = currentQuestion.type;
  document.getElementById("question").textContent = currentQuestion.displayQuestion;

  const referenceEl = document.getElementById("questionReference");
  const sourceEl = document.getElementById("questionSource");
  const isNameThatVerse = currentQuestion.category === "verse";

  // Hide the verse reference until the answer is revealed.
  referenceEl.hidden = isNameThatVerse;
  referenceEl.textContent = `Reference: ${currentQuestion.reference}`;

  sourceEl.hidden = false;
  sourceEl.innerHTML =
    `Source: <a href="${sourceUrl(currentQuestion.reference)}" target="_blank" rel="noopener noreferrer">${escapeHtml(currentQuestion.source)} — ${escapeHtml(currentQuestion.reference)}</a>`;

  const answerEl = document.getElementById("answer");
  answerEl.hidden = true;
  answerEl.textContent = "";

  document.getElementById("revealButton").disabled = false;
  document.getElementById("nextButton").disabled = true;

  startTimer();
}

function sourceUrl(reference) {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=KJV`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function revealAnswer() {
  if (!currentQuestion) return;

  clearInterval(timerInterval);
  document.getElementById("answer").textContent = `Answer: ${currentQuestion.answer}`;
  document.getElementById("answer").hidden = false;

  const referenceEl = document.getElementById("questionReference");
  referenceEl.textContent = `Reference: ${currentQuestion.reference}`;
  referenceEl.hidden = false;

  document.getElementById("revealButton").disabled = true;
  document.getElementById("nextButton").disabled = false;
}

function startTimer() {
  let remaining = ROUND_SECONDS;
  updateTimer(remaining);

  timerInterval = window.setInterval(() => {
    remaining -= 1;
    updateTimer(remaining);
    if (remaining <= 0) {
      clearInterval(timerInterval);
      document.getElementById("revealButton").disabled = false;
      document.getElementById("nextButton").disabled = false;
      document.getElementById("status").textContent = "Time's up! Reveal the answer.";
    }
  }, 1000);
}

function updateTimer(seconds) {
  timerEl.textContent = seconds;
  timerEl.setAttribute("aria-label", `${seconds} seconds remaining`);
  timerEl.classList.toggle("urgent", seconds <= 5);
}

function renderTeams() {
  const container = document.getElementById("teams");
  container.replaceChildren();

  state.names.forEach((name, index) => {
    const card = document.createElement("div");
    card.className = "team";

    const input = document.createElement("input");
    input.value = name;
    input.setAttribute("aria-label", `Team ${index + 1} name`);
    input.addEventListener("change", () => {
      state.names[index] = input.value.trim() || `Team ${index + 1}`;
      saveState();
    });

    const score = document.createElement("span");
    score.className = "team-score";
    score.textContent = state.scores[index] ?? 0;

    const controls = document.createElement("div");
    controls.className = "score-buttons";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "− Point";
    minus.setAttribute("aria-label", `Remove a point from ${name}`);
    minus.addEventListener("click", () => changeScore(index, -1));

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+ Point";
    plus.setAttribute("aria-label", `Add a point to ${name}`);
    plus.addEventListener("click", () => changeScore(index, 1));

    controls.append(minus, plus);
    card.append(input, score, controls);
    container.append(card);
  });
}

function changeScore(index, amount) {
  state.scores[index] = Math.max(0, (state.scores[index] || 0) + amount);
  saveState();
  renderTeams();
}

spinButton.addEventListener("click", spinWheel);
document.getElementById("revealButton").addEventListener("click", revealAnswer);

document.getElementById("nextButton").addEventListener("click", () => {
  clearInterval(timerInterval);
  currentQuestion = null;
  document.getElementById("question").textContent = "Spin the wheel to begin!";
  document.getElementById("questionType").textContent = "Bible Trivia";
  document.getElementById("categoryBadge").textContent = "Ready to play";
  document.getElementById("questionReference").hidden = true;
  document.getElementById("questionSource").hidden = true;
  document.getElementById("answer").hidden = true;
  document.getElementById("revealButton").disabled = true;
  document.getElementById("nextButton").disabled = true;
  document.getElementById("status").textContent = "Spin to get a question.";
  updateTimer(ROUND_SECONDS);
  spinButton.disabled = false;
});

tvToggle.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("tv-mode");
  tvToggle.setAttribute("aria-pressed", String(enabled));
  tvToggle.textContent = enabled ? "Exit TV Mode" : "TV Mode";
});

drawWheel();
renderTeams();
updateTimer(ROUND_SECONDS);
