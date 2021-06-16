#!/usr/bin/env node

const clear = require('clear');
const fs = require('fs');
const { Command } = require('commander');

const logger = require('./lib/logger');
const { getAction, selectProject } = require('./lib/question');

const handler = require('./lib/handler');

function parseArgs() {
  const program = new Command();

  program
    .option('--init [path]', ' create config.json to <path>')
    .option('-c, --config <path>', 'config file')
    .version('1.0.0', '-v, --version');

  program.command('gitlab').description('execcute gitlab tool');
  program.command('docker').description('execcute docker tool');
  program.command('k8s').description('execcute k8s tool');
  program.parse();

  const [action] = program.args;
  const opts = program.opts();

  return { action, ...opts };
}

function getConfig(opts) {
  const { init, config } = opts;

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
  const { action, ...opts } = parseArgs();
  const config = getConfig(opts);
  const { projects } = await selectProject(config.projects);

  return handler[action](projects, config);
}

main();
