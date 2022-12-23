//---------------------------------------------------------------------
// uQRCode二维码生成插件 v4.0.6
// 
// uQRCode是一款基于Javascript环境开发的二维码生成插件，适用所有Javascript运行环境的前端应用和Node.js。
// 
// Copyright (c) Sansnn uQRCode All rights reserved.
// 
// Licensed under the Apache License, Version 2.0.
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// github地址：
//   https://github.com/Sansnn/uQRCode
// 
// npm地址：
//   https://www.npmjs.com/package/uqrcodejs
// 
// uni-app插件市场地址：
//   https://ext.dcloud.net.cn/plugin?id=1287
// 
// 复制使用请保留本段注释，感谢支持开源！
// 
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// 当前文件格式为 es，将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器（别名: esm，module）
// 如需在其他环境使用，请获取环境对应的格式文件
// 格式说明：
// amd - 异步模块定义，适用于 RequireJS 等模块加载器
// cjs - CommonJS，适用于 Node 环境和其他打包工具（别名：commonjs）
// es - 将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器（别名: esm，module）
// umd - 通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of 
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// QR8bitByte
//---------------------------------------------------------------------

function QR8bitByte(data) {
  this.mode = QRMode.MODE_8BIT_BYTE;
  this.data = data;
}

QR8bitByte.prototype = {

  getLength: function(buffer) {
    return this.data.length;
  },

  write: function(buffer) {
    for (var i = 0; i < this.data.length; i++) {
      // not JIS ...
      buffer.put(this.data.charCodeAt(i), 8);
    }
  }
};

//---------------------------------------------------------------------
// QRCode
//---------------------------------------------------------------------

function QRCode(typeNumber, errorCorrectLevel) {
  this.typeNumber = typeNumber;
  this.errorCorrectLevel = errorCorrectLevel;
  this.modules = null;
  this.moduleCount = 0;
  this.dataCache = null;
  this.dataList = new Array();
}

