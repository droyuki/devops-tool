const logger = require('./logger');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

class Gitlab {
  constructor(configs) {
    this.action = configs.action;
    this.projects = configs.projects;
    this.parameters = configs.parameters;

    this.gitlabApi = async ({ method = 'get', url }) => {
      try {
        const option = {
          method,
          headers: {
            'PRIVATE-TOKEN': configs.token,
          },
        }
  
        const proxy =
          process.env.https_proxy ||
          process.env.HTTPS_PROXY || '';

        if (proxy) {
          option.agent = new HttpsProxyAgent(proxy);
        }
  
        return await fetch(`${configs.api}${url}`, option);
      } catch (error) {
        logger.error('Network error')
        process.exit(0)
      }
    };
  }

  getProjectId = async (p) => {
    const res = await this.gitlabApi({
      url: `/search?scope=projects&confidential=true&search=${p}`,
    });
    const projectInfo = await res.json();
    return projectInfo.find((el) => el.name === p).id;
  };

  'create tag' = async () => {
    const { tag, ref } = this.parameters;
    logger.info(`Create tag ${tag} from ${ref}`);

    const f = async (project) => {
      logger.log(`${project}`);
      const pid = await this.getProjectId(project);
      const res = await this.gitlabApi({
        method: 'post',
        url: `/projects/${pid}/repository/tags?tag_name=${tag}&ref=${ref}`,
      });
    };

    this.projects.forEach(f);
  };

  'delete tag' = () => {
    const { tag } = this.parameters;
    logger.info(`Delete tag ${tag}`);

    const f = async (project) => {
      logger.log(`${project}`);
      const pid = await this.getProjectId(project);
      const res = await this.gitlabApi({
        method: 'delete',
        url: `/projects/${pid}/repository/tags/${tag}`,
      });
    };

    this.projects.forEach(f);
  };

  protect = () => {
    const { ref } = this.parameters;
    logger.info(`Protect ${ref}`);

    const f = async (project) => {
      logger.log(`${project}`);
      const pid = await this.getProjectId(project);
      const res = await this.gitlabApi({
        method: 'post',
        url: `/projects/${pid}/protected_branches?name=${ref}`,
      });
    };

    this.projects.forEach(f);
  };

  unprotect = () => {
    const { ref } = this.parameters;
    logger.info(`Unprotect ${ref}`);

    const f = async (project) => {
      logger.log(`${project}`);
      const pid = await this.getProjectId(project);
      const res = await this.gitlabApi({
        method: 'delete',
        url: `/projects/${pid}/protected_branches/${ref}`,
      });
    };

    this.projects.forEach(f);
  };

  merge = () => {};

  exec = () => {
    this[this.action]();
  };
}

module.exports = Gitlab;
