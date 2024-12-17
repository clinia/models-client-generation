import { createSpinner } from './spinners.js';
import type { Generator } from './types.js';

export async function generate(generators: Generator[]): Promise<void> {
  await setupAndGen(generators, async (gen) => {
    // Call generator
    // await gen.generate();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second timeout
  });

  // TODO: format the generated code
}


export async function setupAndGen(
  generators: Generator[],
  fn: (gen: Generator) => Promise<void>,
): Promise<void> {
  for (const gen of generators) {
    const spinner = createSpinner(`generating client for ${gen.key}`);
    await fn(gen);
    spinner.succeed();
  }
}
