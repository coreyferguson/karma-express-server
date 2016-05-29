
module.exports = {
  dev: {
    files: ['src/**/*.js', 'test/**/*.js'],
    tasks: ['jscs', 'mochaTest'],
    options: {
      atBegin: true
    }
  }
};
