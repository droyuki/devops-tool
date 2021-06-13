const chalk = require('chalk');
const figlet = require('figlet');

function logo() {
  console.log();
  console.log(
    chalk.blue(
      figlet.textSync('mcb DevOps', {
        font: 'slant',
      })
    )
  );
}

function log(msg) {
  console.log(chalk.blueBright(`${msg}`));
}

function info(msg) {
  console.log(chalk.green(`[INFO] ${msg}`));
}

function error(msg) {
  console.log(chalk.red(`[ERROR] ${msg}`));
}

module.exports = {
  logo,
  log,
  info,
  error,
};
