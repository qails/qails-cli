import { sync as commandExists } from 'command-exists';
import { execSync } from 'child_process';
import chalk from 'chalk';

export default (appname) => {
  process.chdir(appname);
  const hasYarn = commandExists('yarn');
  const options = { stdio: 'inherit' };
  const cmd = `${hasYarn ? 'yarn' : 'npm'} install --registry https://registry.npm.taobao.org`;
  try {
    execSync(cmd, options);
  } catch (e) {
    console.log(chalk.red('依赖包安装失败，请运行 `npm install` 手动安装依赖包'));
  }
};
