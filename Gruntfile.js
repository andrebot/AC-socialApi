module.exports = function(grunt) {
  grunt.initConfig({
    nodemon: {
      express: {
        script: 'expressServer/index.js',
        options: {
          watch: ['expressServer/']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('serverExpress', ['nodemon:express']);
};