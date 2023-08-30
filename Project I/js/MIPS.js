import * as parser from './parser.js';

export class MIPS {
  constructor() {
    this.reg = new Int32Array(32).fill(0);
    this.IM = new Array(256); // Binary Machine Code
    this.IM_asm = new Array(256); // Assembly Code
    this.IM_len = 0; // Code Length
    this.DM = new Int32Array(256).fill(0);
    this.pc = 0; // unsigned
    this.hi = 0; // signed
    this.lo = 0; // signed
    this.instr = null; // Binary Machine Code Instruction
    this.instr_asm = null; // Assembly Code Instruction
    this.opcode = null;
    this.rs = 0; // unsigned
    this.rt = 0; // unsigned
    this.rd = 0; // unsigned
    this.shamt = 0; // unsigned
    this.funct = null;
    this.imm = 0; // signed
    this.target = 0; // unsigned
  }

  // input: 32bit machine code array in binary format
  setIM(assemblyCode, binMachineCode) {
    this.IM_len = binMachineCode.length;
    for (let i = 0; i < assemblyCode.length; i++) {
      this.IM_asm[i] = assemblyCode[i];
    }
    for (let i = 0; i < binMachineCode.length; i++) {
      this.IM[i] = binMachineCode[i];
    }
  }


  // Fetch the next instruction from this.IM
  fetch() {
    this.instr = this.IM[this.pc / 4];
    this.instr_asm = this.IM_asm[this.pc / 4];
    this.pc += 4;
  }

  // Run the CPU for one cycle
  step() {
    this.fetch();
    if (this.instr !== undefined) {
      this.parseMachineCode();
      this.execute();
    }
  }

  // Run the CPU for the specified number of cycles
  run(cycles) {
    if (cycles > this.IM_len) {
      this.runUntilEnd();
    } else {
      for (let i = 0; i < cycles; i++) {
        this.step();
      }
    }
  }

  runUntilEnd() {
    while (this.pc < (this.IM_len * 4)) {
      this.step();
    }
  }

  parseMachineCode() {
    this.opcode = this.instr.slice(0, 6);
    this.rs = parseInt(this.instr.slice(6, 11), 2);
    this.rt = parseInt(this.instr.slice(11, 16), 2);
    this.rd = parseInt(this.instr.slice(16, 21), 2);
    this.shamt = parseInt(this.instr.slice(21, 26));
    this.funct = this.instr.slice(26, 32);
    const parts = parser.parseInstruction(this.instr_asm);
    this.imm = this.signedInt(parseInt(parts.immediate));
    this.target = parseInt(this.instr.slice(6, 32), 2) * 4;
  }

  // Decode the instruction and execute it
  execute() {
    switch (this.opcode) {
      case "000000": // R-type instruction
        switch (this.funct) {
          case "100000": // ADD
            this.add();
            break;
          case "100010": // SUB
            this.sub();
            break;
          case "100100": // AND
            this.and();
            break;
          case "100101": // OR
            this.or();
            break;
          case "100110": // XOR
            this.xor();
            break;
          case "101010": // SLT
            this.slt();
            break;
          case "001000": // JR
            this.jr();
            break;
          case "000000": // SLL
            this.sll();
            break;
          case "000010": // SRL
            this.srl();
            break;
          case "000011": // SRA
            this.sra();
            break;
          case "010000": // MFHI
            this.mfhi();
            break;
          case "010010": // MFLO
            this.mflo();
            break;
          case "011000": // MULT
            this.mult();
            break;
          case "011010": // DIV
            this.div();
            break;
          default:
            throw new Error(`Unsupported function code: ${this.funct}`);
        }
        break;
      case "000100": // BEQ
        this.beq();
        break;
      case "000101": // BNE
        this.bne();
        break;
      case "001000": // ADDI
        this.addi();
        break;
      case "001010": // SLTI
        this.slti();
        break;
      case "001100": // ANDI
        this.andi();
        break;
      case "001101": // ORI
        this.ori();
        break;
      case "001111": // LUI
        this.lui();
        break;
      case "100011": // LW
        this.lw();
        break;
      case "100000": // LB
        this.lb();
        break;
      case "101011": // SW
        this.sw();
        break;
      case "101000": // SB
        this.sb();
        break;
      case "111000": // MULI
        this.muli();
        break;
      case "000010": // J
        this.j();
        break;
      case "000011": // JAL
        this.jal();
        break;
      default:
        throw new Error(`Unsupported this.opcode: ${this.opcode}`);
    }
  }

