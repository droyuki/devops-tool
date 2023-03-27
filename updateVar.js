const fetch = require("node-fetch");
const ProxyAgent = require("proxy-agent");
const logger = require("./lib/logger");

const T = "Om5oNmo2Z25ndTN0dDR3ZDRpdzZ1ZXY3bmpyaWZ4YWVzeDVqbHY2Z3RjY2tjcjZwbXA2aHE=";

const f = async ({ method = "get", url, body }) => {
  try {
    const option = {
      method,
      agent: new ProxyAgent(),
      headers: {
        Authorization: "Basic " + T,
        "Content-Type": "application/json",
      },
    };

    if (body) {
      option.body = JSON.stringify(body);
    }
    return await fetch(
      `https://dev.azure.com/cht-tl-poc/mcloud/_apis${url}?api-version=6.0`,
      option
    );
  } catch (error) {
    logger.error("Network error");
    logger.error(error);
    process.exit(0);
  }
};

async function getPipelineIds() {
  const res = await f({
    url: "/build/definitions",
  });

  if(res.status > 200){
    console.error(res.status);
    return []
  }
  const data = await res.json();
  // const targets = [
  //   "msp-azure-compose-service-adaptor",
  //   "msp-orchestrator",
  //   "msp-azure-network-adaptor",
  //   "msp-azure-storage-adaptor",
  //   "msp-azure-vm-adaptor",
  // ]
  // const targets = [
  //   "mcb-account"
  // ]
  const mcbPipelines = data.value.filter(
    (el) => el.name.includes("mcb-") && el.name !== "mcb-manual"
    // (el) => targets.includes(el.name)
  );

  return mcbPipelines;
}

async function getPipelineDef(pipeline) {
  const res = await f({
    url: `/build/definitions/${pipeline.id}`,
  });
  const data = await res.json();
  return data;
}

async function update(def) {
  const v = {
    q_ACTION: {
      value: "",
      allowOverride: true,
    },
    q_AUTHENTICATION: {
      value: "",
      allowOverride: true,
    },
    q_BUILD: {
      value: "",
      allowOverride: true,
    },
    q_BUILD_MODE: {
      value: "",
      allowOverride: true,
    },
    q_DEPLOY: {
      value: "",
      allowOverride: true,
    },
    q_MCB_CLUSTER: {
      value: "",
      allowOverride: true,
    },
    q_MCB_DEFAULT_REPO: {
      value: "",
      allowOverride: true,
    },
    q_MCB_IMAGE_TAG: {
      value: "",
      allowOverride: true,
    },
    q_MCB_VERSION: {
      value: "",
      allowOverride: true,
    },
    q_SKAFFOLD_PROFILE: {
      value: "",
      allowOverride: true,
    },
    q_POOL: {
      value: "",
      allowOverride: true
    }
  };

  def.variables = v;

  const res = await f({
    method: "put",
    body: def,
    url: `/build/definitions/${def.id}`,
  });

  console.log(res.status);
  const data = await res.json();
  console.log(data)
}

async function main() {
  const mcbPipelines = await getPipelineIds();

  for (const p of mcbPipelines) {
    try {
      const data = await getPipelineDef(p);
      update(data);
    } catch (error) {
      logger.error(error);
    }
  }
}

main();
