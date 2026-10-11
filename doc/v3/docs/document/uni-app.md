---
sidebarDepth: 1
---

# uni-app组件

文档对应版本：v3.6.5

## Props

### canvasId

- 类型：`String`
- 默认值：`undefined`
- 必填：`是`

canvas组件id。

### value

- 类型：`String|Number`
- 默认值：`undefined`
- 必填：`否`

二维码内容。[start](#start) 为`true`时必填。

### size

- 类型：`Number`
- 默认值：`200`
- 必填：`否`

二维码大小。

### options

- 类型：`Object`
- 默认值：`{}`
- 必填：`否`

二维码配置选项。与`原生`中 [基本配置](native.md#基本配置) 一致，数据格式与 [setOptions](native.md#setoptions) 传入参数一致。

### fileType

- 类型：`String`
- 默认值：`png`
- 必填：`否`

导出的文件类型。可选`jpg`、`png`。

### start

- 类型：`Boolean`
- 默认值：`true`
- 必填：`否`

是否初始化组件后就开始生成。

### auto

- 类型：`Boolean`
- 默认值：`false`
- 必填：`否`

是否数据发生改变自动重绘。

### hide

- 类型：`Boolean`
- 默认值：`false`
- 必填：`否`

隐藏组件。如果只需要导出二维码作为图片使用，可设置为`true`，不能在组件或组件父级元素设置`v-if="false"`、`v-show="false"`、`style="display:none;"`等实现隐藏效果，这样会导致导出二维码空白。

### type

- 类型：`String`
- 默认值：`undefined`
- 必填：`否`

`v3.6.0 新增` canvas组件类型。微信小程序可选`2d`。注意：`v3.6.0`之前版本微信小程序默认为`2d`，升级`v3.6.0`后如还需继续使用`2d`类型，需要设置`type="2d"`，否则可能会出现层级问题。

### sizeUnit

- 类型：`String`
- 默认值：`px`
- 必填：`否`
- 可选：`px`, `rpx`

`v3.6.0 新增` 二维码尺寸单位。

### isQueueLoadImage

- 类型：`Boolean`
- 默认值：`false`
- 必填：`否`

`v3.6.0 新增` 是否队列加载图片，选择`true`将通过队列缓存所需要加载的图片。优点是加载重复资源可减少资源请求次数，节省网络资源，缺点是会转化为同步请求，资源不重复且多的情况下，等待时间会更久。总之，请求重复资源较多则选择`true`，请求不重复资源较多则选择`false`。

## Events

### complete

- 类型：`EventHandle`

生成完成时触发，返回结果`{ success: true | false }`。

### click

- 类型：`EventHandle`

点击组件时触发。

### change

- 类型：`EventHandle`

`v3.6.0 新增`  重绘时触发。

## Methods

### make

生成二维码。

**使用方法：**

```javascript
// qrcode为组件的ref名称
this.$refs.qrcode.make({
  success: () => {
    console.log('生成成功');
  },
  fail: err => {
    console.log(err)
  }
});
```

### remake

重新生成二维码。

**使用方法：**

```javascript
// qrcode为组件的ref名称
this.$refs.qrcode.remake({
  success: () => {
    console.log('生成成功');
  },
  fail: err => {
    console.log(err)
  }
});
```

### toTempFilePath

导出临时文件路径。  
为了保证方法调用成功，请在 [complete](#complete) 事件返回`success=true`后调用。

**使用方法：**

```javascript
// qrcode为组件的ref名称
this.$refs.qrcode.toTempFilePath({
  success: res => {
    console.log(res);
  }
});
```

### save

保存二维码到本地相册。  
为了保证方法调用成功，请在 [complete](#complete) 事件返回`success=true`后调用。

**使用方法：**

```javascript
// qrcode为组件的ref名称
this.$refs.qrcode.save({
  success: () => {
    uni.showToast({
      icon: 'success',
      title: '保存成功'
    });
  }
});
```
