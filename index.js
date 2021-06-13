#!/usr/bin/env node

const clear = require('clear');
const fs = require('fs');
const { Command } = require('commander');

const logger = require('./lib/logger');
const { getAction, selectProject } = require('./lib/question');

const handler = require('./lib/handler');

function getConfig() {
  const program = new Command();
  program.version('0.0.1', '-v, --version');

  program
    .option('--init [path]', ' create config.json to <path>')
    .option('-c, --config <path>', 'config file')
    .parse();

  const { init, config } = program.opts();

  if (init) {
    const configFile =
      init === true ? `${process.cwd()}/config.json` : init;

    logger.log(`Creating ${configFile}`);

    const content = {
      'gitlab-api': 'https://gitlab.com/api/v4',
      'gitlab-token': 'YOUR_GITLAB_TOKEN',
      workspace: '',
      projects: [],
    };

    fs.writeFileSync(
      configFile,
      JSON.stringify(content, null, 4),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );

    process.exit();
  }

  if (!config) {
    logger.error('Config not found!');
    process.exit();
  }

  const file = fs.readFileSync(`${config}`).toString();
  return JSON.parse(file);
}

async function main() {
  logger.logo();
  const config = getConfig();

  const { action: rawAction } = await getAction();
  const { projects } = await selectProject(config.projects);
  const action = /\[.*?\]/.exec(rawAction)[0].slice(1, -1);

  return handler[action](config);
}

main();
