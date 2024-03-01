
let OSS = require('ali-oss');
let fs = require('fs');
let path = require('path');
let _ = require('underscore');

class AliOssFile {
  constructor(options) {
    this.options = options;
    this.client = new OSS(options);
  }

  /**
   * 下载文件
   * @param {string} fileUrl - 文件的URL
   * @param {string} localPath - 文件保存的本地路径（可选）
   */
  async downloadFile(fileUrl, localPath) {
    try {
      // 使用客户端对象获取文件
      let result = await this.client.get(fileUrl, localPath || _.last(fileUrl.split('/')));
    } catch (e) {
      // 如果发生错误，打印错误信息
      console.error(e);
    }
  }
  /**
 * 下载指定前缀的文件夹
 * @param {string} prefix - 文件夹前缀
 * @param {string} localDir - 本地目录
 */
  async downloadFolder(prefix, localDir) {
    // 确保本地目录存在
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    /**
     * 列出带有特定前缀的所有文件
     * @param {Object} client - OSS客户端
     * @param {string} token - 分页标记
     * @returns {Promise} - Promise对象
     */
    async function listAllFiles(client, token) {
      // 列出带有特定前缀的所有文件
      const result = await client.list({
        prefix: prefix,
        'max-keys': 1000,
        marker: token,
      });
      // 下载每个文件
      for (const object of _.rest(result.objects)) {
        // OSS中的文件路径
        const ossFilePath = object.name;
        // 在本地创建文件夹结构
        const localFilePath = path.join(localDir, ossFilePath.replace(prefix, ''));

        // 确保本地文件的文件夹存在
        const localFileDir = path.dirname(localFilePath);
        if (!fs.existsSync(localFileDir)) {
          fs.mkdirSync(localFileDir, { recursive: true });
        }

        // 创建本地文件流并下载
        const readStream = await client.getStream(ossFilePath);
        const writeStream = fs.createWriteStream(localFilePath);
        readStream.stream.pipe(writeStream);
      }

      // 如果 result.isTruncated 为 true，意味着还有更多文件
      if (result.isTruncated) {
        await listAllFiles(this.client, result.nextMarker); // 递归列出更多文件
      }
    }

    // 开始列出和下载文件
    await listAllFiles(this.client);
  }
}

module.exports = AliOssFile