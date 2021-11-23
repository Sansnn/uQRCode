<template>
  <view class="uqrcode">
    <view v-if="options.mode === 'view'" class="uqrcode-view" :style="{
      'width': `${options.size}px`, 
      'height': `${options.size}px`,
      'padding': `${options.margin}px`,
      'background-color': options.backgroundColor
      }">
      <view class="uqrcode-view-row" v-for="(row, rowIndex) in modules.length" :key="rowIndex">
        <view class="uqrcode-view-col" v-for="(col, colIndex) in modules.length" :key="colIndex" :style="{
        	'width': `${colSize}px`,
        	'height': `${colSize}px`,
        	'background-color': modules[rowIndex][colIndex] ? options.foregroundColor : options.backgroundColor
        	}">
        </view>
      </view>
    </view>
    <canvas v-else-if="options.mode === 'canvas'" class="uqrcode-canvas" :id="options.canvasId" :canvas-id="options.canvasId" :style="{'width': `${options.size}px`, 'height': `${options.size}px`}" />
  </view>
</template>

<script>
  import uqrcode from './common/uqrcode'

  export default {
    name: 'uqrcode',
    // props: {
    //   mode: {
    //     type: String,
    //     default: 'view' // view|canvas
    //   }
    // },
    data() {
      return {
        options: uqrcode.defaults,
        modules: [],
        result: {}
      }
    },
    computed: {
      colSize() {
        return (this.options.size - this.options.margin * 2) / this.modules.length
      }
    },
    methods: {
      make(options) {
        options = {
          ...this.options,
          ...options
        }
        if (!options.mode) {
          options.mode = 'view'
        }
        if (!options.canvasId) {
          options.canvasId = this.uuid()
        }
        this.options = options
        if (options.mode === 'view') {
          this.modules = uqrcode.getModules(options)
        } else if (options.mode === 'canvas') {
          return new Promise((resolve, reject) => {
            uqrcode.make(options, this).then(res => {
              this.result = res
              resolve({
                ...res
              })
            }).catch(err => {
              reject(err)
            })
          })
        }
      },
      save() {
        if (this.options.mode === 'view') {
          uni.showToast({
            icon: 'none',
            title: 'view模式不支持保存，请提示用户使用截屏保存'
          })
        } else if (this.options.mode === 'canvas') {
          // #ifdef H5
          uni.showToast({
            icon: 'none',
            title: 'canvas H5不支持保存，请将二维码放置在image组件，再提示用户长按image保存'
          })
          // #endif
          // #ifndef H5
          uni.saveImageToPhotosAlbum({
            filePath: this.result.tempFilePath,
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
          // #endif
        }
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
      }
    }
  }
</script>

<style>
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
</style>
