# 介绍

uQRCode 圆点码风格扩展。

# 使用说明

## 引入

- 通过`import`引入。
``` javascript
import UQRCodeStyleRound from 'uqrcode.style.round.es.js';
```

- `Node.js`通过`require`引入。
``` javascript
const UQRCodeStyleRound = require('uqrcode.style.round.cjs.js');
```

- 原生浏览器环境，在js脚本加载时添加到`window`。
``` html
<script type="text/javascript" src="uqrcode.style.round.umd.js"></script>
<script>
    var UQRCodeStyleRound = window.UQRCodeStyleRound;
</script>
```

## 注册

### 全局注册

```javascript
UQRCode.use(UQRCodeStyleRound);
```

### 实例注册

```javascript
new UQRCode().register(UQRCodeStyleRound);
```

### uni-app通过组件注册

```javascript
import UQRCodeStyleRound from 'uqrcode.style.round.es.js';

export default {
  onReady() {
    /* 注册扩展插件 */
    this.$refs.qrcode.registerStyle(UQRCodeStyleRound); // qrcode为组件的ref名称
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
qr.register(UQRCodeStyleRound);
// 设置扩展属性
qr.backgroundRadius = 1.0;
qr.foregroundRadius = 1.0;
// 调用制作二维码方法
qr.make();

// 设置uQRCode实例的canvas上下文
qr.canvasContext = canvasContext;

// 调用扩展绘制方法将二维码图案绘制到canvas上
qr.drawRoundCanvas();
```

# 扩展属性

### backgroundRadius

- 类型：`number`
- 默认值：`1.0`
- 必填：`否`
- 只读：`否`
- 范围：`0.0`-`1.0`

背景码点圆角半径。

### foregroundRadius

- 类型：`number`
- 默认值：`1.0`
- 必填：`否`
- 只读：`否`
- 范围：`0.0`-`1.0`

前景码点圆角半径。

# 扩展方法

### drawRoundCanvas

- 类型：`Function`
- 返回值：`Promise`

绘制到canvas画布。