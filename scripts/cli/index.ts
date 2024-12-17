import { Argument, program } from "commander";
import { getClientChoices, LangArg, PROMPT_CLIENTS, PROMPT_LANGUAGES, transformSelection } from "./utils";

const args = {
  language: new Argument('[language]', 'The language').choices(PROMPT_LANGUAGES),
  languages: new Argument('[language...]', 'The language').choices(getClientChoices('all')),
  clients: new Argument('[client...]', 'The client').choices(PROMPT_CLIENTS),
  client: new Argument('[client]', 'The client').choices(PROMPT_CLIENTS),
};

program.name('cli');

program
  .command('generate')
  .description('Generate a specified client')
  .addArgument(args.language)
  .addArgument(args.clients)
  .action(async (langArg: LangArg, clientArg: string[], { verbose }) => {
    const { language, client, clientList } = transformSelection({
      langArg,
      clientArg,
    });

    console.log('language:', language);
    console.log('client:', client);
    console.log('clientList:', clientList);
  });


program.parse();
