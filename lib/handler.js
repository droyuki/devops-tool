const logger = require('./logger');
const { exec } = require('child_process');
const { getGitAction } = require('./question');
const Gitlab = require('./Gitlab');

function docker(projects) {
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

async function gitlab(projects, c) {
  const { gitAction, ref, tag } = await getGitAction();

  const api = new Gitlab({
    api: c['gitlab-api'],
    token: c['gitlab-token'],
    gid: c['gitlab-group-id'],
    action: gitAction,
    projects: projects,
    parameters: {
      ref,
      tag,
    },
  });

  api.exec();
}

const k8s = () => {
  logger.info('Not Implemet yet');
};

module.exports = {
  docker,
  gitlab,
  k8s,
};
