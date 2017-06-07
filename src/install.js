import { execSync } from 'child_process';
import chalk from 'chalk';

export const install = (installer, appname) => {
  process.chdir(appname);
  const options = { stdio: 'inherit' };
  const cmd = [installer === 'yarn' ? 'yarn' : 'npm install'];
  try {
    execSync(cmd, options);
  } catch (e) {
    console.log(
      chalk.red('Could not finish installation. \n'),
      `Please install ${installer} with`,
      chalk.yellow(`npm install -g ${installer}`),
      'and try again.'
    );
  }
};

export const npmInstall = appname => install('npm', appname);
export const yarnInstall = appname => install('yarn', appname);
