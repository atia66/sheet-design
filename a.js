/* ===============================
   STATE
================================ */
const MAX = {
  mcq: 30,
  choice: 20,
  essay: 3,
  idcols: 10,
  modelcols: 9,
};

let currentMode = "student"; // 'student' | 'model'

function toggleSettings() {
  const panel = document.getElementById("settingsPanel");
  panel.classList.toggle("open");
}

function toggleTrigger() {
  const btn = document.getElementById("triggerBtn");
  const page = document.querySelector(".page-container");
  if (currentMode === "student") {
    currentMode = "model";
    btn.textContent = "Student Sheet";
    btn.classList.add("is-student");
    page.classList.add("mode-model");
  } else {
    currentMode = "student";
    btn.textContent = "Model Answer";
    btn.classList.remove("is-student");
    page.classList.remove("mode-model");
  }
}

function updateVal(key) {
  const slider = document.getElementById(`slider-${key}`);
  document.getElementById(`val-${key}`).textContent = slider.value;
}

function applySettings() {
  const mcqCount = +document.getElementById("slider-mcq").value;
  const choiceCount = +document.getElementById("slider-choice").value;
  const essayCount = +document.getElementById("slider-essay").value;
  const idCols = +document.getElementById("slider-idcols").value;
  const modelCols = +document.getElementById("slider-modelcols").value;
  applyRowVisibility("#questions-1-40", mcqCount, MAX.mcq);
  applyRowVisibility("#questions-41-80", choiceCount, MAX.choice);
  applyRowVisibility("#questions-81-83", essayCount, MAX.essay);
  applyColVisibility("studentIdGrid", "studentIdHeader", idCols, MAX.idcols);
  applyColVisibility("modelIdGrid", "modelIdHeader", modelCols, MAX.modelcols);
}

function applyRowVisibility(containerSelector, showCount, maxCount) {
  const rows = document.querySelectorAll(`${containerSelector} .question-row`);
  rows.forEach((row, i) => {
    row.style.display = i < showCount ? "" : "none";
  });
}

function applyColVisibility(gridId, headerId, showCols, maxCols) {
  const header = document.getElementById(headerId);
  if (header) {
    header.querySelectorAll(".id-header-cell").forEach((cell, i) => {
      cell.classList.toggle("id-col-hidden", i >= showCols);
    });
    header.style.gridTemplateColumns = `repeat(${showCols}, 1fr)`;
  }
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.querySelectorAll(".id-row").forEach((row) => {
    row.style.gridTemplateColumns = `repeat(${showCols}, 1fr)`;
    row.querySelectorAll(".id-cell").forEach((cell, i) => {
      cell.classList.toggle("id-col-hidden", i >= showCols);
    });
  });
}

function generateTimingMarks() {
  const c = document.getElementById("timingMarks");
  for (let i = 0; i < 15; i++) {
    const mark = document.createElement("div");
    mark.className = "timing-mark";
    c.appendChild(mark);
  }
}

function buildIdHeader(headerId, cols) {
  const header = document.getElementById(headerId);
  if (!header) return;
  header.innerHTML = "";
  const labels = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ];
  for (let i = 0; i < cols; i++) {
    const cell = document.createElement("div");
    cell.className = "id-header-cell";
    cell.textContent = labels[i];
    header.appendChild(cell);
  }
}

