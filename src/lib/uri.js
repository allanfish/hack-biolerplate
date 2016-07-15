'use strict';

/**
 * 基于路径查找文件，支持相对路径，基于项目的绝对路径以及 hack Id.
 *
 * @example
 * // 基于指定目录的相对路径文件查找。
 * var info = hack.uri('./index.js', root + '/static/');
 *
 * // 基于项目的绝对路径。
 * var info = hack.uri('/static/index.js');
 *
 * // 通过 hack Id 查找，不推荐，因为如果跨模块了，是读取不到文件的。
 * var info = hack.uri('common:static/index.js');
 * @param  {String} path    路径
 * @param  {String} dirname 文件夹名
 * @return {Object}         { file, origin, quote, query, hash, rest, ishackID }
 * @namespace hack.uri
 */
var uri = module.exports = function(path, dirname) {
  var info = hack.util.stringQuote(path),
    qInfo = hack.util.query(info.rest);

  info.query = qInfo.query;
  info.hash = qInfo.hash;
  info.rest = qInfo.rest;

  if (info.rest) {
    path = info.rest;
    var config = hack.media();
    var nsConnector = config.get('namespaceConnector', ':');
    var idx = path.indexOf(nsConnector);
    var file;

    if (~idx) {
      info.ishackID = true;
      var ns = path.substring(0, idx);
      if (ns === config.get('namespace')) {
        file = hack.project.getProjectPath(path);
      }
    } else  if (path[0] === '/') {
      file = hack.project.getProjectPath(path);
    } else if (dirname) {
      file = hack.util(dirname, path);
    } else if (!config.get('namespace')) {
      file = hack.project.getProjectPath(path);
      if (file && hack.util.isFile(file)) {
        info.ishackID = true;
      }
    } else {
      hack.log.error('invalid dirname.');
    }

    if (file && hack.util.isFile(file)) {
      info.file = hack.file(file);
    }
  }

  return info;
};

/**
 * 获取目录id表识
 * @param  {String} path    路径
 * @param  {String} dirname 文件夹
 * @return {Object}         { id, file, origin, quote, query, hash, rest, ishackID }
 */
uri.getId = function(path, dirname) {
  var info = uri(path, dirname);
  if (info.file) {
    info.id = info.file.getId();
  } else {
    info.id = info.rest;
  }
  return info;
};
