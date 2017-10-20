import { getEnvVariable } from './get-env-variable';

/**
 * Parses an options object, and replace any environment variable with the actual value
 *
 * For example:
 * Input:
 *    {
 *       apiBase: 'https://gitlab.com',
 *       gitlabApiToken: '${GITLAB_API_TOKEN}'
 *    }
 * Output (assuming that there is an environment variable GITLAB_API_TOKEN, with value of `xyz123`):
 *    {
 *       apiBase: 'https://gitlab.com',
 *       gitlabApiToken: 'xyz123'
 *    }
 *
 * @param {Object} options
 *
 * @return {Object}
 */
function parseOptions(options) {
  const parsedOptions = {};

  Object.keys(options).forEach((key) => {
    let value = options[key];

    // Replace if value matches ${...}
    const match = value.match(/\${(.*)}$/);
    if (match) {
      const variableName = match[1];
      value = getEnvVariable(variableName);
    }

    parsedOptions[key] = value;
  });

  return parsedOptions;
}

/**
 * Construct remark plugin from pluginConfig, which could be a string or an array.
 *
 * @example
 *  [
 *    "remark-gitlab-artifact",
 *    {
 *      "apiBase": "https://gitlab.com",
 *      "gitlabApiToken": "abc-123"
 *    }
 *  ]
 *
 * @param {String|Array} pluginConfig
 * @return {Function|Array} remark plugin
 */
function loadPlugin(pluginConfig) {
  let plugin;

  try {
    if (typeof pluginConfig === 'string') {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      plugin = require(pluginConfig);
    } else if (pluginConfig instanceof Array) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const module = require(pluginConfig[0]);
      let options = {};

      if (pluginConfig[1]) {
        options = parseOptions(pluginConfig[1]);
      }

      plugin = [module, options];
    } else {
      console.error('unsupported pluginConfig', JSON.stringify(pluginConfig, null, 2));
    }
  } catch (error) {
    throw new Error(`Error loading npm package for ${JSON.stringify(pluginConfig, null, 2)}. More details: ${error}`);
  }

  return plugin;
}

/**
 * Load all remark plugins specified in config and return a remark preset object.
 * config is an object that looks like the following:
 *
 * @example
 *   {
 *     "plugins": [
 *       "remark-comment-config",
 *       "remark-graphviz",
 *       [
 *         "remark-gitlab-artifact",
 *         {
 *           "apiBase": "https://gitlab.com",
 *           "gitlabApiToken": "abc-123"
 *         }
 *       ]
 *     ]
 *   }
 *
 * @param {Object} config
 * @return {Object} remark preset - https://github.com/unifiedjs/unified#preset
 */
export default function loadRemarkPreset(config) {
  if (!config || !config.plugins) {
    return {};
  }

  const plugins = config.plugins
    .map(loadPlugin)
    .filter(plugin => plugin);

  const preset = {
    plugins,
  };

  if (config.settings) {
    preset.settings = config.settings;
  }

  return preset;
}
