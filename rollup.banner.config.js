import fs from 'fs';
import packageConfig from './package.json';

let formats = packageConfig.formats;
let builds = [];

let getBannerMain = function() {
  return `//---------------------------------------------------------------------
// uQRCode二维码生成插件 v${packageConfig.version}
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
`;
}

let getBannerFormat = function(format) {
  return `//---------------------------------------------------------------------
// 当前文件格式为 ${format.name}，${format.description}
// 如需在其他环境使用，请获取环境对应的格式文件
// 格式说明：
${formats.map(f => `// ${f.name} - ${f.description}`).join('\n')}
//---------------------------------------------------------------------
`;
}

let buildMain = function() {
  formats.map(format => {
    let option = {
      input: `dist/main/uqrcode.${format.name}.js`,
      output: {
        file: `dist/main/uqrcode.${format.name}.js`,
        banner: getBannerMain() + '\n' + getBannerFormat(format),
        compact: true
      }
    }
    if (format.name === 'umd') {
      option.context = 'typeof window !== "undefined" ? window : global';
    }
    builds.push(option);
  });
}

let buildPlugin = function(name, title) {
  formats.forEach(format => {
    let input = `dist/plugin/${name}/uqrcode.plugin.${name}.${format.name}.js`;
    if (!fs.existsSync(input)) {
      return;
    }
    let option = {
      input,
      output: {
        file: `dist/plugin/${name}/uqrcode.plugin.${name}.${format.name}.js`,
        banner: getBannerMain() + '\n' + getBannerFormat(format),
        compact: true
      }
    }
    if (format.name === 'umd') {
      option.context = 'typeof window !== "undefined" ? window : global';
    }
    builds.push(option);
  });
}

buildMain();
buildPlugin('round', '圆点码');
buildPlugin('liquid', '液态码');
buildPlugin('words', '文字码');
buildPlugin('25d', '2.5D码');
buildPlugin('art', '艺术码');
buildPlugin('colorful', '炫彩码');
buildPlugin('poster', '海报');

export default builds;
