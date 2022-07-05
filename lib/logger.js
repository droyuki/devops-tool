const chalk = require('chalk');
const figlet = require('figlet');

function logo() {
  console.log();
  console.log(
    chalk.blue(
      figlet.textSync('mcloud', {
        font: 'slant',
      })
    )
  );
  console.log();
}

function log(msg) {
  console.log(chalk.blueBright(`${msg}`));
}

function red(msg){
  console.log(chalk.red(`${msg}`));
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
  red,
};