  add() {
    this.reg[this.rd] = this.reg[this.rs] + this.reg[this.rt];
  }

  sub() {
    this.reg[this.rd] = this.reg[this.rs] - this.reg[this.rt];
  }

  and() {
    this.reg[this.rd] = this.reg[this.rs] & this.reg[this.rt];
  }

  or() {
    this.reg[this.rd] = this.reg[this.rs] | this.reg[this.rt];
  }

  xor() {
    this.reg[this.rd] = this.reg[this.rs] ^ this.reg[this.rt];
  }

  slt() {
    if (this.reg[this.rs] < this.reg[this.rt]) {
      this.reg[this.rd] = 1;
    } else {
      this.reg[this.rd] = 0;
    }
  }

  jr() {
    this.pc = this.reg[this.rs] >>> 0; // unsigned
  }

  sll() {
    this.reg[this.rd] = this.reg[this.rt] << this.shamt;
  }

  srl() {
    this.reg[this.rd] = this.reg[this.rt] >>> this.shamt;
  }

  sra() {
    this.reg[this.rd] = this.reg[this.rt] >> this.shamt;
  }

  mfhi() {
    this.reg[this.rd] = this.hi;
  }

  mflo() {
    this.reg[this.rd] = this.lo;
  }

  mult() {
    const product = this.reg[this.rs] * this.reg[this.rt];
    const binary = this.toBinString(product, 64);
    this.lo = this.parseInt32(binary.slice(32), 2);
    this.hi = this.parseInt32(binary.slice(0, 32), 2);
  }

  div() {
    const dividend = this.reg[this.rs];
    const divisor = this.reg[this.rt];

    if (divisor === 0) {
      throw new Error('Division by zero');
    }

    // Calculate the quotient and remainder
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;

    // Store the quotient in LO and the remainder in HI
    this.lo = quotient;
    this.hi = remainder;
  }

  beq() {
    if (this.reg[this.rs] === this.reg[this.rt]) {
      this.pc = this.imm >>> 0; // unsigned
    }
  }

  bne() {
    if (this.reg[this.rs] !== this.reg[this.rt]) {
      this.pc = this.imm >>> 0; // unsigned
    }
  }

  addi() {
    this.reg[this.rt] = this.reg[this.rs] + this.imm;
  }

  slti() {
    if (this.reg[this.rs] < this.imm) {
      this.reg[this.rt] = 1;
    } else {
      this.reg[this.rt] = 0;
    }
  }

  andi() {
    this.reg[this.rt] = this.reg[this.rs] & this.imm;
  }

  ori() {
    this.reg[this.rt] = this.reg[this.rs] | this.imm;
  }

  lui() {
    const imm16 = this.imm << 16;
    this.reg[this.rt] = imm16;
  }

  lw() {
    const address = this.reg[this.rs] + this.imm;
    const data = this.DM[address / 4];
    this.reg[this.rt] = data;
  }

  lb() {
    const byteAddr = this.reg[this.rs] + this.imm;
    const wordAddr = byteAddr - (byteAddr % 4);
    const word = this.toBinString(this.DM[wordAddr / 4], 32);
    const start = 2 * (4 - (byteAddr % 4)) - 2; // byte
    const end = 2 * (4 - (byteAddr % 4)); // byte
    const byte = word.slice(start * 4, end * 4);
    this.reg[this.rt] = this.parseInt32(this.signExtend(byte, 8, 32), 2);
  }

