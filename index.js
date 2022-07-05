#!/usr/bin/env node

const clear = require('clear');
const fs = require('fs');
const homedir = require('os').homedir();
const { Command } = require('commander');
const logger = require('./lib/logger');
const { selectProject, getJiraLoginInfo } = require('./lib/question');
const handler = require('./lib/handler');

function parseArgs() {
  const program = new Command();

  program
    .option('-c, --config <path>', 'config file')
    .option('--ignore-ssl [true]')
    .version('1.0.5', '-v, --version');

  program
    .command('init [path]')
    .description('create .mcloudconfig');

  program
    .command('azure')
    .description('execcute azure tool');

  program
    .command('gitlab')
    .description('execcute gitlab tool');

  // program
  //   .command('docker')
  //   .description('execcute docker tool');

  // program
  //   .command('k8s')
  //   .description('execcute k8s tool');

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
  const configFile = initConfigPath || `${homedir}/.mcloudconfig`;

  logger.log(`Creating ${configFile}`);

  const content = {
    'git-api': 'https://gitlab.com/api/v4',
    'git-pat': 'YOUR_GITLAB_TOKEN',
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
  const { config = `${homedir}/.mcloudconfig` } = opts;

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
  const { projects } = await selectProject(config.projects, action);

  return handler[action](projects, config);
}

main();
