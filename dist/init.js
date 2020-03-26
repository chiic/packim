#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const { writeFile } = require('fs');
const ora = require('ora');
const path = require('path');
program
    .usage(`<template-type> ['js' | 'ts']`);
/**
 * Help.
 */
program.on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # create a new js-type project with webpack'));
    console.log('    $ simpack init js');
    console.log();
});
function help() {
    program.parse(process.argv);
    if (program.args.length < 1)
        return program.help();
}
help();
const type = program.args[0];
let desk = program.args[1];
const pkg = require('../package');
const repo = `${pkg.author}/vue-contextmenu/`;
if (desk) {
    if (/^\w+$/.test(desk)) {
        downTpl();
    }
    else {
        console.log(chalk.red(`[Name error]: ${desk} is a terrible name!`));
        process.exit(1);
    }
}
else {
    inquirer.prompt([{
            type: 'confirm',
            message: 'Generate project in current directory?',
            name: 'ok'
        }]).then(answers => {
        if (answers.ok) {
            desk = '';
            downTpl();
        }
        else {
            process.exit(0);
        }
    });
}
function downTpl() {
    const spinner = ora('downloading template');
    spinner.start();
    download(repo, desk, (err) => {
        if (!err) {
            if (type === 'ts') {
                const tsconfig = require('../tsconfig');
                generateFile(path.resolve(process.cwd(), desk, 'tsconfig.json'), jsonIfy(tsconfig)).then(res => {
                    spinner.stop();
                    console.log(chalk.greenBright('Suceess init!'));
                });
            }
            else {
                spinner.stop();
            }
        }
    });
}
function generateFile(path, data) {
    return new Promise((resolve, reject) => {
        writeFile(path, data, (err) => {
            if (err)
                throw err;
            resolve();
        });
    });
}
function jsonIfy(parse) {
    return JSON.stringify(parse, null, '\t');
}
