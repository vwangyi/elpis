const { name } = require('./package');

/* config-overrides.js */
module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.output.library = `${name}-[name]`;
  config.output.libraryTarget = 'umd';
  // config.output.jsonpFunction = `webpackJsonp_${name}`;
  config.output.globalObject = 'window';

  return config;
};
