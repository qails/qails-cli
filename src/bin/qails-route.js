#!/usr/bin/env node
import { basename } from 'path';
import program from 'commander';
import { prompt } from 'inquirer';
import GeneratorInit from '../generator-init';
import pkg from '../../package.json';

program
  .version(pkg.version)
  .usage('[name] [options]')
  .parse(process.argv);

const run = (appname) => {
  const generator = new GeneratorInit(appname, {
    skipInstall: program.skipInstall
  });
  generator.run();
};

const pkgs = program.args;
const appname = pkgs[0];
if (!appname) {
  prompt([{
    type: 'input',
    name: 'name',
    message: 'name',
    default: basename(process.cwd())
  }]).then((answers) => {
    run(answers.name);
  });
} else {
  run(appname);
}