QRCode.prototype = {

  addData: function(data) {
    var newData = new QR8bitByte(data);
    this.dataList.push(newData);
    this.dataCache = null;
  },

  isDark: function(row, col) {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(row + "," + col);
    }
    return this.modules[row][col];
  },

  getModuleCount: function() {
    return this.moduleCount;
  },

  make: function() {
    // Calculate automatically typeNumber if provided is < 1
    if (this.typeNumber < 1) {
      var typeNumber = 1;
      for (typeNumber = 1; typeNumber < 40; typeNumber++) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

        var buffer = new QRBitBuffer();
        var totalDataCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) {
          totalDataCount += rsBlocks[i].dataCount;
        }

        for (var i = 0; i < this.dataList.length; i++) {
          var data = this.dataList[i];
          buffer.put(data.mode, 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
          data.write(buffer);
        }
        if (buffer.getLengthInBits() <= totalDataCount * 8)
          break;
      }
      this.typeNumber = typeNumber;
    }
    this.makeImpl(false, this.getBestMaskPattern());
  },

  makeImpl: function(test, maskPattern) {

    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = new Array(this.moduleCount);

    for (var row = 0; row < this.moduleCount; row++) {

      this.modules[row] = new Array(this.moduleCount);

      for (var col = 0; col < this.moduleCount; col++) {
        this.modules[row][col] = null; //(col + row) % 3;
      }
    }

    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);

    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test);
    }

    if (this.dataCache == null) {
      this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
    }

    this.mapData(this.dataCache, maskPattern);
  },

  setupPositionProbePattern: function(row, col) {

    for (var r = -1; r <= 7; r++) {

      if (row + r <= -1 || this.moduleCount <= row + r) continue;

      for (var c = -1; c <= 7; c++) {

        if (col + c <= -1 || this.moduleCount <= col + c) continue;

        if ((0 <= r && r <= 6 && (c == 0 || c == 6)) ||
          (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  },

  getBestMaskPattern: function() {

    var minLostPoint = 0;
    var pattern = 0;

    for (var i = 0; i < 8; i++) {

      this.makeImpl(true, i);

      var lostPoint = QRUtil.getLostPoint(this);

      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }

    return pattern;
  },

  createMovieClip: function(target_mc, instance_name, depth) {

    var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
    var cs = 1;

    this.make();

    for (var row = 0; row < this.modules.length; row++) {

      var y = row * cs;

      for (var col = 0; col < this.modules[row].length; col++) {

        var x = col * cs;
        var dark = this.modules[row][col];

        if (dark) {
          qr_mc.beginFill(0, 100);
          qr_mc.moveTo(x, y);
          qr_mc.lineTo(x + cs, y);
          qr_mc.lineTo(x + cs, y + cs);
          qr_mc.lineTo(x, y + cs);
          qr_mc.endFill();
        }
      }
    }

    return qr_mc;
  },

  setupTimingPattern: function() {

    for (var r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] != null) {
        continue;
      }
      this.modules[r][6] = (r % 2 == 0);
    }

    for (var c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] != null) {
        continue;
      }
      this.modules[6][c] = (c % 2 == 0);
    }
  },

  setupPositionAdjustPattern: function() {

    var pos = QRUtil.getPatternPosition(this.typeNumber);

    for (var i = 0; i < pos.length; i++) {

      for (var j = 0; j < pos.length; j++) {

        var row = pos[i];
        var col = pos[j];

        if (this.modules[row][col] != null) {
          continue;
        }

        for (var r = -2; r <= 2; r++) {

          for (var c = -2; c <= 2; c++) {

            if (r == -2 || r == 2 || c == -2 || c == 2 ||
              (r == 0 && c == 0)) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  },

  setupTypeNumber: function(test) {

    var bits = QRUtil.getBCHTypeNumber(this.typeNumber);

    for (var i = 0; i < 18; i++) {
      var mod = (!test && ((bits >> i) & 1) == 1);
      this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
    }

    for (var i = 0; i < 18; i++) {
      var mod = (!test && ((bits >> i) & 1) == 1);
      this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  },

  setupTypeInfo: function(test, maskPattern) {

    var data = (this.errorCorrectLevel << 3) | maskPattern;
    var bits = QRUtil.getBCHTypeInfo(data);

    // vertical		
    for (var i = 0; i < 15; i++) {

      var mod = (!test && ((bits >> i) & 1) == 1);

      if (i < 6) {
        this.modules[i][8] = mod;
      } else if (i < 8) {
        this.modules[i + 1][8] = mod;
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod;
      }
    }

    // horizontal
    for (var i = 0; i < 15; i++) {

      var mod = (!test && ((bits >> i) & 1) == 1);

      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this.modules[8][15 - i - 1 + 1] = mod;
      } else {
        this.modules[8][15 - i - 1] = mod;
      }
    }

    // fixed module
    this.modules[this.moduleCount - 8][8] = (!test);

  },

  mapData: function(data, maskPattern) {

    var inc = -1;
    var row = this.moduleCount - 1;
    var bitIndex = 7;
    var byteIndex = 0;

    for (var col = this.moduleCount - 1; col > 0; col -= 2) {

      if (col == 6) col--;

      while (true) {

        for (var c = 0; c < 2; c++) {

          if (this.modules[row][col - c] == null) {

            var dark = false;

            if (byteIndex < data.length) {
              dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
            }

            var mask = QRUtil.getMask(maskPattern, row, col - c);

            if (mask) {
              dark = !dark;
            }

            this.modules[row][col - c] = dark;
            bitIndex--;

            if (bitIndex == -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }

        row += inc;

        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }

  }

};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {

  var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);

  var buffer = new QRBitBuffer();

  for (var i = 0; i < dataList.length; i++) {
    var data = dataList[i];
    buffer.put(data.mode, 4);
    buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
    data.write(buffer);
  }

  // calc num max data.
  var totalDataCount = 0;
  for (var i = 0; i < rsBlocks.length; i++) {
    totalDataCount += rsBlocks[i].dataCount;
  }

  if (buffer.getLengthInBits() > totalDataCount * 8) {
    throw new Error("code length overflow. (" +
      buffer.getLengthInBits() +
      ">" +
      totalDataCount * 8 +
      ")");
  }

  // end code
  if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
    buffer.put(0, 4);
  }

  // padding
  while (buffer.getLengthInBits() % 8 != 0) {
    buffer.putBit(false);
  }

  // padding
  while (true) {

    if (buffer.getLengthInBits() >= totalDataCount * 8) {
      break;
    }
    buffer.put(QRCode.PAD0, 8);

    if (buffer.getLengthInBits() >= totalDataCount * 8) {
      break;
    }
    buffer.put(QRCode.PAD1, 8);
  }

  return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {

  var offset = 0;

  var maxDcCount = 0;
  var maxEcCount = 0;

  var dcdata = new Array(rsBlocks.length);
  var ecdata = new Array(rsBlocks.length);

  for (var r = 0; r < rsBlocks.length; r++) {

    var dcCount = rsBlocks[r].dataCount;
    var ecCount = rsBlocks[r].totalCount - dcCount;

    maxDcCount = Math.max(maxDcCount, dcCount);
    maxEcCount = Math.max(maxEcCount, ecCount);

    dcdata[r] = new Array(dcCount);

    for (var i = 0; i < dcdata[r].length; i++) {
      dcdata[r][i] = 0xff & buffer.buffer[i + offset];
    }
    offset += dcCount;

    var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
    var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);

    var modPoly = rawPoly.mod(rsPoly);
    ecdata[r] = new Array(rsPoly.getLength() - 1);
    for (var i = 0; i < ecdata[r].length; i++) {
      var modIndex = i + modPoly.getLength() - ecdata[r].length;
      ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
    }

  }

  var totalCodeCount = 0;
  for (var i = 0; i < rsBlocks.length; i++) {
    totalCodeCount += rsBlocks[i].totalCount;
  }

  var data = new Array(totalCodeCount);
  var index = 0;

  for (var i = 0; i < maxDcCount; i++) {
    for (var r = 0; r < rsBlocks.length; r++) {
      if (i < dcdata[r].length) {
        data[index++] = dcdata[r][i];
      }
    }
  }

  for (var i = 0; i < maxEcCount; i++) {
    for (var r = 0; r < rsBlocks.length; r++) {
      if (i < ecdata[r].length) {
        data[index++] = ecdata[r][i];
      }
    }
  }

  return data;

};

//---------------------------------------------------------------------
// QRMode
//---------------------------------------------------------------------

var QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3
};

//---------------------------------------------------------------------
// QRErrorCorrectLevel
//---------------------------------------------------------------------

var QRErrorCorrectLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};

//---------------------------------------------------------------------
// QRMaskPattern
//---------------------------------------------------------------------

var QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};

//---------------------------------------------------------------------
// QRUtil
//---------------------------------------------------------------------

var QRUtil = {

  PATTERN_POSITION_TABLE: [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ],

  G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
  G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
  G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),

  getBCHTypeInfo: function(data) {
    var d = data << 10;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
      d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
    }
    return ((data << 10) | d) ^ QRUtil.G15_MASK;
  },

  getBCHTypeNumber: function(data) {
    var d = data << 12;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
      d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18)));
    }
    return (data << 12) | d;
  },

  getBCHDigit: function(data) {

    var digit = 0;

    while (data != 0) {
      digit++;
      data >>>= 1;
    }

    return digit;
  },

  getPatternPosition: function(typeNumber) {
    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
  },

  getMask: function(maskPattern, i, j) {

    switch (maskPattern) {

      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 == 0;
      case QRMaskPattern.PATTERN001:
        return i % 2 == 0;
      case QRMaskPattern.PATTERN010:
        return j % 3 == 0;
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 == 0;
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
      case QRMaskPattern.PATTERN101:
        return (i * j) % 2 + (i * j) % 3 == 0;
      case QRMaskPattern.PATTERN110:
        return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
      case QRMaskPattern.PATTERN111:
        return ((i * j) % 3 + (i + j) % 2) % 2 == 0;

      default:
        throw new Error("bad maskPattern:" + maskPattern);
    }
  },

  getErrorCorrectPolynomial: function(errorCorrectLength) {

    var a = new QRPolynomial([1], 0);

    for (var i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
    }

    return a;
  },

  getLengthInBits: function(mode, type) {

    if (1 <= type && type < 10) {

      // 1 - 9

      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw new Error("mode:" + mode);
      }

    } else if (type < 27) {

      // 10 - 26

      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw new Error("mode:" + mode);
      }

    } else if (type < 41) {

      // 27 - 40

      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw new Error("mode:" + mode);
      }

    } else {
      throw new Error("type:" + type);
    }
  },

  getLostPoint: function(qrCode) {

    var moduleCount = qrCode.getModuleCount();

    var lostPoint = 0;

    // LEVEL1

    for (var row = 0; row < moduleCount; row++) {

      for (var col = 0; col < moduleCount; col++) {

        var sameCount = 0;
        var dark = qrCode.isDark(row, col);

        for (var r = -1; r <= 1; r++) {

          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }

          for (var c = -1; c <= 1; c++) {

            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }

            if (r == 0 && c == 0) {
              continue;
            }

            if (dark == qrCode.isDark(row + r, col + c)) {
              sameCount++;
            }
          }
        }

        if (sameCount > 5) {
          lostPoint += (3 + sameCount - 5);
        }
      }
    }

    // LEVEL2

    for (var row = 0; row < moduleCount - 1; row++) {
      for (var col = 0; col < moduleCount - 1; col++) {
        var count = 0;
        if (qrCode.isDark(row, col)) count++;
        if (qrCode.isDark(row + 1, col)) count++;
        if (qrCode.isDark(row, col + 1)) count++;
        if (qrCode.isDark(row + 1, col + 1)) count++;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }

    // LEVEL3

    for (var row = 0; row < moduleCount; row++) {
      for (var col = 0; col < moduleCount - 6; col++) {
        if (qrCode.isDark(row, col) &&
          !qrCode.isDark(row, col + 1) &&
          qrCode.isDark(row, col + 2) &&
          qrCode.isDark(row, col + 3) &&
          qrCode.isDark(row, col + 4) &&
          !qrCode.isDark(row, col + 5) &&
          qrCode.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }

    for (var col = 0; col < moduleCount; col++) {
      for (var row = 0; row < moduleCount - 6; row++) {
        if (qrCode.isDark(row, col) &&
          !qrCode.isDark(row + 1, col) &&
          qrCode.isDark(row + 2, col) &&
          qrCode.isDark(row + 3, col) &&
          qrCode.isDark(row + 4, col) &&
          !qrCode.isDark(row + 5, col) &&
          qrCode.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }

    // LEVEL4

    var darkCount = 0;

    for (var col = 0; col < moduleCount; col++) {
      for (var row = 0; row < moduleCount; row++) {
        if (qrCode.isDark(row, col)) {
          darkCount++;
        }
      }
    }

    var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  }

};


//---------------------------------------------------------------------
// QRMath
//---------------------------------------------------------------------

var QRMath = {

  glog: function(n) {

    if (n < 1) {
      throw new Error("glog(" + n + ")");
    }

    return QRMath.LOG_TABLE[n];
  },

  gexp: function(n) {

    while (n < 0) {
      n += 255;
    }

    while (n >= 256) {
      n -= 255;
    }

    return QRMath.EXP_TABLE[n];
  },

  EXP_TABLE: new Array(256),

  LOG_TABLE: new Array(256)

};

for (var i = 0; i < 8; i++) {
  QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
  QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^
    QRMath.EXP_TABLE[i - 5] ^
    QRMath.EXP_TABLE[i - 6] ^
    QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
  QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
}

//---------------------------------------------------------------------
// QRPolynomial
//---------------------------------------------------------------------

function QRPolynomial(num, shift) {

  if (num.length == undefined) {
    throw new Error(num.length + "/" + shift);
  }

  var offset = 0;

  while (offset < num.length && num[offset] == 0) {
    offset++;
  }

  this.num = new Array(num.length - offset + shift);
  for (var i = 0; i < num.length - offset; i++) {
    this.num[i] = num[i + offset];
  }
}

QRPolynomial.prototype = {

  get: function(index) {
    return this.num[index];
  },

  getLength: function() {
    return this.num.length;
  },

  multiply: function(e) {

    var num = new Array(this.getLength() + e.getLength() - 1);

    for (var i = 0; i < this.getLength(); i++) {
      for (var j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
      }
    }

    return new QRPolynomial(num, 0);
  },

  mod: function(e) {

    if (this.getLength() - e.getLength() < 0) {
      return this;
    }

    var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));

    var num = new Array(this.getLength());

    for (var i = 0; i < this.getLength(); i++) {
      num[i] = this.get(i);
    }

    for (var i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
    }

    // recursive call
    return new QRPolynomial(num, 0).mod(e);
  }
};

//---------------------------------------------------------------------
// QRRSBlock
//---------------------------------------------------------------------

function QRRSBlock(totalCount, dataCount) {
  this.totalCount = totalCount;
  this.dataCount = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [

  // L
  // M
  // Q
  // H

  // 1
  [1, 26, 19],
  [1, 26, 16],
  [1, 26, 13],
  [1, 26, 9],

  // 2
  [1, 44, 34],
  [1, 44, 28],
  [1, 44, 22],
  [1, 44, 16],

  // 3
  [1, 70, 55],
  [1, 70, 44],
  [2, 35, 17],
  [2, 35, 13],

  // 4		
  [1, 100, 80],
  [2, 50, 32],
  [2, 50, 24],
  [4, 25, 9],

  // 5
  [1, 134, 108],
  [2, 67, 43],
  [2, 33, 15, 2, 34, 16],
  [2, 33, 11, 2, 34, 12],

  // 6
  [2, 86, 68],
  [4, 43, 27],
  [4, 43, 19],
  [4, 43, 15],

  // 7		
  [2, 98, 78],
  [4, 49, 31],
  [2, 32, 14, 4, 33, 15],
  [4, 39, 13, 1, 40, 14],

  // 8
  [2, 121, 97],
  [2, 60, 38, 2, 61, 39],
  [4, 40, 18, 2, 41, 19],
  [4, 40, 14, 2, 41, 15],

  // 9
  [2, 146, 116],
  [3, 58, 36, 2, 59, 37],
  [4, 36, 16, 4, 37, 17],
  [4, 36, 12, 4, 37, 13],

  // 10		
  [2, 86, 68, 2, 87, 69],
  [4, 69, 43, 1, 70, 44],
  [6, 43, 19, 2, 44, 20],
  [6, 43, 15, 2, 44, 16],

  // 11
  [4, 101, 81],
  [1, 80, 50, 4, 81, 51],
  [4, 50, 22, 4, 51, 23],
  [3, 36, 12, 8, 37, 13],

  // 12
  [2, 116, 92, 2, 117, 93],
  [6, 58, 36, 2, 59, 37],
  [4, 46, 20, 6, 47, 21],
  [7, 42, 14, 4, 43, 15],

  // 13
  [4, 133, 107],
  [8, 59, 37, 1, 60, 38],
  [8, 44, 20, 4, 45, 21],
  [12, 33, 11, 4, 34, 12],

  // 14
  [3, 145, 115, 1, 146, 116],
  [4, 64, 40, 5, 65, 41],
  [11, 36, 16, 5, 37, 17],
  [11, 36, 12, 5, 37, 13],

  // 15
  [5, 109, 87, 1, 110, 88],
  [5, 65, 41, 5, 66, 42],
  [5, 54, 24, 7, 55, 25],
  [11, 36, 12],

  // 16
  [5, 122, 98, 1, 123, 99],
  [7, 73, 45, 3, 74, 46],
  [15, 43, 19, 2, 44, 20],
  [3, 45, 15, 13, 46, 16],

  // 17
  [1, 135, 107, 5, 136, 108],
  [10, 74, 46, 1, 75, 47],
  [1, 50, 22, 15, 51, 23],
  [2, 42, 14, 17, 43, 15],

  // 18
  [5, 150, 120, 1, 151, 121],
  [9, 69, 43, 4, 70, 44],
  [17, 50, 22, 1, 51, 23],
  [2, 42, 14, 19, 43, 15],

  // 19
  [3, 141, 113, 4, 142, 114],
  [3, 70, 44, 11, 71, 45],
  [17, 47, 21, 4, 48, 22],
  [9, 39, 13, 16, 40, 14],

  // 20
  [3, 135, 107, 5, 136, 108],
  [3, 67, 41, 13, 68, 42],
  [15, 54, 24, 5, 55, 25],
  [15, 43, 15, 10, 44, 16],

  // 21
  [4, 144, 116, 4, 145, 117],
  [17, 68, 42],
  [17, 50, 22, 6, 51, 23],
  [19, 46, 16, 6, 47, 17],

  // 22
  [2, 139, 111, 7, 140, 112],
  [17, 74, 46],
  [7, 54, 24, 16, 55, 25],
  [34, 37, 13],

  // 23
  [4, 151, 121, 5, 152, 122],
  [4, 75, 47, 14, 76, 48],
  [11, 54, 24, 14, 55, 25],
  [16, 45, 15, 14, 46, 16],

  // 24
  [6, 147, 117, 4, 148, 118],
  [6, 73, 45, 14, 74, 46],
  [11, 54, 24, 16, 55, 25],
  [30, 46, 16, 2, 47, 17],

  // 25
  [8, 132, 106, 4, 133, 107],
  [8, 75, 47, 13, 76, 48],
  [7, 54, 24, 22, 55, 25],
  [22, 45, 15, 13, 46, 16],

  // 26
  [10, 142, 114, 2, 143, 115],
  [19, 74, 46, 4, 75, 47],
  [28, 50, 22, 6, 51, 23],
  [33, 46, 16, 4, 47, 17],

  // 27
  [8, 152, 122, 4, 153, 123],
  [22, 73, 45, 3, 74, 46],
  [8, 53, 23, 26, 54, 24],
  [12, 45, 15, 28, 46, 16],

  // 28
  [3, 147, 117, 10, 148, 118],
  [3, 73, 45, 23, 74, 46],
  [4, 54, 24, 31, 55, 25],
  [11, 45, 15, 31, 46, 16],

  // 29
  [7, 146, 116, 7, 147, 117],
  [21, 73, 45, 7, 74, 46],
  [1, 53, 23, 37, 54, 24],
  [19, 45, 15, 26, 46, 16],

  // 30
  [5, 145, 115, 10, 146, 116],
  [19, 75, 47, 10, 76, 48],
  [15, 54, 24, 25, 55, 25],
  [23, 45, 15, 25, 46, 16],

  // 31
  [13, 145, 115, 3, 146, 116],
  [2, 74, 46, 29, 75, 47],
  [42, 54, 24, 1, 55, 25],
  [23, 45, 15, 28, 46, 16],

  // 32
  [17, 145, 115],
  [10, 74, 46, 23, 75, 47],
  [10, 54, 24, 35, 55, 25],
  [19, 45, 15, 35, 46, 16],

  // 33
  [17, 145, 115, 1, 146, 116],
  [14, 74, 46, 21, 75, 47],
  [29, 54, 24, 19, 55, 25],
  [11, 45, 15, 46, 46, 16],

  // 34
  [13, 145, 115, 6, 146, 116],
  [14, 74, 46, 23, 75, 47],
  [44, 54, 24, 7, 55, 25],
  [59, 46, 16, 1, 47, 17],

  // 35
  [12, 151, 121, 7, 152, 122],
  [12, 75, 47, 26, 76, 48],
  [39, 54, 24, 14, 55, 25],
  [22, 45, 15, 41, 46, 16],

  // 36
  [6, 151, 121, 14, 152, 122],
  [6, 75, 47, 34, 76, 48],
  [46, 54, 24, 10, 55, 25],
  [2, 45, 15, 64, 46, 16],

  // 37
  [17, 152, 122, 4, 153, 123],
  [29, 74, 46, 14, 75, 47],
  [49, 54, 24, 10, 55, 25],
  [24, 45, 15, 46, 46, 16],

  // 38
  [4, 152, 122, 18, 153, 123],
  [13, 74, 46, 32, 75, 47],
  [48, 54, 24, 14, 55, 25],
  [42, 45, 15, 32, 46, 16],

  // 39
  [20, 147, 117, 4, 148, 118],
  [40, 75, 47, 7, 76, 48],
  [43, 54, 24, 22, 55, 25],
  [10, 45, 15, 67, 46, 16],

  // 40
  [19, 148, 118, 6, 149, 119],
  [18, 75, 47, 31, 76, 48],
  [34, 54, 24, 34, 55, 25],
  [20, 45, 15, 61, 46, 16]
];

QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {

  var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);

  if (rsBlock == undefined) {
    throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" +
      errorCorrectLevel);
  }

  var length = rsBlock.length / 3;

  var list = new Array();

  for (var i = 0; i < length; i++) {

    var count = rsBlock[i * 3 + 0];
    var totalCount = rsBlock[i * 3 + 1];
    var dataCount = rsBlock[i * 3 + 2];

    for (var j = 0; j < count; j++) {
      list.push(new QRRSBlock(totalCount, dataCount));
    }
  }

  return list;
};

QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

  switch (errorCorrectLevel) {
    case QRErrorCorrectLevel.L:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
    case QRErrorCorrectLevel.M:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
    case QRErrorCorrectLevel.Q:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
    case QRErrorCorrectLevel.H:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
    default:
      return undefined;
  }
};

//---------------------------------------------------------------------
// QRBitBuffer
//---------------------------------------------------------------------

function QRBitBuffer() {
  this.buffer = new Array();
  this.length = 0;
}

QRBitBuffer.prototype = {

  get: function(index) {
    var bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
  },

  put: function(num, length) {
    for (var i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) == 1);
    }
  },

  getLengthInBits: function() {
    return this.length;
  },

  putBit: function(bit) {

    var bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }

    if (bit) {
      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
    }

    this.length++;
  }
};

QRCode.errorCorrectLevel = QRErrorCorrectLevel;

/**
 * 字符编码支持中文，QRCode使用mode 4 8bit
 * @param {String} text 文本
 */
function utf16To8(text) {
  text = text.toString();
  var result = '';
  var c;
  for (var i = 0; i < text.length; i++) {
    c = text.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007F) {
      result += text.charAt(i);
    } else if (c > 0x07FF) {
      result += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
      result += String.fromCharCode(0x80 | c >> 6 & 0x3F);
      result += String.fromCharCode(0x80 | c >> 0 & 0x3F);
    } else {
      result += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
      result += String.fromCharCode(0x80 | c >> 0 & 0x3F);
    }
  }
  return result;
}

