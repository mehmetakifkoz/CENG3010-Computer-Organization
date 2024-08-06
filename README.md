# MARS Web App
This repository contains the CENG3010 Computer Organization course projects. The first project involves developing a GUI-based 32-bit MIPS simulator, while the second project centers on designing a custom 16-bit MIPS-like processor with a unique instruction set.

---

# Project I: 32-bit MIPS Simulator with GUI Dashboard

The first project is a 32-bit MIPS Simulator with a GUI Dashboard. This project contains a simulator that accurately replicates the MIPS architecture while providing a user-friendly graphical user interface (GUI) for code execution and analysis.

## Features

- **Interactive Dashboard:** The GUI dashboard provides real-time visualization of key components including General Purpose Registers (GPRs), Program Counter (PC), Hi-Lo Registers, Instruction Memory (IM) and Data Memory (DM), offering insights into the simulation's progress.
- **Branching Support:** Full support for both conditional and unconditional branches ensures accurate simulation of branching behavior within the code.
- **Procedure Calls:** The simulator effectively handles procedure calls and implementations, replicating the behavior of functions within the MIPS architecture.
- **Supported Instructions:**
  - **R-Type:**
    - `add`, `sub`, `and`, `or`, `xor`,
    - `mult`, `div`, `mfhi`, `mflo`,
    - `sll`, `srl`, `sra`,
    - `slt`, `jr`
  - **I-Type:**
    - `addi`, `andi`, `ori`, 
    - `lw`, `lb`, `sw`, `sb`,
    - `beq`, `bne`,
    -  `lui`, `slti`
  - **J-Type:**
    - `j`, `jal`
- **User-Friendly GUI:** The graphical interface enables code input, observation of registers, memory inspection, and other essential fields, making the simulation process user-friendly.
- **Memory Capacity:** With total of 1KB allocated for both data and instruction memory, you can explore and visualize their contents directly within the GUI.

In summary, Project I presents a 32-bit MIPS Simulator with a user-friendly GUI Dashboard. This tool accurately replicates 32-bit MIPS architecture, offers a simple platform to run and understand code, supports various instructions including branching, and provides an accessible platform for code execution and analysis. It's a great way to explore and visualize MIPS operations.
