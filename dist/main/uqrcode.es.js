//---------------------------------------------------------------------
// uQRCode二维码生成插件 v4.0.7
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

function o(o){this.mode=r.MODE_8BIT_BYTE,this.data=o;}function e(o,e){this.typeNumber=o,this.errorCorrectLevel=e,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=new Array;}o.prototype={getLength:function(o){return this.data.length},write:function(o){for(var e=0;e<this.data.length;e++)o.put(this.data.charCodeAt(e),8);}},e.prototype={addData:function(e){var r=new o(e);this.dataList.push(r),this.dataCache=null;},isDark:function(o,e){if(o<0||this.moduleCount<=o||e<0||this.moduleCount<=e)throw new Error(o+","+e);return this.modules[o][e]},getModuleCount:function(){return this.moduleCount},make:function(){if(this.typeNumber<1){var o=1;for(o=1;o<40;o++){for(var e=v.getRSBlocks(o,this.errorCorrectLevel),r=new p,t=0,i=0;i<e.length;i++)t+=e[i].dataCount;for(i=0;i<this.dataList.length;i++){var n=this.dataList[i];r.put(n.mode,4),r.put(n.getLength(),h.getLengthInBits(n.mode,o)),n.write(r);}if(r.getLengthInBits()<=8*t)break}this.typeNumber=o;}this.makeImpl(!1,this.getBestMaskPattern());},makeImpl:function(o,r){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var t=0;t<this.moduleCount;t++){this.modules[t]=new Array(this.moduleCount);for(var i=0;i<this.moduleCount;i++)this.modules[t][i]=null;}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(o,r),this.typeNumber>=7&&this.setupTypeNumber(o),null==this.dataCache&&(this.dataCache=e.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,r);},setupPositionProbePattern:function(o,e){for(var r=-1;r<=7;r++)if(!(o+r<=-1||this.moduleCount<=o+r))for(var t=-1;t<=7;t++)e+t<=-1||this.moduleCount<=e+t||(this.modules[o+r][e+t]=0<=r&&r<=6&&(0==t||6==t)||0<=t&&t<=6&&(0==r||6==r)||2<=r&&r<=4&&2<=t&&t<=4);},getBestMaskPattern:function(){for(var o=0,e=0,r=0;r<8;r++){this.makeImpl(!0,r);var t=h.getLostPoint(this);(0==r||o>t)&&(o=t,e=r);}return e},createMovieClip:function(o,e,r){var t=o.createEmptyMovieClip(e,r);this.make();for(var i=0;i<this.modules.length;i++)for(var n=1*i,a=0;a<this.modules[i].length;a++){var d=1*a;this.modules[i][a]&&(t.beginFill(0,100),t.moveTo(d,n),t.lineTo(d+1,n),t.lineTo(d+1,n+1),t.lineTo(d,n+1),t.endFill());}return t},setupTimingPattern:function(){for(var o=8;o<this.moduleCount-8;o++)null==this.modules[o][6]&&(this.modules[o][6]=o%2==0);for(var e=8;e<this.moduleCount-8;e++)null==this.modules[6][e]&&(this.modules[6][e]=e%2==0);},setupPositionAdjustPattern:function(){for(var o=h.getPatternPosition(this.typeNumber),e=0;e<o.length;e++)for(var r=0;r<o.length;r++){var t=o[e],i=o[r];if(null==this.modules[t][i])for(var n=-2;n<=2;n++)for(var a=-2;a<=2;a++)this.modules[t+n][i+a]=-2==n||2==n||-2==a||2==a||0==n&&0==a;}},setupTypeNumber:function(o){for(var e=h.getBCHTypeNumber(this.typeNumber),r=0;r<18;r++){var t=!o&&1==(e>>r&1);this.modules[Math.floor(r/3)][r%3+this.moduleCount-8-3]=t;}for(r=0;r<18;r++){t=!o&&1==(e>>r&1);this.modules[r%3+this.moduleCount-8-3][Math.floor(r/3)]=t;}},setupTypeInfo:function(o,e){for(var r=this.errorCorrectLevel<<3|e,t=h.getBCHTypeInfo(r),i=0;i<15;i++){var n=!o&&1==(t>>i&1);i<6?this.modules[i][8]=n:i<8?this.modules[i+1][8]=n:this.modules[this.moduleCount-15+i][8]=n;}for(i=0;i<15;i++){n=!o&&1==(t>>i&1);i<8?this.modules[8][this.moduleCount-i-1]=n:i<9?this.modules[8][15-i-1+1]=n:this.modules[8][15-i-1]=n;}this.modules[this.moduleCount-8][8]=!o;},mapData:function(o,e){for(var r=-1,t=this.moduleCount-1,i=7,n=0,a=this.moduleCount-1;a>0;a-=2)for(6==a&&a--;;){for(var d=0;d<2;d++)if(null==this.modules[t][a-d]){var u=!1;n<o.length&&(u=1==(o[n]>>>i&1)),h.getMask(e,t,a-d)&&(u=!u),this.modules[t][a-d]=u,-1==--i&&(n++,i=7);}if((t+=r)<0||this.moduleCount<=t){t-=r,r=-r;break}}}},e.PAD0=236,e.PAD1=17,e.createData=function(o,r,t){for(var i=v.getRSBlocks(o,r),n=new p,a=0;a<t.length;a++){var d=t[a];n.put(d.mode,4),n.put(d.getLength(),h.getLengthInBits(d.mode,o)),d.write(n);}var u=0;for(a=0;a<i.length;a++)u+=i[a].dataCount;if(n.getLengthInBits()>8*u)throw new Error("code length overflow. ("+n.getLengthInBits()+">"+8*u+")");for(n.getLengthInBits()+4<=8*u&&n.put(0,4);n.getLengthInBits()%8!=0;)n.putBit(!1);for(;!(n.getLengthInBits()>=8*u||(n.put(e.PAD0,8),n.getLengthInBits()>=8*u));)n.put(e.PAD1,8);return e.createBytes(n,i)},e.createBytes=function(o,e){for(var r=0,t=0,i=0,n=new Array(e.length),a=new Array(e.length),d=0;d<e.length;d++){var u=e[d].dataCount,s=e[d].totalCount-u;t=Math.max(t,u),i=Math.max(i,s),n[d]=new Array(u);for(var g=0;g<n[d].length;g++)n[d][g]=255&o.buffer[g+r];r+=u;var l=h.getErrorCorrectPolynomial(s),c=new f(n[d],l.getLength()-1).mod(l);a[d]=new Array(l.getLength()-1);for(g=0;g<a[d].length;g++){var m=g+c.getLength()-a[d].length;a[d][g]=m>=0?c.get(m):0;}}var v=0;for(g=0;g<e.length;g++)v+=e[g].totalCount;var p=new Array(v),C=0;for(g=0;g<t;g++)for(d=0;d<e.length;d++)g<n[d].length&&(p[C++]=n[d][g]);for(g=0;g<i;g++)for(d=0;d<e.length;d++)g<a[d].length&&(p[C++]=a[d][g]);return p};for(var r={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},t={L:1,M:0,Q:3,H:2},i=0,n=1,a=2,d=3,u=4,s=5,g=6,l=7,h={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(o){for(var e=o<<10;h.getBCHDigit(e)-h.getBCHDigit(h.G15)>=0;)e^=h.G15<<h.getBCHDigit(e)-h.getBCHDigit(h.G15);return (o<<10|e)^h.G15_MASK},getBCHTypeNumber:function(o){for(var e=o<<12;h.getBCHDigit(e)-h.getBCHDigit(h.G18)>=0;)e^=h.G18<<h.getBCHDigit(e)-h.getBCHDigit(h.G18);return o<<12|e},getBCHDigit:function(o){for(var e=0;0!=o;)e++,o>>>=1;return e},getPatternPosition:function(o){return h.PATTERN_POSITION_TABLE[o-1]},getMask:function(o,e,r){switch(o){case i:return (e+r)%2==0;case n:return e%2==0;case a:return r%3==0;case d:return (e+r)%3==0;case u:return (Math.floor(e/2)+Math.floor(r/3))%2==0;case s:return e*r%2+e*r%3==0;case g:return (e*r%2+e*r%3)%2==0;case l:return (e*r%3+(e+r)%2)%2==0;default:throw new Error("bad maskPattern:"+o)}},getErrorCorrectPolynomial:function(o){for(var e=new f([1],0),r=0;r<o;r++)e=e.multiply(new f([1,c.gexp(r)],0));return e},getLengthInBits:function(o,e){if(1<=e&&e<10)switch(o){case r.MODE_NUMBER:return 10;case r.MODE_ALPHA_NUM:return 9;case r.MODE_8BIT_BYTE:case r.MODE_KANJI:return 8;default:throw new Error("mode:"+o)}else if(e<27)switch(o){case r.MODE_NUMBER:return 12;case r.MODE_ALPHA_NUM:return 11;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 10;default:throw new Error("mode:"+o)}else {if(!(e<41))throw new Error("type:"+e);switch(o){case r.MODE_NUMBER:return 14;case r.MODE_ALPHA_NUM:return 13;case r.MODE_8BIT_BYTE:return 16;case r.MODE_KANJI:return 12;default:throw new Error("mode:"+o)}}},getLostPoint:function(o){for(var e=o.getModuleCount(),r=0,t=0;t<e;t++)for(var i=0;i<e;i++){for(var n=0,a=o.isDark(t,i),d=-1;d<=1;d++)if(!(t+d<0||e<=t+d))for(var u=-1;u<=1;u++)i+u<0||e<=i+u||0==d&&0==u||a==o.isDark(t+d,i+u)&&n++;n>5&&(r+=3+n-5);}for(t=0;t<e-1;t++)for(i=0;i<e-1;i++){var s=0;o.isDark(t,i)&&s++,o.isDark(t+1,i)&&s++,o.isDark(t,i+1)&&s++,o.isDark(t+1,i+1)&&s++,0!=s&&4!=s||(r+=3);}for(t=0;t<e;t++)for(i=0;i<e-6;i++)o.isDark(t,i)&&!o.isDark(t,i+1)&&o.isDark(t,i+2)&&o.isDark(t,i+3)&&o.isDark(t,i+4)&&!o.isDark(t,i+5)&&o.isDark(t,i+6)&&(r+=40);for(i=0;i<e;i++)for(t=0;t<e-6;t++)o.isDark(t,i)&&!o.isDark(t+1,i)&&o.isDark(t+2,i)&&o.isDark(t+3,i)&&o.isDark(t+4,i)&&!o.isDark(t+5,i)&&o.isDark(t+6,i)&&(r+=40);var g=0;for(i=0;i<e;i++)for(t=0;t<e;t++)o.isDark(t,i)&&g++;return r+=10*(Math.abs(100*g/e/e-50)/5)}},c={glog:function(o){if(o<1)throw new Error("glog("+o+")");return c.LOG_TABLE[o]},gexp:function(o){for(;o<0;)o+=255;for(;o>=256;)o-=255;return c.EXP_TABLE[o]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},m=0;m<8;m++)c.EXP_TABLE[m]=1<<m;for(m=8;m<256;m++)c.EXP_TABLE[m]=c.EXP_TABLE[m-4]^c.EXP_TABLE[m-5]^c.EXP_TABLE[m-6]^c.EXP_TABLE[m-8];for(m=0;m<255;m++)c.LOG_TABLE[c.EXP_TABLE[m]]=m;function f(o,e){if(null==o.length)throw new Error(o.length+"/"+e);for(var r=0;r<o.length&&0==o[r];)r++;this.num=new Array(o.length-r+e);for(var t=0;t<o.length-r;t++)this.num[t]=o[t+r];}function v(o,e){this.totalCount=o,this.dataCount=e;}function p(){this.buffer=new Array,this.length=0;}function C(o){return o.setFillStyle=o.setFillStyle||function(e){o.fillStyle=e;},o.setFontSize=o.setFontSize||function(e){o.font=`${e}px`;},o.setTextAlign=o.setTextAlign||function(e){o.textAlign=e;},o.setTextBaseline=o.setTextBaseline||function(e){o.textBaseline=e;},o.setGlobalAlpha=o.setGlobalAlpha||function(e){o.globalAlpha=e;},o.setStrokeStyle=o.setStrokeStyle||function(e){o.strokeStyle=e;},o.setShadow=o.setShadow||function(e,r,t,i){o.shadowOffsetX=e,o.shadowOffsetY=r,o.shadowBlur=t,o.shadowColor=i;},o.draw=o.draw||function(o,e){e&&e();},o}function b(o,e){var r=this.data="";this.dataEncode=!0;var t=this.size=200;this.useDynamicSize=!1,this.dynamicSize=t;var i=this.typeNumber=-1;this.errorCorrectLevel=b.errorCorrectLevel.H;var n=this.margin=0;this.areaColor="#FFFFFF",this.backgroundColor="rgba(255,255,255,0)",this.backgroundImageSrc=void 0;var a=this.backgroundImageWidth=void 0,d=this.backgroundImageHeight=void 0,u=this.backgroundImageX=void 0,s=this.backgroundImageY=void 0;this.backgroundImageAlpha=1,this.backgroundImageBorderRadius=0;var g=this.backgroundPadding=0;this.foregroundColor="#000000",this.foregroundImageSrc=void 0;var l=this.foregroundImageWidth=void 0,h=this.foregroundImageHeight=void 0,c=this.foregroundImageX=void 0,m=this.foregroundImageY=void 0,f=this.foregroundImagePadding=0;this.foregroundImageBackgroundColor="#FFFFFF";var v=this.foregroundImageBorderRadius=0,p=this.foregroundImageShadowOffsetX=0,k=this.foregroundImageShadowOffsetY=0,y=this.foregroundImageShadowBlur=0;this.foregroundImageShadowColor="#808080";var w=this.foregroundPadding=0,I=this.positionProbeBackgroundColor=void 0,B=this.positionProbeForegroundColor=void 0,S=this.separatorColor=void 0,P=this.positionAdjustBackgroundColor=void 0,E=this.positionAdjustForegroundColor=void 0,L=this.timingBackgroundColor=void 0,D=this.timingForegroundColor=void 0,A=this.typeNumberBackgroundColor=void 0,T=this.typeNumberForegroundColor=void 0,N=this.darkBlockColor=void 0;this.base=void 0,this.modules=[],this.moduleCount=0,this.drawModules=[];var M=this.canvasContext=void 0;this.loadImage,this.drawReserve=!1,this.isMaked=!1,Object.defineProperties(this,{data:{get(){if(""===r||void 0===r)throw console.error("[uQRCode]: data must be set!"),new b.Error("data must be set!");return r},set(o){r=String(o);}},size:{get:()=>t,set(o){t=Number(o);}},typeNumber:{get:()=>i,set(o){i=Number(o);}},margin:{get:()=>n,set(o){n=Number(o);}},backgroundImageWidth:{get(){return void 0===a?this.dynamicSize:this.useDynamicSize?this.dynamicSize/this.size*a:a},set(o){a=Number(o);}},backgroundImageHeight:{get(){return void 0===d?this.dynamicSize:this.useDynamicSize?this.dynamicSize/this.size*d:d},set(o){d=Number(o);}},backgroundImageX:{get(){return void 0===u?0:this.useDynamicSize?this.dynamicSize/this.size*u:u},set(o){u=Number(o);}},backgroundImageY:{get(){return void 0===s?0:this.useDynamicSize?this.dynamicSize/this.size*s:s},set(o){s=Number(o);}},backgroundPadding:{get:()=>g,set(o){g=o>1?1:o<0?0:o;}},foregroundImageWidth:{get(){return void 0===l?(this.dynamicSize-2*this.margin)/4:this.useDynamicSize?this.dynamicSize/this.size*l:l},set(o){l=Number(o);}},foregroundImageHeight:{get(){return void 0===h?(this.dynamicSize-2*this.margin)/4:this.useDynamicSize?this.dynamicSize/this.size*h:h},set(o){h=Number(o);}},foregroundImageX:{get(){return void 0===c?this.dynamicSize/2-this.foregroundImageWidth/2:this.useDynamicSize?this.dynamicSize/this.size*c:c},set(o){c=Number(o);}},foregroundImageY:{get(){return void 0===m?this.dynamicSize/2-this.foregroundImageHeight/2:this.useDynamicSize?this.dynamicSize/this.size*m:m},set(o){m=Number(o);}},foregroundImagePadding:{get(){return this.useDynamicSize?this.dynamicSize/this.size*f:f},set(o){f=Number(o);}},foregroundImageBorderRadius:{get(){return this.useDynamicSize?this.dynamicSize/this.size*v:v},set(o){v=Number(o);}},foregroundImageShadowOffsetX:{get(){return this.useDynamicSize?this.dynamicSize/this.size*p:p},set(o){p=Number(o);}},foregroundImageShadowOffsetY:{get(){return this.useDynamicSize?this.dynamicSize/this.size*k:k},set(o){k=Number(o);}},foregroundImageShadowBlur:{get(){return this.useDynamicSize?this.dynamicSize/this.size*y:y},set(o){y=Number(o);}},foregroundPadding:{get:()=>w,set(o){w=o>1?1:o<0?0:o;}},positionProbeBackgroundColor:{get(){return I||this.backgroundColor},set(o){I=o;}},positionProbeForegroundColor:{get(){return B||this.foregroundColor},set(o){B=o;}},separatorColor:{get(){return S||this.backgroundColor},set(o){S=o;}},positionAdjustBackgroundColor:{get(){return P||this.backgroundColor},set(o){P=o;}},positionAdjustForegroundColor:{get(){return E||this.foregroundColor},set(o){E=o;}},timingBackgroundColor:{get(){return L||this.backgroundColor},set(o){L=o;}},timingForegroundColor:{get(){return D||this.foregroundColor},set(o){D=o;}},typeNumberBackgroundColor:{get(){return A||this.backgroundColor},set(o){A=o;}},typeNumberForegroundColor:{get(){return T||this.foregroundColor},set(o){T=o;}},darkBlockColor:{get(){return N||this.foregroundColor},set(o){N=o;}},canvasContext:{get(){if(void 0===M)throw console.error("[uQRCode]: use drawCanvas, you need to set the canvasContext!"),new b.Error("use drawCanvas, you need to set the canvasContext!");return M},set(o){M=C(o);}}}),b.plugins.forEach((o=>o(b,this,!1))),o&&this.setOptions(o),e&&(this.canvasContext=C(e));}f.prototype={get:function(o){return this.num[o]},getLength:function(){return this.num.length},multiply:function(o){for(var e=new Array(this.getLength()+o.getLength()-1),r=0;r<this.getLength();r++)for(var t=0;t<o.getLength();t++)e[r+t]^=c.gexp(c.glog(this.get(r))+c.glog(o.get(t)));return new f(e,0)},mod:function(o){if(this.getLength()-o.getLength()<0)return this;for(var e=c.glog(this.get(0))-c.glog(o.get(0)),r=new Array(this.getLength()),t=0;t<this.getLength();t++)r[t]=this.get(t);for(t=0;t<o.getLength();t++)r[t]^=c.gexp(c.glog(o.get(t))+e);return new f(r,0).mod(o)}},v.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],v.getRSBlocks=function(o,e){var r=v.getRsBlockTable(o,e);if(null==r)throw new Error("bad rs block @ typeNumber:"+o+"/errorCorrectLevel:"+e);for(var t=r.length/3,i=new Array,n=0;n<t;n++)for(var a=r[3*n+0],d=r[3*n+1],u=r[3*n+2],s=0;s<a;s++)i.push(new v(d,u));return i},v.getRsBlockTable=function(o,e){switch(e){case t.L:return v.RS_BLOCK_TABLE[4*(o-1)+0];case t.M:return v.RS_BLOCK_TABLE[4*(o-1)+1];case t.Q:return v.RS_BLOCK_TABLE[4*(o-1)+2];case t.H:return v.RS_BLOCK_TABLE[4*(o-1)+3];default:return}},p.prototype={get:function(o){var e=Math.floor(o/8);return 1==(this.buffer[e]>>>7-o%8&1)},put:function(o,e){for(var r=0;r<e;r++)this.putBit(1==(o>>>e-r-1&1));},getLengthInBits:function(){return this.length},putBit:function(o){var e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),o&&(this.buffer[e]|=128>>>this.length%8),this.length++;}},e.errorCorrectLevel=t,b.errorCorrectLevel=e.errorCorrectLevel,b.Error=function(o){this.errMsg="[uQRCode]: "+o;},b.plugins=[],b.use=function(o){"function"==typeof o&&b.plugins.push(o);},b.prototype.loadImage=function(o){return Promise.resolve(o)},b.prototype.setOptions=function(o){var e,r,t,i,n,a,d,u,s,g,l,h,c,m,f,v,p,C,b,k,y,w,I,B,S,P,E,L,D,A,T,N,M,z,_,O,R,F,x,H,X,Y,j,W,G,K,Q,U,$,J,q,V,Z,oo,eo,ro;o&&(Object.keys(o).forEach((e=>{this[e]=o[e];})),function(o={},e={},r=!1){let t;for(var i in t=r?o:{...o},e){var n=e[i];null!=n&&(n.constructor==Object?t[i]=this.deepReplace(t[i],n):n.constructor!=String||n?t[i]=n:t[i]=t[i]);}}(this,{data:o.data||o.text,dataEncode:o.dataEncode,size:o.size,useDynamicSize:o.useDynamicSize,typeNumber:o.typeNumber,errorCorrectLevel:o.errorCorrectLevel,margin:o.margin,areaColor:o.areaColor,backgroundColor:o.backgroundColor||(null===(e=o.background)||void 0===e?void 0:e.color),backgroundImageSrc:o.backgroundImageSrc||(null===(r=o.background)||void 0===r||null===(t=r.image)||void 0===t?void 0:t.src),backgroundImageWidth:o.backgroundImageWidth||(null===(i=o.background)||void 0===i||null===(n=i.image)||void 0===n?void 0:n.width),backgroundImageHeight:o.backgroundImageHeight||(null===(a=o.background)||void 0===a||null===(d=a.image)||void 0===d?void 0:d.height),backgroundImageX:o.backgroundImageX||(null===(u=o.background)||void 0===u||null===(s=u.image)||void 0===s?void 0:s.x),backgroundImageY:o.backgroundImageY||(null===(g=o.background)||void 0===g||null===(l=g.image)||void 0===l?void 0:l.y),backgroundImageAlpha:o.backgroundImageAlpha||(null===(h=o.background)||void 0===h||null===(c=h.image)||void 0===c?void 0:c.alpha),backgroundImageBorderRadius:o.backgroundImageBorderRadius||(null===(m=o.background)||void 0===m||null===(f=m.image)||void 0===f?void 0:f.borderRadius),backgroundPadding:o.backgroundPadding,foregroundColor:o.foregroundColor||(null===(v=o.foreground)||void 0===v?void 0:v.color),foregroundImageSrc:o.foregroundImageSrc||(null===(p=o.foreground)||void 0===p||null===(C=p.image)||void 0===C?void 0:C.src),foregroundImageWidth:o.foregroundImageWidth||(null===(b=o.foreground)||void 0===b||null===(k=b.image)||void 0===k?void 0:k.width),foregroundImageHeight:o.foregroundImageHeight||(null===(y=o.foreground)||void 0===y||null===(w=y.image)||void 0===w?void 0:w.height),foregroundImageX:o.foregroundImageX||(null===(I=o.foreground)||void 0===I||null===(B=I.image)||void 0===B?void 0:B.x),foregroundImageY:o.foregroundImageY||(null===(S=o.foreground)||void 0===S||null===(P=S.image)||void 0===P?void 0:P.y),foregroundImagePadding:o.foregroundImagePadding||(null===(E=o.foreground)||void 0===E||null===(L=E.image)||void 0===L?void 0:L.padding),foregroundImageBackgroundColor:o.foregroundImageBackgroundColor||(null===(D=o.foreground)||void 0===D||null===(A=D.image)||void 0===A?void 0:A.backgroundColor),foregroundImageBorderRadius:o.foregroundImageBorderRadius||(null===(T=o.foreground)||void 0===T||null===(N=T.image)||void 0===N?void 0:N.borderRadius),foregroundImageShadowOffsetX:o.foregroundImageShadowOffsetX||(null===(M=o.foreground)||void 0===M||null===(z=M.image)||void 0===z?void 0:z.shadowOffsetX),foregroundImageShadowOffsetY:o.foregroundImageShadowOffsetY||(null===(_=o.foreground)||void 0===_||null===(O=_.image)||void 0===O?void 0:O.shadowOffsetY),foregroundImageShadowBlur:o.foregroundImageShadowBlur||(null===(R=o.foreground)||void 0===R||null===(F=R.image)||void 0===F?void 0:F.shadowBlur),foregroundImageShadowColor:o.foregroundImageShadowColor||(null===(x=o.foreground)||void 0===x||null===(H=x.image)||void 0===H?void 0:H.shadowColor),foregroundPadding:o.foregroundPadding,positionProbeBackgroundColor:o.positionProbeBackgroundColor||(null===(X=o.positionProbe)||void 0===X?void 0:X.backgroundColor)||(null===(Y=o.positionDetection)||void 0===Y?void 0:Y.backgroundColor),positionProbeForegroundColor:o.positionProbeForegroundColor||(null===(j=o.positionProbe)||void 0===j?void 0:j.foregroundColor)||(null===(W=o.positionDetection)||void 0===W?void 0:W.foregroundColor),separatorColor:o.separatorColor||(null===(G=o.separator)||void 0===G?void 0:G.color),positionAdjustBackgroundColor:o.positionAdjustBackgroundColor||(null===(K=o.positionAdjust)||void 0===K?void 0:K.backgroundColor)||(null===(Q=o.alignment)||void 0===Q?void 0:Q.backgroundColor),positionAdjustForegroundColor:o.positionAdjustForegroundColor||(null===(U=o.positionAdjust)||void 0===U?void 0:U.foregroundColor)||(null===($=o.alignment)||void 0===$?void 0:$.foregroundColor),timingBackgroundColor:o.timingBackgroundColor||(null===(J=o.timing)||void 0===J?void 0:J.backgroundColor),timingForegroundColor:o.timingForegroundColor||(null===(q=o.timing)||void 0===q?void 0:q.foregroundColor),typeNumberBackgroundColor:o.typeNumberBackgroundColor||(null===(V=o.typeNumber)||void 0===V?void 0:V.backgroundColor)||(null===(Z=o.versionInformation)||void 0===Z?void 0:Z.backgroundColor),typeNumberForegroundColor:o.typeNumberForegroundColor||(null===(oo=o.typeNumber)||void 0===oo?void 0:oo.foregroundColor)||(null===(eo=o.versionInformation)||void 0===eo?void 0:eo.foregroundColor),darkBlockColor:o.darkBlockColor||(null===(ro=o.darkBlock)||void 0===ro?void 0:ro.color)},!0));},b.prototype.make=function(){let{foregroundColor:o,backgroundColor:r,typeNumber:t,errorCorrectLevel:i,data:n,dataEncode:a,size:d,margin:u,useDynamicSize:s}=this;if(o===r)throw console.error("[uQRCode]: foregroundColor and backgroundColor cannot be the same!"),new b.Error("foregroundColor and backgroundColor cannot be the same!");a&&(n=function(o){o=o.toString();for(var e,r="",t=0;t<o.length;t++)(e=o.charCodeAt(t))>=1&&e<=127?r+=o.charAt(t):e>2047?(r+=String.fromCharCode(224|e>>12&15),r+=String.fromCharCode(128|e>>6&63),r+=String.fromCharCode(128|e>>0&63)):(r+=String.fromCharCode(192|e>>6&31),r+=String.fromCharCode(128|e>>0&63));return r}(n));var g=new e(t,i);g.addData(n),g.make(),this.base=g,this.typeNumber=g.typeNumber,this.modules=g.modules,this.moduleCount=g.moduleCount,this.dynamicSize=s?Math.ceil((d-2*u)/g.moduleCount)*g.moduleCount+2*u:d,function(o){let{dynamicSize:e,margin:r,backgroundColor:t,backgroundPadding:i,foregroundColor:n,foregroundPadding:a,modules:d,moduleCount:u}=o;var s=(e-2*r)/u,g=s,l=0;i>0&&(g-=2*(l=g*i/2));var h=s,c=0;a>0&&(h-=2*(c=h*a/2));for(var m=0;m<u;m++)for(var f=0;f<u;f++){var v=f*s+r,p=m*s+r;if(d[m][f]){var C=c,b=v+c,k=p+c,y=h,w=h;d[m][f]={type:["foreground"],color:n,isBlack:!0,isDrawn:!1,destX:v,destY:p,destWidth:s,destHeight:s,x:b,y:k,width:y,height:w,paddingTop:C,paddingRight:C,paddingBottom:C,paddingLeft:C};}else C=l,b=v+l,k=p+l,y=g,w=g,d[m][f]={type:["background"],color:t,isBlack:!1,isDrawn:!1,destX:v,destY:p,destWidth:s,destHeight:s,x:b,y:k,width:y,height:w,paddingTop:C,paddingRight:C,paddingBottom:C,paddingLeft:C};}}(this),function(o){let{modules:e,moduleCount:r,positionProbeBackgroundColor:t,positionProbeForegroundColor:i}=o;var n=r-7;[[0,0,1],[1,0,1],[2,0,1],[3,0,1],[4,0,1],[5,0,1],[6,0,1],[0,1,1],[1,1,0],[2,1,0],[3,1,0],[4,1,0],[5,1,0],[6,1,1],[0,2,1],[1,2,0],[2,2,1],[3,2,1],[4,2,1],[5,2,0],[6,2,1],[0,3,1],[1,3,0],[2,3,1],[3,3,1],[4,3,1],[5,3,0],[6,3,1],[0,4,1],[1,4,0],[2,4,1],[3,4,1],[4,4,1],[5,4,0],[6,4,1],[0,5,1],[1,5,0],[2,5,0],[3,5,0],[4,5,0],[5,5,0],[6,5,1],[0,6,1],[1,6,1],[2,6,1],[3,6,1],[4,6,1],[5,6,1],[6,6,1]].forEach((o=>{var r=e[o[0]][o[1]],a=e[o[0]+n][o[1]],d=e[o[0]][o[1]+n];d.type.push("positionProbe"),a.type.push("positionProbe"),r.type.push("positionProbe"),r.color=1==o[2]?i:t,a.color=1==o[2]?i:t,d.color=1==o[2]?i:t;}));}(this),function(o){let{modules:e,moduleCount:r,separatorColor:t}=o;[[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]].forEach((o=>{var i=e[o[0]][o[1]],n=e[r-o[0]-1][o[1]],a=e[o[0]][r-o[1]-1];a.type.push("separator"),n.type.push("separator"),i.type.push("separator"),i.color=t,n.color=t,a.color=t;}));}(this),function(o){let{typeNumber:e,modules:r,moduleCount:t,foregroundColor:i,backgroundColor:n,positionAdjustForegroundColor:a,positionAdjustBackgroundColor:d,timingForegroundColor:u,timingBackgroundColor:s}=o;var g=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]][e-1];if(g)for(var l=[[-2,-2,1],[-1,-2,1],[0,-2,1],[1,-2,1],[2,-2,1],[-2,-1,1],[-1,-1,0],[0,-1,0],[1,-1,0],[2,-1,1],[-2,0,1],[-1,0,0],[0,0,1],[1,0,0],[2,0,1],[-2,1,1],[-1,1,0],[0,1,0],[1,1,0],[2,1,1],[-2,2,1],[-1,2,1],[0,2,1],[1,2,1],[2,2,1]],h=g.length,c=0;c<h;c++)for(var m=0;m<h;m++){var{x:f,y:v}={x:g[c],y:g[m]};f<9&&v<9||f>t-9-1&&v<9||v>t-9-1&&f<9||l.forEach((o=>{var e=r[f+o[0]][v+o[1]];e.type.push("positionAdjust"),e.type.includes("timing")?1==o[2]?e.color=a==i?u:a:e.color=a==i&&d==n?s:d:e.color=1==o[2]?a:d;}));}}(this),function(o){let{modules:e,moduleCount:r,timingForegroundColor:t,timingBackgroundColor:i}=o;for(var n=r-16,a=0;a<n;a++){var d=e[6][8+a],u=e[8+a][6];d.type.push("timing"),u.type.push("timing"),d.color=1&a^1?t:i,u.color=1&a^1?t:i;}}(this),function(o){let{modules:e,moduleCount:r,darkBlockColor:t}=o;var i=e[r-7-1][8];i.type.push("darkBlock"),i.color=t;}(this),function(o){let{typeNumber:e,modules:r,moduleCount:t,typeNumberBackgroundColor:i,typeNumberForegroundColor:n}=o;if(e<7)return r;var a=[0,0,0,0,0,0,0,"000111110010010100","001000010110111100","001001101010011001","001010010011010011","001011101111110110","001100011101100010","001101100001000111","001110011000001101","001111100100101000","010000101101111000","010001010001011101","010010101000010111","010011010100110010","010100100110100110","010101011010000011","010110100011001001","010111011111101100","011000111011000100","011001000111100001","011010111110101011","011011000010001110","011100110000011010","011101001100111111","011110110101110101","011111001001010000","100000100111010101","100001011011110000","100010100010111010","100011011110011111","100100101100001011","100101010000101110","100110101001100100","100111010101000001","101000110001101001"],d=a[e]+a[e],u=[t-11,t-10,t-9];[[5,u[2]],[5,u[1]],[5,u[0]],[4,u[2]],[4,u[1]],[4,u[0]],[3,u[2]],[3,u[1]],[3,u[0]],[2,u[2]],[2,u[1]],[2,u[0]],[1,u[2]],[1,u[1]],[1,u[0]],[0,u[2]],[0,u[1]],[0,u[0]],[u[2],5],[u[1],5],[u[0],5],[u[2],4],[u[1],4],[u[0],4],[u[2],3],[u[1],3],[u[0],3],[u[2],2],[u[1],2],[u[0],2],[u[2],1],[u[1],1],[u[0],1],[u[2],0],[u[1],0],[u[0],0]].forEach(((o,e)=>{var t=r[o[0]][o[1]];t.type.push("typeNumber"),t.color="1"==d[e]?n:i;}));}(this),this.isMaked=!0,this.drawModules=[];},b.prototype.getDrawModules=function(){if(this.drawModules&&this.drawModules.length>0)return this.drawModules;let o=this.drawModules=[],{modules:e,moduleCount:r,dynamicSize:t,areaColor:i,backgroundImageSrc:n,backgroundImageX:a,backgroundImageY:d,backgroundImageWidth:u,backgroundImageHeight:s,backgroundImageAlpha:g,backgroundImageBorderRadius:l,foregroundImageSrc:h,foregroundImageX:c,foregroundImageY:m,foregroundImageWidth:f,foregroundImageHeight:v,foregroundImagePadding:p,foregroundImageBackgroundColor:C,foregroundImageBorderRadius:b,foregroundImageShadowOffsetX:k,foregroundImageShadowOffsetY:y,foregroundImageShadowBlur:w,foregroundImageShadowColor:I}=this;i&&o.push({name:"area",type:"area",color:i,x:0,y:0,width:t,height:t}),n&&o.push({name:"backgroundImage",type:"image",imageSrc:n,mappingName:"backgroundImageSrc",x:a,y:d,width:u,height:s,alpha:g,borderRadius:l});for(var B=0;B<r;B++)for(var S=0;S<r;S++){var P=e[B][S];P.isDrawn||(P.type.includes("foreground")?o.push({name:"foreground",type:"tile",color:P.color,destX:P.destX,destY:P.destY,destWidth:P.destWidth,destHeight:P.destHeight,x:P.x,y:P.y,width:P.width,height:P.height,paddingTop:P.paddingTop,paddingRight:P.paddingRight,paddingBottom:P.paddingBottom,paddingLeft:P.paddingLeft,rowIndex:B,colIndex:S}):o.push({name:"background",type:"tile",color:P.color,destX:P.destX,destY:P.destY,destWidth:P.destWidth,destHeight:P.destHeight,x:P.x,y:P.y,width:P.width,height:P.height,paddingTop:P.paddingTop,paddingRight:P.paddingRight,paddingBottom:P.paddingBottom,paddingLeft:P.paddingLeft,rowIndex:B,colIndex:S}),P.isDrawn=!0);}return h&&o.push({name:"foregroundImage",type:"image",imageSrc:h,mappingName:"foregroundImageSrc",x:c,y:m,width:f,height:v,padding:p,backgroundColor:C,borderRadius:b,shadowOffsetX:k,shadowOffsetY:y,shadowBlur:w,shadowColor:I}),o},b.prototype.isBlack=function(o,e){var r=this.moduleCount;return !(0>o||0>e||o>=r||e>=r)&&this.modules[o][e].isBlack},b.prototype.drawCanvas=function(o){let{isMaked:e,canvasContext:r,useDynamicSize:t,dynamicSize:i,foregroundColor:n,foregroundPadding:a,backgroundColor:d,backgroundPadding:u,drawReserve:s,margin:g}=this;if(!e)return console.error("[uQRCode]: please execute the make method first!"),Promise.reject(new b.Error("please execute the make method first!"));let l=this.getDrawModules(),h=async(e,t)=>{try{r.draw(o);for(var i=0;i<l.length;i++){var n=l[i];switch(r.save(),n.type){case"area":r.setFillStyle(n.color),r.fillRect(n.x,n.y,n.width,n.height);break;case"tile":var a=n.x,d=n.y,u=n.width,g=n.height;r.setFillStyle(n.color),r.fillRect(a,d,u,g);break;case"image":if("backgroundImage"===n.name){a=Math.round(n.x),d=Math.round(n.y),u=Math.round(n.width),g=Math.round(n.height);u<2*(c=Math.round(n.borderRadius))&&(c=u/2),g<2*c&&(c=g/2),r.setGlobalAlpha(n.alpha),c>0&&(r.beginPath(),r.moveTo(a+c,d),r.arcTo(a+u,d,a+u,d+g,c),r.arcTo(a+u,d+g,a,d+g,c),r.arcTo(a,d+g,a,d,c),r.arcTo(a,d,a+u,d,c),r.closePath(),r.setStrokeStyle("rgba(0,0,0,0)"),r.stroke(),r.clip());try{var h=await this.loadImage(n.imageSrc);r.drawImage(h,a,d,u,g);}catch(o){throw console.error(`[uQRCode]: ${n.mappingName} invalid!`),new b.Error(`${n.mappingName} invalid!`)}}else if("foregroundImage"===n.name){a=Math.round(n.x),d=Math.round(n.y),u=Math.round(n.width),g=Math.round(n.height);var c,m=Math.round(n.padding);u<2*(c=Math.round(n.borderRadius))&&(c=u/2),g<2*c&&(c=g/2);var f=a-m,v=d-m,p=u+2*m,C=g+2*m,k=Math.round(p/u*c);p<2*k&&(k=p/2),C<2*k&&(k=C/2),r.save(),r.setShadow(n.shadowOffsetX,n.shadowOffsetY,n.shadowBlur,n.shadowColor),k>0?(r.beginPath(),r.moveTo(f+k,v),r.arcTo(f+p,v,f+p,v+C,k),r.arcTo(f+p,v+C,f,v+C,k),r.arcTo(f,v+C,f,v,k),r.arcTo(f,v,f+p,v,k),r.closePath(),r.setFillStyle(n.backgroundColor),r.fill()):(r.setFillStyle(n.backgroundColor),r.fillRect(f,v,p,C)),r.restore(),r.save(),k>0?(r.beginPath(),r.moveTo(f+k,v),r.arcTo(f+p,v,f+p,v+C,k),r.arcTo(f+p,v+C,f,v+C,k),r.arcTo(f,v+C,f,v,k),r.arcTo(f,v,f+p,v,k),r.closePath(),r.setFillStyle(m>0?n.backgroundColor:"rgba(0,0,0,0)"),r.fill()):(r.setFillStyle(m>0?n.backgroundColor:"rgba(0,0,0,0)"),r.fillRect(f,v,p,C)),r.restore(),c>0&&(r.beginPath(),r.moveTo(a+c,d),r.arcTo(a+u,d,a+u,d+g,c),r.arcTo(a+u,d+g,a,d+g,c),r.arcTo(a,d+g,a,d,c),r.arcTo(a,d,a+u,d,c),r.closePath(),r.setStrokeStyle("rgba(0,0,0,0)"),r.stroke(),r.clip());try{h=await this.loadImage(n.imageSrc);r.drawImage(h,a,d,u,g);}catch(o){throw console.error(`[uQRCode]: ${n.mappingName} invalid!`),new b.Error(`${n.mappingName} invalid!`)}}}s&&r.draw(!0),r.restore();}r.draw(!0),setTimeout(e,150);}catch(o){t(o);}};return new Promise(((o,e)=>{h(o,e);}))},b.prototype.draw=function(o){return this.drawCanvas(o)},b.prototype.register=function(o){o&&o(b,this,!0);};export{b as default};