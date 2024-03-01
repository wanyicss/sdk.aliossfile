aliyun OSS文件操作node工具包

### 环境要求
要求Node.js >= 8.0.0

### 安装包
```bash
npm install alioss-file --save
```

### 接口
- [初始化sdk](#初始化sdk)
- [下载文件](#下载文件)
- [下载文件夹](#下载文件夹)

#### 初始化sdk
```js
const OSS = require('alioss-file');
const store = new OSS({
  region: '<oss region>',
  accessKeyId: '<Your accessKeyId>',
  accessKeySecret: '<Your accessKeySecret>',
  bucket: '<Your bucket name>'
});
```

#### 下载文件
```js
await store.downloadFile('imgs/baojing.png') // 缺省本地路径
await store.downloadFile('imgs/baojing.png', './baojing.png') // 指定本地路径
```


#### 下载文件夹
```js
await store.downloadFolder('imgs') // 缺省本地路径
await store.downloadFolder('imgs', './img') // 指定本地路径
```

