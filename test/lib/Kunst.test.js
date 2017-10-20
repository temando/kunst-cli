import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import Kunst from './../../src/lib/Kunst';

const fixturesDir = path.join(__dirname, '../fixtures');
const runtimeDir = path.join(__dirname, '../runtime');

describe('Kunst', () => {
  it('can be initialised', () => {
    const kunst = new Kunst(jest.fn());

    expect(kunst).toBeInstanceOf(Kunst);
  });

  it('copy options can be set', () => {
    const kunst = new Kunst(jest.fn(), {
      copy: {
        preserveTimestamps: false,
      },
    });

    expect(kunst.options.copy.preserveTimestamps).toBeFalsy();
  });

  it('can process a directory', async () => {
    const src = `${fixturesDir}/full`;
    const dest = `${runtimeDir}/full`;
    const fn = jest.fn(() => Promise.resolve());

    const kunst = new Kunst(fn);
    const vfiles = await kunst.processDirectory(src, dest);

    expect(vfiles).toHaveLength(2);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith(`${src}/index.md`, `${dest}/index.md`);
    expect(fn).toHaveBeenCalledWith(`${src}/nested/index.md`, `${dest}/nested/index.md`);
    expect(fn).not.toHaveBeenCalledWith(`${src}/assets/miss-me.txt`, `${dest}/assets/miss-me.txt`);

    expect(fs.existsSync(`${dest}/index.md`)).toBeTruthy();
    expect(fs.existsSync(`${dest}/nested/index.md`)).toBeTruthy();
    expect(fs.existsSync(`${dest}/assets/miss-me.txt`)).toBeTruthy();
  });
});
