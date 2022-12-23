/**
 * 字符编码支持中文，QRCode使用mode 4 8bit
 * @param {String} text 文本
 */
export function utf16To8(text) {
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
export function deepReplace(o = {}, r = {}, c = false) {
  let obj;
  if (c) {
    // 从源替换
    obj = o;
  } else {
    // 不替换源，copy一份备份来替换
    obj = {
      ...o
    }
  }
  for (var k in r) {
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
