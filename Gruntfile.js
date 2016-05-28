
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jscs: require('./config/grunt-jscs'),
    watch: require('./config/grunt-watch'),
    mochaTest: require('./config/grunt-mocha-test'),
    bump: require('./config/grunt-bump'),
    jsdoc: require('./config/grunt-jsdoc')
  });

  grunt.registerTask('default', ['jscs', 'mochaTest']);
  grunt.registerTask('test', ['mochaTest', 'watch']);
  grunt.registerTask('test:single', ['mochaTest']);

};
