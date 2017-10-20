import path from 'path';

/**
 * @param {Kunst} kunst
 * @param {Logger} logger
 */
export default function prepareRunner(kunst, logger) {
  /**
   * Runs the transformer over a source directory to a target directory. Optionally
   * transforms a single file if `sourceFilePath` is passed.
   *
   * @param {string} sourceDir
   * @param {string} targetDir
   * @param {string} sourceFilePath
   * @return {Promise<VFiles[]>}
   */
  return async function runner(sourceDir, targetDir, sourceFilePath = undefined) {
    let vFiles;

    try {
      const sourceDirPath = path.resolve(sourceDir, '.');
      const targetDirPath = path.resolve(targetDir, '.');

      logger.profile('Kunst transformation complete.');

      // Either process the entire directory, or a single file.
      if (sourceFilePath) {
        vFiles = [await kunst.processMarkdownFile(sourceDirPath, sourceFilePath, targetDirPath)];
      } else {
        vFiles = await kunst.processDirectory(sourceDirPath, targetDirPath);
      }

      logger.profile('Kunst transformation complete.');
    } catch (err) {
      logger.error(err);
      process.exitCode = 1;
    }

    return vFiles;
  };
}
