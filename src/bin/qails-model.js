import program from 'commander';
import GeneratorModel from '../generator-model';
import pkg from '../../package.json';

program
  .version(pkg.version)
  .usage('[name] [options]')
  .parse(process.argv);

const run = (name) => {
  const generator = new GeneratorModel(name);
  generator.run();
};

const pkgs = program.args;
const name = pkgs[0];
if (!name) {
  program.help();
} else {
  run(name);
}
