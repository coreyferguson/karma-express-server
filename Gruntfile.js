
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jscs: require('./config/grunt-jscs'),
    watch: require('./config/grunt-watch'),
    mochaTest: require('./config/grunt-mocha-test')
  });

  grunt.registerTask('default', ['jscs', 'mochaTest']);

};
