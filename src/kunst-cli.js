#!/usr/bin/env node

import program from 'commander';
import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import logger from 'winston';
import pkg from '../package.json';
import reporter from './lib/cli-reporter';
import prepareRunner from './lib/kunst-runner';
import Kunst from './lib/Kunst';
import remarkTransformer from './lib/remark-transformer';
import loadRemarkPreset from './lib/load-remark-preset';

logger.cli();

program
  .version(pkg.version)
  .option('-c, --config [filename]', 'Path to Kunst config file, used to configure remark.', 'kunst.config.json')
  .option('-s, --source [directory]', 'Path to search for Markdown files.', '.')
  .option('-t, --target [directory]', 'Path in which to output the transformed source.', 'target')
  .option('--clean', 'Cleans the target directory prior to processing.')
  .option('--watch', 'Reruns when changes to markdown files specified by `--source` happen.')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}

const { source, target } = program;

// Check config
const configPath = `${process.cwd()}/${program.config}`;

if (!fs.existsSync(configPath)) {
  logger.error(`Config file does not exist at ${configPath}`);
  process.exit(1);
}

// Load preset
let preset;
if (configPath.endsWith('.js')) {
  // All plugins have been loaded
  // eslint-disable-next-line import/no-dynamic-require, global-require
  preset = require(configPath);
} else if (configPath.endsWith('.json')) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const config = require(configPath);
  preset = loadRemarkPreset(config);
} else {
  logger.error(`Unsupported data type: ${configPath}. Must be either json or js.`);
  process.exit(1);
}

if (program.clean) {
  fs.emptyDirSync(target);
}

// Setup the base classes.
const transformer = remarkTransformer(preset);
const kunst = new Kunst(transformer);
const runner = prepareRunner(kunst, logger);

// If watch mode is on, we'll just process files as changes occur.
if (program.watch) {
  const sourceDir = path.join(source, '**/*.md');
  const watcher = chokidar.watch(sourceDir, {
    ignoreInitial: true,
    cwd: process.cwd(),
  });

  logger.info(`watching ${source} for any changes to .md files…`);

  watcher.on('all', (event, eventPath) => {
    logger.info(`detected change in ${eventPath}…`);

    reporter(logger, runner(source, target, eventPath));
  });

// Otherwise, process the entire directory at once and report the result.
} else {
  reporter(logger, runner(source, target));
}
