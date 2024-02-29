
const AliOssFile = require('../lib/index')
const fs = require('fs')

const expect = require('chai').expect;
const ossconfig = require('../ossconfig')

const dirPath = `${__dirname}/data`
if (fs.existsSync(dirPath)) {
  fs.rmdirSync(dirPath, { recursive: true });
}
fs.mkdirSync(dirPath, { recursive: true });

describe('下载', function() {
  it('下载单个文件', function() {
    const aliOssFile = new AliOssFile(ossconfig)
    aliOssFile.downloadFile('imgs/baojing.png', `${__dirname}/data/baojing.png`)
    expect(!!fs.statSync(`${__dirname}/data/baojing.png`)).to.be.equal(true);
  });
  it('下载文件夹', function() {
    const aliOssFile = new AliOssFile(ossconfig)
    aliOssFile.downloadFolder('imgs', `${__dirname}/data/imgs`)
  });
});
