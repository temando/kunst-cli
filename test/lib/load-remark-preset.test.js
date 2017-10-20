import sinon from 'sinon';
import loadRemarkPreset from '../../src/lib/load-remark-preset';

describe('load-remark-preset', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('load config', () => {
    const config = {
      plugins: [
        'remark-comment-config',
      ],
    };

    const preset = loadRemarkPreset(config);

    expect(preset.plugins).toBeInstanceOf(Array);
    expect(preset.plugins).toHaveLength(1);
    preset.plugins.forEach((plugin) => {
      expect(typeof plugin).toBe('function');
    });

    const functionNames = preset.plugins.map(plugin => plugin.name);
    expect(functionNames).toContain('commentconfig');
  });

  it('load config with environment variables', () => {
    const env = require('../../src/lib/get-env-variable');
    const getEnvVariableMock = sandbox.stub(env, 'getEnvVariable');
    getEnvVariableMock.withArgs('API_BASE').returns('https://gitlab.com');
    getEnvVariableMock.withArgs('GITLAB_API_TOKEN').returns('abc123');

    const config = {
      plugins: [
        [
          'remark-gitlab-artifact',
          {
            apiBase: '${API_BASE}',
            gitlabApiToken: '${GITLAB_API_TOKEN}',
            directory: 'blah',
          },
        ],
      ],
    };

    const preset = loadRemarkPreset(config);
    expect(preset.plugins).toBeInstanceOf(Array);
    expect(preset.plugins).toHaveLength(1);

    const plugin = preset.plugins[0];
    expect(plugin).toBeInstanceOf(Array);
    expect(plugin).toHaveLength(2);
    expect(typeof plugin[0]).toBe('function');
    expect(plugin[1].apiBase).toBe('https://gitlab.com');
    expect(plugin[1].gitlabApiToken).toBe('abc123');
    expect(plugin[1].directory).toBe('blah');
  });
});
