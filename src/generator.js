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
      console.log('\n正在初始化工程');
      this.writing();
      this.fs.commit(() => {
        console.log('工程初始化完成');
        console.log('正在安装依赖');
        this.installing();
      });
    }, (reason) => {
      console.log(`${reason}\n\nqails init 被取消。`);
    });
  }
}
