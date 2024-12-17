import type config from '../config/clients.config.json';

/**
 * Config.
 */
export type LanguageConfig = {
  folder: string;
  gitRepoId: string;
  packageVersion?: string;
};

export type Generator = Record<string, any> & {
  language: Language;
  client: string;
  key: string;
  output: string;
};

export type Language = keyof typeof config;
