import chalk from "chalk"
import yargs from "yargs"
import {hideBin} from "yargs/helpers" // eslint-disable-line node/file-extension-in-import -- This is not a real file path, this is a resolve shortcut defined in node_modules/yargs/package.json[exports][./helpers]

/**
 * @typedef {Object} Args
 * @prop {string} input
 * @prop {boolean} color
 */

/**
 * @param {Args} args
 * @return {Promise<void>}
 */
const job = async args => {
  const uppercaseInput = args.input.toUpperCase()
  if (args.color) {
    process.stdout.write(chalk.yellow(uppercaseInput))
  } else {
    process.stdout.write(uppercaseInput)
  }
}

/**
 * @type {import("yargs").CommandBuilder}
 */
const builder = {
  input: {
    type: "string",
    description: "Input text",
  },
  color: {
    type: "boolean",
    default: false,
    description: "Use color",
  },
}

await yargs(hideBin(process.argv))
  .scriptName("uppercase-converter")
  .version("1.0.0")
  .command("$0 <input>", "Converts input to uppercase", builder, job)
  .argv