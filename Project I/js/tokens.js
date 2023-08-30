export const registers = {
  '$zero': '00000',
  '$at': '00001',
  '$v0': '00010',
  '$v1': '00011',
  '$a0': '00100',
  '$a1': '00101',
  '$a2': '00110',
  '$a3': '00111',
  '$t0': '01000',
  '$t1': '01001',
  '$t2': '01010',
  '$t3': '01011',
  '$t4': '01100',
  '$t5': '01101',
  '$t6': '01110',
  '$t7': '01111',
  '$s0': '10000',
  '$s1': '10001',
  '$s2': '10010',
  '$s3': '10011',
  '$s4': '10100',
  '$s5': '10101',
  '$s6': '10110',
  '$s7': '10111',
  '$t8': '11000',
  '$t9': '11001',
  '$k0': '11010',
  '$k1': '11011',
  '$gp': '11100',
  '$sp': '11101',
  '$fp': '11110',
  '$ra': '11111'
};

export const RTypeInstructions = {
  "add": {
    "opcode": "000000",
    "funct": "100000"
  },
  "sub": {
    "opcode": "000000",
    "funct": "100010"
  },
  "and": {
    "opcode": "000000",
    "funct": "100100"
  },
  "or": {
    "opcode": "000000",
    "funct": "100101"
  },
  "xor": {
    "opcode": "000000",
    "funct": "100110"
  },
  "slt": {
    "opcode": "000000",
    "funct": "101010"
  },
  "jr": {
    "opcode": "000000",
    "funct": "001000"
  },
  "sll": {
    "opcode": "000000",
    "funct": "000000"
  },
  "srl": {
    "opcode": "000000",
    "funct": "000010"
  },
  "sra": {
    "opcode": "000000",
    "funct": "000011"
  },
  "mfhi": {
    "opcode": "000000",
    "funct": "010000"
  },
  "mflo": {
    "opcode": "000000",
    "funct": "010010"
  },
  "mult": {
    "opcode": "000000",
    "funct": "011000"
  },
  "div": {
    "opcode": "000000",
    "funct": "011010"
  }
};

export const ITypeInstructions = {
  "beq": {
    "opcode": "000100"
  },
  "bne": {
    "opcode": "000101"
  },
  "addi": {
    "opcode": "001000"
  },
  "slti": {
    "opcode": "001010"
  },
  "andi": {
    "opcode": "001100"
  },
  "ori": {
    "opcode": "001101"
  },
  "lui": {
    "opcode": "001111"
  },
  "lw": {
    "opcode": "100011"
  },
  "lb": {
    "opcode": "100000"
  },
  "sw": {
    "opcode": "101011"
  },
  "sb": {
    "opcode": "101000"
  }
};

export const JTypeInstructions = {
  "j": {
    "opcode": "000010"
  },
  "jal": {
    "opcode": "000011"
  }
};