/**
 * 对象属性深度替换
 * @param {Object} o 原始对象/默认对象/被替换的对象
 * @param {Object} r 从这个对象里取值替换到o对象里
 * @return {Object} 替换后的新对象
 */
function deepReplace(o = {}, r = {}, c = false) {
  let obj;
  if (c) {
    // 从源替换
    obj = o;
  } else {
    // 不替换源，copy一份备份来替换
    obj = {
      ...o
    };
  }
  for (let k in r) {
    var vr = r[k];
    if (vr != undefined) {
      if (vr.constructor == Object) {
        obj[k] = this.deepReplace(obj[k], vr);
      } else if (vr.constructor == String && !vr) {
        obj[k] = obj[k];
      } else {
        obj[k] = vr;
      }
    }
  }
  return obj;
}

/**
 * 获取画布定制上下文。
 * @param {*} ctx 前端传过来的上下文
 * 写扩展插件时需注意，因微信官方旧版Canvas未完全依照Web Canvas API设计，安卓并未兼容，如需要H5和微信小程序旧版Canvas同时兼容，需要在扩展函数里加入这些API的兼容。（如当前未补充的：setLineCap、setTransform、setStrokeStyle等与Web Canvas不一致的API）
 */
function getCanvasContext(ctx) {
  /**
   ctx注意事项：
     gcanvas drawImage后必跟一个draw(true)，否则会出现图片丢失的情况；
     gcanvas 坑实在是太多了，nvue端建议部署一个nodejs服务，通过接口获取二维码图片，这样做体验最好；
   **/
  /* 兼容setFillStyle写法，主要在uni-app nvue gcanvas 微信小程序normal */
  ctx.setFillStyle = ctx.setFillStyle || function(color) {
    ctx.fillStyle = color;
  };
  /* 兼容setFontSize写法 */
  ctx.setFontSize = ctx.setFontSize || function(fontSize) {
    ctx.font = `${fontSize}px`;
  };
  /* 兼容setTextAlign写法 */
  ctx.setTextAlign = ctx.setTextAlign || function(align) {
    ctx.textAlign = align;
  };
  /* 兼容setTextBaseline写法 */
  ctx.setTextBaseline = ctx.setTextBaseline || function(textBaseline) {
    ctx.textBaseline = textBaseline;
  };
  /* 兼容setGlobalAlpha写法，设置透明度，主要在微信小程序normal */
  ctx.setGlobalAlpha = ctx.setGlobalAlpha || function(alpha) {
    ctx.globalAlpha = alpha;
  };
  /* 兼容setGlobalAlpha写法，设置描边颜色 */
  ctx.setStrokeStyle = ctx.setStrokeStyle || function(color) {
    ctx.strokeStyle = color;
  };
  /* 兼容setGlobalAlpha写法，设定阴影样式 */
  ctx.setShadow = ctx.setShadow || function(offsetX, offsetY, blur, color) {
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
  };
  /* 若实例不包含draw方法则创建一个 */
  ctx.draw = ctx.draw || function(reserve, callback) {
    callback && callback();
  };
  ctx.clearRect = ctx.clearRect || function(x, y, width, height) {
    ctx.draw(false);
  };
  return ctx;
}

