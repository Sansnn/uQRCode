# 介绍

uQRCode 文字码风格扩展。尽量使用纯文字，不要带标点符号。

# 使用说明

## 引入

- 通过`import`引入。
``` javascript
import UQRCodeStyleWords from 'uqrcode.style.words.es.js';
```

- `Node.js`通过`require`引入。
``` javascript
const UQRCodeStyleWords = require('uqrcode.style.words.cjs.js');
```

- 原生浏览器环境，在js脚本加载时添加到`window`。
``` html
<script type="text/javascript" src="uqrcode.style.words.umd.js"></script>
<script>
    var UQRCodeStyleWords = window.UQRCodeStyleWords;
</script>
```

## 注册

### 全局注册

```javascript
UQRCode.use(UQRCodeStyleWords);
```

### 实例注册

```javascript
new UQRCode().register(UQRCodeStyleWords);
```

### uni-app通过组件注册

```javascript
import UQRCodeStyleWords from 'uqrcode.style.words.es.js';

export default {
  onReady() {
    /* 注册扩展插件 */
    this.$refs.qrcode.registerStyle(UQRCodeStyleWords); // qrcode为组件的ref名称
  }
}
```

## 使用示例

```javascript
// 获取uQRCode实例
var qr = new UQRCode();
// 设置uQRCode属性
qr.data = 'https://uqrcode.cn/doc'; // 指定二维码对应内容
qr.size = 220; // 指定要生成的二维码大小
qr.margin = 10; // 指定二维码的边距
// 注册扩展
qr.register(UQRCodeStyleWords);
// 设置扩展属性
qr.words = '扫我';
// 调用制作二维码方法
qr.make();

// 设置uQRCode实例的canvas上下文
qr.canvasContext = canvasContext;

// 调用扩展绘制方法将二维码图案绘制到canvas上
qr.drawWordsCanvas();
```

# 扩展属性

### words

- 类型：`string`
- 默认值：`undefined`
- 必填：`否`
- 只读：`否`

文字内容。

# 扩展方法

### drawWordsCanvas

- 类型：`Function`
- 返回值：`Promise`

绘制到canvas画布。