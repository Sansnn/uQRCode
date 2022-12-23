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
let buildPlugin = function(name, moduleName) {
  let input = `plugin/${name}/plugin.js`;
  if (!fs.existsSync(input)) {
    return;
  }
  let output = formats.map(format => {
    var option = {
      file: `dist/plugin/${name}/uqrcode.plugin.${name}.${format.name}.js`,
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
        src: `plugin/${name}/README.md`,
        dest: `dist/plugin/${name}`
      }, {
        src: `LICENSE.md`,
        dest: `dist/plugin/${name}`
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
buildPlugin('round', 'UQRCodePluginRound');
buildPlugin('liquid', 'UQRCodePluginLiquid');
buildPlugin('words', 'UQRCodePluginWords');
buildPlugin('25d', 'UQRCodePlugin25D');
buildPlugin('art', 'UQRCodePluginArt');
buildPlugin('colorful', 'UQRCodePluginColorful');
buildPlugin('poster', 'UQRCodePluginPoster');

export default builds;
