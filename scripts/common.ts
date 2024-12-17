import fsp from 'fs/promises';
import path from 'path';

import type {
  Generator,
  Language,
} from './types.js';

import clientsConfig from '../config/clients.config.json' assert { type: 'json' };


export const CI = Boolean(process.env.CI);

// This script is run by `yarn workspace ...`, which means the current working directory is `./script`
const ROOT_DIR = path.resolve(process.cwd(), '..');

export const ROOT_ENV_PATH = path.resolve(ROOT_DIR, '.env');

// Build `GENERATORS` from the `clients.config.json` file
export const GENERATORS = Object.entries(clientsConfig).reduce(
  (current, [language, { clients, folder, ...gen }]) => {
    for (const client of clients) {
      let output = folder;
      let key = '';
      let clientName = '';

      if (typeof client !== 'string') {
        key = `${language}-${client.name}`;
        clientName = client.name;
        output = client.output;
      } else {
        key = `${language}-${client}`;
        clientName = client;
      }

      current[key] = {
        ...gen,
        output,
        client: clientName,
        language: language as Language,
        key,
      };

      // // guess the package name for js from the output folder variable
      // if (language === 'javascript') {
      //   current[key].additionalProperties.packageName = output.substring(
      //     output.lastIndexOf('/') + 1,
      //   );
      // }
    }

    return current;
  },
  {} as Record<string, Generator>,
);

export const LANGUAGES = [
  ...new Set(Object.values(GENERATORS).map((gen) => gen.language)),
];

export const CLIENTS = [
  ...new Set(Object.values(GENERATORS).map((gen) => gen.client)),
];


/**
 * Splits a string for a given `delimiter` (defaults to `-`) and capitalize each
 * parts except the first letter.
 *
 * `search-client` -> `searchClient`.
 */
function camelize(str: string, delimiter: string = '-'): string {
  return str
    .split(delimiter)
    .map((part, i) => (i === 0 ? part : capitalize(part)))
    .join('');
}

/**
 * Sets the first letter of the given string in capital.
 *
 * `searchClient` -> `SearchClient`.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toSnakeCase(str: string): string {
  return (str.charAt(0).toLowerCase() + str.slice(1))
    .replace(/[A-Z]/g, (letter) => `_${letter}`)
    .replace(/(-|\s)/g, '_')
    .toLowerCase();
}
