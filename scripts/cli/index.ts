import { Argument, program } from "commander";
import { generatorList, getClientChoices, LangArg, PROMPT_CLIENTS, PROMPT_LANGUAGES, transformSelection } from "./utils";
import { generate } from "../generate";
import { setVerbose } from "../common";

const args = {
  language: new Argument('[language]', 'The language').choices(PROMPT_LANGUAGES),
  languages: new Argument('[language...]', 'The language').choices(getClientChoices('all')),
  clients: new Argument('[client...]', 'The client').choices(PROMPT_CLIENTS),
  client: new Argument('[client]', 'The client').choices(PROMPT_CLIENTS),
};

const flags = {
  verbose: {
    flag: '-v, --verbose',
    description: 'make the generation verbose',
  },
};

program.name('cli');

program
  .command('generate')
  .description('Generate a specified client')
  .addArgument(args.language)
  .addArgument(args.clients)
  .option(flags.verbose.flag, flags.verbose.description)
  .action(async (langArg: LangArg, clientArg: string[], { verbose }) => {
    const { language, client, clientList } = transformSelection({
      langArg,
      clientArg,
    });

    setVerbose(Boolean(verbose));

    const generators = generatorList({ language, client, clientList });
    await generate(generators);
  });


program.parse();