  sw() {
    const address = this.reg[this.rs] + this.imm;
    this.DM[address / 4] = this.reg[this.rt];
  }

  sb() {
    const byteAddr = this.reg[this.rs] + this.imm;
    const wordAddr = byteAddr - (byteAddr % 4);
    const word = this.toHexString(this.DM[wordAddr / 4], 8);
    const start = 2 * (4 - (byteAddr % 4)) - 2; // byte
    const end = 2 * (4 - (byteAddr % 4)); // byte
    const result = word.slice(0, start) +
      this.toHexString(this.reg[this.rt], 8).slice(6, 8) +
      word.slice(end, 8);
    this.DM[wordAddr / 4] = this.parseInt32(result, 16);
  }

  j() {
    this.pc = this.target;
  }

  jal() {
    this.reg[31] = this.pc;
    this.pc = this.target;
  }

  //output functions
  regToHex() {
    const hexArray = [];
    for (let i = 0; i < this.reg.length; i++) {
      const hexString = "0x" + this.toHexString(this.reg[i], 8);
      hexArray.push(hexString);
    }
    return hexArray;
  }

  DMToHex() {
    const hexArray = [];
    for (let i = 0; i < this.DM.length; i++) {
      const hexString = "0x" + this.toHexString(this.DM[i], 8);
      hexArray.push(hexString);
    }
    return hexArray;
  }

  pcToHex() {
    return "0x" + this.toHexString(this.pc, 8);
  }

  hiToHex() {
    return "0x" + this.toHexString(this.hi, 8);
  }

  loToHex() {
    return "0x" + this.toHexString(this.lo, 8);
  }

  // helper functions
  parseInt32(inputStr, radix) {
    return this.signedInt(parseInt(inputStr, radix));
  }

  signedInt(unsigned) {
    const uint32Array = new Uint32Array(1);
    uint32Array[0] = unsigned;
    const int32Array = new Int32Array(uint32Array.buffer);
    return int32Array[0];
  }

  signExtend(inputStr, initialLen, finalLen) {
    let outputStr = inputStr;
    const signBit = inputStr.charAt(0);
    const signExtension = signBit.repeat(finalLen - initialLen);
    if (initialLen < finalLen) {
      outputStr = signExtension + inputStr;
    } else if (initialLen > finalLen) {
      outputStr = inputStr.slice(initialLen - finalLen);
    }
    return outputStr;
  }

  toHexString(num, hexLen) {
    // Get the binary string representation of the number in two's complement form
    const binaryStr = this.toBinString(num, hexLen * 4);

    // Convert the binary string to a hexadecimal string
    const hexStr = parseInt(binaryStr, 2).toString(16);

    // Pad the hexadecimal string with zeros to the desired length
    return hexStr.padStart(hexLen, '0');
  }

  toBinString(num, binLen) {
    // Convert num to binary string
    let binaryStr = Math.abs(num).toString(2);

    // If binaryStr is shorter than binLen, pad with zeros to the left
    binaryStr = binaryStr.padStart(binLen, '0');

    // If num is negative, take the two's complement
    if (num < 0) {
      binaryStr = this.twosComplement(binaryStr, binLen);
    }

    // Return binary string
    return binaryStr;
  }

  twosComplement(binaryStr, length) {
    // Pad the binary string with zeros on the left to the given length
    const paddedStr = binaryStr.padStart(length, "0");

    // Invert all bits
    const invertedStr = paddedStr.split("").map(bit => bit === "0" ? "1" : "0").join("");

    // Add 1 to the inverted value
    let carry = 1;
    let result = "";
    for (let i = invertedStr.length - 1; i >= 0; i--) {
      const sum = parseInt(invertedStr[i]) + carry;
      if (sum === 2) {
        result = "0" + result;
        carry = 1;
      } else {
        result = sum.toString() + result;
        carry = 0;
      }
    }

    // Pad the result with zeros on the left to the given length
    return result;
  }
}
