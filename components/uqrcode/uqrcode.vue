<template>
  <view class="uqrcode" :style="{'width': `${size}px`, 'height': `${size}px`}">
    <block v-if="!isReload">
      <!-- canvas模式，默认 -->
      <block v-if="mode === 'canvas'">
        <!-- #ifdef APP-NVUE -->
        <gcanvas class="uqrcode-canvas" ref="gcanvas" :style="{'width': `${size}px`, 'height': `${size}px`}"></gcanvas>
        <!-- #endif -->
        <!-- #ifndef APP-NVUE -->
        <canvas class="uqrcode-canvas" :id="id" :canvas-id="id" :style="{'width': `${size}px`, 'height': `${size}px`}"></canvas>
        <!-- #endif -->
      </block>

      <!-- view模式，兼容 -->
      <view v-else-if="mode === 'view'" class="uqrcode-view" :style="{
      'width': `${size}px`,
      'height': `${size}px`,
      'padding': `${margin}px`,
      'background-color': backgroundColor
      }">
        <view class="uqrcode-view-row" v-for="(row, rowIndex) in modules.length" :key="rowIndex">
          <view class="uqrcode-view-col" v-for="(col, colIndex) in modules.length" :key="colIndex" :style="{
        	'width': `${tileSize}px`,
        	'height': `${tileSize}px`,
        	'background-color': modules[rowIndex][colIndex] ? foregroundColor : backgroundColor
        	}">
          </view>
        </view>
      </view>
    </block>

    <!-- 生成二维码的loading效果 -->
    <!-- <view class="uqrcode-makeing" :class="{'uqrcode-make-complete': !makeing}">loading...</view> -->

    <!-- H5保存提示 -->
    <!-- #ifdef H5 -->
    <view class="uqrcode-h5-save" v-if="isH5Save">
      <image class="uqrcode-h5-save-image" :src="tempFilePath"></image>
      <text class="uqrcode-h5-save-text">请长按二维码进行保存</text>
      <view class="uqrcode-h5-save-close" @click="isH5Save=false">
        <view class="uqrcode-h5-save-close-before"></view>
        <view class="uqrcode-h5-save-close-after"></view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
  /* 引入uqrcode核心js */
  import uqrcode from './common/uqrcode'

  /* 引入nvue所需模块 */
  // #ifdef APP-NVUE
  import {
    enable,
    WeexBridge
  } from './gcanvas'
  let modal = weex.requireModule("modal")
  // #endif

  export default {
    name: 'uqrcode',
    props: {
      // id
      id: {
        type: String,
        default: uuid()
      },
      // 生成模式
      mode: {
        type: String,
        default: 'canvas' // canvas|view (nvue不支持canvas模式)
      },
      // 二维码内容
      text: String,
      // 二维码大小
      size: {
        type: Number,
        default: 256
      },
      // 填充边距
      margin: {
        type: Number,
        default: 0
      },
      // 背景色
      backgroundColor: {
        type: String,
        default: '#FFFFFF'
      },
      // 前景色
      foregroundColor: {
        type: String,
        default: '#000000'
      },
      // 纠错等级
      errorCorrectLevel: {
        type: [String, Number],
        default: uqrcode.errorCorrectLevel.H
      },
      // 版本
      typeNumber: {
        type: Number,
        default: -1
      },
      // 导出的文件类型
      fileType: {
        type: String,
        default: 'png'
      }
    },
    data() {
      return {
        canvasContext: null,
        makeing: false,
        delegate: null,
        delegateParams: null,
        tempFilePath: '',
        isH5Save: false,
        isReload: false
      }
    },
    computed: {
      modules() {
        let options = {
          ...this.$props
        }
        if (typeof options.errorCorrectLevel === 'string') {
          options.errorCorrectLevel = uqrcode.errorCorrectLevel[options.errorCorrectLevel]
        }
        return uqrcode.getModules(options)
      },
      tileSize() {
        return (this.size - this.margin * 2) / this.modules.length
      }
    },
    watch: {
      /* 深度监听props，任意属性一发生改变立即重绘二维码 */
      $props: {
        handler() {
          this.reload()
        },
        deep: true
      },
      makeing(val) {
        if (!val) {
          if (typeof this.delegate === 'function') {
            this.delegate(this.delegateParams)
          }
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.make()
      })
    },
    methods: {
      reload() {
        /* 重载组件 */
        this.isReloadMake = true
        this.isReload = true
        this.$nextTick(() => {
          this.isReload = false
          this.$nextTick(() => {
            setTimeout(() => {
              this.make()
            }, 150)
          })
        })
      },
      make() {
        if (this.makeing) {
          return
        }
        this.makeing = true
        if (this.mode === 'canvas') {
          let ctx = null

          // #ifdef APP-NVUE
          /* 获取元素引用 */
          let gcanvas = this.$refs["gcanvas"]
          /* 通过元素引用获取canvas对象 */
          let canvasObj = enable(gcanvas, {
            bridge: WeexBridge
          })
          /* 获取绘图所需的上下文，目前不支持3d */
          ctx = canvasObj.getContext('2d')
          // #endif

          // #ifndef APP-NVUE
          /* 获取绘图所需的上下文 */
          ctx = uni.createCanvasContext(this.id, this)
          // #endif

          this.canvasContext = ctx

          ctx.draw() // 清空之前的画布内容
          ctx.setFillStyle(this.backgroundColor)
          ctx.fillRect(0, 0, this.size, this.size)

          for (var row = 0; row < this.modules.length; row++) {
            for (var col = 0; col < this.modules.length; col++) {
              // 计算每一个小块的位置
              var x = col * this.tileSize + this.margin
              var y = row * this.tileSize + this.margin
              var w = this.tileSize
              var h = this.tileSize

              var style = this.modules[row][col] ? this.foregroundColor : this.backgroundColor
              ctx.setFillStyle(style)
              ctx.fillRect(x, y, w, h)
            }
          }

          ctx.draw(false, () => {
            // setTimeout(() => {
            this.complete()
            // }, 3000)
          })
        } else if (this.mode === 'view') {
          this.complete()
        }
      },
      complete(e = {}) {
        let basic = {
          id: this.id,
          text: this.text,
          mode: this.mode
        }
        let ages = {
          ...basic,
          ...e
        }
        this.makeing = false
        this.$emit('complete', ages)
      },
      toTempFilePath(callback = {}) {
        if (typeof callback.success != 'function') {
          callback.success = () => {}
        }
        if (typeof callback.fail != 'function') {
          callback.fail = () => {}
        }
        if (typeof callback.complete != 'function') {
          callback.complete = () => {}
        }

        if (this.makeing) {
          // 如果还在生成状态，那当前操作将托管到委托，监听生成完成后再通过委托复调当前方法
          this.delegate = this.toTempFilePath
          this.delegateParams = callback
          return
        } else {
          this.delegate = null
          this.delegateParams = null
        }

        let _this = this
        // #ifdef APP-NVUE
        this.canvasContext.toTempFilePath(
          0,
          0,
          _this.size * 3, // 不知道什么原因，最少要*3，不然输出的图片只有一个角
          _this.size * 3, // 不知道什么原因，最少要*3，不然输出的图片只有一个角
          _this.size,
          _this.size,
          _this.fileType,
          1,
          res => {
            _this.tempFilePath = res.tempFilePath
            callback.success(res)
            callback.complete(res)
          }
        )
        // #endif

        // #ifndef APP-NVUE
        uni.canvasToTempFilePath({
          canvasId: this.id,
          fileType: this.fileType,
          width: this.size,
          height: this.size,
          success: res => {
            this.tempFilePath = res.tempFilePath
            callback.success(res)
          },
          fail: err => {
            callback.fail(err)
          },
          complete: res => {
            callback.complete(res)
          }
        }, this)
        // #endif
      },
      save(callback = {}) {
        if (typeof callback.success != 'function') {
          callback.success = () => {}
        }
        if (typeof callback.fail != 'function') {
          callback.fail = () => {}
        }
        if (typeof callback.complete != 'function') {
          callback.complete = () => {}
        }

        this.toTempFilePath({
          success: res => {
            // #ifdef H5
            this.isH5Save = true
            callback.success({
              msg: 'H5请长按图片保存'
            })
            callback.complete({
              msg: 'H5请长按图片保存'
            })
            // #endif

            // #ifndef H5
            uni.saveImageToPhotosAlbum({
              filePath: this.tempFilePath,
              success: res1 => {
                callback.success({
                  msg: '保存成功'
                })
              },
              fail: err1 => {
                callback.fail(err1)
              },
              complete: res1 => {
                callback.complete(res1)
              }
            })
            // #endif
          },
          fail: err => {
            callback.fail(err)
          }
        })
      }
    }
  }

  function uuid(len = 32, firstU = true, radix = null) {
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
  }
