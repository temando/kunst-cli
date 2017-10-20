import vfile from 'vfile';
import Promise from 'bluebird';
import reporter from './../../src/lib/cli-reporter';

const loggerStub = {
  info: jest.fn(),
  warn: jest.fn(),
};

describe('cli-reporter', () => {
  const foo = vfile({ path: 'foo.md' });
  foo.message('Foo');
  const bar = vfile({ path: 'bar.md' });
  bar.message('Bar');

  beforeEach(() => {
    loggerStub.info.mockReset();
    loggerStub.warn.mockReset();
  });

  it('can report good and bad vfiles', async () => {
    const promises = [Promise.resolve(foo), Promise.reject(bar)].map(
      (p) => p.reflect(),
    );

    const vFiles = Promise.all(promises);

    await reporter(loggerStub, vFiles);

    expect(loggerStub.info).toHaveBeenCalledTimes(1);
    expect(loggerStub.warn).toHaveBeenCalledTimes(1);
  });

  it('can report just bad vfiles', async () => {
    const promises = [Promise.reject(foo), Promise.reject(bar)].map(
      (p) => p.reflect(),
    );

    const vFiles = Promise.all(promises);

    await reporter(loggerStub, vFiles);

    expect(loggerStub.info).not.toHaveBeenCalledTimes(1);
    expect(loggerStub.warn).toHaveBeenCalledTimes(2);
  });
});
