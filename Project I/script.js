import * as compiler from './js/compiler.js';
import * as MIPS from './js/MIPS.js';

function init() {
  initializeDMTable();
  initializeIMTable();
  const runBtn = document.querySelector("#run-btn");
  runBtn.addEventListener("click", run);
}

window.addEventListener("load", init);

function initializeDMTable() {
  const DM_tableBody = document.querySelector("#data-memory-table tbody");

  for (let i = 0; i < 64; i++) {
    const row = document.createElement("tr");

    const address = document.createElement("th");
    const decimalAddress = (i * 16);
    address.textContent = "0x" + decimalAddress.toString(16).padStart(8, '0');
    row.appendChild(address);

    for (let j = 0; j < 4; j++) {
      const value = document.createElement("td");
      const decimalId = (i * 16 + j * 4) / 4;
      value.setAttribute("id", "DM_" + decimalId);
      value.textContent = "0x00000000";
      row.appendChild(value);
    }

    DM_tableBody.appendChild(row);
  }
}

function initializeIMTable() {
  const IM_tableBody = document.querySelector("#instruction-memory-table tbody");

  for (let i = 0; i < 256; i++) {
    const row = document.createElement("tr");

    const address = document.createElement("td");
    address.textContent = "0x" + (i * 4).toString(16).padStart(8, '0');
    row.appendChild(address);

    const code = document.createElement("td");
    code.textContent = "0x00000000";
    code.setAttribute("id", "IM_code_" + i);
    row.appendChild(code);

    const source = document.createElement("td");
    source.setAttribute("id", "IM_source_" + i);
    row.appendChild(source);

    IM_tableBody.appendChild(row);
  }
}

function run() {
  // Get assembly code from textarea
  const textarea = document.querySelector("#editor");
  const input = textarea.value.split("\n");
  const assemblyCode = [];
  for (let i = 0; i < input.length; i++) {
    const splittedLine = input[i].split("#");
    const trimmedLine = splittedLine[0].trim();
    if (trimmedLine !== "") {
      assemblyCode.push(trimmedLine);
    }
  }

  // Compile assembly code to machine code
  const hexMachineCode = compiler.compileToHex(assemblyCode);
  const binMachineCode = compiler.compileToBin(assemblyCode);

  // Run the machine code
  const myMIPS = new MIPS.MIPS();
  myMIPS.setIM(assemblyCode, binMachineCode);
  myMIPS.runUntilEnd();
  const reg = myMIPS.regToHex();
  const DM = myMIPS.DMToHex();
  const pc = myMIPS.pcToHex();
  const hi = myMIPS.hiToHex();
  const lo = myMIPS.loToHex();

  // Display the data in tables
  updateTable(hexMachineCode, "#IM_code_", "0x");
  updateTable(assemblyCode, "#IM_source_");
  updateTable(reg, "#reg_");
  updateTable(DM, "#DM_");
  updateElement(pc, "#pc");
  updateElement(hi, "#hi");
  updateElement(lo, "#lo");
}

function updateTable(arr, baseID, prefix = "") {
  for (let i = 0; i < arr.length; i++) {
    const codeElement = document.querySelector(baseID + i);
    codeElement.textContent = prefix + arr[i];
  }
}

function updateElement(val, ID) {
  const codeElement = document.querySelector(ID);
  codeElement.textContent = val;
}