import QRCode from './qrcode';
import {
  utf16To8,
  deepReplace
} from './util';
import {
  getCanvasContext
} from './canvasHelper';
import {
  paintData,
  paintPositionProbe,
  paintSeparator,
  paintPositionAdjust,
  paintTiming,
  paintDarkBlock,
  paintTypeNumber
} from './paint';

/**
 * UQRCode
 * @param {Object} options 
 * @param {Object} canvasContext 
 */
function UQRCode(options, canvasContext) {
  /** 基本属性 */
  var _data = this.data = ''; // 二维码对应内容
  var _size = this.size = 200; // 二维码大小
  var _useDynamicSize = this.useDynamicSize = false; // 使用动态尺寸，自动计算每一个小方块尺寸为整数，因为canvas特性，小数点部分会被绘制为透明渐变色，绘制后看起来像是有白色细线，计算为整数则可以解决这个问题，但是实际尺寸已不是原尺寸，canvas的尺寸需要通过获取dynamicSize后重新设置
  var _dynamicSize = this.dynamicSize = _size; // 动态尺寸
  var _typeNumber = this.typeNumber = -1; // 二维码版本，-1为自动计算，自动计算字符越多，版本越高
  var _errorCorrectLevel = this.errorCorrectLevel = UQRCode.errorCorrectLevel.H; // 纠错等级
  var _margin = this.margin = 0; // 二维码外边距
  var _areaColor = this.areaColor = '#FFFFFF'; // 二维码绘制区域颜色、底部背景色

  /** 背景属性 */
  var _backgroundColor = this.backgroundColor = 'rgba(255,255,255,0)'; // 背景色
  var _backgroundImageSrc = this.backgroundImageSrc = undefined; //背景图片地址
  var _backgroundImageWidth = this.backgroundImageWidth = undefined; // 背景图片宽度，默认与size同宽
  var _backgroundImageHeight = this.backgroundImageHeight = undefined; // 背景图片高度，默认与size同高
  var _backgroundImageX = this.backgroundImageX = undefined; // 背景图片位置X坐标，默认0
  var _backgroundImageY = this.backgroundImageY = undefined; // 背景图片位置Y坐标，默认0
  var _backgroundImageAlpha = this.backgroundImageAlpha = 1; // 背景图片透明度，默认不透明
  var _backgroundImageBorderRadius = this.backgroundImageBorderRadius = 0; // 背景图片圆角，默认不是圆角
  var _backgroundPadding = this.backgroundPadding = 0.0; // 背景码点内边距，系数：0.0-1.0

  /** 前景属性 */
  var _foregroundColor = this.foregroundColor = '#000000'; // 前景色
  var _foregroundImageSrc = this.foregroundImageSrc = undefined; // 前景图片地址
  var _foregroundImageWidth = this.foregroundImageWidth = undefined; // 前景图片宽度，默认为size的1/4
  var _foregroundImageHeight = this.foregroundImageHeight = undefined; // 前景图片高度，默认为size的1/4
  var _foregroundImageX = this.foregroundImageX = undefined; // 前景图片位置X坐标，默认在画布中间位置
  var _foregroundImageY = this.foregroundImageY = undefined; // 前景图片位置Y坐标，默认在画布中间位置
  var _foregroundImagePadding = this.foregroundImagePadding = 0; // 前景图边距填充
  var _foregroundImageBackgroundColor = this.foregroundImageBackgroundColor = '#FFFFFF'; // 前景图背景颜色
  var _foregroundImageBorderRadius = this.foregroundImageBorderRadius = 0; // 前景图边界圆角
  var _foregroundImageShadowOffsetX = this.foregroundImageShadowOffsetX = 0; // 前景图阴影水平偏移值
  var _foregroundImageShadowOffsetY = this.foregroundImageShadowOffsetY = 0; // 前景图阴影垂直偏移值
  var _foregroundImageShadowBlur = this.foregroundImageShadowBlur = 0; // 前景图阴影模糊度
  var _foregroundImageShadowColor = this.foregroundImageShadowColor = '#808080'; // 前景图阴影颜色
  var _foregroundPadding = this.foregroundPadding = 0.0; // 前景码点内边距，0.0-1.0

  /** 其他属性 */
  var _positionProbeBackgroundColor = this.positionProbeBackgroundColor = undefined; // 定位角区域背景色，默认值跟随背景色
  var _positionProbeForegroundColor = this.positionProbeForegroundColor = undefined; // 定位角码点颜色，默认值跟随前景色
  var _separatorColor = this.separatorColor = undefined; // 分割区域颜色，默认值跟随背景色
  var _positionAdjustBackgroundColor = this.positionAdjustBackgroundColor = undefined; // 对齐区域背景色，默认值跟随背景色
  var _positionAdjustForegroundColor = this.positionAdjustForegroundColor = undefined; // 对齐码点颜色，默认值跟随前景色
  var _timingBackgroundColor = this.timingBackgroundColor = undefined; // 时序区域背景色，默认值跟随背景色
  var _timingForegroundColor = this.timingForegroundColor = undefined; // 时序码点颜色，默认值跟随前景色
  var _typeNumberBackgroundColor = this.typeNumberBackgroundColor = undefined; // 版本信息区域背景色，默认值跟随背景色
  var _typeNumberForegroundColor = this.typeNumberForegroundColor = undefined; // 版本信息码点颜色，默认值跟随前景色
  var _darkBlockColor = this.darkBlockColor = undefined; // 暗块颜色，默认值跟随前景色

  /** 数据 */
  var _base = this.base = undefined; // 二维码基本对象，通过实例化QRCode类并调用make后得到
  var _modules = this.modules = []; // 制作二维码主要模块数据，基于base的modules但数据格式不一致，这里的modules是定制过的
  var _moduleCount = this.moduleCount = 0; // 模块数量
  var _drawModules = this.drawModules = []; // 绘制模块，层级：最底层 -> 绘制区域 -> 背景图片 -> 背景|前景 -> 前景图片 -> 最顶层

  /** 绘制模块 */
  var _canvasContext = this.canvasContext = undefined; // canvas上下文
  var _drawReserve = this.drawReserve = false; // ctx.draw保留绘制，本次绘制是否接着上一次绘制，2d没有draw方法，所以2d该属性对2d无效

  var _isMaked = this.isMaked = false;

  /* 属性设置 */
  Object.defineProperties(this, {
    data: {
      get() {
        if (_data === '' || _data === undefined) {
          console.error('[uQRCode]: data must be set!');
          throw new UQRCode.Error('data must be set!');
        }
        return _data;
      },
      set(value) {
        _data = String(value);
      }
    },
    size: {
      get() {
        return _size;
      },
      set(value) {
        _size = Number(value);
      }
    },
    typeNumber: {
      get() {
        return _typeNumber;
      },
      set(value) {
        _typeNumber = Number(value);
      }
    },
    margin: {
      get() {
        return _margin;
      },
      set(value) {
        _margin = Number(value);
      }
    },
    backgroundImageWidth: {
      get() {
        if (_backgroundImageWidth === undefined) {
          return this.dynamicSize;
        } else {
          if (this.useDynamicSize) {
            return (this.dynamicSize / this.size) * _backgroundImageWidth;
          } else {
            return _backgroundImageWidth;
          }
        }
      },
      set(value) {
        _backgroundImageWidth = Number(value);
      }
    },
    backgroundImageHeight: {
      get() {
        if (_backgroundImageHeight === undefined) {
          return this.dynamicSize;
        } else {
          if (this.useDynamicSize) {
            return (this.dynamicSize / this.size) * _backgroundImageHeight;
          } else {
            return _backgroundImageHeight;
          }
        }
      },
      set(value) {
        _backgroundImageHeight = Number(value);
      }
    },
    backgroundImageX: {
      get() {
        if (_backgroundImageX === undefined) {
          return 0;
        } else {
          if (this.useDynamicSize) {
            return (this.dynamicSize / this.size) * _backgroundImageX;
          } else {
            return _backgroundImageX;
          }
        }
      },
      set(value) {
        _backgroundImageX = Number(value);
      }
    },
    backgroundImageY: {
      get() {
        if (_backgroundImageY === undefined) {
          return 0;
        } else {
          if (this.useDynamicSize) {
            return (this.dynamicSize / this.size) * _backgroundImageY;
          } else {
            return _backgroundImageY;
          }
        }
      },
      set(value) {
        _backgroundImageY = Number(value);
      }
    },
    backgroundPadding: {
      get() {
        return _backgroundPadding;
      },
      set(value) {
        if (value > 1) {
          _backgroundPadding = 1;
        } else if (value < 0) {
          _backgroundPadding = 0;
        } else {
          _backgroundPadding = value;
        }
      }
    },
    foregroundImageWidth: {
      get() {
        if (_foregroundImageWidth === undefined) {
          return (this.dynamicSize - this.margin * 2) / 4;
        } else {
          if (this.useDynamicSize) {
            return (this.dynamicSize / this.size) * _foregroundImageWidth;
          } else {
            return _foregroundImageWidth;
          }
        }
      },
      set(value) {
        _foregroundImageWidth = Number(value);
      }
    },
    foregroundImageHeight: {
      get() {
        if (_foregroundImageHeight === undefined) {
          return (this.dynamicSize - this.margin * 2) / 4;
        } else {
          if (this.useDynamicSize) {
            return (this.dynamicSize / this.size) * _foregroundImageHeight;
          } else {
            return _foregroundImageHeight;
          }
        }
      },
      set(value) {
        _foregroundImageHeight = Number(value);
      }
    },
    foregroundImageX: {
      get() {
        if (_foregroundImageX === undefined) {
          return this.dynamicSize / 2 - this.foregroundImageWidth / 2;
        } else {
          if (this.useDynamicSize) {
            return (this.dynamicSize / this.size) * _foregroundImageX;
          } else {
            return _foregroundImageX;
          }
        }
      },
      set(value) {
        _foregroundImageX = Number(value);
      }
    },
    foregroundImageY: {
      get() {
        if (_foregroundImageY === undefined) {
          return this.dynamicSize / 2 - this.foregroundImageHeight / 2;
        } else {
          if (this.useDynamicSize) {
            return (this.dynamicSize / this.size) * _foregroundImageY;
          } else {
            return _foregroundImageY;
          }
        }
      },
      set(value) {
        _foregroundImageY = Number(value);
      }
    },
    foregroundImagePadding: {
      get() {
        if (this.useDynamicSize) {
          return (this.dynamicSize / this.size) * _foregroundImagePadding;
        } else {
          return _foregroundImagePadding;
        }
      },
      set(value) {
        _foregroundImagePadding = Number(value);
      }
    },
    foregroundImageBorderRadius: {
      get() {
        if (this.useDynamicSize) {
          return (this.dynamicSize / this.size) * _foregroundImageBorderRadius;
        } else {
          return _foregroundImageBorderRadius;
        }
      },
      set(value) {
        _foregroundImageBorderRadius = Number(value);
      }
    },
    foregroundImageShadowOffsetX: {
      get() {
        if (this.useDynamicSize) {
          return (this.dynamicSize / this.size) * _foregroundImageShadowOffsetX;
        } else {
          return _foregroundImageShadowOffsetX;
        }
      },
      set(value) {
        _foregroundImageShadowOffsetX = Number(value);
      }
    },
    foregroundImageShadowOffsetY: {
      get() {
        if (this.useDynamicSize) {
          return (this.dynamicSize / this.size) * _foregroundImageShadowOffsetY;
        } else {
          return _foregroundImageShadowOffsetY;
        }
      },
      set(value) {
        _foregroundImageShadowOffsetY = Number(value);
      }
    },
    foregroundImageShadowBlur: {
      get() {
        if (this.useDynamicSize) {
          return (this.dynamicSize / this.size) * _foregroundImageShadowBlur;
        } else {
          return _foregroundImageShadowBlur;
        }
      },
      set(value) {
        _foregroundImageShadowBlur = Number(value);
      }
    },
    foregroundPadding: {
      get() {
        return _foregroundPadding;
      },
      set(value) {
        if (value > 1) {
          _foregroundPadding = 1;
        } else if (value < 0) {
          _foregroundPadding = 0;
        } else {
          _foregroundPadding = value;
        }
      }
    },
    positionProbeBackgroundColor: {
      get() {
        return _positionProbeBackgroundColor || this.backgroundColor;
      },
      set(value) {
        _positionProbeBackgroundColor = value;
      }
    },
    positionProbeForegroundColor: {
      get() {
        return _positionProbeForegroundColor || this.foregroundColor;
      },
      set(value) {
        _positionProbeForegroundColor = value;
      }
    },
    separatorColor: {
      get() {
        return _separatorColor || this.backgroundColor;
      },
      set(value) {
        _separatorColor = value;
      }
    },
    positionAdjustBackgroundColor: {
      get() {
        return _positionAdjustBackgroundColor || this.backgroundColor;
      },
      set(value) {
        _positionAdjustBackgroundColor = value;
      }
    },
    positionAdjustForegroundColor: {
      get() {
        return _positionAdjustForegroundColor || this.foregroundColor;
      },
      set(value) {
        _positionAdjustForegroundColor = value;
      }
    },
    timingBackgroundColor: {
      get() {
        return _timingBackgroundColor || this.backgroundColor;
      },
      set(value) {
        _timingBackgroundColor = value;
      }
    },
    timingForegroundColor: {
      get() {
        return _timingForegroundColor || this.foregroundColor;
      },
      set(value) {
        _timingForegroundColor = value;
      }
    },
    typeNumberBackgroundColor: {
      get() {
        return _typeNumberBackgroundColor || this.backgroundColor;
      },
      set(value) {
        _typeNumberBackgroundColor = value;
      }
    },
    typeNumberForegroundColor: {
      get() {
        return _typeNumberForegroundColor || this.foregroundColor;
      },
      set(value) {
        _typeNumberForegroundColor = value;
      }
    },
    darkBlockColor: {
      get() {
        return _darkBlockColor || this.foregroundColor;
      },
      set(value) {
        _darkBlockColor = value;
      }
    },
    canvasContext: {
      get() {
        if (_canvasContext === undefined) {
          console.error('[uQRCode]: use drawCanvas, you need to set the canvasContext!');
          throw new UQRCode.Error('use drawCanvas, you need to set the canvasContext!');
        }
        return _canvasContext;
      },
      set(value) {
        _canvasContext = getCanvasContext(value);
      }
    }
  });

  /* 安装扩展插件 */
  UQRCode.plugins.forEach(plugin => plugin(UQRCode, this, false));

  /* 兼容v3.2.0-v3.4.5版本写法 */
  if (options) {
    this.setOptions(options);
  }
  if (canvasContext) {
    this.canvasContext = getCanvasContext(canvasContext);
  }
}

