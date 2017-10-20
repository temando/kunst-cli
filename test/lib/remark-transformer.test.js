import toVFile from 'to-vfile';
import path from 'path';
import fs from 'fs-extra';
import setup, { addMetadata } from './../../src/lib/remark-transformer';
import loadRemarkPreset from './../../src/lib/load-remark-preset';

const fixturesDir = path.join(__dirname, '../fixtures');
const runtimeDir = path.join(__dirname, '../runtime');

describe('remarkTransformer', () => {
  it('can add metadata to a VFile', () => {
    const srcFile = `${fixturesDir}/full/index.md`;
    const destFile = `${runtimeDir}/index.md`;
    const vFile = toVFile.readSync(srcFile);
    addMetadata(vFile, destFile);

    expect(vFile.data).toHaveProperty('destinationFilePath', destFile);
    expect(vFile.data).toHaveProperty('destinationDir', runtimeDir);
  });

  it('can transform a markdown file', async () => {
    expect.assertions(3);
    fs.ensureDirSync(runtimeDir);
    const srcFile = `${fixturesDir}/full/index.md`;
    const destFile = `${runtimeDir}/index.md`;
    const config = fs.readJSONSync(`${fixturesDir}/kunst.config.json`);
    const preset = loadRemarkPreset(config);

    const transformerFn = setup(preset);
    expect(typeof transformerFn).toBe('function');

    const vFile = await transformerFn(srcFile, destFile);
    expect(typeof vFile).toEqual('object');
    expect(vFile.messages).toHaveLength(0);
  });
});
