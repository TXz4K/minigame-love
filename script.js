const moodButtons = Array.from(document.querySelectorAll("[data-mood]"));
const sparks = Array.from(document.querySelectorAll(".spark"));
const slots = Array.from(document.querySelectorAll(".light-slot"));
const score = document.querySelector("#score");
const hint = document.querySelector("#hint");
const gameReveal = document.querySelector("#gameReveal");
const gameCard = document.querySelector("#gameCard");
const lightTray = document.querySelector("#lightTray");
const careBox = document.querySelector("#careBox");
const letter = document.querySelector("#letter");
const letterKicker = document.querySelector("#letterKicker");
const letterTitle = document.querySelector("#letterTitle");
const typedMessage = document.querySelector("#typedMessage");
const letterSignature = document.querySelector("#letterSignature");
const resetButton = document.querySelector("#resetButton");
const loginGate = document.querySelector("#loginGate");
const loginForm = document.querySelector("#loginForm");
const lovePassword = document.querySelector("#lovePassword");
const loginHint = document.querySelector("#loginHint");

let foundCount = 0;
let selectedMood = "";
let typingTimer = null;
const loveCodes = new Set(["16มีนาคม2005", "16/03/2005", "16-03-2005", "16032005"]);
const smoothScrollOptions = { behavior: "smooth", block: "start" };

const moodLetters = {
  "ชิวมาก": {
    kicker: "จดหมายลับสายชิวถูกเปิดแล้ว",
    title: "วันนี้คนฉวยดูสบายใจ เค้าก็สบายใจตามแหละ",
    body:
      "วันนี้ลงชุมชนแบบชิว ๆ ใช่มั้ยคะ ดีใจด้วยนะอ้วน เห็นอ้วนมีวันที่ไม่หนักมากแล้วเค้าก็สบายใจ แต่ถึงจะชิวก็อย่าลืมกินน้ำ พักตา แล้วเก็บแรงกลับมาให้เค้ากอดด้วยนะ วันนี้เก่งแบบน่ารักมาก ๆ เลย",
    signature: "จากคนที่ชอบเห็นอ้วนยิ้มมากกว่าสิ่งไหน อิอิ"
  },
  "สบายมาก": {
    kicker: "จดหมายลับโหมดแฟนภูมิใจถูกเปิดแล้ว",
    title: "สบายมากเลยสิ เก่งจังเลยไออ้วน",
    body:
      "วันนี้ตอบว่าสบายมาก เก่งอะ เค้าภูมิใจในตัวอ้วนมากนะ  อ้วนทำได้อยู่แล้ว วันนี้ขอให้ความสบายใจนี้อยู่กับอ้วนนาน ๆ แล้วกลับมาเล่าให้เค้าฟังด้วยนะ เค้ารอฟังทุกเรื่องของอ้วนเลย",
    signature: "จากแฟนคลับอันดับหนึ่งของอ้วน"
  },
  "เหนื่อย": {
    kicker: "จดหมายลับโหมดกอดเบา ๆ ถูกเปิดแล้ว",
    title: "เหนื่อยใช่มั้ยคะ มาให้เค้ากอดหน่อย",
    body:
      "วันนี้ลงชุมชนแล้วเหนื่อยใช่ไหมคะ คนฉวยของเค้าเก่งมากเลยนะ แค่อ้วนยังพยายาม ยังยิ้มให้คนอื่นได้ ทั้งที่ตัวเองก็เหนื่อย นั่นก็น่ารักและเก่งมากแล้ว กลับมาให้เค้ากอดใจนะ วันนี้ไม่ต้องเข้มแข็งตลอดเวลาก็ได้",
    signature: "จากคนที่อยากเป็นที่พักใจให้อ้วนทุกวัน"
  },
  "เหนื่อยมาก": {
    kicker: "จดหมายลับโหมดโอ๋เต็มแรงถูกเปิดแล้ว",
    title: "เหนื่อยมากเลยเหรอคะ โอ๋นะคนเก่ง",
    body:
      "ถ้าวันนี้เหนื่อยมาก ๆ ขอให้กล่องนี้กอดอ้วนแทนเค้าก่อนนะ คนฉวยไม่ต้องแบกทุกอย่างไว้คนเดียวเลย อ้วนทำดีที่สุดแล้วจริง ๆ เค้าภูมิใจในตัวอ้วนมาก รักอ้วนมาก และอยากให้รู้ว่าต่อให้วันไหนหมดแรง อ้วนก็ยังเป็นคนโปรดของเค้าเสมอ",
    signature: "จากคนที่รักอ้วน แม้อ้วนจะงอแงแค่ไหนก็ตาม"
  }
};

function chooseMood(button) {
  selectedMood = button.dataset.mood;
  moodButtons.forEach((moodButton) => moodButton.classList.remove("is-selected"));
  button.classList.add("is-selected");
  revealGameArea();
  gameCard.classList.remove("is-locked");
  hint.textContent = `รับทราบว่าวันนี้ "${selectedMood}" นะ แตะแสงกำลังใจให้ครบ 6 ดวง`;
  scrollAfterAction(gameReveal, 260);
}

function revealGameArea() {
  gameReveal.classList.remove("is-rolled", "is-unrolling");
  void gameReveal.offsetWidth;
  gameReveal.classList.add("is-unrolling");
}