/* 纠错等级 */
UQRCode.errorCorrectLevel = QRCode.errorCorrectLevel;

/**
 * 错误类
 * @param {String} msg 
 */
UQRCode.Error = function(msg) {
  this.errMsg = '[uQRCode]: ' + msg;
}

/* 插件集合 */
UQRCode.plugins = [];

/**
 * 全局扩展插件方法
 * @param {Function} func 
 */
UQRCode.use = function(plugin) {
  if (typeof plugin === 'function') {
    UQRCode.plugins.push(plugin);
  }
}

/**
 * 加载图片
 * @param {String} src 
 */
UQRCode.prototype.loadImage = function(src) {
  return Promise.resolve(src);
}

/**
 * 设置选项
 * @param {Object} options 
 */
UQRCode.prototype.setOptions = function(options) {
  if (options) {
    Object.keys(options).forEach(k => {
      this[k] = options[k];
    });
    /* 其中包含了兼容v3.2.0-v3.4.5的写法 */
    // deepReplace(this, {
    //   data: options.data || options.text,
    //   size: options.size,
    //   useDynamicSize: options.useDynamicSize,
    //   typeNumber: options.typeNumber,
    //   errorCorrectLevel: options.errorCorrectLevel,
    //   margin: options.margin,
    //   areaColor: options.areaColor,
    //   backgroundColor: options.backgroundColor || options.background?.color,
    //   backgroundImageSrc: options.backgroundImageSrc || options.background?.image?.src,
    //   backgroundImageWidth: options.backgroundImageWidth || options.background?.image?.width,
    //   backgroundImageHeight: options.backgroundImageHeight || options.background?.image?.height,
    //   backgroundImageX: options.backgroundImageX || options.background?.image?.x,
    //   backgroundImageY: options.backgroundImageY || options.background?.image?.y,
    //   backgroundImageAlpha: options.backgroundImageAlpha || options.background?.image?.alpha,
    //   backgroundImageBorderRadius: options.backgroundImageBorderRadius || options.background?.image?.borderRadius,
    //   backgroundPadding: options.backgroundPadding,
    //   foregroundColor: options.foregroundColor || options.foreground?.color,
    //   foregroundImageSrc: options.foregroundImageSrc || options.foreground?.image?.src,
    //   foregroundImageWidth: options.foregroundImageWidth || options.foreground?.image?.width,
    //   foregroundImageHeight: options.foregroundImageHeight || options.foreground?.image?.height,
    //   foregroundImageX: options.foregroundImageX || options.foreground?.image?.x,
    //   foregroundImageY: options.foregroundImageY || options.foreground?.image?.y,
    //   foregroundImagePadding: options.foregroundImagePadding || options.foreground?.image?.padding,
    //   foregroundImageBackgroundColor: options.foregroundImageBackgroundColor || options.foreground?.image?.backgroundColor,
    //   foregroundImageBorderRadius: options.foregroundImageBorderRadius || options.foreground?.image?.borderRadius,
    //   foregroundImageShadowOffsetX: options.foregroundImageShadowOffsetX || options.foreground?.image?.shadowOffsetX,
    //   foregroundImageShadowOffsetY: options.foregroundImageShadowOffsetY || options.foreground?.image?.shadowOffsetY,
    //   foregroundImageShadowBlur: options.foregroundImageShadowBlur || options.foreground?.image?.shadowBlur,
    //   foregroundImageShadowColor: options.foregroundImageShadowColor || options.foreground?.image?.shadowColor,
    //   foregroundPadding: options.foregroundPadding,
    //   positionProbeBackgroundColor: options.positionProbeBackgroundColor || options.positionProbe?.backgroundColor || options.positionDetection?.backgroundColor,
    //   positionProbeForegroundColor: options.positionProbeForegroundColor || options.positionProbe?.foregroundColor || options.positionDetection?.foregroundColor,
    //   separatorColor: options.separatorColor || options.separator?.color,
    //   positionAdjustBackgroundColor: options.positionAdjustBackgroundColor || options.positionAdjust?.backgroundColor || options.alignment?.backgroundColor,
    //   positionAdjustForegroundColor: options.positionAdjustForegroundColor || options.positionAdjust?.foregroundColor || options.alignment?.foregroundColor,
    //   timingBackgroundColor: options.timingBackgroundColor || options.timing?.backgroundColor,
    //   timingForegroundColor: options.timingForegroundColor || options.timing?.foregroundColor,
    //   typeNumberBackgroundColor: options.typeNumberBackgroundColor || options.typeNumber?.backgroundColor || options.versionInformation?.backgroundColor,
    //   typeNumberForegroundColor: options.typeNumberForegroundColor || options.typeNumber?.foregroundColor || options.versionInformation?.foregroundColor,
    //   darkBlockColor: options.darkBlockColor || options.darkBlock?.color
    // }, true);

    /* rollup配置es6转es5后并未进行转换，故通过babel在线转换后替换 */
    var _options$background, _options$background2, _options$background2$, _options$background3, _options$background3$, _options$background4, _options$background4$, _options$background5, _options$background5$, _options$background6, _options$background6$, _options$background7, _options$background7$, _options$background8, _options$background8$, _options$foreground, _options$foreground2, _options$foreground2$, _options$foreground3, _options$foreground3$, _options$foreground4, _options$foreground4$, _options$foreground5, _options$foreground5$, _options$foreground6, _options$foreground6$, _options$foreground7, _options$foreground7$, _options$foreground8, _options$foreground8$, _options$foreground9, _options$foreground9$, _options$foreground10, _options$foreground11, _options$foreground12, _options$foreground13, _options$foreground14, _options$foreground15, _options$foreground16, _options$foreground17, _options$positionProb, _options$positionDete, _options$positionProb2, _options$positionDete2, _options$separator, _options$positionAdju, _options$alignment, _options$positionAdju2, _options$alignment2, _options$timing, _options$timing2, _options$typeNumber, _options$versionInfor, _options$typeNumber2, _options$versionInfor2, _options$darkBlock;
    deepReplace(this, {
      data: options.data || options.text,
      size: options.size,
      useDynamicSize: options.useDynamicSize,
      typeNumber: options.typeNumber,
      errorCorrectLevel: options.errorCorrectLevel,
      margin: options.margin,
      areaColor: options.areaColor,
      backgroundColor: options.backgroundColor || ((_options$background = options.background) === null || _options$background === void 0 ? void 0 : _options$background.color),
      backgroundImageSrc: options.backgroundImageSrc || ((_options$background2 = options.background) === null || _options$background2 === void 0 ? void 0 : (_options$background2$ = _options$background2.image) === null || _options$background2$ === void 0 ? void 0 : _options$background2$.src),
      backgroundImageWidth: options.backgroundImageWidth || ((_options$background3 = options.background) === null || _options$background3 === void 0 ? void 0 : (_options$background3$ = _options$background3.image) === null || _options$background3$ === void 0 ? void 0 : _options$background3$.width),
      backgroundImageHeight: options.backgroundImageHeight || ((_options$background4 = options.background) === null || _options$background4 === void 0 ? void 0 : (_options$background4$ = _options$background4.image) === null || _options$background4$ === void 0 ? void 0 : _options$background4$.height),
      backgroundImageX: options.backgroundImageX || ((_options$background5 = options.background) === null || _options$background5 === void 0 ? void 0 : (_options$background5$ = _options$background5.image) === null || _options$background5$ === void 0 ? void 0 : _options$background5$.x),
      backgroundImageY: options.backgroundImageY || ((_options$background6 = options.background) === null || _options$background6 === void 0 ? void 0 : (_options$background6$ = _options$background6.image) === null || _options$background6$ === void 0 ? void 0 : _options$background6$.y),
      backgroundImageAlpha: options.backgroundImageAlpha || ((_options$background7 = options.background) === null || _options$background7 === void 0 ? void 0 : (_options$background7$ = _options$background7.image) === null || _options$background7$ === void 0 ? void 0 : _options$background7$.alpha),
      backgroundImageBorderRadius: options.backgroundImageBorderRadius || ((_options$background8 = options.background) === null || _options$background8 === void 0 ? void 0 : (_options$background8$ = _options$background8.image) === null || _options$background8$ === void 0 ? void 0 : _options$background8$.borderRadius),
      backgroundPadding: options.backgroundPadding,
      foregroundColor: options.foregroundColor || ((_options$foreground = options.foreground) === null || _options$foreground === void 0 ? void 0 : _options$foreground.color),
      foregroundImageSrc: options.foregroundImageSrc || ((_options$foreground2 = options.foreground) === null || _options$foreground2 === void 0 ? void 0 : (_options$foreground2$ = _options$foreground2.image) === null || _options$foreground2$ === void 0 ? void 0 : _options$foreground2$.src),
      foregroundImageWidth: options.foregroundImageWidth || ((_options$foreground3 = options.foreground) === null || _options$foreground3 === void 0 ? void 0 : (_options$foreground3$ = _options$foreground3.image) === null || _options$foreground3$ === void 0 ? void 0 : _options$foreground3$.width),
      foregroundImageHeight: options.foregroundImageHeight || ((_options$foreground4 = options.foreground) === null || _options$foreground4 === void 0 ? void 0 : (_options$foreground4$ = _options$foreground4.image) === null || _options$foreground4$ === void 0 ? void 0 : _options$foreground4$.height),
      foregroundImageX: options.foregroundImageX || ((_options$foreground5 = options.foreground) === null || _options$foreground5 === void 0 ? void 0 : (_options$foreground5$ = _options$foreground5.image) === null || _options$foreground5$ === void 0 ? void 0 : _options$foreground5$.x),
      foregroundImageY: options.foregroundImageY || ((_options$foreground6 = options.foreground) === null || _options$foreground6 === void 0 ? void 0 : (_options$foreground6$ = _options$foreground6.image) === null || _options$foreground6$ === void 0 ? void 0 : _options$foreground6$.y),
      foregroundImagePadding: options.foregroundImagePadding || ((_options$foreground7 = options.foreground) === null || _options$foreground7 === void 0 ? void 0 : (_options$foreground7$ = _options$foreground7.image) === null || _options$foreground7$ === void 0 ? void 0 : _options$foreground7$.padding),
      foregroundImageBackgroundColor: options.foregroundImageBackgroundColor || ((_options$foreground8 = options.foreground) === null || _options$foreground8 === void 0 ? void 0 : (_options$foreground8$ = _options$foreground8.image) === null || _options$foreground8$ === void 0 ? void 0 : _options$foreground8$.backgroundColor),
      foregroundImageBorderRadius: options.foregroundImageBorderRadius || ((_options$foreground9 = options.foreground) === null || _options$foreground9 === void 0 ? void 0 : (_options$foreground9$ = _options$foreground9.image) === null || _options$foreground9$ === void 0 ? void 0 : _options$foreground9$.borderRadius),
      foregroundImageShadowOffsetX: options.foregroundImageShadowOffsetX || ((_options$foreground10 = options.foreground) === null || _options$foreground10 === void 0 ? void 0 : (_options$foreground11 = _options$foreground10.image) === null || _options$foreground11 === void 0 ? void 0 : _options$foreground11.shadowOffsetX),
      foregroundImageShadowOffsetY: options.foregroundImageShadowOffsetY || ((_options$foreground12 = options.foreground) === null || _options$foreground12 === void 0 ? void 0 : (_options$foreground13 = _options$foreground12.image) === null || _options$foreground13 === void 0 ? void 0 : _options$foreground13.shadowOffsetY),
      foregroundImageShadowBlur: options.foregroundImageShadowBlur || ((_options$foreground14 = options.foreground) === null || _options$foreground14 === void 0 ? void 0 : (_options$foreground15 = _options$foreground14.image) === null || _options$foreground15 === void 0 ? void 0 : _options$foreground15.shadowBlur),
      foregroundImageShadowColor: options.foregroundImageShadowColor || ((_options$foreground16 = options.foreground) === null || _options$foreground16 === void 0 ? void 0 : (_options$foreground17 = _options$foreground16.image) === null || _options$foreground17 === void 0 ? void 0 : _options$foreground17.shadowColor),
      foregroundPadding: options.foregroundPadding,
      positionProbeBackgroundColor: options.positionProbeBackgroundColor || ((_options$positionProb = options.positionProbe) === null || _options$positionProb === void 0 ? void 0 : _options$positionProb.backgroundColor) || ((_options$positionDete = options.positionDetection) === null || _options$positionDete === void 0 ? void 0 : _options$positionDete.backgroundColor),
      positionProbeForegroundColor: options.positionProbeForegroundColor || ((_options$positionProb2 = options.positionProbe) === null || _options$positionProb2 === void 0 ? void 0 : _options$positionProb2.foregroundColor) || ((_options$positionDete2 = options.positionDetection) === null || _options$positionDete2 === void 0 ? void 0 : _options$positionDete2.foregroundColor),
      separatorColor: options.separatorColor || ((_options$separator = options.separator) === null || _options$separator === void 0 ? void 0 : _options$separator.color),
      positionAdjustBackgroundColor: options.positionAdjustBackgroundColor || ((_options$positionAdju = options.positionAdjust) === null || _options$positionAdju === void 0 ? void 0 : _options$positionAdju.backgroundColor) || ((_options$alignment = options.alignment) === null || _options$alignment === void 0 ? void 0 : _options$alignment.backgroundColor),
      positionAdjustForegroundColor: options.positionAdjustForegroundColor || ((_options$positionAdju2 = options.positionAdjust) === null || _options$positionAdju2 === void 0 ? void 0 : _options$positionAdju2.foregroundColor) || ((_options$alignment2 = options.alignment) === null || _options$alignment2 === void 0 ? void 0 : _options$alignment2.foregroundColor),
      timingBackgroundColor: options.timingBackgroundColor || ((_options$timing = options.timing) === null || _options$timing === void 0 ? void 0 : _options$timing.backgroundColor),
      timingForegroundColor: options.timingForegroundColor || ((_options$timing2 = options.timing) === null || _options$timing2 === void 0 ? void 0 : _options$timing2.foregroundColor),
      typeNumberBackgroundColor: options.typeNumberBackgroundColor || ((_options$typeNumber = options.typeNumber) === null || _options$typeNumber === void 0 ? void 0 : _options$typeNumber.backgroundColor) || ((_options$versionInfor = options.versionInformation) === null || _options$versionInfor === void 0 ? void 0 : _options$versionInfor.backgroundColor),
      typeNumberForegroundColor: options.typeNumberForegroundColor || ((_options$typeNumber2 = options.typeNumber) === null || _options$typeNumber2 === void 0 ? void 0 : _options$typeNumber2.foregroundColor) || ((_options$versionInfor2 = options.versionInformation) === null || _options$versionInfor2 === void 0 ? void 0 : _options$versionInfor2.foregroundColor),
      darkBlockColor: options.darkBlockColor || ((_options$darkBlock = options.darkBlock) === null || _options$darkBlock === void 0 ? void 0 : _options$darkBlock.color)
    }, true);
  }
}

