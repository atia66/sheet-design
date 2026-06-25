const MAX = {
  mcq: 30,
  choice: 20,
  essay: 3,
  idcols: 10,
  modelcols: 9,
};

let currentMode = "model";

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
    } else if (type === "text-input") {
      const textInput = document.createElement("input");
      textInput.type = "text";
      textInput.className = "answer-input";
      textInput.value = "";
      optionsDiv.appendChild(textInput);
    } else if (type === "essay-lines") {
      const maxLines = 7;
      const lineH = 30;
      const maxH = maxLines * lineH;

      const essayContainer = document.createElement("div");
      essayContainer.className = "essay-container";

      const linesBackground = document.createElement("div");
      linesBackground.className = "essay-lines-bg";
      for (let ln = 0; ln < maxLines; ln++) {
        const essayLine = document.createElement("div");
        essayLine.className = "essay-line";
        linesBackground.appendChild(essayLine);
      }

      const editDiv = document.createElement("div");
      editDiv.className = "essay-editable";
      editDiv.contentEditable = "true";
      editDiv.spellcheck = false;

      editDiv.addEventListener("keydown", function (e) {
        if (this.scrollHeight < maxH) return;
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
        if (e.ctrlKey || e.metaKey) return;
        if (!allowed.includes(e.key)) e.preventDefault();
      });

      editDiv.addEventListener("input", function () {
        if (this.scrollHeight > maxH + 2) trimToLimit(this, maxH);
      });

      editDiv.addEventListener("paste", function (e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData(
          "text/plain",
        );
        document.execCommand("insertText", false, text);
        if (this.scrollHeight > maxH + 2) trimToLimit(this, maxH);
      });

      essayContainer.appendChild(linesBackground);
      essayContainer.appendChild(editDiv);
      optionsDiv.appendChild(essayContainer);
    }

    row.appendChild(optionsDiv);
    container.appendChild(row);
  }
}

/* ══════════════════════════════════════════════
   IMPORT / EXPORT JSON
══════════════════════════════════════════════ */

function collectSheetData() {
  const data = {
    mcq: [],
    choices: [],
    essays: [],
    studentId: null, // number string e.g. "2031456789", or null if model sheet
    modelId: null,
  };

  // MCQ bubbles
  document.querySelectorAll("#questions-1-40 .question-row").forEach((row) => {
    const filled = row.querySelector(".bubble.filled");
    data.mcq.push(filled ? filled.textContent.trim() : null);
  });

  // Choice text inputs
  document.querySelectorAll("#questions-41-80 .answer-input").forEach((inp) => {
    data.choices.push(inp.value);
  });

  // Essay editables
  document
    .querySelectorAll("#questions-81-83 .essay-editable")
    .forEach((el) => {
      data.essays.push(el.innerText);
    });

  // Student ID — only when in student mode
  // Concatenate each column's filled digit into one number string.
  // A column with no filled bubble contributes "_" as a placeholder.
  if (currentMode === "student") {
    const idCols = +document.getElementById("slider-idcols").value;
    let digits = "";
    for (let col = 0; col < idCols; col++) {
      const filled = document.querySelector(
        `#studentIdGrid .id-cell:nth-child(${col + 1}) .id-bubble.filled`,
      );
      digits += filled ? filled.textContent.trim() : "_";
    }
    data.studentId = digits; // partial fills use "_" as placeholder per column
  }
  // else stays null for model sheets

  // Model ID — which bubble is filled
  const filledModel = document.querySelector("#modelIdGrid .id-bubble.filled");
  data.modelId = filledModel ? filledModel.textContent.trim() : null;

  return data;
}