function paintData(instance) {
  let {
    dynamicSize: size,
    margin,
    backgroundColor,
    backgroundPadding,
    foregroundColor,
    foregroundPadding,
    modules,
    moduleCount
  } = instance;

  let destSize = (size - margin * 2) / moduleCount;

  let tileBackgroundSize = destSize;
  let tileBackgroundPadding = 0;
  if (backgroundPadding > 0) {
    tileBackgroundPadding = (tileBackgroundSize * backgroundPadding) / 2;
    tileBackgroundSize -= tileBackgroundPadding * 2;
  }
  let tileForegroundSize = destSize;
  let tileForegroundPadding = 0;
  if (foregroundPadding > 0) {
    tileForegroundPadding = (tileForegroundSize * foregroundPadding) / 2;
    tileForegroundSize -= tileForegroundPadding * 2;
  }

  for (var rowI = 0; rowI < moduleCount; rowI++) {
    for (var colI = 0; colI < moduleCount; colI++) {
      var tile = modules[rowI][colI];
      var destX = colI * destSize + margin;
      var destY = rowI * destSize + margin;
      if (tile) {
        var tilePadding = tileForegroundPadding;
        var tileX = destX + tileForegroundPadding;
        var tileY = destY + tileForegroundPadding;
        var tileWidth = tileForegroundSize;
        var tileHeight = tileForegroundSize;
        modules[rowI][colI] = {
          type: ['foreground'],
          color: foregroundColor,
          isBlack: true,
          isDrawn: false,
          destX: destX,
          destY: destY,
          destWidth: destSize,
          destHeight: destSize,
          x: tileX,
          y: tileY,
          width: tileWidth,
          height: tileHeight,
          paddingTop: tilePadding,
          paddingRight: tilePadding,
          paddingBottom: tilePadding,
          paddingLeft: tilePadding
        };
      } else {
        var tilePadding = tileBackgroundPadding;
        var tileX = destX + tileBackgroundPadding;
        var tileY = destY + tileBackgroundPadding;
        var tileWidth = tileBackgroundSize;
        var tileHeight = tileBackgroundSize;
        modules[rowI][colI] = {
          type: ['background'],
          color: backgroundColor,
          isBlack: false,
          isDrawn: false,
          destX: destX,
          destY: destY,
          destWidth: destSize,
          destHeight: destSize,
          x: tileX,
          y: tileY,
          width: tileWidth,
          height: tileHeight,
          paddingTop: tilePadding,
          paddingRight: tilePadding,
          paddingBottom: tilePadding,
          paddingLeft: tilePadding
        };
      }
    }
  }
}

