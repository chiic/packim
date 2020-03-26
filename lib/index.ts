#!/usr/bin/env node

const commander = require('commander')

commander
  .version(require('../package.json').version)
  .usage('<command> [type]')
  .command('init', 'generate a new project white [type]')

  commander.parse(process.argv);
