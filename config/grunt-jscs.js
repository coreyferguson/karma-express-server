
module.exports = {
  dev: {
    src: [
      'src/**/*.js',
      'test/**/*.js',
      'config/**/*.js'
    ]
  },
  options: {
    config: '.jscsrc',
    esnext: true,
    verbose: true
  }
};
