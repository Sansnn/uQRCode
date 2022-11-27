const http = require('http');
// 引入canvas
const {
  createCanvas,
  loadImage
} = require('canvas');
// 引入uQRCode
const UQRCode = require('./js/uqrcode');
const plugins = [];
// 引入扩展
try {
  const UQRCodeStyle25D = require('./js/uqrcode.style.25d');
  UQRCode.use(UQRCodeStyle25D);
  plugins.push(UQRCodeStyle25D.DrawCanvas);
} catch (e) {}
try {
  const UQRCodeStyleArt = require('./js/uqrcode.style.art');
  UQRCode.use(UQRCodeStyleArt);
  plugins.push(UQRCodeStyleArt.DrawCanvas);
} catch (e) {}
try {
  const UQRCodeStyleLiquid = require('./js/uqrcode.style.liquid');
  UQRCode.use(UQRCodeStyleLiquid);
  plugins.push(UQRCodeStyleLiquid.DrawCanvas);
} catch (e) {}
try {
  const UQRCodeStyleRound = require('./js/uqrcode.style.round');
  UQRCode.use(UQRCodeStyleRound);
  plugins.push(UQRCodeStyleRound.DrawCanvas);
} catch (e) {}
try {
  const UQRCodeStyleWords = require('./js/uqrcode.style.words');
  UQRCode.use(UQRCodeStyleWords);
  plugins.push(UQRCodeStyleWords.DrawCanvas);
} catch (e) {}
// 后续要绘制图片，需要设置加载图片方法
UQRCode.prototype.loadImage = loadImage;

const server = http.createServer(function(request, response) {
  console.log('QR Code drawing...');

  // 获取uQRCode实例
  const qr = new UQRCode();
  // 设置uQRCode属性
  qr.data = 'uQRCode';
  qr.size = 220;
  qr.margin = 10;
  qr.useDynamicSize = true;
  // 调用制作二维码方法
  qr.make();

  // 创建canvas
  const canvas = createCanvas(qr.dynamicSize, qr.dynamicSize);
  // 获取canvas上下文
  const canvasContext = canvas.getContext('2d');
  // 设置uQRCode实例的canvas上下文
  qr.canvasContext = canvasContext;
  // 调用绘制方法将二维码图案绘制到canvas上
  qr.drawCanvas().then(() => {
    const qrDataURL = canvas.toDataURL();

    // 重设画布大小为size对应大小
    canvas.width = qr.size;
    canvas.height = qr.size;
    // 加载二维码图片
    loadImage(qrDataURL).then(qrImg => {
      // 将二维码图片重新绘制到调整过size的canvas上，以保证与原设size一致
      canvasContext.drawImage(qrImg, 0, 0, qr.size, qr.size);

      // console.log(canvas.toDataURL()); // 返回base64
      // console.log(canvas.toBuffer()); // 返回buffer

      response.writeHead(200, {
        'Content-Type': 'image/png'
      });
      response.end(canvas.toBuffer());

      console.log('drawn.');
    });
  });
});
server.listen(3000, () => {
  console.log('服务器开启成功：http://127.0.0.1:3000');
});