import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import pluralize from 'pluralize';
import { capitalize } from 'lodash';
import Generator from './generator';

export default class GeneratorModel extends Generator {
  constructor(name, options) {
    super();
    this.name = name;
    this.features = {};
    this.options = Object.assign({
    }, options);
  }

  initializing() {
    const pkg = join(process.cwd(), 'package.json');
    if (!existsSync(pkg)) {
      console.log(chalk.red('请在项目根目录执行该命令'));
      process.exit(1);
    } else {
      this.destinationRoot = this.destination('src/models');
    }
  }

  async prompting() {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'tableName',
        message: 'tableName',
        default: pluralize(this.name)
      },
      {
        type: 'confirm',
        name: 'hasTimestamps',
        message: 'hasTimestamps',
        default: true
      },
      {
        type: 'confirm',
        name: 'hasUuid',
        message: 'hasUuid',
        default: false
      },
      {
        type: 'input',
        name: 'jsonColumns',
        message: 'jsonColumns',
        default: ''
      }
    ]).then((answers) => {
      if (answers) {
        this.features = answers;
        return Promise.resolve(true);
      }
      return Promise.reject('aaa');
    }, () => {});
  }

  writing() {
    this.fs.copyTpl(
      this.template('model/model.js'),
      this.destination(`${this.name}.js`),
      {
        modelName: capitalize(this.name),
        ...this.features
      }
    );
  }
}
