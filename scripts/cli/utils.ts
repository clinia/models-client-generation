import { CLIENTS, LANGUAGES } from "../common";
import { Language } from "../types";

export const ALL = "all";
export const PROMPT_LANGUAGES = [ALL, ...LANGUAGES];
export const PROMPT_CLIENTS = [ALL, ...CLIENTS];

export type AllLanguage = Language | typeof ALL;
export type LangArg = AllLanguage | undefined;

type Selection = {
  language: AllLanguage;
  client: string[];
  clientList: string[];
};

type Args = {
  langArg: LangArg;
  clientArg: string[];
};

export function getClientChoices(
  language?: LangArg,
  clientList = PROMPT_CLIENTS,
): string[] {
  const withoutClinia = clientList.filter((client) => client !== 'clinia');

  return language === ALL || language === 'javascript'
    ? clientList
    : withoutClinia;
}

export function transformSelection({ langArg, clientArg }: Args): Selection {
  const selection: Selection = {
    client: [ALL],
    language: langArg || ALL,
    clientList: [],
  };

  selection.clientList = getClientChoices(selection.language, CLIENTS);

  if (clientArg?.length) {
    clientArg.forEach((client) => {
      if (![ALL, ...selection.clientList].includes(client)) {
        throw new Error(
          `The '${clientArg}' client does not exist for ${
            selection.language
          }.\n\nAllowed choices are: ${selection.clientList.join(', ')}`,
        );
      }
    });

    selection.client = clientArg;
  }

  return selection;
}
