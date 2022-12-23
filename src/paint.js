/* 第一次深受const、let混淆其害，果然还是不能随便使用const、let搭配混淆食用，特别是解构赋值（解构赋值最好使用let），它俩会影响压缩混淆的代码，导致异常。 */

export function paintData(instance) {
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

  var destSize = (size - margin * 2) / moduleCount;

  var tileBackgroundSize = destSize;
  var tileBackgroundPadding = 0;
  if (backgroundPadding > 0) {
    tileBackgroundPadding = (tileBackgroundSize * backgroundPadding) / 2;
    tileBackgroundSize -= tileBackgroundPadding * 2;
  }
  var tileForegroundSize = destSize;
  var tileForegroundPadding = 0;
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

export function paintPositionProbe(instance) {
  let {
    modules,
    moduleCount,
    positionProbeBackgroundColor,
    positionProbeForegroundColor
  } = instance;

  var basePart = [
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
  var disc = moduleCount - 7;
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

export function paintSeparator(instance) {
  let {
    modules,
    moduleCount,
    separatorColor
  } = instance;

  var basePart = [
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

export function paintPositionAdjust(instance) {
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
  var ALIGNMENT_OF_VERSION = [
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
  var alignments = ALIGNMENT_OF_VERSION[typeNumber - 1];
  if (alignments) {
    var calcMatrix = [
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
    var group_len = alignments.length;
    for (var i = 0; i < group_len; i++) {
      for (var j = 0; j < group_len; j++) {
        /* 对齐图案不能污染定位器和分隔器 */
        var {
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

export function paintTiming(instance) {
  let {
    modules,
    moduleCount,
    timingForegroundColor,
    timingBackgroundColor
  } = instance;

  var timingPartLen = moduleCount - 16;
  for (var i = 0; i < timingPartLen; i++) {
    var xItem = modules[6][8 + i];
    var yItem = modules[8 + i][6];
    xItem.type.push('timing');
    yItem.type.push('timing');
    xItem.color = (1 & i) ^ 1 ? timingForegroundColor : timingBackgroundColor;
    yItem.color = (1 & i) ^ 1 ? timingForegroundColor : timingBackgroundColor;
  }
}

export function paintDarkBlock(instance) {
  let {
    modules,
    moduleCount,
    darkBlockColor
  } = instance;

  var darkBlockItem = modules[moduleCount - 7 - 1][8];
  darkBlockItem.type.push('darkBlock');
  darkBlockItem.color = darkBlockColor;
}

export function paintTypeNumber(instance) {
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
  var VERSIONS = [
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
  //var version_codes = _v.correctVersionData(_v.version);
  var version_codes = VERSIONS[typeNumber] + VERSIONS[typeNumber];
  /* 创建预留版本信息 */
  var disc = [moduleCount - 11, moduleCount - 10, moduleCount - 9];
  /* 左+右 */
  var version_cells = [
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