function generateModelIdGrid() {
  buildIdHeader("modelIdHeader", MAX.modelcols);
  const grid = document.getElementById("modelIdGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const row = document.createElement("div");
  row.className = "id-row";
  for (let col = 1; col <= MAX.modelcols; col++) {
    const cell = document.createElement("div");
    cell.className = "id-cell";
    const bubble = document.createElement("div");
    bubble.className = "id-bubble";
    bubble.textContent = col;
    bubble.onclick = function () {
      grid
        .querySelectorAll(".id-bubble")
        .forEach((b) => b.classList.remove("filled"));
      this.classList.add("filled");
    };
    cell.appendChild(bubble);
    row.appendChild(cell);
  }
  grid.appendChild(row);
}

function generateStudentIdGrid() {
  buildIdHeader("studentIdHeader", MAX.idcols);
  const idGrid = document.getElementById("studentIdGrid");
  if (!idGrid) return;
  idGrid.innerHTML = "";
  for (let digit = 0; digit <= 9; digit++) {
    const row = document.createElement("div");
    row.className = "id-row";
    for (let col = 0; col < MAX.idcols; col++) {
      const cell = document.createElement("div");
      cell.className = "id-cell";
      const bubble = document.createElement("div");
      bubble.className = "id-bubble";
      bubble.textContent = digit;
      bubble.onclick = (function (c) {
        return function () {
          idGrid
            .querySelectorAll(`.id-cell:nth-child(${c + 1}) .id-bubble`)
            .forEach((b) => b.classList.remove("filled"));
          this.classList.add("filled");
        };
      })(col);
      cell.appendChild(bubble);
      row.appendChild(cell);
    }
    idGrid.appendChild(row);
  }
}


function placeCursorAtEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function trimToLimit(el, maxH) {
  while (el.scrollHeight > maxH + 2 && el.innerText.length > 0) {
    el.innerText = el.innerText.slice(0, -1);
    placeCursorAtEnd(el);
  }
}

function generateQuestionRows(containerId, startNum, endNum, type = "bubble") {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = startNum; i <= endNum; i++) {
    const row = document.createElement("div");
    row.className = "question-row";

    const numDiv = document.createElement("div");
    numDiv.className = "question-num";
    numDiv.textContent = i;
    row.appendChild(numDiv);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    /* ── Block 1: MCQ bubbles ── */
    if (type === "bubble") {
      ["A", "B", "C", "D", "E"].forEach((letter) => {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = letter;
        bubble.onclick = function () {
          this.parentElement
            .querySelectorAll(".bubble")
            .forEach((b) => b.classList.remove("filled"));
          this.classList.add("filled");
        };
        optionsDiv.appendChild(bubble);
      });

      /* ── Block 2: text input ── */
    } else if (type === "text-input") {
      const textInput = document.createElement("input");
      textInput.type = "text";
      textInput.className = "answer-input";
      textInput.value = "";
      optionsDiv.appendChild(textInput);

      /* ── Block 3: essay with contenteditable ── */
    } else if (type === "essay-lines") {
      const maxLines = 7;
      const lineH = 30; // must match --line-height-essay in CSS (px)
      const maxH = maxLines * lineH;

      /* lined background */
      const essayContainer = document.createElement("div");
      essayContainer.className = "essay-container";

      const linesBackground = document.createElement("div");
      linesBackground.className = "essay-lines-bg";
      for (let ln = 0; ln < maxLines; ln++) {
        const essayLine = document.createElement("div");
        essayLine.className = "essay-line";
        linesBackground.appendChild(essayLine);
      }

      /* contenteditable div — no scrollbar possible with overflow:hidden */
      const editDiv = document.createElement("div");
      editDiv.className = "essay-editable";
      editDiv.contentEditable = "true";
      editDiv.setAttribute("data-placeholder", "Write answer here…");
      editDiv.spellcheck = false;

      /* Block new characters once the box is full */
      editDiv.addEventListener("keydown", function (e) {
        if (this.scrollHeight < maxH) return; // still room — allow everything

        const allowed = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
          "Tab",
        ];
        const isCtrl = e.ctrlKey || e.metaKey;

        // Allow Ctrl+A, Ctrl+C, Ctrl+Z, Ctrl+X etc.
        if (isCtrl) return;

        // Block any printable character or Enter
        if (!allowed.includes(e.key)) {
          e.preventDefault();
        }
      });

      /* Trim on every input event (catches autocomplete, IME, voice, etc.) */
      editDiv.addEventListener("input", function () {
        if (this.scrollHeight > maxH + 2) {
          trimToLimit(this, maxH);
        }
      });

      /* Intercept paste — insert as plain text then trim */
      editDiv.addEventListener("paste", function (e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData(
          "text/plain",
        );
        document.execCommand("insertText", false, text);
        if (this.scrollHeight > maxH + 2) {
          trimToLimit(this, maxH);
        }
      });

      essayContainer.appendChild(linesBackground);
      essayContainer.appendChild(editDiv);
      optionsDiv.appendChild(essayContainer);
    }

    row.appendChild(optionsDiv);
    container.appendChild(row);
  }
}