function exportJSON() {
  const data = collectSheetData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "omr-sheet-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        loadSheetData(data);
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function loadSheetData(data) {
  // MCQ
  if (Array.isArray(data.mcq)) {
    const rows = document.querySelectorAll("#questions-1-40 .question-row");
    rows.forEach((row, i) => {
      row
        .querySelectorAll(".bubble")
        .forEach((b) => b.classList.remove("filled"));
      if (data.mcq[i]) {
        const match = Array.from(row.querySelectorAll(".bubble")).find(
          (b) => b.textContent.trim() === data.mcq[i],
        );
        if (match) match.classList.add("filled");
      }
    });
  }

  // Choices
  if (Array.isArray(data.choices)) {
    const inputs = document.querySelectorAll("#questions-41-80 .answer-input");
    inputs.forEach((inp, i) => {
      inp.value = data.choices[i] ?? "";
    });
  }

  // Essays
  if (Array.isArray(data.essays)) {
    const edits = document.querySelectorAll("#questions-81-83 .essay-editable");
    edits.forEach((el, i) => {
      el.innerText = data.essays[i] ?? "";
    });
  }

  // Student ID — stored as merged digit string e.g. "2031_56789"
  // "_" means that column had no bubble filled; null means model sheet (skip)
  if (typeof data.studentId === "string") {
    const idGrid = document.getElementById("studentIdGrid");
    [...data.studentId].forEach((ch, col) => {
      idGrid
        .querySelectorAll(`.id-cell:nth-child(${col + 1}) .id-bubble`)
        .forEach((b) => b.classList.remove("filled"));
      if (ch !== "_") {
        const match = Array.from(
          idGrid.querySelectorAll(`.id-cell:nth-child(${col + 1}) .id-bubble`),
        ).find((b) => b.textContent.trim() === ch);
        if (match) match.classList.add("filled");
      }
    });
  }

  // Model ID
  if (data.modelId !== undefined) {
    const modelGrid = document.getElementById("modelIdGrid");
    modelGrid
      .querySelectorAll(".id-bubble")
      .forEach((b) => b.classList.remove("filled"));
    if (data.modelId !== null) {
      const match = Array.from(modelGrid.querySelectorAll(".id-bubble")).find(
        (b) => b.textContent.trim() === String(data.modelId),
      );
      if (match) match.classList.add("filled");
    }
  }
}

/* ══════════════════════════════════════════════
   CLEAR
══════════════════════════════════════════════ */
function clearAllAnswers() {
  document
    .querySelectorAll(".bubble, .id-bubble")
    .forEach((b) => b.classList.remove("filled"));
  document.querySelectorAll(".answer-input").forEach((inp) => {
    inp.value = "";
  });
  document.querySelectorAll(".essay-editable").forEach((el) => {
    el.innerText = "";
  });
}



function openQrModal() {
  document.getElementById("qrModal").classList.add("open");
  document.getElementById("qrModalOverlay").classList.add("open");
  // Pre-fill from header if already set
  const examTitle = document.querySelector(".exam-title");
  if (examTitle && examTitle.dataset.examName) {
    document.getElementById("qrExamName").value =
      examTitle.dataset.examName || "";
    document.getElementById("qrCourseCode").value =
      examTitle.dataset.courseCode || "";
  }
}

function closeQrModal() {
  document.getElementById("qrModal").classList.remove("open");
  document.getElementById("qrModalOverlay").classList.remove("open");
}

async function generateQrCode() {
  const examName = document.getElementById("qrExamName").value.trim();
  const courseCode = document.getElementById("qrCourseCode").value.trim();

  if (!examName && !courseCode) {
    alert("Please enter at least an exam name or course code.");
    return;
  }

  // Update header exam title
  const examTitleEl = document.querySelector(".exam-title");
  if (examTitleEl) {
    examTitleEl.textContent = `${courseCode ? courseCode + " — " : ""}${examName}`;
    examTitleEl.dataset.examName = examName;
    examTitleEl.dataset.courseCode = courseCode;
  }

  // Send to your local QR generator API
  const preview = document.getElementById("qrPreview");
  preview.innerHTML =
    '<span style="color:#888;font-size:11px">Generating…</span>';
  try {
    const res = await fetch(
      "http://localhost:8080/api/professor/exams/qrcode",
      {
        method: "POST",
        headers: {
          accept: "image/png",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsInJvbGUiOiJwcm9mZXNzb3IiLCJleHAiOjE3ODIzMDUyNzh9.XmKjXyoOyk61rkf971yUTxbCRyTYyvR1W5OAfsYleEo",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_code: courseCode,
          exam_name: examName,
        }),
      },
    );
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Show in modal preview
    preview.innerHTML = "";
    const previewImg = document.createElement("img");
    previewImg.src = url;
    previewImg.style.cssText =
      "width:140px;height:140px;border:2px solid var(--qr_code_boarder);border-radius:3px;";
    preview.appendChild(previewImg);

    // Place on the sheet
    const sheetQr = document.querySelector(".qr-code");
    if (sheetQr) {
      sheetQr.innerHTML = "";
      const sheetImg = document.createElement("img");
      sheetImg.src = url;
      sheetImg.style.cssText =
        "max-width:var(--qr-logo-size);max-height:var(--qr-logo-size);border:var(--border-medium) solid var(--qr_code_boarder);";
      sheetQr.appendChild(sheetImg);
    }
  } catch (err) {
    preview.innerHTML = `<span style="color:#e55;font-size:11px">Failed: ${err.message}</span>`;
  }
}

/* ══════════════════════════════════════════════
   PDF DOWNLOAD
══════════════════════════════════════════════ */
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

  const replacements = [];
  document.querySelectorAll(".essay-editable").forEach((ed) => {
    const computed = window.getComputedStyle(ed);
    const div = document.createElement("div");
    div.style.cssText = `
      position: absolute; inset: 0; width: 100%; height: 100%;
      font-size: ${computed.fontSize}; font-family: ${computed.fontFamily};
      line-height: ${computed.lineHeight}; padding: ${computed.padding};
      color: ${computed.color}; background: transparent;
      white-space: pre-wrap; word-break: break-word;
      overflow: hidden; z-index: 2; box-sizing: border-box;
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

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
  generateTimingMarks();
  generateModelIdGrid();
  generateStudentIdGrid();
  generateQuestionRows("questions-1-40", 1, MAX.mcq, "bubble");
  generateQuestionRows("questions-41-80", 1, MAX.choice, "text-input");
  generateQuestionRows("questions-81-83", 1, MAX.essay, "essay-lines");

  // Sync UI to initial mode
  const btn = document.getElementById("triggerBtn");
  const page = document.querySelector(".page-container");
  btn.textContent = "Student Sheet";
  btn.classList.add("is-student");
  page.classList.add("mode-model");
});
