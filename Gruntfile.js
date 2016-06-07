
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    bump: require('./config/grunt-bump'),
    jscs: require('./config/grunt-jscs'),
    jsdoc: require('./config/grunt-jsdoc'),
    karma: require('./config/grunt-karma'),
    mochaTest: require('./config/grunt-mocha-test'),
    watch: require('./config/grunt-watch'),
  });

  grunt.registerTask('default', ['jscs', 'mochaTest', 'karma']);
  grunt.registerTask('test', ['watch']);
  grunt.registerTask('test:single', ['mochaTest', 'karma']);

};