function collectSpark(spark) {
  if (!selectedMood || spark.classList.contains("is-collected")) return;

  popHeart(spark);
  spark.classList.add("is-collected");
  slots[foundCount].classList.add("is-lit");

  foundCount += 1;
  score.textContent = foundCount;

  if (foundCount < sparks.length) {
    hint.textContent = `เก็บแสง "${spark.dataset.note}" แล้ว เหลืออีก ${sparks.length - foundCount} ดวง`;
    return;
  }

  revealLetter();
}

function revealLetter() {
  const letterData = moodLetters[selectedMood];
  hint.textContent = "กล่องเปิดแล้ว เลื่อนอ่านจดหมายลับได้เลย";
  careBox.classList.add("is-open");
  letter.hidden = false;
  letterKicker.textContent = letterData.kicker;
  letterTitle.textContent = letterData.title;
  letterSignature.textContent = letterData.signature;
  typeMessage(letterData.body);
  launchConfetti();
  scrollAfterAction(letter, 360);
}

function popHeart(source) {
  const bounds = source.getBoundingClientRect();
  const heart = document.createElement("span");
  heart.className = "heart-pop";
  heart.textContent = "♡";
  heart.style.left = `${bounds.left + bounds.width / 2}px`;
  heart.style.top = `${bounds.top + bounds.height / 2}px`;
  document.body.append(heart);
  window.setTimeout(() => heart.remove(), 900);
}

function typeMessage(message) {
  let index = 0;
  typedMessage.textContent = "";
  window.clearInterval(typingTimer);

  typingTimer = window.setInterval(() => {
    typedMessage.textContent += message[index];
    index += 1;

    if (index >= message.length) {
      window.clearInterval(typingTimer);
    }
  }, 34);
}

function launchConfetti() {
  const colors = ["#64b7ff", "#ff8fb3", "#ffd36e", "#d9c7ff", "#fffaf2"];

  for (let index = 0; index < 56; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 1700);
  }
}

function resetGame() {
  foundCount = 0;
  selectedMood = "";
  score.textContent = "0";
  hint.textContent = "เลือกความรู้สึกก่อน แล้วกล่องจะเริ่มทำงาน";
  letter.hidden = true;
  letterKicker.textContent = "จดหมายลับถูกเปิดแล้ว";
  letterTitle.textContent = "ถึงคนที่กำลังพยายาม";
  typedMessage.textContent = "";
  letterSignature.textContent = "จากคนที่อยากเห็นอ้วนยิ้มได้ แม้วันนี้จะหนักแค่ไหนก็ตาม";
  gameCard.classList.add("is-locked");
  gameReveal.classList.add("is-rolled");
  gameReveal.classList.remove("is-unrolling");
  careBox.classList.remove("is-open");
  window.clearInterval(typingTimer);

  moodButtons.forEach((button) => button.classList.remove("is-selected"));
  sparks.forEach((spark) => spark.classList.remove("is-collected"));
  slots.forEach((slot) => {
    slot.classList.remove("is-lit");
  });
  scrollAfterAction(moodButtons[0], 120);
}

moodButtons.forEach((button) => {
  button.addEventListener("click", () => chooseMood(button));
});

sparks.forEach((spark) => {
  spark.addEventListener("click", () => collectSpark(spark));
});

resetButton.addEventListener("click", resetGame);

function normalizeLoveCode(value) {
  return value.trim().replace(/\s+/g, "").replace(/มี.ค./g, "มีนาคม");
}

function formatDateCode(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts = [];

  if (digits.length > 0) {
    parts.push(digits.slice(0, 2));
  }

  if (digits.length > 2) {
    parts.push(digits.slice(2, 4));
  }

  if (digits.length > 4) {
    parts.push(digits.slice(4, 8));
  }

  return parts.join("/");
}

function scrollAfterAction(target, delay = 0) {
  window.setTimeout(() => {
    target.scrollIntoView(smoothScrollOptions);
  }, delay);
}

function unlockSite() {
  document.body.classList.remove("is-locked");
  loginGate.classList.add("is-unlocked");
  sessionStorage.setItem("minigameLoveUnlocked", "yes");
}

function lockSite() {
  if (sessionStorage.getItem("minigameLoveUnlocked") === "yes") {
    loginGate.classList.add("is-unlocked");
    return;
  }

  document.body.classList.add("is-locked");
  window.setTimeout(() => lovePassword.focus(), 260);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = normalizeLoveCode(lovePassword.value);

  if (loveCodes.has(code)) {
    loginHint.classList.remove("is-error");
    loginHint.textContent = "รายงานตัวสำเร็จแล้วครับ";
    unlockSite();
    launchConfetti();
    return;
  }

  loginHint.classList.remove("is-error");
  void loginHint.offsetWidth;
  loginHint.classList.add("is-error");
  loginHint.textContent = "ยังไม่ใช่น้า ลองใส่วันที่แบบ 16032005 ดูอีกทีครับ";
  lovePassword.select();
});

lovePassword.addEventListener("input", () => {
  const formatted = formatDateCode(lovePassword.value);
  lovePassword.value = formatted;
});

lockSite();
