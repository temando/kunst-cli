import path from 'path';
import prepareRunner from './../../src/lib/kunst-runner';

const fixturesDir = path.join(__dirname, '../fixtures/full');
const runtimeDir = path.join(__dirname, '../runtime');

const loggerStub = {
  error: jest.fn(),
  profile: jest.fn(),
};

const kunstStub = {
  processMarkdownFile: jest.fn(() => Promise.resolve()),
  processDirectory: jest.fn(() => Promise.resolve([Promise.resolve()])),
};

describe('runner', () => {
  it('returns a runner function', () => {
    expect(typeof prepareRunner(kunstStub, loggerStub)).toEqual('function');
  });

  it('runner can handle a directory', async () => {
    const runner = prepareRunner(kunstStub, loggerStub);
    const promises = await runner(fixturesDir, runtimeDir);

    expect(promises).toHaveLength(1);
  });

  it('runner can handle a single file', async () => {
    const runner = prepareRunner(kunstStub, loggerStub);
    const promises = await runner(fixturesDir, runtimeDir, `${fixturesDir}/index.md`);

    expect(promises).toHaveLength(1);
  });
});
