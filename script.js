// ✅ 1. API 網址
const DATA_URL = "https://script.google.com/macros/s/AKfycbzxBiz_T58kzLGfpSyjaKonPl464VCe5mmbBP94JDAt9Y-eJjO2DBjZ7dLZSWqCIjyf/exec";

let questions = [];
let currentIndex = -1;
let currentQuestion = null;
let usedHints = [false, false, false, false, false];
let usedIndexes = [];

// ✅ 2. 讀取題庫
fetch(DATA_URL)
  .then(response => response.json())
  .then(data => {
    console.log("API data:", data);
    questions = data;
    nextQuestion();
  })
  .catch(error => {
    console.error(error);
    alert("無法讀取題庫，請檢查 API");
  });

// ✅ 3. 下一題
function nextQuestion() {
  if (!questions || questions.length === 0) {
    alert("目前沒有題目");
    return;
  }

  if (usedIndexes.length === questions.length) {
    alert("題目已全部完成！");
    return;
  }

  do {
    currentIndex = Math.floor(Math.random() * questions.length);
  } while (usedIndexes.includes(currentIndex));

  usedIndexes.push(currentIndex);

  const q = questions[currentIndex];

  currentQuestion = {
    hints: q.hints || q.slice(0, 5),
    answer: q.answer || q[5]
  };

  usedHints = [false, false, false, false, false];

  // 重置按鈕樣式
  document.querySelectorAll("#hint-buttons button").forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("used");
  });

  // 清空提示與答案顯示
  document.getElementById("hint-display").textContent = "";
  document.getElementById("answer").textContent = currentQuestion.answer;
  document.getElementById("answer").classList.add("hidden");

  updateHintCounter();
  updateProgress();
}

// ✅ 4. 顯示提示
function showHint(index) {
  if (usedHints[index]) return;

  const hint = currentQuestion.hints[index] || "（沒有提示）";
  const hintDisplay = document.getElementById("hint-display");

  // 如果還有舊提示，就換行追加
  hintDisplay.textContent += hintDisplay.textContent ? "\n" + hint : hint;

  usedHints[index] = true;

  const btn = document.querySelectorAll("#hint-buttons button")[index];
  btn.disabled = true;
  btn.classList.add("used");

  updateHintCounter();
}

// ✅ 5. 更新提示使用計數
function updateHintCounter() {
  const count = usedHints.filter(v => v).length;
  document.getElementById("hint-counter").textContent =
    "已使用提示：" + count + " / 5";
}

// ✅ 6. 更新題目進度
function updateProgress() {
  document.getElementById("progress").textContent =
    "第 " + usedIndexes.length + " 題 / 共 " + questions.length + " 題";
}

// ✅ 7. 顯示 / 隱藏答案
function toggleAnswer() {
  document.getElementById("answer").classList.toggle("hidden");
}