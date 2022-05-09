<template>
  <view class="u-qrcode" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- 画布 -->
    <!-- #ifndef MP-WEIXIN || APP-NVUE -->
    <canvas
      class="u-qrcode-canvas"
      :id="canvasId"
      :canvas-id="canvasId"
      :style="{
        width: `${templateOptions.canvasWidth}px`,
        height: `${templateOptions.canvasHeight}px`,
        transform: `scale(${size / templateOptions.canvasWidth}, ${size / templateOptions.canvasHeight})`
      }"
      @click="onClick"
      v-if="templateOptions.canvasDisplay"
    ></canvas>
    <!-- #endif -->

    <!-- 微信小程序非2d模式不支持transform所以使用canvas2d -->
    <!-- #ifdef MP-WEIXIN -->
    <canvas
      class="u-qrcode-canvas"
      type="2d"
      :id="canvasId"
      :canvas-id="canvasId"
      :style="{
        width: `${templateOptions.canvasWidth}px`,
        height: `${templateOptions.canvasHeight}px`
      }"
      @click="onClick"
      v-if="templateOptions.canvasDisplay"
    ></canvas>
    <!-- #endif -->

    <!-- nvue用gcanvas -->
    <!-- #ifdef APP-NVUE -->
    <gcanvas
      class="u-qrcode-canvas"
      ref="gcanvas"
      :style="{
        width: `${templateOptions.canvasWidth}px`,
        height: `${templateOptions.canvasWidth}px`
      }"
      @click="onClick"
      v-if="templateOptions.canvasDisplay"
    ></gcanvas>
    <!-- #endif -->

    <!-- H5保存提示 -->
    <!-- #ifdef H5 -->
    <view class="uqrcode-h5-save" v-if="isH5Save">
      <image class="uqrcode-h5-save-image" :src="tempFilePath"></image>
      <text class="uqrcode-h5-save-text">若保存失败，请长按二维码进行保存</text>
      <view class="uqrcode-h5-save-close" @click="isH5Save = false">
        <view class="uqrcode-h5-save-close-before"></view>
        <view class="uqrcode-h5-save-close-after"></view>
      </view>
    </view>
    <!-- #endif -->

    <!-- 加载效果，可在此替换 -->
    <view class="u-qrcode-makeing" v-if="makeing">
      <image
        class="u-qrcode-makeing-image"
        :style="{ width: `${size / 5}px`, height: `${size / 5}px` }"
        src="data:image/gif;base64,R0lGODlhPAA8ANU9AOnp6d3d3c/Pz8LCwurq6vv7+/7+/v39/fz8/Pf399/f3/n5+fLy8tLS0u7u7vr6+u/v7/T09PX19cbGxvb29u3t7ezs7Ovr6/Hx8efn5+Li4vDw8PPz89PT0+Pj497e3ujo6Pj4+ODg4OTk5Obm5tzc3OHh4dHR0dfX19nZ2dDQ0NjY2Nra2sXFxdXV1eXl5czMzM7Oztvb28TExMfHx9bW1sPDw9TU1M3NzcjIyMvLy8rKysnJyf///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3ZjEzNTNkOS1lZDJmLTQyZTYtOTc2Ni05OTE5ZTM5MzQ0YTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODJBMjY1RUI5NTI1MTFFNzhENDA5Q0JBREM4QTAxNkUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODJBMjY1RUE5NTI1MTFFNzhENDA5Q0JBREM4QTAxNkUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06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"
      ></image>
    </view>

    <!-- 错误处理，可在此替换 -->
    <view class="u-qrcode-error" v-if="inError"><text class="u-qrcode-error-message">Error, see console.</text></view>

    <!-- <view
      class="u-qrcode-canvas"
      style="background-color: rgba(243, 105, 59, 0.5);position: absolute;top: 0;left: 0;z-index: 999;"
      :style="{
        width: `${size}px`,
        height: `${size}px`
      }"
      v-if="templateOptions.canvasDisplay"
    ></view> -->
  </view>
</template>

<script>
/* 引入uQRCode核心js */
import uQRCode from './common/u-qrcode';

/* 引入nvue所需模块 */
// #ifdef APP-NVUE
import { enable, WeexBridge } from './gcanvas';
let modal = weex.requireModule('modal');
// #endif