function fillRandomAnswers() {
  // Block 1 — MCQ bubbles
  document.querySelectorAll("#questions-1-40 .question-row").forEach((row) => {
    if (row.style.display === "none") return;
    const bubbles = row.querySelectorAll(".bubble");
    bubbles.forEach((b) => b.classList.remove("filled"));
    const pick = bubbles[Math.floor(Math.random() * bubbles.length)];
    if (pick) pick.classList.add("filled");
  });

  // Block 2 — text inputs with real text answers
  const choiceAnswers = [
    "True",
    "False",
    "Yes",
    "No",
    "Correct",
    "Incorrect",
    "Agree",
    "Disagree",
    "Valid",
    "Invalid",
    "A and B",
    "None",
  ];
  document.querySelectorAll("#questions-41-80 .answer-input").forEach((inp) => {
    const row = inp.closest(".question-row");
    if (row && row.style.display === "none") return;
    inp.value = choiceAnswers[Math.floor(Math.random() * choiceAnswers.length)];
  });

  // Block 3 — essay editables
  // Block 3 — essay editables
  const samples = [
    "The main concept relies on the fundamental principles established in the theoretical framework. Evidence suggests a strong correlation between the variables studied throughout the experiment and supports the original hypothesis proposed.",
    "Based on the analysis conducted, several key factors emerge as significant contributors to the overall outcome. The methodology applied ensures validity and reliability of the findings presented in this section.",
    "The results demonstrate a clear pattern consistent with the hypothesis proposed. Further investigation is recommended to explore the underlying mechanisms driving these observed relationships in detail.",
  ];

  document
    .querySelectorAll("#questions-81-83 .essay-editable")
    .forEach((el, idx) => {
      const row = el.closest(".question-row");
      if (row && row.style.display === "none") return;
      el.innerText = samples[idx % samples.length];
      setTimeout(() => {
        const lh = parseFloat(getComputedStyle(el).lineHeight) || 30;
        const maxH = 7 * lh;
        while (el.scrollHeight > maxH + 2 && el.innerText.length > 0) {
          el.innerText = el.innerText.slice(0, -1);
        }
      }, 50);
    });

  // Student ID grid
  const idCols = +document.getElementById("slider-idcols").value;
  for (let col = 0; col < idCols; col++) {
    const colBubbles = document.querySelectorAll(
      `#studentIdGrid .id-cell:nth-child(${col + 1}) .id-bubble`,
    );
    colBubbles.forEach((b) => b.classList.remove("filled"));
    const pick = colBubbles[Math.floor(Math.random() * colBubbles.length)];
    if (pick) pick.classList.add("filled");
  }

  // Model ID grid
  const modelCols = +document.getElementById("slider-modelcols").value;
  const modelBubbles = Array.from(
    document.querySelectorAll("#modelIdGrid .id-bubble"),
  ).filter((_, i) => i < modelCols);
  modelBubbles.forEach((b) => b.classList.remove("filled"));
  const pick = modelBubbles[Math.floor(Math.random() * modelBubbles.length)];
  if (pick) pick.classList.add("filled");
}

function clearAllAnswers() {
  // Bubbles (MCQ + ID grids)
  document
    .querySelectorAll(".bubble, .id-bubble")
    .forEach((b) => b.classList.remove("filled"));

  // Block 2 text inputs
  document.querySelectorAll(".answer-input").forEach((inp) => {
    inp.value = "";
  });

  // Block 3 essay editables
  document.querySelectorAll(".essay-editable").forEach((el) => {
    el.innerText = "";
  });
}


async function downloadSheet() {
  if (typeof window.jspdf === "undefined") {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load jsPDF"));
      document.head.appendChild(s);
    });
  }

  const page = document.querySelector(".page-container");
  const prevTransform = page.style.transform;
  const prevMB = page.style.marginBottom;
  const prevMR = page.style.marginRight;
  page.style.transform = "none";
  page.style.marginBottom = "";
  page.style.marginRight = "";
  document.body.classList.add("generating");

  // Swap each essay-editable for a plain div so html2canvas
  // captures all text (not just the visible overflow:hidden slice)
  const replacements = [];
  document.querySelectorAll(".essay-editable").forEach((ed) => {
    const computed = window.getComputedStyle(ed);
    const div = document.createElement("div");
    div.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      font-size: ${computed.fontSize};
      font-family: ${computed.fontFamily};
      line-height: ${computed.lineHeight};
      padding: ${computed.padding};
      color: ${computed.color};
      background: transparent;
      white-space: pre-wrap;
      word-break: break-word;
      overflow: hidden;
      z-index: 2;
      box-sizing: border-box;
    `;
    div.textContent = ed.innerText;
    ed.parentNode.insertBefore(div, ed);
    ed.style.display = "none";
    replacements.push({ ed, div });
  });

  try {
    const canvas = await html2canvas(page, {
      scale: 4,
      useCORS: true,
      backgroundColor: "#ffffff",
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: page.scrollWidth,
      windowHeight: page.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pxToMm = 0.2646;
    const pageW = page.scrollWidth * pxToMm;
    const pageH = page.scrollHeight * pxToMm;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: pageW > pageH ? "landscape" : "portrait",
      unit: "mm",
      format: [pageW, pageH],
    });
    pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH, "", "FAST");
    pdf.save("omr-answer-sheet.pdf");
  } catch (err) {
    console.error("PDF download failed:", err);
    alert("PDF download failed: " + err.message);
  } finally {
    replacements.forEach(({ ed, div }) => {
      ed.style.display = "";
      div.remove();
    });
    page.style.transform = prevTransform;
    page.style.marginBottom = prevMB;
    page.style.marginRight = prevMR;
    document.body.classList.remove("generating");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  generateTimingMarks();
  generateModelIdGrid();
  generateStudentIdGrid();
  generateQuestionRows("questions-1-40", 1, MAX.mcq, "bubble");
  generateQuestionRows("questions-41-80", 1, MAX.choice, "text-input");
  generateQuestionRows("questions-81-83", 1, MAX.essay, "essay-lines");
});
