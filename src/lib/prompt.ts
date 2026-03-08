import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

export async function ask(question: string): Promise<string> {
  const rl = createInterface({ input, output });
  try {
    const value = await rl.question(question);
    return value.trim();
  } finally {
    rl.close();
  }
}
