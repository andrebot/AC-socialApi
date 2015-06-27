module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      uiLib: {
        files: [
          {expand: true, flatten: true, src: ['node_modules/jquery/dist/*.min.*'], dest: 'expressServer/public/lib'},
          {expand: true, flatten: true, src: ['node_modules/jquery.cookie/jquery.cookie.js'], dest: 'expressServer/public/lib'}
        ]
      }
    },
    nodemon: {
      express: {
        script: 'index.js',
        options: {
          watch: ['expressServer/'],
          cwd: 'expressServer/src'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('serverExpress', ['copy', 'nodemon:express']);
};