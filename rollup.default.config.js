import fs from 'fs';
import {
  terser
} from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import packageConfig from './package.json';

let formats = packageConfig.formats;
let builds = [];

let buildMain = function() {
  builds.push({
    input: 'src/main.js',
    output: formats.map(format => {
      var option = {
        file: `dist/main/uqrcode.${format.name}.js`,
        format: format.name,
        exports: 'auto'
      }
      if (format.name === 'umd') {
        option.name = 'UQRCode';
      }
      return option;
    }),
    plugins: [
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
    ] // 压缩代码，压缩后banner也会被移除，重新写个bannerConfig再次buildBanner
  });
}
let buildStyle = function(name, moduleName) {
  let input = `style/${name}/style.js`;
  if (!fs.existsSync(input)) {
    return;
  }
  let output = formats.map(format => {
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
  let plugins = [
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
  builds.push({
    input,
    output,
    plugins
  });
}

buildMain();
buildStyle('round', 'UQRCodeStyleRound');
buildStyle('liquid', 'UQRCodeStyleLiquid');
buildStyle('words', 'UQRCodeStyleWords');
buildStyle('25d', 'UQRCodeStyle25D');
buildStyle('art', 'UQRCodeStyleArt');
buildStyle('colorful', 'UQRCodeStyleColorful');

export default builds;
