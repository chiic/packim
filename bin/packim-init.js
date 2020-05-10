#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');
const linkDir = path.resolve(__dirname, `../.tpl`);
const deDir = path.resolve(__dirname, `../tpl`);
program
    .usage(`<template-type> ['js' | 'ts']  <dir?> [dir-name]`);
/**
 * Help.
 */
program.on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # create a new js-type project with webpack'));
    console.log('    $ packim init js');
    console.log();
    console.log(chalk.gray('    # create a new ts-type project in test dir with webpack'));
    console.log('    $ packim init ts test');
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
if (desk) {
    if (/^\w+$/.test(desk)) {
        loadTpl();
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
            if (fse.existsSync(path.resolve(process.cwd())) &&
                fse.readdirSync(path.resolve(process.cwd())).length) {
                console.log(chalk.red(`[File error]: The current folder is not an empty folder!`));
                process.exit(0);
            }
            loadTpl();
        }
        else {
            process.exit(0);
        }
    });
}
function loadTpl() {
    const spinner = ora('loading template');
    spinner.start();
    createDir(type);
    fse.copy(linkDir, path.resolve(process.cwd(), desk)).then(() => {
        spinner.stop();
        fse.remove(linkDir);
        console.log(chalk.green('[Create]: Initialization complete!'));
    }).catch(err => {
        console.log(err);
        fse.remove(linkDir);
        desk
            ? fse.remove(path.resolve(process.cwd(), desk))
            : null;
    });
}
function createDir(type) {
    fse.copySync(deDir, linkDir);
    if (type === 'ts') {
        fse.writeFileSync(path.resolve(linkDir, 'tsconfig.json'), JSON.stringify(require(path.resolve(__dirname, `../options/tsconfig.json`)), null, '\t'));
        fse.renameSync(path.resolve(linkDir, `src/index.js`), path.resolve(linkDir, `src/index.ts`));
    }
    insertBaseOptions(type);
}
function insertBaseOptions(_type) {
    console.log(linkDir);
    let resoure = fs.readFileSync(path.resolve(linkDir, './webpack.config.base.js'), {
        encoding: 'utf-8'
    });
    let _res = resoure.replace(/`<%Entry%>`/gm, `'./src/index.${_type}'`);
    if (_type === 'ts') {
        _res = _res.replace(/`<%Loader%>`/gm, `{\n\t\t\ttest: /\.tsx?$/, \n\t\t\tuse: 'ts-loader',\n\t\t\texclude: /node_modules/\n\t\t}`);
    }
    if (_type === 'js') {
        _res = _res.replace(/`<%Loader%>`,\s/gm, ``);
    }
    fs.writeFileSync(path.resolve(linkDir, './webpack.config.base.js'), _res);
}
