import {
  terser
} from 'rollup-plugin-terser';
import packageConfig from './package.json';

const formats = packageConfig.formats;

let buildMain = function() {
  this.input = 'src/main.js';
  this.output = formats.map(format => {
    var option = {
      file: `dist/uqrcode.${format.name}.js`,
      format: format.name,
      exports: 'auto'
    }
    if (format.name === 'umd') {
      option.name = 'UQRCode';
    }
    return option;
  });
  this.plugins = [terser()]; // 压缩代码，压缩后banner也会被移除，重新写个bannerConfig再次buildBanner
}

let buildStyle = function(name) {
  this.input = `style/${name}.js`;
  this.output = formats.map(format => {
    var option = {
      file: `dist/style/${name}/uqrcode.style.${name}.${format.name}.js`,
      format: format.name,
      exports: 'auto'
    }
    if (format.name === 'umd') {
      option.name = `UQRCodeStyle${name.substring(0, 1).toUpperCase()}${name.substring(1)}`;
    }
    return option;
  });
}

export default [
  new buildMain(),
  new buildStyle('round'),
  new buildStyle('liquid')
];
