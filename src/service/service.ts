const {root} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
} = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !root[userCommand]) {
  root[DEFAULT_COMMAND].run();
  process.exit(ExitCode.SUCCESS);
}

root[userCommand].run(userArguments.slice(1));
