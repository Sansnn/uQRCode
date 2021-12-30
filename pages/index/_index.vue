<template>
  <view class="content">
    <view class="title">uQRCode二维码生成</view>

    <view class="qrcode-box">
      <uqrcode ref="uqrcodeView" />
      <text class="text">view({{qrcodeSize}}px)</text>
    </view>

    <view class="qrcode-box">
      <uqrcode ref="uqrcodeCanvas" />
      <text class="text">canvas({{qrcodeSize}}px)</text>
    </view>
    <view class="image-box">
      <image class="image" :src="qrcodeSrc" />
      <text class="text">image(400rpx)</text>
    </view>

    <input class="input" v-model="qrcodeText" placeholder="输入内容生成二维码" />
    <button class="button" type="primary" @tap="make">生成二维码</button>
    <button class="button" type="primary" @tap="save">保存二维码</button>

    <view class="canvas-box">
      <canvas id="customqrcode" canvas-id="customqrcode" :style="{'width': `${qrcodeSize}px`, 'height': `${qrcodeSize}px`}" />
      <text class="text">custom</text>
    </view>

    <input class="input" v-model="qrcodeTextRandom" placeholder="点击下方按钮生成自定义二维码" />
    <button class="button" type="primary" @tap="makeCustom">生成随机内容二维码</button>
    <!-- #ifndef H5 -->
    <button class="button" type="primary" @tap="saveCustom">保存二维码</button>
    <!-- #endif -->

    <button class="button" type="primary" @tap="makeBatch">批量生成</button>
    <view class="qrcode-box" v-for="(item, index) in qrcodeList" :key="index">
      <uqrcode ref="batchqrcode" />
      <text class="text">{{item}}</text>
    </view>
    <button class="button" type="primary" @tap="saveBatch">批量保存</button>
  </view>
</template>

