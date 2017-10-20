import report from 'vfile-reporter';

/**
 * Takes an array of VFiles (reflected promises), and logs to logger all files
 * that were transformed successfully and then any failed transforms including
 * their messages.
 *
 * @param {Promises<VFiles[]>}
 * @return void
 */
export default async function reporter(logger, vFiles) {
  const reports = await vFiles;

  // Report the good
  const successFiles = reports
    .filter(inspection => inspection.isFulfilled())
    .map(inspection => inspection.value());

  if (successFiles.length) {
    logger.info(report(successFiles));
  }

  // Report the bad
  reports
    .filter(inspection => !inspection.isFulfilled())
    .map(inspection => logger.warn(inspection.reason()));
}