export default {
  name: 'uqrcode',
  props: {
    /**
     * canvas组件id
     */
    canvasId: {
      type: String,
      required: true // canvasId在微信小程序初始值不能为空，created中赋值也不行，必须给一个值，否则挂载组件后无法绘制
    },
    /**
     * 二维码内容
     */
    value: {
      type: [String, Number],
      required: true
    },
    /**
     * 二维码大小
     */
    size: {
      type: [String, Number],
      default: 354
    },
    /**
     * 导出的文件类型
     */
    fileType: {
      type: String,
      default: 'png'
    },
    /**
     * 选项
     */
    options: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      canvas: undefined,
      canvasContext: undefined,
      makeDelegate: undefined,
      toTempFilePathDelegate: undefined,
      makeing: true,
      inError: false,
      isH5Save: false,
      tempFilePath: '',
      templateOptions: {
        canvasWidth: 0, // canvas宽度
        canvasHeight: 0,
        canvasDisplay: false
      },
      uqrcodeOptions: {
        text: ''
      }
    };
  },
  watch: {
    value: {
      handler() {
        this.remake();
      }
    },
    options: {
      handler() {
        this.remake();
      },
      deep: true
    },
    makeing: {
      handler(val) {
        if (!val) {
          if (typeof this.toTempFilePathDelegate === 'function') {
            this.toTempFilePathDelegate();
          }
        }
      }
    }
  },
  mounted() {
    this.templateOptions.canvasWidth = this.size;
    this.templateOptions.canvasHeight = this.size;
    this.$nextTick(() => {
      this.templateOptions.canvasDisplay = true;
      this.$nextTick(() => {
        this.make();
      });
    });
  },
  methods: {
    /**
     * 生成二维码
     */
    make() {
      this.makeing = true;
      this.inError = false;

      if (!this.canvasId || !this.value) {
        if (!this.canvasId) {
          console.error('[uQRCode]: canvasId must be set!');
        }
        if (!this.value) {
          console.error('[uQRCode]: value must be set!');
        }
        this.inError = true;
        this.complete(false);
        clearTimeout(this.makeDelegate);
        return;
      }

      /* 高频重绘节流 */
      clearTimeout(this.makeDelegate);
      this.makeDelegate = setTimeout(() => {
        /* 组件数据 */
        this.templateOptions = this.getTemplateOptions();
        /* uQRCode选项 */
        this.uqrcodeOptions = this.getUqrcodeOptions();

        /* 纠错等级兼容字母写法 */
        if (typeof this.uqrcodeOptions.errorCorrectLevel === 'string') {
          this.uqrcodeOptions.errorCorrectLevel = uQRCode.errorCorrectLevel[this.uqrcodeOptions.errorCorrectLevel];
        }
        /* nvue不支持动态修改gcanvas尺寸，除nvue外，默认使用useDynamicSize */
        // #ifndef APP-NVUE
        if (typeof this.options.useDynamicSize === 'undefined') {
          this.uqrcodeOptions.useDynamicSize = true;
        }
        // #endif
        // #ifdef APP-NVUE
        this.uqrcodeOptions.useDynamicSize = false;
        // #endif

        // #ifndef MP-WEIXIN || APP-NVUE
        /* uniapp获取canvas实例方式 */
        const ctx = (this.canvasContext = uni.createCanvasContext(this.canvasId, this));
        /* uniapp获取图像方式 */
        const loadImage = function(src) {
          return new Promise((resolve, reject) => {
            uni.getImageInfo({
              src,
              success: res => {
                resolve(res.path);
              }
            });
          });
        };

        /* 实例化uQRCode：uQRCode选项参数, canvas实例, loadImage方法 */
        let uqrcode = new uQRCode(this.uqrcodeOptions, ctx, loadImage);
        /* 调用uqrcode方法 */
        uqrcode.make();

        /* 使用dynamicSize，可以解决小块间出现白线问题，再通过scale缩放至size，使其达到所设尺寸 */
        this.templateOptions.canvasWidth = uqrcode.options.dynamicSize;
        this.templateOptions.canvasHeight = uqrcode.options.dynamicSize;

        /* 等待canvas重新渲染和节流，并以最后一次重绘为准 */
        // clearTimeout(this.makeDelegate);
        this.makeDelegate = setTimeout(() => {
          uqrcode
            .draw()
            .then(() => {
              this.complete(true);
            })
            .catch(() => {
              this.complete(false);
            });
        }, 150);
        // #endif

        // #ifdef MP-WEIXIN
        /* 因为是回调的原因，高频率重绘会出现问题 */
        if (!this.templateOptions.canvasDisplay) {
          return;
        }
        /* 微信小程序获取canvas实例方式 */
        uni
          .createSelectorQuery()
          .in(this) // 在组件内使用需要
          .select(`#${this.canvasId}`)
          .fields({
            node: true,
            size: true
          })
          .exec(res => {
            /* 因为是回调的原因，高频率重绘会出现问题 */
            if (!this.templateOptions.canvasDisplay) {
              return;
            }
            const canvas = (this.canvas = res[0].node);
            const ctx = (this.canvasContext = canvas.getContext('2d'));
            /* 微信小程序获取图像方式 */
            const loadImage = function(src) {
              /* 小程序下获取网络图片信息需先配置download域名白名单才能生效 */
              return new Promise((resolve, reject) => {
                const img = canvas.createImage();
                img.src = src;
                img.onload = () => {
                  resolve(img);
                };
              });
            };
            const dpr = uni.getSystemInfoSync().pixelRatio;

            /* 实例化uQRCode：uQRCode选项参数, canvas实例, loadImage方法（微信小程序使用的是canvas2d，不能直接用src，得转成img对象才能使用drawImage） */
            let uqrcode = new uQRCode(this.uqrcodeOptions, ctx, loadImage);
            /* 调用uqrcode方法 */
            uqrcode.make();

            /* 2d的组件设置宽高与实际canvas绘制宽高不是一个,打个比方,组件size=200,canvas.width设置为100,那么绘制出来就是100=200,组件size=400,canvas.width设置为800,绘制大小还是800=400,所以无需理会下方返回的dynamicSize是多少,按dpr重新赋值给canvas即可 */
            this.templateOptions.canvasWidth = uqrcode.options.size;
            this.templateOptions.canvasHeight = uqrcode.options.size;
            /* 使用dynamicSize+scale，可以解决小块间出现白线问题，dpr可以解决模糊问题 */
            canvas.width = uqrcode.options.dynamicSize * dpr;
            canvas.height = uqrcode.options.dynamicSize * dpr;
            ctx.scale(dpr, dpr);

            /* 等待canvas重新渲染和节流，并以最后一次重绘为准 */
            // clearTimeout(this.makeDelegate);
            this.makeDelegate = setTimeout(() => {
              uqrcode
                .draw()
                .then(() => {
                  this.complete(true);
                })
                .catch(() => {
                  this.complete(false);
                });
            }, 150);
          });
        // #endif

        // #ifdef APP-NVUE
        /* 获取元素引用 */
        const gcanvas = this.$refs['gcanvas'];
        /* 通过元素引用获取canvas对象 */
        const canvas = enable(gcanvas, {
          bridge: WeexBridge
        });
        /* 获取绘图所需的上下文，目前不支持3d */
        const ctx = (this.canvasContext = canvas.getContext('2d'));
        /* nvue获取图像方式 */
        const loadImage = function(src) {
          return new Promise((resolve, reject) => {
            /* getImageInfo在nvue的bug：获取同一个路径的图片信息，同一时间第一次获取成功，后续失败，猜测是写入本地时产生文件写入冲突，所以没有返回，特别是对于网络资源 --- js部分已实现队列绘制，已解决此问题 */
            uni.getImageInfo({
              src,
              success: res => {
                resolve(res.path);
              }
            });
          });
        };

        /* 实例化uQRCode：uQRCode选项参数, canvas实例, loadImage方法 */
        let uqrcode = new uQRCode(this.uqrcodeOptions, ctx, loadImage);
        /* 调用uqrcode方法 */
        uqrcode.make();

        /* 等待canvas重新渲染和节流，并以最后一次重绘为准 */
        // clearTimeout(this.makeDelegate);
        this.makeDelegate = setTimeout(() => {
          uqrcode
            .draw()
            .then(() => {
              this.complete(true);
            })
            .catch(() => {
              this.complete(false);
            });
        }, 150);
        // #endif
      }, 300);
    },
    /**
     * 生成完成
     */
    complete(success = true) {
      setTimeout(() => {
        this.makeing = false;
        this.$emit('complete', {
          success
        });
      }, 150);
    },
    /**
     * 重新生成
     */
    remake() {
      this.resetCanvas(() => {
        this.make();
      });
    },
    /**
     * 重置画布
     */
    resetCanvas(callback) {
      this.templateOptions.canvasDisplay = false;
      this.$nextTick(() => {
        this.templateOptions.canvasDisplay = true;
        this.$nextTick(() => {
          callback && callback();
        });
      });
    },
    /**
     * 注册click事件
     */
    onClick(e) {
      this.$emit('click', e);
    },
    getTemplateOptions() {
      return uQRCode.deepReplace(this.templateOptions, {
        width: this.size,
        height: this.size
      });
    },
    getUqrcodeOptions() {
      return uQRCode.deepReplace(this.options, {
        text: this.value,
        size: this.size
      });
    },
    /**
     * 导出临时路径
     */
    toTempFilePath(callback = {}) {
      if (typeof callback.success != 'function') {
        callback.success = () => {};
      }
      if (typeof callback.fail != 'function') {
        callback.fail = () => {};
      }
      if (typeof callback.complete != 'function') {
        callback.complete = () => {};
      }

      if (this.makeing) {
        /* 如果还在生成状态，那当前操作将托管到委托，监听生成完成后再通过委托复调当前方法 */
        this.toTempFilePathDelegate = () => {
          this.toTempFilePath(callback);
        };
        return;
      } else {
        this.toTempFilePathDelegate = null;
      }

      // #ifndef MP-WEIXIN || APP-NVUE
      uni.canvasToTempFilePath(
        {
          canvasId: this.canvasId,
          fileType: this.fileType,
          width: this.templateOptions.canvasWidth,
          height: this.templateOptions.canvasHeight,
          success: res => {
            callback.success(res);
          },
          fail: err => {
            callback.fail(err);
          },
          complete: () => {
            callback.complete();
          }
        },
        this
      );
      // #endif

      // #ifdef MP-WEIXIN
      /* 需要将 data:image/png;base64, 这段去除 writeFile 才能正常打开文件，否则是损坏文件，无法打开*/
      const reg = new RegExp('^data:image/png;base64,', 'g');
      const dataURL = this.canvas.toDataURL().replace(reg, '');
      const fs = wx.getFileSystemManager();
      const tempFilePath = `${wx.env.USER_DATA_PATH}/${new Date().getTime()}${
        Math.random()
          .toString()
          .split('.')[1]
      }.png`;
      fs.writeFile({
        filePath: tempFilePath, // 要写入的文件路径 (本地路径)
        data: dataURL, // base64图片
        encoding: 'base64',
        success: res => {
          callback.success({
            tempFilePath
          });
        },
        fail: err => {
          callback.fail(err);
        },
        complete: () => {
          callback.complete();
        }
      });
      // #endif

      // #ifdef APP-NVUE
      /* 测试过程中，size需要乘以3才能保存完整，3又对应dpr，猜测是与像素比有关，故乘以3。第一次运行无法保存，后续正常，待排查。 */
      const dpr = uni.getSystemInfoSync().pixelRatio;
      this.canvasContext.toTempFilePath(0, 0, this.size * dpr, this.size * dpr, this.size * dpr, this.size * dpr, '', 1, res => {
        callback.success(res);
        callback.complete(res);
      });
      // #endif
    },
    /**
     * 保存
     */
    save(callback = {}) {
      if (typeof callback.success != 'function') {
        callback.success = () => {};
      }
      if (typeof callback.fail != 'function') {
        callback.fail = () => {};
      }
      if (typeof callback.complete != 'function') {
        callback.complete = () => {};
      }

      this.toTempFilePath({
        success: res => {
          console.log(res);
          // #ifndef H5
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: res1 => {
              callback.success(res1);
            },
            fail: err1 => {
              callback.fail(err1);
            },
            complete: () => {
              callback.complete();
            }
          });
          // #endif

          // #ifdef H5
          /* 可以在电脑浏览器下载，移动端iOS不行，安卓微信浏览器不行，安卓外部浏览器可以 */
          this.isH5Save = true;
          this.tempFilePath = res.tempFilePath;
          const aEle = document.createElement('a');
          aEle.download = 'uQRCode'; // 设置下载的文件名，默认是'下载'
          aEle.href = res.tempFilePath;
          document.body.appendChild(aEle);
          aEle.click();
          aEle.remove(); // 下载之后把创建的元素删除
          callback.success({
            errMsg: 'ok'
          });
          callback.complete();
          // #endif
        },
        fail: err => {
          callback.fail(err);
          callback.complete();
        }
      });
    }
  }
};
</script>

<style>
.u-qrcode {
  position: relative;
}

.u-qrcode-canvas {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform-origin: top left;
}

.u-qrcode-makeing {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}

.u-qrcode-makeing-image {
  /* #ifndef APP-NVUE */
  display: block;
  max-width: 120px;
  max-height: 120px;
  /* #endif */
}

.u-qrcode-error {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}

.u-qrcode-error-message {
  font-size: 12px;
  color: #939291;
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
  color: #ffffff;
}

.uqrcode-h5-save-close {
  position: relative;
  margin-top: 72rpx;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #ffffff;
  border-radius: 40rpx;
  padding: 10rpx;
}

.uqrcode-h5-save-close-before {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 40rpx;
  height: 4rpx;
  background: #ffffff;
}

.uqrcode-h5-save-close-after {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) rotate(-45deg);
  width: 40rpx;
  height: 4rpx;
  background: #ffffff;
}

/* #endif */
</style>
