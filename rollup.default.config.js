import {
  terser
} from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import packageConfig from './package.json';

const formats = packageConfig.formats;

let buildMain = function() {
  this.input = 'src/main.js';
  this.output = formats.map(format => {
    var option = {
      file: `dist/main/uqrcode.${format.name}.js`,
      format: format.name,
      exports: 'auto'
    }
    if (format.name === 'umd') {
      option.name = 'UQRCode';
    }
    return option;
  });
  this.plugins = [
    terser(),
    copy({
      targets: [{
        src: 'README.md',
        dest: 'dist/main'
      }, {
        src: 'LICENSE.md',
        dest: 'dist/main'
      }],
      verbose: true
    })
  ]; // 压缩代码，压缩后banner也会被移除，重新写个bannerConfig再次buildBanner
}

let buildStyle = function(name, moduleName) {
  this.input = `style/${name}/${name}.js`;
  this.output = formats.map(format => {
    var option = {
      file: `dist/style/${name}/uqrcode.style.${name}.${format.name}.js`,
      format: format.name,
      exports: 'auto'
    }
    if (format.name === 'umd') {
      option.name = moduleName;
    }
    return option;
  });
  this.plugins = [
    copy({
      targets: [{
        src: `style/${name}/README.md`,
        dest: `dist/style/${name}`
      }, {
        src: `LICENSE.md`,
        dest: `dist/style/${name}`
      }],
      verbose: true
    })
  ];
}

export default [
  new buildMain(),
  new buildStyle('round', 'UQRCodeStyleRound'),
  new buildStyle('liquid', 'UQRCodeStyleLiquid'),
  new buildStyle('words', 'UQRCodeStyleWords'),
  new buildStyle('25d', 'UQRCodeStyle25D'),
  new buildStyle('art', 'UQRCodeStyleArt')
];
