#!/usr/bin/env node

const clear = require('clear');
const fs = require('fs');
const homedir = require('os').homedir();
const { Command } = require('commander');
const logger = require('./lib/logger');
const { getAction, selectProject } = require('./lib/question');
const handler = require('./lib/handler');

function parseArgs() {
  const program = new Command();

  program
    .option('-c, --config <path>', 'config file')
    .option('--ignore-ssl [true]')
    .version('1.0.4', '-v, --version');

  program
    .command('init [path]')
    .description('create gfconfig');

  program
    .command('gitlab')
    .description('execcute gitlab tool');

  program
    .command('docker')
    .description('execcute docker tool');

  program
    .command('k8s')
    .description('execcute k8s tool');

  program.parse();

  const [action, initConfigPath] = program.args;
  const { ignoreSsl, ...opts } = program.opts();

  if (ignoreSsl) {
    logger.log('ignore ssl')
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  return { action, initConfigPath, ...opts };
}

function initConfig(initConfigPath) {
  const configFile = initConfigPath || `${homedir}/gfconfig`;

  logger.log(`Creating ${configFile}`);

  const content = {
    'gitlab-api': 'https://gitlab.com/api/v4',
    'gitlab-token': 'YOUR_GITLAB_TOKEN',
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

function getConfig(opts) {
  const { config = `${homedir}/gfconfig` } = opts;

  try {
    if (fs.existsSync(config)) {
      const file = fs.readFileSync(`${config}`).toString();
      return JSON.parse(file);
    } else {
      logger.error('Config not found!');
      process.exit();
    }
  } catch (error) {
    logger.error(error);
    process.exit();
  }
}

async function main() {
  logger.logo();
  const { action, initConfigPath, ...opts } = parseArgs();

  if (action === 'init') {
    initConfig(initConfigPath);
  }

  const config = getConfig(opts);
  const { projects } = await selectProject(config.projects);

  return handler[action](projects, config);
}

main();
