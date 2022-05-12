var http = require('http');

const uQRCode = require('../uni_modules/Sansnn-uQRCode/js_sdk/u-qrcode/module');

http.createServer(function(request, response) {
  console.log('QR code drawing...');

  const size = 480;
  const {
    createCanvas,
    loadImage
  } = require('canvas');
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  let uqrcode = new uQRCode({
    text: 'uQRCode',
    size: size,
    useDynamicSize: true,
    margin: 10,
    foreground: {
      image: {
        src: 'img/logo.png',
        width: 0.25,
        height: 0.25,
        align: ['center', 'center'],
        anchor: [0, 0]
      }
    }
  }, ctx, loadImage);
  uqrcode.make();

  // 使用dynamicSize可以解决白线问题
  canvas.width = uqrcode.options.dynamicSize;
  canvas.height = uqrcode.options.dynamicSize;
  uqrcode.draw().then(() => {
    const qrcodeDataURL = canvas.toDataURL();

    // 重设画布大小为size对应大小
    canvas.width = size;
    canvas.height = size;
    loadImage(qrcodeDataURL).then(qrcodeImg => {
      ctx.drawImage(qrcodeImg, 0, 0, size, size);

      // console.log(canvas.toDataURL()); // 返回base64
      // console.log(canvas.toBuffer()); // 返回buffer

      response.writeHead(200, {
        'Content-Type': 'image/png'
      });
      response.end(canvas.toBuffer());
      
      console.log('Drawn.');
    });
  });
}).listen(8888);

console.log('Server running at http://127.0.0.1:8888/');
