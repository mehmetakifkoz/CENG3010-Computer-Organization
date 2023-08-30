import * as parser from './parser.js';
import * as tokens from './tokens.js';

export function compileToHex(assemblyCode) {
  const machineCode = [];
  assemblyCode.forEach(instruction => {
    const compiledInstruction = compileInstruction(instruction);
    const hexCode = parseInt(compiledInstruction, 2).toString(16).padStart(8, "0");
    machineCode.push(hexCode);
  });
  return machineCode;
}

export function compileToBin(assemblyCode) {
  const machineCode = [];
  assemblyCode.forEach(instruction => {
    machineCode.push(compileInstruction(instruction));
  });
  return machineCode;
}

function compileInstruction(instruction) {
  const [opcode, ...args] = instruction.trim().split(/\s+/);

  if (tokens.RTypeInstructions.hasOwnProperty(opcode)) {
    return compileRTypeInstruction(instruction);
  } else if (tokens.ITypeInstructions.hasOwnProperty(opcode)) {
    return compileITypeInstruction(instruction);
  } else if (tokens.JTypeInstructions.hasOwnProperty(opcode)) {
    return compileJTypeInstruction(instruction);
  } else {
    throw new Error(`Unknown instruction: ${instruction}`);
  }
}

function compileRTypeInstruction(instruction) {
  const parts = parser.parseInstruction(instruction);
  if (parts.category === "Register") {
    const { category, opcode, rd, rs, rt } = parts;
    return tokens.RTypeInstructions[opcode].opcode +
      tokens.registers[rs] +
      tokens.registers[rt] +
      tokens.registers[rd] +
      "00000" +
      tokens.RTypeInstructions[opcode].funct;
  } else if (parts.category === "Shift") {
    const { category, opcode, rd, rt, shamt } = parts;
    return tokens.RTypeInstructions[opcode].opcode +
      "00000" +
      tokens.registers[rt] +
      tokens.registers[rd] +
      convertImmediateToBinary(shamt, 5) +
      tokens.RTypeInstructions[opcode].funct;
  } else if (parts.category === "MultDiv") {
    const { category, opcode, rs, rt } = parts;
    return tokens.RTypeInstructions[opcode].opcode +
      tokens.registers[rs] +
      tokens.registers[rt] +
      "00000" +
      "00000" +
      tokens.RTypeInstructions[opcode].funct;
  } else if (parts.category === "MoveFrom") {
    const { category, opcode, rd } = parts;
    return tokens.RTypeInstructions[opcode].opcode +
      "00000" +
      "00000" +
      tokens.registers[rd] +
      "00000" +
      tokens.RTypeInstructions[opcode].funct;
  } else if (parts.category === "RJump") {
    const { category, opcode, rs } = parts;
    return tokens.RTypeInstructions[opcode].opcode +
      tokens.registers[rs] +
      "00000" +
      "00000" +
      "00000" +
      tokens.RTypeInstructions[opcode].funct;
  }

}

// In here we are using a helper function parser to parse instractions
// Then we return a dictionary in tokens and the index is opcode itself and we get the opcode


function compileITypeInstruction(instruction) {
  const parts = parser.parseInstruction(instruction);
  if (parts.category === "LoadUpperImmediate") {
    const { category, opcode, rt, immediate } = parts;
    return tokens.ITypeInstructions[opcode].opcode +
      "00000" +
      tokens.registers[rt] +
      convertImmediateToBinary(immediate, 16);
  } else {
    const { category, opcode, rt, rs, immediate } = parts;
    return tokens.ITypeInstructions[opcode].opcode +
      tokens.registers[rs] +
      tokens.registers[rt] +
      convertImmediateToBinary(immediate, 16);
  }
}



function compileJTypeInstruction(instruction) {
  const { category, opcode, target } =
    parser.parseInstruction(instruction);
  return tokens.JTypeInstructions[opcode].opcode +
    convertImmediateToBinary(target, 26);
}



function convertImmediateToBinary(immediate, length) {
  let binary;
  if (immediate.startsWith('-')) {
    // negative decimal immediate value
    binary = (Math.pow(2, length) + parseInt(immediate)).toString(2);
  } else if (immediate.startsWith('0x')) {
    // hexadecimal immediate value
    binary = parseInt(immediate.substring(2), 16).toString(2);
  } else if (immediate.startsWith('0b')) {
    // binary immediate value
    binary = immediate.substring(2);
  } else { // decimal immediate value
    binary = parseInt(immediate).toString(2);
  }

  if (binary.length > length) {
    throw new Error(`Binary value ${binary} exceeds the provided length of ${length}.`);
  }

  return binary.padStart(length, '0');
}

