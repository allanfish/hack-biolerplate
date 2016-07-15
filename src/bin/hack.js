#!/usr/bin/env node
import path from 'path'
import Liftoff from 'liftoff'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2));
const cli = new Liftoff({
  name: 'hack',
  processTitle: 'hack',
  moduleName: 'hack',
  configName: 'hack-conf',

  // only js supported!
  extensions: {
    '.js': null
  }
});

cli.launch({
  cwd: argv.r || argv.root,
  configPath: argv.f || argv.file
}, (env) => {
  var hack;
  if (!env.modulePath) {
    hack = require('../');
  } else {
    hack = require(env.modulePath);
  }

  process.title = this.name + ' ' + process.argv.slice(2).join(' ') + ' [ ' + env.cwd + ' ]';

  // 配置插件查找路径，优先查找本地项目里面的 node_modules
  // 然后才是全局环境下面安装的 hack 目录里面的 node_modules
  hack.require.paths.unshift(path.join(env.cwd, 'node_modules'));
  hack.require.paths.push(path.join(path.dirname(__dirname), 'node_modules'));
  hack.cli.name = this.name;
  hack.cli.run(argv, env);
});
