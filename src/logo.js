import chalk from 'chalk';

export default () => {
  [
    '',
    '                       88 88          ',
    '                       "" 88          ',
    '                          88          ',
    ' ,adPPYb,d8 ,adPPYYba, 88 88 ,adPPYba,',
    'a8"    `Y88 ""     `Y8 88 88 I8[    ""',
    '8b       88 ,adPPPPP88 88 88  `"Y8ba, ',
    '"8a    ,d88 88,    ,88 88 88 aa    ]8I',
    ' `"YbbdP\'88 `"8bbdP"Y8 88 88 `"YbbdP"\'',
    '         88                           ',
    '         88 ',
    ''
  ].forEach((line) => {
    console.log(
      '\t',
      chalk.red(line.substr(0, 11)),
      chalk.green(line.substr(11, 11)),
      chalk.yellow(line.substr(22, 3)),
      chalk.blue(line.substr(25, 3)),
      chalk.magenta(line.substr(28, 11)),
    );
  });

  // console.log(.join('\n'));
};