</script>

<style>
  .uqrcode {
    position: relative;
  }

  .uqrcode-makeing {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* #ifndef APP-NVUE */
    display: flex;
    box-sizing: border-box;
    /* #endif */
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    transition-property: opacity;
    transition-duration: 0.25s;
    opacity: 0.88;
  }

  .uqrcode-make-complete {
    opacity: 0;
  }

  .uqrcode-view {
    /* #ifndef APP-NVUE */
    display: flex;
    box-sizing: border-box;
    /* #endif */
    flex-direction: column;
  }

  .uqrcode-view-row {
    /* #ifndef APP-NVUE */
    display: flex;
    box-sizing: border-box;
    /* #endif */
    flex-direction: row;
  }

  .uqrcode-view-col {
    /* #ifndef APP-NVUE */
    display: flex;
    box-sizing: border-box;
    /* #endif */
  }

  /* #ifdef H5 */
  .uqrcode-h5-save {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.68);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .uqrcode-h5-save-image {
    width: 512rpx;
    height: 512rpx;
    padding: 32rpx;
  }

  .uqrcode-h5-save-text {
    margin-top: 20rpx;
    font-size: 32rpx;
    font-weight: 700;
    color: #FFFFFF;
  }

  .uqrcode-h5-save-close {
    position: relative;
    margin-top: 72rpx;
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid #FFFFFF;
    border-radius: 40rpx;
    padding: 10rpx;
  }

  .uqrcode-h5-save-close-before {
    position: absolute;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 40rpx;
    height: 4rpx;
    background: #FFFFFF;
  }

  .uqrcode-h5-save-close-after {
    position: absolute;
    top: 50%;
    transform: translateY(-50%) rotate(-45deg);
    width: 40rpx;
    height: 4rpx;
    background: #FFFFFF;
  }

  /* #endif */
</style>