/**
 * 制作二维码
 */
UQRCode.prototype.make = function() {
  let {
    foregroundColor,
    backgroundColor,
    typeNumber,
    errorCorrectLevel,
    data,
    size,
    margin,
    useDynamicSize
  } = this;

  if (foregroundColor === backgroundColor) {
    console.error('[uQRCode]: foregroundColor and backgroundColor cannot be the same!');
    throw new UQRCode.Error('foregroundColor and backgroundColor cannot be the same!');
  }

  var qrc = new QRCode(typeNumber, errorCorrectLevel);
  qrc.addData(utf16To8(data));
  qrc.make();

  this.base = qrc;
  this.typeNumber = qrc.typeNumber;
  this.modules = qrc.modules;
  this.moduleCount = qrc.moduleCount;

  if (useDynamicSize) {
    this.dynamicSize = Math.ceil((size - margin * 2) / qrc.moduleCount) * qrc.moduleCount + margin * 2;
  } else {
    this.dynamicSize = size;
  }

  paintData(this);
  paintPositionProbe(this);
  paintSeparator(this);
  paintPositionAdjust(this);
  paintTiming(this);
  paintDarkBlock(this);
  paintTypeNumber(this);

  this.isMaked = true;
  this.drawModules = [];
}

/**
 * 获取绘制模块
 */
