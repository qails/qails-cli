import glob from 'packing-glob';

export const isEmptyDirectory = cwd => glob('**/*', { cwd }).length === 0;
