import program from 'commander';
import pkg from '../../package.json';
import logo from '../logo';

logo();

program.version(pkg.version, '-v, --version');

program
  .command('init [name]', 'create new project')
  .command('model [name]', 'create new model')
  .command('route [name]', 'create new route')
  .description('This utility will walk you through creating a new project.')
  .parse(process.argv);
