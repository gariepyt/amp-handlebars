'use strict';

module.exports = function ( grunt ) {

	// Load grunt tasks automatically
	require( 'load-grunt-tasks' )( grunt );

	// Time how long tasks take. Can help when optimizing build times
	require( 'time-grunt' )( grunt );

	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-watch');
	

	grunt.initConfig({
		watch: {
			options: {
				livereload: true
			},
			express: {
				files:  [ '**/*.js' ],
				tasks:  [ 'express:dev' ],
				options: {
					spawn: false
				}
			},
			public: {
				files: ['public/**/*.css', 'public/**/*.js']
			},
			handlebars: {
				files: ['views/**/*.handlebars']
			}
		},
		express: {
			options: {
			  // Override defaults here
			},
			dev: {
			  options: {
			    script: 'server.js'
			  }
			},
			prod: {
			  options: {
			    script: 'server.js',
			    node_env: 'production'
			  }
			},
			test: {
			  options: {
			    script: 'server.js'
			  }
			}
		},
		open : {
			dev : {
				path: 'http://localhost:3000',
				app: 'Google Chrome'
			},
			build : {
				path: 'http://localhost:3000',
				app: 'Google Chrome'
			},
			file : {
				path : '/etc/hosts'
			},
			custom: {
				path : function () {
				  return grunt.option('path');
				} 
			}
		}
	});

	grunt.registerTask('serve', 'Start a Node Express Handlebars web server', [
		'express:dev',
		'open:dev',
		'watch'
	]);

};