function paintPositionProbe(instance) {
  let {
    modules,
    moduleCount,
    positionProbeBackgroundColor,
    positionProbeForegroundColor
  } = instance;

  let basePart = [
    [0, 0, 1],
    [1, 0, 1],
    [2, 0, 1],
    [3, 0, 1],
    [4, 0, 1],
    [5, 0, 1],
    [6, 0, 1],
    [0, 1, 1],
    [1, 1, 0],
    [2, 1, 0],
    [3, 1, 0],
    [4, 1, 0],
    [5, 1, 0],
    [6, 1, 1],
    [0, 2, 1],
    [1, 2, 0],
    [2, 2, 1],
    [3, 2, 1],
    [4, 2, 1],
    [5, 2, 0],
    [6, 2, 1],
    [0, 3, 1],
    [1, 3, 0],
    [2, 3, 1],
    [3, 3, 1],
    [4, 3, 1],
    [5, 3, 0],
    [6, 3, 1],
    [0, 4, 1],
    [1, 4, 0],
    [2, 4, 1],
    [3, 4, 1],
    [4, 4, 1],
    [5, 4, 0],
    [6, 4, 1],
    [0, 5, 1],
    [1, 5, 0],
    [2, 5, 0],
    [3, 5, 0],
    [4, 5, 0],
    [5, 5, 0],
    [6, 5, 1],
    [0, 6, 1],
    [1, 6, 1],
    [2, 6, 1],
    [3, 6, 1],
    [4, 6, 1],
    [5, 6, 1],
    [6, 6, 1]
  ];
  let disc = moduleCount - 7;
  basePart.forEach(d => {
    var ltItem = modules[d[0]][d[1]];
    var rtItem = modules[d[0] + disc][d[1]];
    var lbItem = modules[d[0]][d[1] + disc];
    lbItem.type.push('positionProbe');
    rtItem.type.push('positionProbe');
    ltItem.type.push('positionProbe');
    //绘制左上角
    ltItem.color = d[2] == 1 ? positionProbeForegroundColor : positionProbeBackgroundColor;
    //绘制右上角
    rtItem.color = d[2] == 1 ? positionProbeForegroundColor : positionProbeBackgroundColor;
    //绘制左下角
    lbItem.color = d[2] == 1 ? positionProbeForegroundColor : positionProbeBackgroundColor;
  });
}

function paintSeparator(instance) {
  let {
    modules,
    moduleCount,
    separatorColor
  } = instance;

  let basePart = [
    [7, 0],
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
    [7, 7],
    [0, 7],
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7]
  ];
  basePart.forEach(d => {
    var ltItem = modules[d[0]][d[1]];
    var rtItem = modules[moduleCount - d[0] - 1][d[1]];
    var lbItem = modules[d[0]][moduleCount - d[1] - 1];
    lbItem.type.push('separator');
    rtItem.type.push('separator');
    ltItem.type.push('separator');
    //绘制左上
    ltItem.color = separatorColor;
    //绘制右上
    rtItem.color = separatorColor;
    //绘制左下
    lbItem.color = separatorColor;
  });
}

function paintPositionAdjust(instance) {
  let {
    typeNumber,
    modules,
    moduleCount,
    foregroundColor,
    backgroundColor,
    positionAdjustForegroundColor,
    positionAdjustBackgroundColor,
    timingForegroundColor,
    timingBackgroundColor
  } = instance;

  /* 不同版本的对齐图案组合位置 */
  const ALIGNMENT_OF_VERSION = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  /* 对齐图案数量和中心位置根据版本定义 */
  const alignments = ALIGNMENT_OF_VERSION[typeNumber - 1];
  if (alignments) {
    const calcMatrix = [
      [-2, -2, 1],
      [-1, -2, 1],
      [0, -2, 1],
      [1, -2, 1],
      [2, -2, 1],
      [-2, -1, 1],
      [-1, -1, 0],
      [0, -1, 0],
      [1, -1, 0],
      [2, -1, 1],
      [-2, 0, 1],
      [-1, 0, 0],
      [0, 0, 1],
      [1, 0, 0],
      [2, 0, 1],
      [-2, 1, 1],
      [-1, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
      [2, 1, 1],
      [-2, 2, 1],
      [-1, 2, 1],
      [0, 2, 1],
      [1, 2, 1],
      [2, 2, 1]
    ];
    const group_len = alignments.length;
    for (let i = 0; i < group_len; i++) {
        console.log('e',i)
      for (let j = 0; j < group_len; j++) {
        console.log('l',j)
        /* 对齐图案不能污染定位器和分隔器 */
        let {
          x,
          y
        } = {
          x: alignments[i],
          y: alignments[j]
        };
        if (!((x < 9 && y < 9) || (x > moduleCount - 9 - 1 && y < 9) || (y > moduleCount - 9 - 1 && x < 9))) {
          calcMatrix.forEach(d => {
            var alignmentItem = modules[x + d[0]][y + d[1]];
            alignmentItem.type.push('positionAdjust');
            if (alignmentItem.type.includes('timing')) {
              /* 因为对齐图案层级比时序图案高，所以此处做一下处理，如果是与timing重叠部分，timing设置了颜色而positionAdjust颜色与foreground一致则使用timing颜色，否则使用默认颜色 */
              if (d[2] == 1) {
                if (positionAdjustForegroundColor == foregroundColor) {
                  alignmentItem.color = timingForegroundColor;
                } else {
                  alignmentItem.color = positionAdjustForegroundColor;
                }
              } else {
                if (positionAdjustForegroundColor == foregroundColor) {
                  if (positionAdjustBackgroundColor == backgroundColor) {
                    alignmentItem.color = timingBackgroundColor;
                  } else {
                    alignmentItem.color = positionAdjustBackgroundColor;
                  }
                } else {
                  alignmentItem.color = positionAdjustBackgroundColor;
                }
              }
            } else {
              alignmentItem.color = d[2] == 1 ? positionAdjustForegroundColor : positionAdjustBackgroundColor;
            }
          });
        }
      }
    }
  }
}

function paintTiming(instance) {
  let {
    modules,
    moduleCount,
    timingForegroundColor,
    timingBackgroundColor
  } = instance;

  let timingPartLen = moduleCount - 16;
  for (let i = 0; i < timingPartLen; i++) {
    var xItem = modules[6][8 + i];
    var yItem = modules[8 + i][6];
    xItem.type.push('timing');
    yItem.type.push('timing');
    xItem.color = (1 & i) ^ 1 ? timingForegroundColor : timingBackgroundColor;
    yItem.color = (1 & i) ^ 1 ? timingForegroundColor : timingBackgroundColor;
  }
}

function paintDarkBlock(instance) {
  let {
    modules,
    moduleCount,
    darkBlockColor
  } = instance;

  var darkBlockItem = modules[moduleCount - 7 - 1][8];
  darkBlockItem.type.push('darkBlock');
  darkBlockItem.color = darkBlockColor;
}

function paintTypeNumber(instance) {
  let {
    typeNumber,
    modules,
    moduleCount,
    typeNumberBackgroundColor,
    typeNumberForegroundColor
  } = instance;

  if (typeNumber < 7) {
    return modules;
  }
  /* 预留版本信息，0为补位，从索引7开始 */
  const VERSIONS = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    '000111110010010100',
    '001000010110111100',
    '001001101010011001',
    '001010010011010011',
    '001011101111110110',
    '001100011101100010',
    '001101100001000111',
    '001110011000001101',
    '001111100100101000',
    '010000101101111000',
    '010001010001011101',
    '010010101000010111',
    '010011010100110010',
    '010100100110100110',
    '010101011010000011',
    '010110100011001001',
    '010111011111101100',
    '011000111011000100',
    '011001000111100001',
    '011010111110101011',
    '011011000010001110',
    '011100110000011010',
    '011101001100111111',
    '011110110101110101',
    '011111001001010000',
    '100000100111010101',
    '100001011011110000',
    '100010100010111010',
    '100011011110011111',
    '100100101100001011',
    '100101010000101110',
    '100110101001100100',
    '100111010101000001',
    '101000110001101001'
  ];

  /* 两种方式获取预留格式信息，临时计算或者查字典 */
  //let version_codes = _v.correctVersionData(_v.version);
  let version_codes = VERSIONS[typeNumber] + VERSIONS[typeNumber];
  /* 创建预留版本信息 */
  let disc = [moduleCount - 11, moduleCount - 10, moduleCount - 9];
  /* 左+右 */
  let version_cells = [
    /* 左 */
    [5, disc[2]],
    [5, disc[1]],
    [5, disc[0]],
    [4, disc[2]],
    [4, disc[1]],
    [4, disc[0]],
    [3, disc[2]],
    [3, disc[1]],
    [3, disc[0]],
    [2, disc[2]],
    [2, disc[1]],
    [2, disc[0]],
    [1, disc[2]],
    [1, disc[1]],
    [1, disc[0]],
    [0, disc[2]],
    [0, disc[1]],
    [0, disc[0]],
    /* 右 */
    [disc[2], 5],
    [disc[1], 5],
    [disc[0], 5],
    [disc[2], 4],
    [disc[1], 4],
    [disc[0], 4],
    [disc[2], 3],
    [disc[1], 3],
    [disc[0], 3],
    [disc[2], 2],
    [disc[1], 2],
    [disc[0], 2],
    [disc[2], 1],
    [disc[1], 1],
    [disc[0], 1],
    [disc[2], 0],
    [disc[1], 0],
    [disc[0], 0]
  ];
  version_cells.forEach((d, index) => {
    var versionInformationItem = modules[d[0]][d[1]];
    versionInformationItem.type.push('typeNumber');
    versionInformationItem.color = version_codes[index] == '1' ? typeNumberForegroundColor : typeNumberBackgroundColor;
  });
}

