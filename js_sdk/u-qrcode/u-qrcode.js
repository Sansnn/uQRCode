//---------------------------------------------------------------------
// uQRCode 二维码生成插件 v3.2.2
// 
// uQRCode 是一款使用方式简单，高扩展的二维码生成插件。支持全端生成，支持canvas的地方就可以使用uQRCode。
// 
// Copyright (c) Sansnn uQRCode All rights reserved.
// Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// 复制使用请保留本段注释，感谢支持开源！
// 
// 开源地址：
// https://github.com/Sansnn/uQRCode
// 
// uni-app插件市场地址：
// https://ext.dcloud.net.cn/plugin?id=1287
//---------------------------------------------------------------------

"use strict";

function uQRCode(options, canvasContext, loadImage) {
  this.options = uQRCode.getOptions(options);
  this.canvasContext = uQRCode.getCanvasContext(canvasContext);
  this.loadImage = uQRCode.getLoadImage(loadImage);
}

(function() {
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
  }

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

  }

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
  }

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
  }

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

  //---------------------------------------------------------------------
  // Support Chinese 字符编码支持中文
  // 使用mode 4 8bit
  //---------------------------------------------------------------------
  function utf16To8(text) {
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
   * 队列
   */
  class Queue {
    constructor() {
      let waitingQueue = [];
      let isRunning = false; //记录是否有未完成的任务
      function execute(task, resolve, reject) {
        task()
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          })
          .finally(() => {
            //等待任务队列中如果有任务，则触发它；否则设置isRunning = false,表示无任务状态
            if (waitingQueue.length) {
              const next = waitingQueue.shift();
              execute(next.task, next.resolve, next.reject);
            } else {
              isRunning = false;
            }
          });
      }
      return function(task) {
        return new Promise((resolve, reject) => {
          if (isRunning) {
            waitingQueue.push({
              task,
              resolve,
              reject
            });
          } else {
            isRunning = true;
            execute(task, resolve, reject);
          }
        });
      };
    }
  }
  // const queue = new Queue();
  // queue(() => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve('task1');
  //   }, 1000);
  // })).then(data => console.log(data));
  // queue(() => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve('task2');
  //   }, 100);
  // })).then(data => console.log(data));
  // queue(() => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve('task3');
  //   }, 300);
  // })).then(data => console.log(data));

  /**
   * 纠错等级
   */
  uQRCode.errorCorrectLevel = QRErrorCorrectLevel;

  /**
   * 预设默认值（基本，不包含各部分和艺术码参数）
   */
  uQRCode.defaults = {
    typeNumber: -1, // 版本，-1为自动计算，字符越多，版本越高
    errorCorrectLevel: QRErrorCorrectLevel.H, // 纠错等级
    text: '', // 二维码内容
    size: 354, // 大小
    useDynamicSize: false, // 使用动态尺寸，可以去掉方块小数点，绘制出来后没有白色细线
    margin: 0, // 边距
    background: {
      color: '#FFFFFF' // 背景色
    },
    foreground: {
      color: '#000000' // 前景色
    }
  }

  /**
   * 对象属性深度替换
   * @param {Object} o 原始对象/默认对象/被替换的对象
   * @param {Object} r 从这个对象里取值替换到o对象里
   * @return {Object} 替换后的新对象
   */
  uQRCode.deepReplace = function(o = {}, r = {}) {
    let obj = {
      ...o
    }
    for (let k in r) {
      var vr = r[k];
      if (vr.constructor == Object) {
        obj[k] = this.deepReplace(obj[k], vr);
      } else if (vr.constructor == String && !vr) {
        obj[k] = obj[k];
      } else {
        obj[k] = vr;
      }
    }
    return obj;
  }

  /**
   * 获取选项值
   */
  uQRCode.getOptions = function(options) {
    options = uQRCode.deepReplace(uQRCode.defaults, options);

    /* 背景 */
    options.background = uQRCode.deepReplace({
      color: options.background.color, // 背景色
      image: {
        src: '',
        width: 1, // 图片宽
        height: 1, // 图片高
        align: ['center', 'center'], // 图片对齐方式水平，垂直
        anchor: [0, 0], // 图片位置，X坐标，Y坐标
        alpha: 1 // 透明度
      }
    }, options.background);
    /* 前景 */
    options.foreground = uQRCode.deepReplace({
      color: options.foreground.color, // 前景色
      image: {
        src: '',
        width: 1 / 4, // 图片宽
        height: 1 / 4, // 图片高
        align: ['center', 'center'], // 图片对齐方式水平，垂直
        anchor: [0, 0] // 图片位置，X坐标，Y坐标
      }
    }, options.foreground);
    /* 定位角 */
    options.positionDetection = uQRCode.deepReplace({
      backgroundColor: options.background.color, // 定位角区域背景色，默认值跟随背景色
      foregroundColor: options.foreground.color // 定位角小块颜色，默认值跟随前景色
    }, options.positionDetection);
    /* 分割图案 */
    options.separator = uQRCode.deepReplace({
      color: options.background.color // 分割区域颜色，默认值跟随背景色
    }, options.separator);
    /* 对齐图案 */
    options.alignment = uQRCode.deepReplace({
      backgroundColor: options.background.color, // 对齐区域背景色，默认值跟随背景色
      foregroundColor: options.foreground.color // 对齐小块颜色，默认值跟随前景色
    }, options.alignment);
    /* 时序图案 */
    options.timing = uQRCode.deepReplace({
      backgroundColor: options.background.color, // 时序区域背景色，默认值跟随背景色
      foregroundColor: options.foreground.color // 时序小块颜色，默认值跟随前景色
    }, options.timing);
    /* 暗块 */
    options.darkBlock = uQRCode.deepReplace({
      color: options.foreground.color // 暗块颜色
    }, options.darkBlock);
    /* 版本信息 */
    options.versionInformation = uQRCode.deepReplace({
      backgroundColor: options.background.color, // 版本信息区域背景色，默认值跟随背景色
      foregroundColor: options.foreground.color // 版本信息小块颜色，默认值跟随前景色
    }, options.versionInformation);

    return options;
  }

  /**
   * 获取canvas实例
   */
  uQRCode.getCanvasContext = function(ctx) {
    /* 兼容setFillStyle写法，主要在uni-app nvue gcanvas */
    ctx.setFillStyle = ctx.setFillStyle || function(color) {
      ctx.fillStyle = color;
    }
    /* 兼容setFontSize写法，主要在微信小程序canvas2d */
    ctx.setFontSize = ctx.setFontSize || function(fontSize) {
      ctx.font = `${fontSize}px`;
    }
    /* 兼容setTextAlign写法，主要在微信小程序canvas2d */
    ctx.setTextAlign = ctx.setTextAlign || function(align) {
      ctx.textAlign = align;
    }
    /* 兼容setTextBaseline写法，主要在微信小程序canvas2d */
    ctx.setTextBaseline = ctx.setTextBaseline || function(textBaseline) {
      ctx.textBaseline = textBaseline;
    }
    /* 若实例不包含draw方法则创建一个 */
    ctx.draw = ctx.draw || function(reserve, callback) {
      callback && callback();
    }
    return ctx;
  }

  /* 队列实例，某些平台一起使用多个组件时需要通过队列逐一绘制，否则部分绘制方法异常，nvue端的iOS gcanvas尤其明显，在不通过队列绘制时会出现图片丢失的情况 */
  uQRCode.Queue = new Queue();
  uQRCode.QueueLoadImage = new Queue();

  /* 缓存loadImage图片 */
  uQRCode.loadImageCache = [];

  /**
   * 获取加载图片方法
   */
  uQRCode.getLoadImage = function(loadImage) {
    if (typeof loadImage == 'function') {
      return function(src) {
        /* 解决iOS APP||NVUE同时绘制多个二维码导致图片丢失需使用队列 */
        return uQRCode.QueueLoadImage(() => new Promise((resolve, reject) => {
          setTimeout(() => {
            const cache = uQRCode.loadImageCache.find(x => x.src == src);
            if (cache) {
              resolve(cache.img);
            } else {
              loadImage(src).then(img => {
                uQRCode.loadImageCache.push({
                  src,
                  img
                });
                resolve(img);
              });
            }
          }, 150);
        }));
      }
    } else {
      return function(src) {
        return Promise.resolve(src);
      }
    }
  }

  uQRCode.prototype = {
    /**
     * 实例化传入的选项值
     */
    options: {},

    /**
     * 画布实例
     */
    canvasContext: {},

    /**
     * 制作二维码全部数据
     */
    makeData: {},

    /**
     * 制作二维码主要模块数据，基于makeData的modules但数据格式不一致，这里的modules是定制过的
     */
    modules: [],

    /**
     * 模块数量
     */
    moduleCount: 0,

    /**
     * 获取制作二维码数据
     */
    getMakeData() {
      let {
        typeNumber,
        errorCorrectLevel,
        text
      } = this.options;
      var qrcode = new QRCode(typeNumber, errorCorrectLevel);
      qrcode.addData(utf16To8(text.toString()));
      qrcode.make();
      return qrcode;
    },

    /**
     * 制作二维码方法
     */
    make() {
      let makeData = this.makeData = this.getMakeData();
      this.modules = JSON.parse(JSON.stringify(makeData.modules));
      this.moduleCount = makeData.moduleCount;
      this.options.typeNumber = makeData.typeNumber;

      /* 数据码 data */
      this.paintData();
      /* 定位图案 position detection */
      this.paintPositionDetection();
      /* 分隔图案 separator */
      this.paintSeparator();
      /* 对齐图案 alignment */
      this.paintAlignment();
      /* 时序图案 timing */
      this.paintTiming();
      /* 暗块 darkBlock */
      this.paintDarkBlock();
      /* 预留版本信息 version information */
      this.paintVersionInformation();
    },

    paintData() {
      let modules = this.modules;
      let moduleCount = this.moduleCount;
      let {
        size,
        margin,
        background,
        foreground,
        useDynamicSize
      } = this.options;

      /* dynamicSize自动计算出最适合绘制的尺寸，并按这个尺寸去绘制，可以解决canvas绘制小块间产生白线的问题（其实就是小数点精度问题），useDynamicSize=false可以取消这个设定 */
      // let dynamicSize = this.options.dynamicSize = Math.floor((size - margin * 2) / moduleCount) * moduleCount + margin * 2; // Math.floor向下取整缩放会模糊
      let dynamicSize = this.options.dynamicSize = Math.ceil((size - margin * 2) / moduleCount) * moduleCount + margin * 2; // Math.ceil向上取整缩放效果比floor清晰
      if (!useDynamicSize) {
        dynamicSize = this.options.dynamicSize = size;
      }
      let tileSize = (dynamicSize - margin * 2) / moduleCount;

      for (var rowI = 0; rowI < modules.length; rowI++) {
        for (var colI = 0; colI < modules.length; colI++) {
          var tile = modules[rowI][colI];
          if (tile) {
            modules[rowI][colI] = {
              size: tileSize,
              x: colI * tileSize + margin,
              y: rowI * tileSize + margin,
              type: ['foreground'],
              color: foreground.color,
              isBlack: true,
              isDrawn: false
            };
          } else {
            modules[rowI][colI] = {
              size: tileSize,
              x: colI * tileSize + margin,
              y: rowI * tileSize + margin,
              type: ['background'],
              color: background.color,
              isBlack: false,
              isDrawn: false
            };
          }
        }
      }
    },

    paintPositionDetection() {
      let modules = this.modules;
      let size = this.moduleCount;
      let {
        positionDetection
      } = this.options;

      //1) 定义基础图形索引（左上角）x ,y,v
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
      let disc = size - 7; //size -7
      basePart.forEach(d => {
        var ltItem = modules[d[0]][d[1]];
        var rtItem = modules[d[0] + disc][d[1]];
        var lbItem = modules[d[0]][d[1] + disc];
        lbItem.type.push('positionDetection');
        rtItem.type.push('positionDetection');
        ltItem.type.push('positionDetection');
        //绘制左上角
        ltItem.color = d[2] == 1 ? positionDetection.foregroundColor : positionDetection.backgroundColor;
        //绘制右
        rtItem.color = d[2] == 1 ? positionDetection.foregroundColor : positionDetection.backgroundColor;
        //绘制左
        lbItem.color = d[2] == 1 ? positionDetection.foregroundColor : positionDetection.backgroundColor;
      });
    },

    paintSeparator() {
      let modules = this.modules;
      let size = this.moduleCount;
      let {
        separator
      } = this.options;

      //1) 定义基础图形索引（左上角）
      [
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
      ].forEach(d => {
        var ltItem = modules[d[0]][d[1]];
        var rtItem = modules[size - d[0] - 1][d[1]];
        var lbItem = modules[d[0]][size - d[1] - 1];
        lbItem.type.push('separator');
        rtItem.type.push('separator');
        ltItem.type.push('separator');
        //绘制左上
        ltItem.color = separator.color;
        //绘制右
        rtItem.color = separator.color;
        //绘制左
        lbItem.color = separator.color;
      });
    },

    paintAlignment() {
      let modules = this.modules;
      let size = this.moduleCount;
      let {
        alignment,
        typeNumber
      } = this.options;

      //不同版本的对齐图案组合位置
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
      // 对齐图案数量和中心位置根据版本定义
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
          for (let j = 0; j < group_len; j++) {
            //对齐图案不能污染 定位器和分隔器
            let {
              x,
              y
            } = {
              x: alignments[i],
              y: alignments[j]
            };
            if (!((x < 9 && y < 9) || (x > size - 9 - 1 && y < 9) || (y > size - 9 - 1 && x < 9))) {
              calcMatrix.forEach(d => {
                var alignmentItem = modules[x + d[0]][y + d[1]];
                alignmentItem.type.push('alignment');
                alignmentItem.color = d[2] == 1 ? alignment.foregroundColor : alignment.backgroundColor;
              });
            }
          }
        }
      }
    },

    paintTiming() {
      let modules = this.modules;
      let {
        timing
      } = this.options;

      let timingPartLen = modules.length - 16;
      for (let i = 0; i < timingPartLen; i++) {
        var xItem = modules[6][8 + i];
        var yItem = modules[8 + i][6];
        xItem.type.push('timing');
        yItem.type.push('timing');
        xItem.color = (1 & i) ^ 1 ? timing.foregroundColor : timing.backgroundColor;
        yItem.color = (1 & i) ^ 1 ? timing.foregroundColor : timing.backgroundColor;
      }
    },

    paintDarkBlock() {
      let modules = this.modules;
      let size = this.moduleCount;
      let {
        darkBlock
      } = this.options;

      //创建暗模块
      var darkBlockItem = modules[size - 7 - 1][8];
      darkBlockItem.type.push('darkBlock');
      darkBlockItem.color = darkBlock.color;
    },

    paintVersionInformation() {
      let modules = this.modules;
      let size = this.moduleCount;
      let {
        versionInformation,
        typeNumber: version
      } = this.options;

      if (version < 7) {
        return modules;
      }
      //预留版本信息 0 为补位,预留版本信息 是从索引7开始
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

      //两种方式获取预留格式信息,临时计算或者查字典
      //let version_codes = _v.correctVersionData(_v.version);
      let version_codes = VERSIONS[version] + VERSIONS[version];
      //创建预留版本信息
      let disc = [size - 11, size - 10, size - 9];
      // 左+右
      let version_cells = [
        //左
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
        //右
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
        versionInformationItem.type.push('versionInformation');
        versionInformationItem.color = version_codes[index] == '1' ? versionInformation.foregroundColor : versionInformation.backgroundColor;
      });
    },

    /**
     * 绘制二维码方法
     */
    draw(options) {
      options = uQRCode.deepReplace({
        drawBackground: {
          before: () => {},
          after: () => {}
        },
        drawBackgroundImage: {
          before: () => {},
          after: () => {}
        },
        drawForeground: {
          before: () => {},
          after: () => {}
        },
        drawForegroundImage: {
          before: () => {},
          after: () => {}
        }
      }, options);

      /* 绘制层级关系，最底层背景 -> 背景图片 -> 前景 -> 最顶层前景图片 */
      return new Promise((resolve, reject) => {
        let ctx = this.canvasContext;

        const startup = () => {
          /* 同时绘制多个二维码时使用队列绘制，防止内部方法冲突导致绘制失败 */
          return uQRCode.Queue(() => new Promise((queueResolve, queueReject) => {
            setTimeout(() => {
              ctx.draw(false); // 第一个draw false可以清空画布
              queueResolve();
            }, 150);
          }));
        }
        startup()
          .then(() => {
            /* 绘制背景 */
            return this.drawBackground({
              before: options.drawBackground.before,
              after: options.drawBackground.after
            });
          })
          .then(() => {
            /* 绘制背景图片 */
            return this.drawBackgroundImage({
              before: options.drawBackgroundImage.before,
              after: options.drawBackgroundImage.after
            });
          })
          .then(() => {
            /* 绘制前景 */
            return this.drawForeground({
              before: options.drawForeground.before,
              after: options.drawForeground.after
            });
          })
          .then(() => {
            /* 绘制前景图片 */
            return this.drawForegroundImage({
              before: options.drawForegroundImage.before,
              after: options.drawForegroundImage.after
            });
          })
          .then(() => {
            /* 完成绘制 */
            resolve();
          });
      });
    },

    drawBackground({
      before,
      after
    }) {
      let {
        dynamicSize: size,
        background
      } = this.options;
      let ctx = this.canvasContext;

      return new Promise((resolve, reject) => {
        (async () => {
          await before(this);

          ctx.save();
          /* 填充背景色 */
          ctx.setFillStyle(background.color);
          ctx.fillRect(0, 0, size, size);
          ctx.restore();
          ctx.draw(true); // gcanvas需要每一阶段都draw一下，否则重绘有问题，例如uni-app nvue绘制图片会失败

          await after(this);
          resolve();
        })();
      });
    },

    drawBackgroundImage({
      before,
      after
    }) {
      let {
        dynamicSize: size,
        background
      } = this.options;
      let ctx = this.canvasContext;

      return new Promise((resolve, reject) => {
        (async () => {
          await before(this);

          if (background.image.src) {
            ctx.save();

            let x = 0;
            let y = 0;

            let w = background.image.width * size;
            let h = background.image.height * size;
            let align = background.image.align;
            let anchor = background.image.anchor;
            let alpha = background.image.alpha;

            switch (align[0]) {
              case 'left':
                x = 0;
                break;
              case 'center':
                x = size / 2 - w / 2;
                break;
              case 'right':
                x = size - w;
                break;
            }
            x += Number(anchor[0]);

            switch (align[1]) {
              case 'top':
                y = 0;
                break;
              case 'center':
                y = size / 2 - h / 2;
                break;
              case 'bottom':
                y = size - h;
                break;
            }
            y += Number(anchor[1]);

            /* 设置透明度 */
            ctx.globalAlpha = alpha;

            /* 绘制图片 */
            const img = await this.loadImage(background.image.src);
            ctx.drawImage(img, x, y, w, h);
            ctx.restore();
            ctx.draw(true); // gcanvas需要每一阶段都draw一下，否则重绘有问题，例如uni-app nvue绘制图片会失败
          }

          await after(this);
          resolve();
        })();
      });
    },

    drawForeground({
      before,
      after
    }) {
      let {
        background
      } = this.options;
      let modules = this.modules;
      let moduleCount = this.moduleCount;
      let ctx = this.canvasContext;

      return new Promise((resolve, reject) => {
        (async () => {
          await before(this);

          ctx.save();
          for (var rowI = 0; rowI < moduleCount; rowI++) {
            for (var colI = 0; colI < moduleCount; colI++) {
              var tile = modules[rowI][colI];
              if (!tile.isDrawn && tile.color != background.color) { // 颜色不能与背景色一致，否则可能发生颜色重叠
                var color = tile.color;
                ctx.setFillStyle(color);
                ctx.fillRect(tile.x, tile.y, tile.size, tile.size);
                tile.isDrawn = true;
              }
            }
          }
          ctx.restore();
          ctx.draw(true); // gcanvas需要每一阶段都draw一下，否则重绘有问题，例如uni-app nvue绘制图片会失败

          await after(this);
          resolve();
        })();
      });
    },

    drawForegroundImage({
      before,
      after
    }) {
      let {
        dynamicSize: size,
        foreground
      } = this.options;
      let ctx = this.canvasContext;

      return new Promise((resolve, reject) => {
        (async () => {
          await before(this);

          if (foreground.image.src) {
            ctx.save();

            // 绘制前景图
            let x = 0;
            let y = 0;

            let w = foreground.image.width * size;
            let h = foreground.image.height * size;
            let align = foreground.image.align;
            let anchor = foreground.image.anchor;
            let alpha = foreground.image.alpha;
            let shadow = foreground.image.shadow;
            let border = foreground.image.border;

            switch (align[0]) {
              case 'left':
                x = 0;
                break;
              case 'center':
                x = size / 2 - w / 2;
                break;
              case 'right':
                x = size - w;
                break;
            }
            x += Number(anchor[0]);

            switch (align[1]) {
              case 'top':
                y = 0;
                break;
              case 'center':
                y = size / 2 - h / 2;
                break;
              case 'bottom':
                y = size - h;
                break;
            }
            y += Number(anchor[1]);

            /* 绘制图片 */
            const img = await this.loadImage(foreground.image.src);
            ctx.drawImage(img, x, y, w, h);
            ctx.restore();
            ctx.draw(true); // gcanvas需要每一阶段都draw一下，否则重绘有问题，例如uni-app nvue绘制图片会失败
          }

          await after(this);
          resolve();
        })();
      });
    }

  }

})();

export default uQRCode;