UQRCode.prototype.getDrawModules = function() {
  if (this.drawModules && this.drawModules.length > 0) {
    return this.drawModules;
  }

  /* 层级：最底层 -> 绘制区域 -> 背景图片 -> 背景|前景 -> 前景图片 -> 最顶层 */
  let drawModules = this.drawModules = [];
  let {
    modules,
    moduleCount,
    dynamicSize: size,
    areaColor,
    backgroundImageSrc,
    backgroundImageX,
    backgroundImageY,
    backgroundImageWidth,
    backgroundImageHeight,
    backgroundImageAlpha,
    backgroundImageBorderRadius,
    foregroundImageSrc,
    foregroundImageX,
    foregroundImageY,
    foregroundImageWidth,
    foregroundImageHeight,
    foregroundImagePadding,
    foregroundImageBackgroundColor,
    foregroundImageBorderRadius,
    foregroundImageShadowOffsetX,
    foregroundImageShadowOffsetY,
    foregroundImageShadowBlur,
    foregroundImageShadowColor
  } = this;

  /* 绘制区域 */
  if (areaColor) {
    drawModules.push({
      name: 'area',
      type: 'area',
      color: areaColor,
      x: 0,
      y: 0,
      width: size,
      height: size
    });
  }

  /* 背景图片 */
  if (backgroundImageSrc) {
    drawModules.push({
      name: 'backgroundImage',
      type: 'image',
      imageSrc: backgroundImageSrc,
      mappingName: 'backgroundImageSrc',
      x: backgroundImageX,
      y: backgroundImageY,
      width: backgroundImageWidth,
      height: backgroundImageHeight,
      alpha: backgroundImageAlpha,
      borderRadius: backgroundImageBorderRadius
    });
  }

  /* 前景 */
  for (var rowI = 0; rowI < moduleCount; rowI++) {
    for (var colI = 0; colI < moduleCount; colI++) {
      var tile = modules[rowI][colI];
      if (!tile.isDrawn) {
        if (tile.type.includes('foreground')) {
          drawModules.push({
            name: 'foreground',
            type: 'tile',
            color: tile.color,
            destX: tile.destX,
            destY: tile.destY,
            destWidth: tile.destWidth,
            destHeight: tile.destHeight,
            x: tile.x,
            y: tile.y,
            width: tile.width,
            height: tile.height,
            paddingTop: tile.paddingTop,
            paddingRight: tile.paddingRight,
            paddingBottom: tile.paddingBottom,
            paddingLeft: tile.paddingLeft,
            rowIndex: rowI,
            colIndex: colI
          });
        } else {
          drawModules.push({
            name: 'background',
            type: 'tile',
            color: tile.color,
            destX: tile.destX,
            destY: tile.destY,
            destWidth: tile.destWidth,
            destHeight: tile.destHeight,
            x: tile.x,
            y: tile.y,
            width: tile.width,
            height: tile.height,
            paddingTop: tile.paddingTop,
            paddingRight: tile.paddingRight,
            paddingBottom: tile.paddingBottom,
            paddingLeft: tile.paddingLeft,
            rowIndex: rowI,
            colIndex: colI
          });
        }
        /* 标记为已绘制 */
        tile.isDrawn = true;
      }
    }
  }

  /* 前景图片 */
  if (foregroundImageSrc) {
    drawModules.push({
      name: 'foregroundImage',
      type: 'image',
      imageSrc: foregroundImageSrc,
      mappingName: 'foregroundImageSrc',
      x: foregroundImageX,
      y: foregroundImageY,
      width: foregroundImageWidth,
      height: foregroundImageHeight,
      padding: foregroundImagePadding,
      backgroundColor: foregroundImageBackgroundColor,
      borderRadius: foregroundImageBorderRadius,
      shadowOffsetX: foregroundImageShadowOffsetX,
      shadowOffsetY: foregroundImageShadowOffsetY,
      shadowBlur: foregroundImageShadowBlur,
      shadowColor: foregroundImageShadowColor
    });
  }

  return drawModules;
}

