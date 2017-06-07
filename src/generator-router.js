import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { capitalize } from 'lodash';
import Generator from './generator';

export default class GeneratorRouter extends Generator {
  constructor(name, options) {
    super();
    this.name = name;
    this.options = Object.assign({
    }, options);
  }

  initializing() {
    const pkg = join(process.cwd(), 'package.json');
    if (!existsSync(pkg)) {
      console.log(chalk.red('请在项目根目录执行该命令'));
      process.exit(1);
    } else {
      this.destinationRoot = this.destination('src/routes');
    }
  }

  async prompting() {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'path',
        message: 'path',
        default: ''
      }
    ]).then((answers) => {
      if (answers) {
        this.name = answers.name;
        return Promise.resolve(true);
      }
      return Promise.reject('aaa');
    });
  }

  writing() {
    this.fs.copyTpl(
      this.template('router/router.js'),
      this.destination(`${this.name}.js`),
      {
        modelName: capitalize(this.name),
        routerName: this.name
      }
    );
  }
}
