/**
 * Returns environment variable for a given variable name, null if the variable does not exist.
 *
 * @param {String} variableName
 *
 * @return {String}
 */
export function getEnvVariable(variableName) { // eslint-disable-line import/prefer-default-export
  if (process.env[variableName]) {
    return process.env[variableName];
  }

  return '';
}
