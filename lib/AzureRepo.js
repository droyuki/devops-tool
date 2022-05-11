const logger = require('./logger');
const fetch = require('node-fetch');
const ProxyAgent = require('proxy-agent');
const querystring = require('querystring');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AzureRepo {
  constructor(configs) {
    this.action = configs.action;
    this.gid = configs.gid;
    this.projects = configs.projects;
    this.parameters = configs.parameters;

    this.fetch = async ({ method = 'get', url, body }) => {
      try {
        const ignoreSsl = configs.ignoreSsl;
        const option = {
          method,
          agent: new ProxyAgent(),
          headers: {
            'Authorization': 'Basic ' + configs.token,
            'Content-Type': 'application/json'
          }
        };

        if (body) {
          option.body = JSON.stringify(body)
        }
        return await fetch(`${configs.api}${url}`, option);
      } catch (error) {
        logger.error('Network error');
        process.exit(0);
      }
    };
  }

  getProjectRefId = async (p) => {
    const { ref } = this.parameters
    const searchApi = `/repositories/${p}/refs?api-version=6.0`

    const res = await this.fetch({
      url: searchApi,
    });

    const projectRefs = await res.json();
    return projectRefs.value.find((el) => el.name === `refs/heads/${ref}`).objectId;
  };

  runEachProject = async (f) => {
    for(let p of this.projects){
      await sleep(1000)
      const res = await f(p)

      if(res.status > 299){
        const body = await res.text();
        logger.red(`[${res.status}] ${p}, ${api} ${body}`);
      } else {
        logger.log(`[${res.status}] ${p}`);
      }
    }
  };

  'create tag' = async () => {
    const { branch } = this.parameters;

    const runAsync = async (p) => {
      const projectRefId = await this.getProjectRefId(p);
      const body = [{
        "name": `refs/tags/${branch}`,
        "oldObjectId": "0000000000000000000000000000000000000000",
        "newObjectId": projectRefId
      }];

      const res = await this.fetch({
        method: 'post',
        url: `/repositories/${p}/refs?api-version=6.`,
        body: body
      });
      return res;
    };
    
    this.runEachProject(runAsync);
  };

  'create branch' = async () => {
    const { branch } = this.parameters;

    const runAsync = async (p) => {
      const projectRefId = await this.getProjectRefId(p);
      const body = [{
        "name": `refs/heads/${branch}`,
        "oldObjectId": "0000000000000000000000000000000000000000",
        "newObjectId": projectRefId
      }];

      const res = await this.fetch({
        method: 'post',
        url: `/repositories/${p}/refs?api-version=6.`,
        body: body
      });
      return res;
    };
    
    this.runEachProject(runAsync);
  };

  'delete branch' = () => {
    const { branch } = this.parameters;

    const runAsync = async (p) => {
      const projectRefId = await this.getProjectRefId(p);
      const body = [{
        "name": `refs/heads/${branch}`,
        "newObjectId": "0000000000000000000000000000000000000000",
        "oldObjectId": projectRefId
      }];

      const res = await this.fetch({
        method: 'post',
        url: `/repositories/${p}/refs?api-version=6.`,
        body: body
      });
      return res;
    };
    
    this.runEachProject(runAsync);
  };

  'delete tag' = () => {
    const { branch } = this.parameters;

    const runAsync = async (p) => {
      const projectRefId = await this.getProjectRefId(p);
      const body = [{
        "name": `refs/tags/${branch}`,
        "newObjectId": "0000000000000000000000000000000000000000",
        "oldObjectId": projectRefId
      }];

      const res = await this.fetch({
        method: 'post',
        url: `/repositories/${p}/refs?api-version=6.`,
        body: body
      });
      return res;
    };
    
    this.runEachProject(runAsync);
  };


  exec = () => {
    this[this.action]();
  };
}

module.exports = AzureRepo;
