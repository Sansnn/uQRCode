import defaultConfig from './rollup.default.config.js';
import bannerConfig from './rollup.banner.config.js';
import copyConfig from './rollup.copy.config.js';

export default commandLineArgs => {
  if (commandLineArgs.configBanner === true) {
    return bannerConfig;
  } else if (commandLineArgs.configCopy === true) {
    return copyConfig;
  }
  return defaultConfig;
}
