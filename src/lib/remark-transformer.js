import Promise from 'bluebird';
import path from 'path';
import unified from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import toVFile from 'to-vfile';

/**
 * Mutates vFile by adding metadata (such as context/destination)
 *
 * @param {VFile} vFile
 * @param {string} destinationFilePath
 */
export function addMetadata(vFile, destinationFilePath) {
  // eslint-disable-next-line no-param-reassign
  vFile.data = {
    destinationFilePath,
    destinationDir: path.dirname(destinationFilePath),
  };
}

/**
 * Accepts a unified preset and returns a function capable of transforming
 * with remark.
 *
 * @link https://github.com/unifiedjs/unified#preset
 *
 * @param {object} unifiedPreset
 * @return {function}
 */
export default function setup(unifiedPreset) {
  const vFileRead = Promise.promisify(toVFile.read);
  const vFileWrite = Promise.promisify(toVFile.write);
  const remarkInstance = unified()
    .use(parse, { gfm: true, yaml: true, commonmark: true })
    .use(unifiedPreset)
    .use(stringify)
    .freeze();

  /**
   * Transform the `sourceFilePath` from Markdown, applying any transforms
   * to Markdown and place the result at the destination specified by
   * `destinationFilePath`.
   *
   * @param  {string} sourceFilePath
   * @param  {string} destinationFilePath
   * @return {Promise<VFile>}
   */
  return async function transform(sourceFilePath, destinationFilePath) {
    // Read in the source file as vFile
    const vFileSource = await vFileRead(sourceFilePath);

    // Set some custom meta-data
    addMetadata(vFileSource, destinationFilePath);

    // Run remark on the vFile
    const vFile = await remarkInstance.process(vFileSource);
    vFile.path = destinationFilePath;

    // Write the contents to the destination
    await vFileWrite(vFile);

    return vFile;
  };
}
