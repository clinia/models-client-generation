import path from 'path';
import { ROOT_PROTO_PATH } from './common.js';
import { createSpinner } from './spinners.js';
import type { Generator } from './types.js';
import {execa} from 'execa'
import fsp from 'fs/promises';

export async function generate(generators: Generator[]): Promise<void> {
  await setupAndGen(generators, async (gen) => {
    const OUTPUT_PATH = path.resolve(process.cwd(), '..', gen.output);
    // Get all .proto file paths in the proto folder
    const protoFiles = await listProtoFiles(ROOT_PROTO_PATH);

    const { all } = await execa('protoc', [
      `--proto_path`, `${ROOT_PROTO_PATH}`,
      `--go-grpc_out`, `${OUTPUT_PATH}`,
      `--go-grpc_opt`, `paths=source_relative`,
      `--go_out`, `${OUTPUT_PATH}`,
      `--go_opt`, `paths=source_relative`,
      ...protoFiles,
    ]);
    
    console.log(all);
  });

  // TODO: format the generated code
}

async function listProtoFiles(dir: string): Promise<string[]> {
  const files = await fsp.readdir(dir);
  return files.filter(file => file.endsWith('.proto')).map(file => path.join(dir, file));
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
