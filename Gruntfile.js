module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      uiLib: {
        files: [
          {expand: true, flatten: true, src: ['node_modules/jquery/dist/*.min.*'], dest: 'expressServer/public/lib/js'},
          {expand: true, flatten: true, src: ['node_modules/jquery.cookie/jquery.cookie.js'], dest: 'expressServer/public/lib/js'},
          {expand: true, flatten: true, src: ['node_modules/bootstrap/dist/js/bootstrap.min.js'], dest: 'expressServer/public/lib/js'},
          {expand: true, flatten: true, src: ['node_modules/bootstrap/dist/fonts/*'], dest: 'expressServer/public/lib/fonts/'},
          {expand: true, flatten: true, src: ['node_modules/bootstrap/dist/css/*.min.css'], dest: 'expressServer/public/lib/css/'}
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
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'blanketWrapper'
        },
        src: ['expressServer/tests/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['expressServer/tests/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('serverExpress', ['copy', 'nodemon:express']);
  grunt.registerTask('testExpressServer', ['mochaTest']);
};