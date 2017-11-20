import { basename } from 'path';
import mkdirp from 'mkdirp';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Generator from './generator';
import { isEmptyDirectory } from './utils';
import install from './install';

export default class GeneratorInit extends Generator {
  constructor(appname, options) {
    super();
    this.appname = appname;
    this.answers = {};
    this.options = Object.assign({
      skipInstall: false
    }, options);
  }

  initializing() {
    if (basename(this.destination()) !== this.appname) {
      const appname = chalk.green(this.appname);
      console.log(`检测到程序没有运行在\`${appname}\`目录下，程序将会自动创建\`${appname}\`目录`);
      mkdirp(this.appname);
      this.destinationRoot = this.destination(this.appname);
    }
  }

  async prompting() {
    const questions = [];
    if (!isEmptyDirectory(this.destinationRoot)) {
      console.log(chalk.yellow(`检测到\`${chalk.green(this.appname)}\`不是空目录`));
      questions.push({
        type: 'confirm',
        name: 'overwrite',
        message: `是否覆盖 ${this.appname} ？`,
        default: false
      });
    }
    questions.push({
      type: 'confirm',
      name: 'mysql',
      message: '是否使用 MySQL ？',
      default: true,
      when: answers => !('overwrite' in answers) || answers.overwrite === true
    });
    await inquirer.prompt(questions).then((answers) => {
      if ('overwrite' in answers && answers.overwrite === false) {
        return Promise.reject(`目录\`${this.appname}\`禁止覆盖，请更换目录重试。`);
      }
      this.answers = answers;
      return Promise.resolve(true);
    });
  }

  writing() {
    this.fs.copyTpl(
      this.template('init'),
      this.destination(),
      {
        appname: this.appname,
        ...this.answers
      }
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
      this.destination('profiles/env.beta'),
      this.destination('profiles/.env.beta')
    );

    this.fs.move(
      this.destination('profiles/env.development'),
      this.destination('profiles/.env.development')
    );

    this.fs.move(
      this.destination('profiles/env.local'),
      this.destination('profiles/.env.local')
    );

    this.fs.move(
      this.destination('profiles/env.production'),
      this.destination('profiles/.env.production')
    );

    this.fs.copy(
      this.destination('profiles/.env.local'),
      this.destination('.env')
    );

    if (!this.answers.mysql) {
      this.fs.delete(this.destination('migrations'));
      this.fs.delete(this.destination('seeds'));
    }
  }

  async installing() {
    if (!this.options.skipInstall) {
      await install(this.appname);
    }
  }
}