<script>
  import uQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode'

  export default {
    data() {
      return {
        qrcodeSize: 256,
        qrcodeText: `uQRCode 2.0.5 更新时间：2021-12-21`,
        // qrcodeSize: 2560,
        // qrcodeText: `canvas 在微信小程序、百度小程序、QQ小程序中为原生组件，层级高于前端组件，请勿内嵌在 scroll-view、swiper、picker-view、movable-view 中使用。解决 canvas 层级过高无法覆盖，参考 native-component。其他小程序端的 canvas 仍然为 webview 中的 canvas。
        // app-vue 中的 canvas 仍然是 webview 的 canvas。app-nvue下如需使用canvas，需下载插件，详见文档底部章节。
        // app-vue的canvas虽然是webview自带的canvas，但却比nvue和微信小程序的原生canvas性能更高。注意并非原生=更快。canvas动画的流畅，关键不在于渲染引擎的速度，而在于减少从逻辑层向视图层频繁通信造成的折损。
        // 小程序、app-nvue，因为通信阻塞，难以绘制非常流畅的canvas动画。h5和app-vue不存在此问题。但注意，app-vue下若想流畅的绘制canvas动画，需要使用renderjs技术，把操作canvas的js逻辑放到视图层运行，避免逻辑层和视图层频繁通信。hello uni-app的canvas示例很典型，在相同手机运行该示例，可以看出在h5端和app端非常流畅，而小程序端由于没有renderjs技术，做不到这么流畅的动画。`,
        qrcodeSrc: '',
        qrcodeTextRandom: '',
        qrcodeList: ['我是第一个', '我是第二个', '我是第三个']
      }
    },
    onLoad() {
      // 在onReady中调用绘制二维码方法，尽量不要在onLoad中
    },
    onReady() {
      this.make()
      this.makeCustom()
    },
    methods: {
      make() {
        // view
        uni.showLoading({
          mask: true,
          title: '生成中...'
        })
        this.$refs
          .uqrcodeView
          .make({
            mode: 'view',
            size: this.qrcodeSize,
            text: this.qrcodeText,
            margin: 10
          })
        uni.hideLoading()

        // canvas
        uni.showLoading({
          mask: true,
          title: '生成中...'
        })
        this.$refs
          .uqrcodeCanvas
          .make({
            mode: 'canvas',
            size: this.qrcodeSize,
            text: this.qrcodeText,
            drawDelay: 500, // 在安卓上生成失败或异常可以调整延时久一点试试，例如在后面再补个零？实在不行就用view模式，不能设置为300，否则App端canvas.draw不执行，有点奇葩的设定
            toFileDelay: 500 // 在安卓上生成失败或异常可以调整延时久一点试试，例如在后面再补个零？实在不行就用view模式，不能设置为300，否则App端canvas.draw不执行，有点奇葩的设定
            // drawDelay: -1, // 不设置延时会使用默认的，设置为-1则为实际的不设置延时
            // toFileDelay: -1 // 不设置延时会使用默认的，设置为-1则为实际的不设置延时
          })
          .then(res => {
            // 返回的res与uni.canvasToTempFilePath返回一致
            console.log(res)
            this.qrcodeSrc = res.tempFilePath
          })
          .finally(() => {
            uni.hideLoading()
          })
      },
      save() {
        this.$refs
          .uqrcodeCanvas
          .save()
      },
      makeCustom() {
        this.qrcodeTextRandom = this.uuid()

        // 得到矩阵，可根据返回的矩阵信息自行实现二维码生成，甚至是样式。以下为示例
        var modules = uQRCode.getModules({
          text: this.qrcodeTextRandom,
          errorCorrectLevel: uQRCode.errorCorrectLevel.H
        })
        // console.log('modules', modules)

        // 定义样式信息
        var size = this.qrcodeSize
        var margin = 10
        var tileW = (size - margin * 2) / modules.length
        var tileH = tileW
        var foregroundColor = '#39b54a'
        var backgroundColor = '#ffffff'

        // canvas实例
        var canvasId = 'customqrcode'
        var ctx = uni.createCanvasContext(canvasId)
        ctx.setFillStyle(backgroundColor)
        ctx.fillRect(0, 0, size, size)
        for (var row = 0; row < modules.length; row++) {
          for (var col = 0; col < modules.length; col++) {
            // 计算每一个小块的位置
            var x = col * tileW + margin
            var y = row * tileH + margin
            var w = tileW
            var h = tileH

            // 画圆，随机颜色
            // var style = modules[row][col] ? this.getRandomColor() : backgroundColor
            // ctx.setFillStyle(style)
            // ctx.beginPath()
            // ctx.arc(x + 4, y + 4, w / 2, 0, 2 * Math.PI)
            // ctx.fill()

            // 画方
            var style = modules[row][col] ? foregroundColor : backgroundColor
            ctx.setFillStyle(style)
            ctx.fillRect(x, y, w, h)
          }
        }
        ctx.draw()
      },
      saveCustom() {
        uni.canvasToTempFilePath({
          canvasId: 'customqrcode',
          fileType: 'jpg',
          width: this.qrcodeSize,
          height: this.qrcodeSize,
          destWidth: this.qrcodeSize,
          destHeight: this.qrcodeSize,
          success: (res) => {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (res) => {
                uni.showToast({
                  icon: 'success',
                  title: '保存成功'
                })
              },
              fail: (err) => {
                uni.showToast({
                  icon: 'none',
                  title: JSON.stringify(err)
                })
              }
            })
          },
          fail: (err) => {
            uni.showToast({
              icon: 'none',
              title: JSON.stringify(err)
            })
          }
        }, this)
      },
      makeBatch() {
        this.$refs.batchqrcode.forEach((ref, index) => {
          ref.make({
            mode: 'canvas',
            size: this.qrcodeSize,
            text: this.qrcodeList[index],
            margin: 10
          })
        })
      },
      saveBatch() {
        this.$refs.batchqrcode.forEach((ref, index) => {
          ref.save()
        })
      },






      uuid(len = 32, firstU = true, radix = null) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [];
        radix = radix || chars.length;

        if (len) {
          // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
          for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
          let r;
          // rfc4122标准要求返回的uuid中,某些位为固定的字符
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';

          for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }

        // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
        if (firstU) {
          uuid.shift();
          return 'u' + uuid.join('');
        } else {
          return uuid.join('');
        }
      },
      getRandomColor() {
        const rgb = []
        for (let i = 0; i < 3; ++i) {
          let color = Math.floor(Math.random() * 256).toString(16)
          color = color.length == 1 ? '0' + color : color
          rgb.push(color)
        }
        return '#' + rgb.join('')
      }
    }
  }
</script>

<style>
  /* #ifndef APP-NVUE */
  page {
    background-color: #f0f0f0;
  }

  /* #endif */

  .content {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 44px;
  }

  .title {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    margin-top: 50rpx;
    font-size: 36rpx;
    color: #666666;
  }

  .qrcode-box,
  .image-box,
  .canvas-box {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    margin-top: 50rpx;
  }

  .text {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    margin-top: 12rpx;
    font-size: 34rpx;
  }

  .image-box {
    width: 400rpx;
    margin-top: 50rpx;
  }

  .image {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    width: 400rpx;
    height: 400rpx;
  }

  .input {
    width: 600rpx;
    height: 40px;
    margin: 50rpx 0;
    padding: 0 20rpx;
    border: 1px solid #b0b0b0;
    border-radius: 5px;
    background-color: #ffffff;
  }

  .button {
    width: 690rpx;
    margin: 10rpx;
  }

  .button:last-child {
    margin-bottom: 50rpx;
  }

  .component {
    margin-top: 30rpx;
    text-align: center;
  }

  .component-title {
    /* #ifndef APP-NVUE */
    display: inline-block;
    /* #endif */
    padding: 20rpx 40rpx;
    border-bottom: 2px solid #d8d8d8;
    font-size: 36rpx;
  }

  .component-buttons {
    margin-top: 30rpx;
  }
</style>
