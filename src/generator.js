import EventEmitter from 'events';
import { resolve } from 'path';
import memFs from 'mem-fs';
import FileEditor from 'mem-fs-editor';

export default class Generator extends EventEmitter {
  constructor() {
    super();
    const store = memFs.create();
    this.fs = FileEditor.create(store);
    this.destinationRoot = process.cwd();
    this.sourceRoot = resolve(__dirname, '..');
  }

  initializing() {}

  async prompting() {
    return true;
  }

  installing() {}

  template(rootPath = '') {
    return resolve(this.sourceRoot, 'templates', rootPath);
  }

  destination(rootPath = '') {
    return resolve(this.destinationRoot, rootPath);
  }

  async run() {
    this.initializing();
    await this.prompting().then(() => {
      console.log('\nDump files start');
      this.writing();
      this.fs.commit(() => {
        console.log('Write memory fs to disk ... ok');
        this.installing();
      });
    }, (reason) => {
      console.log(`${reason}\n\nqails init has been cancelled.`);
    });
  }
}