/**
 * UQRCode
 * @param {Object} options 
 * @param {Object} canvasContext 
 */
function UQRCode(options, canvasContext) {
  /** 基本属性 */
  var _data = this.data = ''; // 二维码对应内容
  this.dataEncode = true; // 数据编码，默认utf16to8，设为false则传入原始data，如有特殊的编码需求，可以将其设为false，再将数据编码后传入data
  var _size = this.size = 200; // 二维码大小
  this.useDynamicSize = false; // 使用动态尺寸，自动计算每一个小方块尺寸为整数，因为canvas特性，小数点部分会被绘制为透明渐变色，绘制后看起来像是有白色细线，计算为整数则可以解决这个问题，但是实际尺寸已不是原尺寸，canvas的尺寸需要通过获取dynamicSize后重新设置
  this.dynamicSize = _size; // 动态尺寸
  var _typeNumber = this.typeNumber = -1; // 二维码版本，-1为自动计算，自动计算字符越多，版本越高
  this.errorCorrectLevel = UQRCode.errorCorrectLevel.H; // 纠错等级
  var _margin = this.margin = 0; // 二维码外边距
  this.areaColor = '#FFFFFF'; // 二维码绘制区域颜色、底部背景色

  /** 背景属性 */
  this.backgroundColor = 'rgba(255,255,255,0)'; // 背景色
  this.backgroundImageSrc = undefined; //背景图片地址
  var _backgroundImageWidth = this.backgroundImageWidth = undefined; // 背景图片宽度，默认与size同宽
  var _backgroundImageHeight = this.backgroundImageHeight = undefined; // 背景图片高度，默认与size同高
  var _backgroundImageX = this.backgroundImageX = undefined; // 背景图片位置X坐标，默认0
  var _backgroundImageY = this.backgroundImageY = undefined; // 背景图片位置Y坐标，默认0
  this.backgroundImageAlpha = 1; // 背景图片透明度，默认不透明
  this.backgroundImageBorderRadius = 0; // 背景图片圆角，默认不是圆角
  var _backgroundPadding = this.backgroundPadding = 0.0; // 背景码点内边距，系数：0.0-1.0

  /** 前景属性 */
  this.foregroundColor = '#000000'; // 前景色
  this.foregroundImageSrc = undefined; // 前景图片地址
  var _foregroundImageWidth = this.foregroundImageWidth = undefined; // 前景图片宽度，默认为size的1/4
  var _foregroundImageHeight = this.foregroundImageHeight = undefined; // 前景图片高度，默认为size的1/4
  var _foregroundImageX = this.foregroundImageX = undefined; // 前景图片位置X坐标，默认在画布中间位置
  var _foregroundImageY = this.foregroundImageY = undefined; // 前景图片位置Y坐标，默认在画布中间位置
  var _foregroundImagePadding = this.foregroundImagePadding = 0; // 前景图边距填充
  this.foregroundImageBackgroundColor = '#FFFFFF'; // 前景图背景颜色
  var _foregroundImageBorderRadius = this.foregroundImageBorderRadius = 0; // 前景图边界圆角
  var _foregroundImageShadowOffsetX = this.foregroundImageShadowOffsetX = 0; // 前景图阴影水平偏移值
  var _foregroundImageShadowOffsetY = this.foregroundImageShadowOffsetY = 0; // 前景图阴影垂直偏移值
  var _foregroundImageShadowBlur = this.foregroundImageShadowBlur = 0; // 前景图阴影模糊度
  this.foregroundImageShadowColor = '#808080'; // 前景图阴影颜色
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
  this.base = undefined; // 二维码基本对象，通过实例化QRCode类并调用make后得到
  this.modules = []; // 制作二维码主要模块数据，基于base的modules但数据格式不一致，这里的modules是定制过的
  this.moduleCount = 0; // 模块数量
  this.drawModules = []; // 绘制模块，层级：最底层 -> 绘制区域 -> 背景图片 -> 背景|前景 -> 前景图片 -> 最顶层

  /** 绘制模块 */
  var _canvasContext = this.canvasContext = undefined; // canvas上下文
  this.loadImage;
  this.drawReserve = false; // ctx.draw保留绘制，本次绘制是否接着上一次绘制，2d没有draw方法，所以2d该属性对2d无效

  this.isMaked = false;

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
};

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
};

