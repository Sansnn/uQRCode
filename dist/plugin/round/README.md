# 介绍

uQRCode 圆点码风格扩展。

> 支持uni-app组件

# 使用说明

## 引入

- 通过`import`引入。
``` javascript
import UQRCodePluginRound from 'uqrcode.plugin.round.es.js';
```

- `Node.js`通过`require`引入。
``` javascript
const UQRCodePluginRound = require('uqrcode.plugin.round.cjs.js');
```

- 原生浏览器环境，在js脚本加载时添加到`window`。
``` html
<script type="text/javascript" src="uqrcode.plugin.round.umd.js"></script>
<script>
    var UQRCodePluginRound = window.UQRCodePluginRound;
</script>
```

## 原生方式使用

### 全局注册

```javascript
UQRCode.use(UQRCodePluginRound);
```

### 实例注册

```javascript
const qr = new UQRCode();
qr.register(UQRCodePluginRound);
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
qr.register(UQRCodePluginRound);
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

## uni-app组件方式使用

### 注册扩展

```javascript
import UQRCodePluginRound from 'uqrcode.plugin.round.es.js';

export default {
  onReady() {
    /* 注册扩展插件 */
    this.$refs.qrcode.registerStyle(UQRCodePluginRound); // qrcode为组件的ref名称
  }
}
```

## 使用示例

```html
<uqrcode ref="uqrcode" canvas-id="qrcode" value="https://uqrcode.cn/doc" :options="{ style: 'round', foregroundRadius: 1.0, backgroundRadius: 1.0 }"></uqrcode>
```

### Type

- 类型：`string`
- 默认值：`'style'`
- 只读：`是`

插件类型。

### Name

- 类型：`string`
- 默认值：`'round'`
- 只读：`是`

插件名称。

### DrawCanvas

- 类型：`string`
- 默认值：`'drawRoundCanvas'`
- 只读：`是`

插件`drawCanvas`的函数名称。

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