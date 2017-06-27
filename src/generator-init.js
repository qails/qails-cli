import { basename } from 'path';
import mkdirp from 'mkdirp';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Generator from './generator';
import { isEmptyDirectory } from './utils';
import { yarnInstall } from './install';

export default class GeneratorInit extends Generator {
  constructor(appname, options) {
    super();
    this.appname = appname;
    this.options = Object.assign({
      skipInstall: false
    }, options);
  }

  initializing() {
    if (basename(this.destination()) !== this.appname) {
      console.log([
        `Your generator must be inside a folder named ${chalk.green(this.appname)}`,
        'I\'ll automatically create this folder.\n'
      ].join('\n'));
      mkdirp(this.appname);
      this.destinationRoot = this.destination(this.appname);
    }
  }

  async prompting() {
    if (!isEmptyDirectory(this.destinationRoot)) {
      console.log(chalk.yellow('The destination root is not a empty directory'));
      await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Are you sure overwrite the directory?',
          default: false
        }
      ]).then((answers) => {
        if (!answers.overwrite) {
          return Promise.reject([
            chalk.yellow('The destination directory is not allowed to overwrite.'),
            chalk.underline('Please change a directory and try again.')
          ].join('\n'));
        }
        return Promise.resolve(true);
      });
    }
  }

  writing() {
    this.fs.copyTpl(
      this.template('init'),
      this.destination(),
      { appname: this.appname }
    );

    this.fs.move(
      this.destination('qdr_service/qunar_service.sh'),
      this.destination(`qdr_service/qunar_${this.appname}`)
    );

    this.fs.move(
      this.destination('_package.json'),
      this.destination('package.json')
    );

    this.fs.move(
      this.destination('babelrc'),
      this.destination('.babelrc')
    );

    this.fs.move(
      this.destination('eslintignore'),
      this.destination('.eslintignore')
    );

    this.fs.move(
      this.destination('eslintrc.js'),
      this.destination('.eslintrc.js')
    );

    this.fs.move(
      this.destination('gitignore'),
      this.destination('.gitignore')
    );

    this.fs.move(
      this.destination('src/profiles/env.beta'),
      this.destination('src/profiles/.env.beta')
    );

    this.fs.move(
      this.destination('src/profiles/env.development'),
      this.destination('src/profiles/.env.development')
    );

    this.fs.move(
      this.destination('src/profiles/env.local'),
      this.destination('src/profiles/.env.local')
    );

    this.fs.move(
      this.destination('src/profiles/env.production'),
      this.destination('src/profiles/.env.production')
    );

    this.fs.copy(
      this.destination('src/profiles/.env.local'),
      this.destination('.env')
    );
  }

  async installing() {
    if (!this.options.skipInstall) {
      await yarnInstall(this.appname);
    }
  }
}