/**
 * 判断当前模块是否是黑块（前景部分）
 * @param {Number} rowI 
 * @param {Number} colI 
 */
UQRCode.prototype.isBlack = function(rowI, colI) {
  var count = this.moduleCount;
  return !(0 > rowI || 0 > colI || rowI >= count || colI >= count) && this.modules[rowI][colI].isBlack;
}

/**
 * 绘制canvas方法
 */
UQRCode.prototype.drawCanvas = function() {
  let {
    isMaked,
    canvasContext: ctx,
    useDynamicSize,
    dynamicSize: size,
    foregroundColor,
    foregroundPadding,
    backgroundColor,
    backgroundPadding,
    drawReserve,
    margin
  } = this;

  if (!isMaked) {
    console.error('[uQRCode]: please execute the make method first!');
    return Promise.reject(new UQRCode.Error('please execute the make method first!'));
  }

  let drawModules = this.getDrawModules();

  let draw = async (resolve, reject) => {
    try {
      ctx.clearRect(0, 0, size, size);
      ctx.draw(false);
      for (var i = 0; i < drawModules.length; i++) {
        var drawModule = drawModules[i];
        ctx.save();
        switch (drawModule.type) {
          case 'area':
            /* 绘制区域 */
            ctx.setFillStyle(drawModule.color);
            ctx.fillRect(drawModule.x, drawModule.y, drawModule.width, drawModule.height);
            break;
          case 'tile':
            /* 绘制码点 */
            var x = drawModule.x;
            var y = drawModule.y;
            var w = drawModule.width;
            var h = drawModule.height;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arcTo(x + w, y, x + w, y + h, 0);
            ctx.arcTo(x + w, y + h, x, y + h, 0);
            ctx.arcTo(x, y + h, x, y, 0);
            ctx.arcTo(x, y, x + w, y, 0);
            ctx.closePath();
            ctx.fillStyle = drawModule.color;
            ctx.fill();
            ctx.clip();
            break;
          case 'image':
            /* 绘制图像 */
            if (drawModule.name === 'backgroundImage') {
              var x = drawModule.x;
              var y = drawModule.y;
              var w = drawModule.width;
              var h = drawModule.height;
              var r = drawModule.borderRadius;
              if (w < 2 * r) {
                r = w / 2;
              }
              if (h < 2 * r) {
                r = h / 2;
              }

              /* 设置透明度 */
              ctx.globalAlpha = drawModule.alpha;

              /* 绘制圆角 */
              ctx.beginPath();
              ctx.moveTo(x + r, y);
              ctx.arcTo(x + w, y, x + w, y + h, r);
              ctx.arcTo(x + w, y + h, x, y + h, r);
              ctx.arcTo(x, y + h, x, y, r);
              ctx.arcTo(x, y, x + w, y, r);
              ctx.closePath();
              ctx.strokeStyle = 'rgba(0,0,0,0)';
              ctx.stroke();
              ctx.clip();

              try {
                /* 绘制图片前需要先加载图片，因为图片可能是异步资源，如果没有设置loadImage方法，则需要在上层先获取到图片再传入 */
                var img = await this.loadImage(drawModule.imageSrc);
                ctx.drawImage(img, drawModule.x, drawModule.y, drawModule.width, drawModule.height);
              } catch (e) {
                console.error(`[uQRCode]: ${drawModule.mappingName} invalid!`);
                throw new UQRCode.Error(`${drawModule.mappingName} invalid!`);
              }
            } else if (drawModule.name === 'foregroundImage') {
              var x = drawModule.x;
              var y = drawModule.y;
              var w = drawModule.width;
              var h = drawModule.height;
              var r = drawModule.borderRadius;
              if (w < 2 * r) {
                r = w / 2;
              }
              if (h < 2 * r) {
                r = h / 2;
              }
              var bx = drawModule.x - drawModule.padding;
              var by = drawModule.y - drawModule.padding;
              var bw = drawModule.width + drawModule.padding * 2;
              var bh = drawModule.height + drawModule.padding * 2;
              var br = (bw / w) * r;
              if (bw < 2 * br) {
                br = bw / 2;
              }
              if (bh < 2 * br) {
                br = bh / 2;
              }

              /* 绘制阴影 */
              ctx.save();
              ctx.shadowOffsetX = drawModule.shadowOffsetX;
              ctx.shadowOffsetY = drawModule.shadowOffsetY;
              ctx.shadowBlur = drawModule.shadowBlur;
              ctx.shadowColor = drawModule.shadowColor;
              /* 阴影需要一个填充块作为载体 */
              ctx.beginPath();
              ctx.moveTo(bx + br, by);
              ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
              ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
              ctx.arcTo(bx, by + bh, bx, by, br);
              ctx.arcTo(bx, by, bx + bw, by, br);
              ctx.closePath();
              ctx.setFillStyle(drawModule.backgroundColor);
              ctx.fill();
              ctx.restore();

              /* 绘制Padding */
              ctx.beginPath();
              ctx.moveTo(bx + br, by);
              ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
              ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
              ctx.arcTo(bx, by + bh, bx, by, br);
              ctx.arcTo(bx, by, bx + bw, by, br);
              ctx.closePath();
              ctx.setFillStyle(drawModule.padding > 0 ? drawModule.backgroundColor : 'rgba(0,0,0,0)');
              ctx.fill();

              /* 绘制圆角 */
              ctx.beginPath();
              ctx.moveTo(x + r, y);
              ctx.arcTo(x + w, y, x + w, y + h, r);
              ctx.arcTo(x + w, y + h, x, y + h, r);
              ctx.arcTo(x, y + h, x, y, r);
              ctx.arcTo(x, y, x + w, y, r);
              ctx.closePath();
              ctx.strokeStyle = 'rgba(0,0,0,0)';
              ctx.stroke();
              ctx.clip();

              try {
                /* 绘制图片前需要先加载图片，因为图片可能是异步资源，如果没有设置loadImage方法，则需要在上层先获取到图片再传入 */
                var img = await this.loadImage(drawModule.imageSrc);
                ctx.drawImage(img, drawModule.x, drawModule.y, drawModule.width, drawModule.height);
              } catch (e) {
                console.error(`[uQRCode]: ${drawModule.mappingName} invalid!`);
                throw new UQRCode.Error(`${drawModule.mappingName} invalid!`);
              }
            }
            break;
        }

        /* gcanvas需要每一阶段都draw一下，否则重绘有问题，例如uni-app nvue绘制图片会失败 */
        if (drawReserve) {
          ctx.draw(true);
        }

        ctx.restore();
      }
      ctx.draw(true);
      /* 某些平台的draw回调不一定会触发，故resolve不放在draw回调中 */
      setTimeout(resolve, 150);
    } catch (e) {
      if (e instanceof UQRCode.Error) {
        reject(e);
      } else {
        throw e;
      }
    }
  }

  return new Promise((resolve, reject) => {
    /* 完成绘制 */
    draw(resolve, reject);
  });
}

/**
 * 绘制canvas方法，兼容v3.2.0-v3.4.5版本的写法
 */
UQRCode.prototype.draw = function() {
  return this.drawCanvas();
}

/**
 * 注册实例插件
 * @param {Function} plugin 
 */
UQRCode.prototype.register = function(plugin) {
  /* UQRCode, 实例属性, 是否来自实例注册 */
  plugin && plugin(UQRCode, this, true);
}

export default UQRCode;