/**
 * 加载图片
 * @param {String} src 
 */
UQRCode.prototype.loadImage = function(src) {
  return Promise.resolve(src);
};

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
    //   dataEncode: options.dataEncode,
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
      dataEncode: options.dataEncode,
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
};

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
    dataEncode,
    size,
    margin,
    useDynamicSize
  } = this;

  if (foregroundColor === backgroundColor) {
    console.error('[uQRCode]: foregroundColor and backgroundColor cannot be the same!');
    throw new UQRCode.Error('foregroundColor and backgroundColor cannot be the same!');
  }

  if (dataEncode) {
    data = utf16To8(data);
  }
  
  var qrc = new QRCode(typeNumber, errorCorrectLevel);
  qrc.addData(data);
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
};

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
};

/**
 * 判断当前模块是否是黑块（前景部分）
 * @param {Number} rowI 
 * @param {Number} colI 
 */
UQRCode.prototype.isBlack = function(rowI, colI) {
  var count = this.moduleCount;
  return !(0 > rowI || 0 > colI || rowI >= count || colI >= count) && this.modules[rowI][colI].isBlack;
};

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
      // ctx.draw(false);

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
            ctx.setFillStyle(drawModule.color);
            ctx.fillRect(x, y, w, h);
            break;
          case 'image':
            /* 绘制图像 */
            if (drawModule.name === 'backgroundImage') {
              /* 安卓微信小程序带小数操作旧版Canvas会出问题，而且很多地方都有问题，尽量保持整数 */
              var x = Math.round(drawModule.x);
              var y = Math.round(drawModule.y);
              var w = Math.round(drawModule.width);
              var h = Math.round(drawModule.height);
              var r = Math.round(drawModule.borderRadius);
              if (w < 2 * r) {
                r = w / 2;
              }
              if (h < 2 * r) {
                r = h / 2;
              }

              /* 设置透明度 */
              ctx.setGlobalAlpha(drawModule.alpha);

              /* 绘制圆角 */
              if (r > 0) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
                ctx.closePath();
                ctx.setStrokeStyle('rgba(0,0,0,0)');
                ctx.stroke();
                ctx.clip();
              }

              try {
                /* 绘制图片前需要先加载图片，因为图片可能是异步资源，如果没有设置loadImage方法，则需要在上层先获取到图片再传入 */
                var img = await this.loadImage(drawModule.imageSrc);
                ctx.drawImage(img, x, y, w, h);
              } catch (e) {
                console.error(`[uQRCode]: ${drawModule.mappingName} invalid!`);
                throw new UQRCode.Error(`${drawModule.mappingName} invalid!`);
              }
            } else if (drawModule.name === 'foregroundImage') {
              /* 安卓微信小程序带小数操作旧版Canvas会出问题，而且很多地方都有问题，尽量保持整数 */
              var x = Math.round(drawModule.x);
              var y = Math.round(drawModule.y);
              var w = Math.round(drawModule.width);
              var h = Math.round(drawModule.height);
              var p = Math.round(drawModule.padding);
              var r = Math.round(drawModule.borderRadius);
              if (w < 2 * r) {
                r = w / 2;
              }
              if (h < 2 * r) {
                r = h / 2;
              }
              var bx = x - p;
              var by = y - p;
              var bw = w + p * 2;
              var bh = h + p * 2;
              var br = Math.round((bw / w) * r);
              if (bw < 2 * br) {
                br = bw / 2;
              }
              if (bh < 2 * br) {
                br = bh / 2;
              }

              /* 绘制阴影 */
              ctx.save();
              ctx.setShadow(drawModule.shadowOffsetX, drawModule.shadowOffsetY, drawModule.shadowBlur, drawModule.shadowColor);
              /* 阴影需要一个填充块作为载体 */
              if (br > 0) {
                ctx.beginPath();
                ctx.moveTo(bx + br, by);
                ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
                ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
                ctx.arcTo(bx, by + bh, bx, by, br);
                ctx.arcTo(bx, by, bx + bw, by, br);
                ctx.closePath();
                ctx.setFillStyle(drawModule.backgroundColor);
                ctx.fill();
              } else {
                ctx.setFillStyle(drawModule.backgroundColor);
                ctx.fillRect(bx, by, bw, bh);
              }
              ctx.restore();

              /* 绘制Padding */
              ctx.save();
              if (br > 0) {
                ctx.beginPath();
                ctx.moveTo(bx + br, by);
                ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
                ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
                ctx.arcTo(bx, by + bh, bx, by, br);
                ctx.arcTo(bx, by, bx + bw, by, br);
                ctx.closePath();
                ctx.setFillStyle(p > 0 ? drawModule.backgroundColor : 'rgba(0,0,0,0)');
                ctx.fill();
              } else {
                ctx.setFillStyle(p > 0 ? drawModule.backgroundColor : 'rgba(0,0,0,0)');
                ctx.fillRect(bx, by, bw, bh);
              }
              ctx.restore();

              /* 绘制圆角 */
              if (r > 0) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
                ctx.closePath();
                ctx.setStrokeStyle('rgba(0,0,0,0)');
                ctx.stroke();
                ctx.clip();
              }

              try {
                /* 绘制图片前需要先加载图片，因为图片可能是异步资源，如果没有设置loadImage方法，则需要在上层先获取到图片再传入 */
                var img = await this.loadImage(drawModule.imageSrc);
                ctx.drawImage(img, x, y, w, h);
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
  };

  return new Promise((resolve, reject) => {
    /* 完成绘制 */
    draw(resolve, reject);
  });
};

/**
 * 绘制canvas方法，兼容v3.2.0-v3.4.5版本的写法
 */
UQRCode.prototype.draw = function() {
  return this.drawCanvas();
};

/**
 * 注册实例插件
 * @param {Function} plugin 
 * 写扩展插件时需注意，因微信官方旧版Canvas未完全依照Web Canvas API设计，安卓并未兼容，如需要H5和微信小程序旧版Canvas同时兼容，需要在扩展函数里加入这些API的兼容。（如当前未补充的：setLineCap、setTransform、setStrokeStyle等与Web Canvas不一致的API）
 */
UQRCode.prototype.register = function(plugin) {
  /* UQRCode, 实例属性, 是否来自实例注册 */
  plugin && plugin(UQRCode, this, true);
};export{UQRCode as default};