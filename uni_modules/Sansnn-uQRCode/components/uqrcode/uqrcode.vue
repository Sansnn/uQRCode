<template>
  <view class="uqrcode" :style="{ width: `${size}px`, height: `${size}px` }">
    <block v-if="!isReload">
      <!-- canvas模式，默认 -->
      <block v-if="mode === 'canvas'">
        <!-- #ifdef APP-NVUE -->
        <gcanvas class="uqrcode-canvas" ref="gcanvas" :style="{ width: `${size}px`, height: `${size}px` }" />
        <!-- #endif -->
        <!-- #ifndef APP-NVUE -->
        <canvas class="uqrcode-canvas" :id="canvasId" :canvas-id="canvasId" :style="{ width: `${size}px`, height: `${size}px` }" />
        <!-- #endif -->
      </block>

      <!-- view模式，兼容 -->
      <view
        v-else-if="mode === 'view'"
        class="uqrcode-view"
        :style="{
          width: `${size}px`,
          height: `${size}px`,
          padding: `${margin}px`,
          backgroundColor
        }"
      >
        <view class="uqrcode-view-row" v-for="(row, rowIndex) in modules.length" :key="rowIndex">
          <view
            class="uqrcode-view-col"
            v-for="(col, colIndex) in modules.length"
            :key="colIndex"
            :style="{
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              backgroundColor: modules[rowIndex][colIndex] ? foregroundColor : backgroundColor
            }"
          ></view>
        </view>
      </view>
    </block>

    <!-- 生成二维码的loading效果 -->
    <!-- <view class="uqrcode-makeing" :class="{'uqrcode-make-complete': !makeing}">loading...</view> -->

    <!-- H5保存提示 -->
    <!-- #ifdef H5 -->
    <view class="uqrcode-h5-save" v-if="isH5Save">
      <image class="uqrcode-h5-save-image" :src="tempFilePath" />
      <text class="uqrcode-h5-save-text">请长按二维码进行保存</text>
      <view class="uqrcode-h5-save-close" @click="isH5Save = false">
        <view class="uqrcode-h5-save-close-before"></view>
        <view class="uqrcode-h5-save-close-after"></view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
/* 引入uqrcode核心js */
import uqrcode from './common/uqrcode';

/* 引入nvue所需模块 */
// #ifdef APP-NVUE
import { enable, WeexBridge } from './gcanvas';
let modal = weex.requireModule('modal');
// #endif

