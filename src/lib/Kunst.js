import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import Promise from 'bluebird';

export default class Kunst {
  /**
   * Accepts a transformer function, and an object of configuration options.
   *
   * @constructor
   * @param {function} transformer
   * @param {object} options
   */
  constructor(transformer, options = {}) {
    this.transformer = transformer;
    this.options = Object.assign({
      copy: {
        overwrite: true,
        dereference: true,
        preserveTimestamps: true,
      },
      search: {
        nodir: true,
        ignore: [
          '**/node_modules',
        ],
      },
    }, options);
  }

  /**
   * Given an `sourceDir`, iterate over all the files so they eventually
   * end up in the `destinationDir`. Markdown files will additionally
   * be invoked through the Kunst tranformer.
   *
   * @see http://bluebirdjs.com/docs/api/reflect.html
   * @param  {string}   sourceDir
   * @param  {string}   destinationDir
   * @return {Promise}
   */
  processDirectory(sourceDir, destinationDir) {
    // Copy all the files to the destination
    fs.copySync(sourceDir, destinationDir, this.options.copy);

    // Find the Markdown sources!
    const markdownSources = glob.sync(
      path.join(sourceDir, '**/*.md'),
      this.options.search,
    );

    // Build an array of Promises that will transform the Markdown sources
    const transformSources = markdownSources.map(sourceFilePath =>
      this.processMarkdownFile(sourceDir, sourceFilePath, destinationDir),
    );

    return Promise.all(transformSources);
  }

  /**
   * Process a single markdown file by invoking the Kunst transformer.
   *
   * @param {string} sourceDir
   * @param {string} sourceFilePath
   * @param {string} destinationDir
   * @return {Promise}
   */
  processMarkdownFile(sourceDir, sourceFilePath, destinationDir) {
    try {
      const destination = path.resolve(
        destinationDir,
        path.relative(sourceDir, path.dirname(sourceFilePath)),
      );
      const destinationFilePath = path.join(
        destination,
        path.basename(sourceFilePath),
      );

      // Note we are using `.reflect` to ensure ALL files are attempted and we
      // don't bail if one Promise errors out early.
      return this.transformer(sourceFilePath, destinationFilePath).reflect();
    } catch (error) {
      throw new Error(`error processing ${sourceFilePath}: ${error.message}`);
    }
  }
}
