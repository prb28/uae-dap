import { DebugInfo } from "./debugInfo";
import { URI as Uri } from "vscode-uri";
import * as cp from "child_process";
import * as path from "path";

const wasmPath = path.join(__dirname, "..", "wasm", "cstool");

/**
 * Class to disassemble the m68k binaries
 */
export class Capstone {
  /**
   * Disassemble a buffer
   * @param buffer Buffer to disassemble
   */
  public async disassemble(buffer: string): Promise<string> {
    const args = ["m68k", buffer];

    const process = cp.fork(wasmPath, args, { stdio: "pipe" });

    let code = "";
    process.stdout?.on("data", (data) => (code += data));
    process.stderr?.on("data", (data) => (code += data));

    return new Promise((resolve, reject) => {
      process.on("exit", () =>
        code.includes("ERROR") ? reject(code) : resolve(code)
      );
      process.on("error", () => reject(code));
    });
  }

  /**
   * Disassemble a amiga hunk file
   * @param filename File to disassemble
   */
  public async disassembleFile(filename: Uri): Promise<string> {
    const di = new DebugInfo(filename);
    if (await di.load()) {
      const codeDataArray = di.getCodeData();
      let allCode = "";
      for (const codeData of codeDataArray) {
        let s = "";
        for (const b of codeData) {
          s += this.padStartWith0(b.toString(16), 8);
        }
        const data = await this.disassemble(s);
        allCode += data + "\n";
      }
      return allCode;
    } else {
      throw new Error(`File '${filename}' could not be parsed`);
    }
  }

  private padStartWith0(stringToPad: string, targetLength: number): string {
    targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
    let padString = "0";
    if (stringToPad.length > targetLength) {
      return stringToPad;
    } else {
      targetLength = targetLength - stringToPad.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + stringToPad;
    }
  }
}