export default {
  name: 'uqrcode',
  props: {
    /* id */
    id: String,
    /* 生成模式 */
    mode: {
      type: String,
      default: 'canvas' // canvas|view
    },
    /* 二维码内容 */
    text: {
      type: [String, Number],
      required: true
    },
    /* 二维码大小 */
    size: {
      type: Number,
      default: 256
    },
    /* 填充边距 */
    margin: {
      type: Number,
      default: 0
    },
    /* 背景色 */
    backgroundColor: String,
    /* 前景色 */
    foregroundColor: {
      type: [String, Array],
      default: '#000000'
    },
    /* 前景色渐变方式：线性:linear/圆形|放射:circular */
    foregroundGradientType: {
      type: String,
      default: 'linear'
    },
    /* 前景色渐变范围，线性默认：[0, size, size, size]，圆形默认：[size/2, size/2, size] */
    foregroundGradientScope: Array,
    /* 纠错等级 */
    errorCorrectLevel: {
      type: [String, Number],
      default: uqrcode.errorCorrectLevel.H
    },
    /* 版本 */
    typeNumber: {
      type: Number,
      default: -1
    },
    /* 导出的文件类型 */
    fileType: {
      type: String,
      default: 'jpg'
    },
    /* 小块边距，基于小块宽度的百分比 */
    tileMargin: {
      type: Number,
      default: 0
    },
    /* 小块圆角值，基于小块宽度的百分比 */
    tileRadius: {
      type: Number,
      default: 0
    },
    /* 小块透明度 */
    tileAlpha: {
      type: Number,
      default: 1
    },
    /* 前景图 */
    foregroundImage: String,
    /* 前景图选项 */
    foregroundImageOptions: Object,
    /* 背景图 */
    backgroundImage: String,
    /* 背景图选项 */
    backgroundImageOptions: Object,
    /* 定位角 */
    corner: Object,
    debug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      canvasId: '',
      canvasContext: null,
      makeing: false,
      delegate: null,
      delegateParams: null,
      tempFilePath: '',
      isH5Save: false,
      isReload: false
    };
  },
  computed: {
    modules() {
      let options = {
        ...this.$props
      };
      if (typeof options.errorCorrectLevel === 'string') {
        options.errorCorrectLevel = uqrcode.errorCorrectLevel[options.errorCorrectLevel];
      }
      let modules = uqrcode.getModules(options);
      /* 标记定位角 */
      for (var row = 0; row < modules.length; row++) {
        for (var col = 0; col < modules.length; col++) {
          var leftTop = row < 7 && col < 7;
          var rightTop = row < 7 && col >= modules.length - 7;
          var leftBottom = row >= modules.length - 7 && col < 7;
          if (leftTop && modules[row][col]) {
            modules[row][col] = 'lt'; // 定位角左上
          } else if (rightTop && modules[row][col]) {
            modules[row][col] = 'rt'; // 定位角右上
          } else if (leftBottom && modules[row][col]) {
            modules[row][col] = 'lb'; // 定位角左下
          }
        }
      }
      return modules;
    },
    tileSize() {
      return (this.size - this.margin * 2) / this.modules.length;
    }
  },
  watch: {
    /* 深度监听props，任意属性一发生改变立即重绘二维码 */
    $props: {
      handler(val) {
        if (this.debug) {
          console.log(val);
        }
        this.reload();
      },
      deep: true
    },
    makeing(val) {
      if (!val) {
        if (typeof this.delegate === 'function') {
          this.delegate(this.delegateParams);
        }
      }
    }
  },
  mounted() {
    this.canvasId = this.id || this.createCanvasId();
    this.$nextTick(() => {
      this.make();
    });
  },
  methods: {
    reload() {
      /* 重载组件 */
      this.isReloadMake = true;
      this.isReload = true;
      this.$nextTick(() => {
        this.isReload = false;
        this.$nextTick(() => {
          setTimeout(() => {
            this.make();
          }, 150);
        });
      });
    },
    make() {
      if (this.makeing) {
        return;
      }
      this.makeing = true;
      if (this.mode === 'canvas') {
        let ctx = this.createCanvasContext();
        /* 如果画布有其他内容则清空之前的画布内容 */
        ctx.draw(false);
        /* 绘制背景色 */
        this.drawBackgroundColor();
        /* 绘制背景图 */
        this.drawBackgroundImage();
        /* 绘制二维码主体 */
        this.drawQrCodeBody();
        /* 绘制二维码定位角 */
        this.drawQrCodeCorner();
        /* 绘制前景图 */
        this.drawForegroundImage();

        ctx.draw(false, () => {
          // setTimeout(() => {
          this.complete();
          // }, 3000)
        });
      } else if (this.mode === 'view') {
        this.complete();
      }
    },
    complete(e = {}) {
      let basic = {
        id: this.canvasId,
        text: this.text,
        mode: this.mode
      };
      let ages = {
        ...basic,
        ...e
      };
      this.makeing = false;
      this.$emit('complete', ages);
    },
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
        // 如果还在生成状态，那当前操作将托管到委托，监听生成完成后再通过委托复调当前方法
        this.delegate = this.toTempFilePath;
        this.delegateParams = callback;
        return;
      } else {
        this.delegate = null;
        this.delegateParams = null;
      }

      let _this = this;
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
          _this.tempFilePath = res.tempFilePath;
          callback.success(res);
          callback.complete(res);
        }
      );
      // #endif

      // #ifndef APP-NVUE
      uni.canvasToTempFilePath(
        {
          canvasId: this.canvasId,
          fileType: this.fileType,
          width: this.size,
          height: this.size,
          success: res => {
            this.tempFilePath = res.tempFilePath;
            callback.success(res);
          },
          fail: err => {
            callback.fail(err);
          },
          complete: res => {
            callback.complete(res);
          }
        },
        this
      );
      // #endif
    },
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
          // #ifdef H5
          this.isH5Save = true;
          callback.success({
            msg: 'H5请长按图片保存'
          });
          callback.complete({
            msg: 'H5请长按图片保存'
          });
          // #endif

          // #ifndef H5
          uni.saveImageToPhotosAlbum({
            filePath: this.tempFilePath,
            success: res1 => {
              callback.success({
                msg: '保存成功'
              });
            },
            fail: err1 => {
              callback.fail(err1);
            },
            complete: res1 => {
              callback.complete(res1);
            }
          });
          // #endif
        },
        fail: err => {
          callback.fail(err);
        }
      });
    },

    /* —————————————————— canvas方法 —————————————————— */

    /**
     * 填充小块
     */
    fillTile(ctx, x, y, w, h, m, r) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      // ctx.stroke();
      ctx.fill();
      ctx.restore();
    },

    /**
     * 绘制二维码定位角
     */
    drawQrCodeCorner() {
      let ctx = this.canvasContext;
      ctx.save();

      let modules = this.modules;
      let corner =
        this.corner === undefined
          ? {
              lt: {
                color: this.foregroundColor,
                tileMargin: this.tileMargin,
                tileRadius: this.tileRadius,
                tileAlpha: this.tileAlpha
              },
              rt: {
                color: this.foregroundColor,
                tileMargin: this.tileMargin,
                tileRadius: this.tileRadius,
                tileAlpha: this.tileAlpha
              },
              lb: {
                color: this.foregroundColor,
                tileMargin: this.tileMargin,
                tileRadius: this.tileRadius,
                tileAlpha: this.tileAlpha
              }
            }
          : {
              lt:
                this.corner.lt === undefined
                  ? {
                      color: this.foregroundColor,
                      tileMargin: this.tileMargin,
                      tileRadius: this.tileRadius,
                      tileAlpha: this.tileAlpha
                    }
                  : {
                      color: this.corner.lt.color || this.foregroundColor,
                      tileMargin: typeof this.corner.lt.tileMargin != 'number' ? this.tileMargin : this.corner.lt.tileMargin,
                      tileRadius: typeof this.corner.lt.tileRadius != 'number' ? this.tileRadius : this.corner.lt.tileRadius,
                      tileAlpha: typeof this.corner.lt.tileAlpha != 'number' ? this.tileAlpha : this.corner.lt.tileAlpha
                    },
              rt:
                this.corner.rt === undefined
                  ? {
                      color: this.foregroundColor,
                      tileMargin: this.tileMargin,
                      tileRadius: this.tileRadius,
                      tileAlpha: this.tileAlpha
                    }
                  : {
                      color: this.corner.rt.color || this.foregroundColor,
                      tileMargin: typeof this.corner.rt.tileMargin != 'number' ? this.tileMargin : this.corner.rt.tileMargin,
                      tileRadius: typeof this.corner.rt.tileRadius != 'number' ? this.tileRadius : this.corner.rt.tileRadius,
                      tileAlpha: typeof this.corner.rt.tileAlpha != 'number' ? this.tileAlpha : this.corner.rt.tileAlpha
                    },
              lb:
                this.corner.lb === undefined
                  ? {
                      color: this.foregroundColor,
                      tileMargin: this.tileMargin,
                      tileRadius: this.tileRadius,
                      tileAlpha: this.tileAlpha
                    }
                  : {
                      color: this.corner.lb.color || this.foregroundColor,
                      tileMargin: typeof this.corner.lb.tileMargin != 'number' ? this.tileMargin : this.corner.lb.tileMargin,
                      tileRadius: typeof this.corner.lb.tileRadius != 'number' ? this.tileRadius : this.corner.lb.tileRadius,
                      tileAlpha: typeof this.corner.lb.tileAlpha != 'number' ? this.tileAlpha : this.corner.lb.tileAlpha
                    }
            };

      for (let c in corner) {
        ctx.save();

        var item = corner[c];
        var color = item.color; // 绘制颜色
        var size = this.tileSize * 7;
        if (typeof color === 'string' && color.split(',').length > 1) {
          /* 前景色为字符串元素但是是通过逗号分隔的多颜色元素，则表示是渐变，且切割成数组元素 */
          color = color.split(',');
        }
        if (color instanceof Array) {
          /* 前景色为数组元素则表示是渐变 */
          if (this.foregroundGradientType === 'linear') {
            var scope = [];
            if (this.corner) {
              if (c === 'lt' && this.corner.lt && this.corner.lt.color) {
                scope = [0, size, size, size];
              } else if (c === 'rt' && this.corner.rt && this.corner.rt.color) {
                scope = [(modules.length - 7) * this.tileSize, size, modules.length * this.tileSize, size];
              } else if (c === 'lb' && this.corner.lb && this.corner.lb.color) {
                scope = [0, size, size, size];
              } else {
                scope = this.foregroundGradientScope || [0, this.size, this.size, this.size];
              }
            } else {
              scope = this.foregroundGradientScope || [0, this.size, this.size, this.size];
            }
            var gnt = ctx.createLinearGradient(scope[0], scope[1], scope[2], scope[3]);
            gnt.addColorStop(0, color[0]);
            gnt.addColorStop(1, color[1]);
            ctx.setFillStyle(gnt);
            ctx.setStrokeStyle(gnt);
          } else if (this.foregroundGradientType === 'circular') {
            var scope = [];
            if (this.corner) {
              if (c === 'lt' && this.corner.lt && this.corner.lt.color) {
                scope = [size / 2, size / 2, size];
              } else if (c === 'rt' && this.corner.rt && this.corner.rt.color) {
                scope = [(modules.length - 7) * this.tileSize + size / 2, size / 2, size];
              } else if (c === 'lb' && this.corner.lb && this.corner.lb.color) {
                scope = [size / 2, (modules.length - 7) * this.tileSize + size / 2, size];
              } else {
                scope = this.foregroundGradientScope || [this.size / 2, this.size / 2, this.size];
              }
            } else {
              scope = this.foregroundGradientScope || [this.size / 2, this.size / 2, this.size];
            }
            var gnt = ctx.createCircularGradient(scope[0], scope[1], scope[2]);
            gnt.addColorStop(0, color[0]);
            gnt.addColorStop(1, color[1]);
            ctx.setFillStyle(gnt);
            ctx.setStrokeStyle(gnt);
          }
        } else {
          /* 前景色为字符串元素则为纯色 */
          ctx.setFillStyle(color);
          ctx.setStrokeStyle(color);
        }

        /* 设置透明度 */
        ctx.globalAlpha = item.tileAlpha;

        for (var row = 0; row < modules.length; row++) {
          for (var col = 0; col < modules.length; col++) {
            if (modules[row][col] === c) {
              /* 计算每一个小块的位置 */
              var x = col * this.tileSize + this.margin;
              var y = row * this.tileSize + this.margin;
              var w = this.tileSize;
              var h = this.tileSize;
              var m = 0;
              var r = 0;
              /* 填充主要内容部分 */
              m = (w * (item.tileMargin / 100)) / 2;
              x += m;
              y += m;
              w -= m * 2;
              h -= m * 2;
              r = (w * (item.tileRadius / 100)) / 2;
              this.fillTile(ctx, x, y, w, h, m, r);
            }
          }
        }

        ctx.restore();
      }

      ctx.restore();
    },

    /**
     * 绘制二维码主体
     */
    drawQrCodeBody() {
      let ctx = this.canvasContext;
      ctx.save();

      let foregroundColor = this.foregroundColor; // 前景色绘制颜色
      if (typeof foregroundColor === 'string' && foregroundColor.split(',').length > 1) {
        /* 前景色为字符串元素但是是通过逗号分隔的多颜色元素，则表示是渐变，且切割成数组元素 */
        foregroundColor = foregroundColor.split(',');
      }
      if (foregroundColor instanceof Array) {
        /* 前景色为数组元素则表示是渐变 */
        if (this.foregroundGradientType === 'linear') {
          var scope = this.foregroundGradientScope || [0, this.size, this.size, this.size];
          var gnt = ctx.createLinearGradient(scope[0], scope[1], scope[2], scope[3]);
          gnt.addColorStop(0, foregroundColor[0]);
          gnt.addColorStop(1, foregroundColor[1]);
          ctx.setFillStyle(gnt);
          ctx.setStrokeStyle(gnt);
        } else if (this.foregroundGradientType === 'circular') {
          var scope = this.foregroundGradientScope || [this.size / 2, this.size / 2, this.size];
          var gnt = ctx.createCircularGradient(scope[0], scope[1], scope[2]);
          gnt.addColorStop(0, foregroundColor[0]);
          gnt.addColorStop(1, foregroundColor[1]);
          ctx.setFillStyle(gnt);
          ctx.setStrokeStyle(gnt);
        }
      } else {
        /* 前景色为字符串元素则为纯色 */
        ctx.setFillStyle(foregroundColor);
        ctx.setStrokeStyle(foregroundColor);
      }

      /* 设置透明度 */
      ctx.globalAlpha = this.tileAlpha;

      let modules = this.modules;
      for (var row = 0; row < modules.length; row++) {
        for (var col = 0; col < modules.length; col++) {
          if (modules[row][col] === true) {
            /* 计算每一个小块的位置 */
            var x = col * this.tileSize + this.margin;
            var y = row * this.tileSize + this.margin;
            var w = this.tileSize;
            var h = this.tileSize;
            var m = 0;
            var r = 0;
            /* 填充主要内容部分 */
            m = (w * (this.tileMargin / 100)) / 2;
            x += m;
            y += m;
            w -= m * 2;
            h -= m * 2;
            r = (w * (this.tileRadius / 100)) / 2;
            this.fillTile(ctx, x, y, w, h, m, r);
          }
        }
      }

      ctx.restore();
    },

    /**
     * 绘制前景图
     */
    drawForegroundImage() {
      let ctx = this.canvasContext;
      ctx.save();

      let foregroundImage = this.foregroundImage; // 前景图
      if (foregroundImage) {
        // 绘制前景图
        let x = 0;
        let y = 0;

        let options =
          this.foregroundImageOptions === undefined
            ? {
                width: this.size / 4,
                height: this.size / 4,
                align: ['center', 'center'],
                anchor: [0, 0],
                alpha: 1
              }
            : {
                width: typeof this.foregroundImageOptions.width != 'number' ? this.size / 4 : this.foregroundImageOptions.width,
                height: typeof this.foregroundImageOptions.height != 'number' ? this.size / 4 : this.foregroundImageOptions.height,
                align: this.foregroundImageOptions.align instanceof Array ? this.foregroundImageOptions.align : ['center', 'center'],
                anchor: this.foregroundImageOptions.anchor instanceof Array ? this.foregroundImageOptions.anchor : [0, 0],
                alpha: typeof this.foregroundImageOptions.alpha != 'number' ? 1 : this.foregroundImageOptions.alpha
              };

        let w = options.width;
        let h = options.height;
        let align = options.align;
        let anchor = options.anchor;
        let alpha = options.alpha;

        switch (align[0]) {
          case 'left':
            x = 0;
            break;
          case 'center':
            x = this.size / 2 - w / 2;
            break;
          case 'right':
            x = this.size - w;
            break;
        }
        x += Number(anchor[0]);

        switch (align[1]) {
          case 'top':
            y = 0;
            break;
          case 'center':
            y = this.size / 2 - h / 2;
            break;
          case 'bottom':
            y = this.size - h;
            break;
        }
        y += Number(anchor[1]);

        /* 设置透明度 */
        ctx.globalAlpha = alpha;

        ctx.drawImage(foregroundImage, x, y, w, h);

        ctx.restore();
      }
    },

    /**
     * 绘制背景图
     */
    drawBackgroundImage() {
      let ctx = this.canvasContext;
      ctx.save();
      let backgroundImage = this.backgroundImage; // 背景图
      if (backgroundImage) {
        let x = 0;
        let y = 0;

        let options =
          this.backgroundImageOptions === undefined
            ? {
                width: this.size,
                height: this.size,
                align: ['center', 'center'],
                anchor: [0, 0],
                alpha: 1
              }
            : {
                width: typeof this.backgroundImageOptions.width != 'number' ? this.size : this.backgroundImageOptions.width,
                height: typeof this.backgroundImageOptions.height != 'number' ? this.size : this.backgroundImageOptions.height,
                align: this.backgroundImageOptions.align instanceof Array ? this.backgroundImageOptions.align : ['center', 'center'],
                anchor: this.backgroundImageOptions.anchor instanceof Array ? this.backgroundImageOptions.anchor : [0, 0],
                alpha: typeof this.backgroundImageOptions.alpha != 'number' ? 1 : this.backgroundImageOptions.alpha
              };

        let w = options.width;
        let h = options.height;
        let align = options.align;
        let anchor = options.anchor;
        let alpha = options.alpha;

        switch (align[0]) {
          case 'left':
            x = 0;
            break;
          case 'center':
            x = this.size / 2 - w / 2;
            break;
          case 'right':
            x = this.size - w;
            break;
        }
        x += Number(anchor[0]);

        switch (align[1]) {
          case 'top':
            y = 0;
            break;
          case 'center':
            y = this.size / 2 - h / 2;
            break;
          case 'bottom':
            y = this.size - h;
            break;
        }
        y += Number(anchor[1]);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(backgroundImage, x, y, w, h);
        ctx.restore();
      }
      ctx.restore();
    },

    /**
     * 绘制背景色
     */
    drawBackgroundColor() {
      let ctx = this.canvasContext;
      ctx.save();
      let backgroundColor = this.backgroundColor; // 背景色绘制颜色
      if (backgroundColor) {
        // 背景色已设置则填充，未设置则不填充，为透明背景
        ctx.setFillStyle(backgroundColor);
        ctx.fillRect(0, 0, this.size, this.size);
      }
      ctx.restore();
    },

    /**
     * 创建canvas上下文
     */
    createCanvasContext() {
      let ctx = null;

      // #ifdef APP-NVUE
      /* 获取元素引用 */
      let gcanvas = this.$refs['gcanvas'];
      /* 通过元素引用获取canvas对象 */
      let canvasObj = enable(gcanvas, {
        bridge: WeexBridge
      });
      /* 获取绘图所需的上下文，目前不支持3d */
      ctx = canvasObj.getContext('2d');
      // #endif

      // #ifndef APP-NVUE
      /* 获取绘图所需的上下文 */
      ctx = uni.createCanvasContext(this.canvasId, this);
      // #endif

      this.canvasContext = ctx;

      return ctx;
    },

    /**
     * 生成随机的canvasId
     */
    createCanvasId() {
      let id = '';
      let t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let len = t.length;
      for (let i = 0; i < 32; i++) {
        id += t.charAt(Math.floor(Math.random() * len));
      }
      return id;
    }
  }
};

function uuid(len = 32, firstU = true, radix = null) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [];
  radix = radix || chars.length;

  if (len) {
    // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    // rfc4122标准要求返回的uuid中,某些位为固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
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
  background-color: #ffffff;
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
