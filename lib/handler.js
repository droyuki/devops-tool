const logger = require('./logger');
const { exec } = require('child_process');
const { getGitAction } = require('./question');
const Gitlab = require('./Gitlab');

function docker({ projects }) {
  projects.forEach((p) => {
    const dockerProcess = exec(
      `docker pull ${p}`,
      (error, stdout, stderr) => {
        if (error) {
          logger.error(error);
          return;
        }

        stdout && logger.info(stdout);
        stderr && logger.error(stderr);

        dockerProcess.on('exit', (c) => {
          console.log(`${p} exit with code ${c}`);
        });
      }
    );
  });
}

async function gitlab(c) {
  const { gitAction, ref, tag } = await getGitAction();

  logger.log(JSON.stringify({ gitAction, ref, tag }));
  const api = new Gitlab({
    api: c['gitlab-api'],
    token: c['gitlab-token'],
    action: gitAction,
    projects: c.projects,
    parameters: {
      ref,
      tag,
    },
  });

  api.exec();
}

module.exports = {
  'docker export': docker,
  git: gitlab,
  deploy: () => {},
};
