'use strict';

module.exports = function(grunt) {

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-jsonlint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-sftp-deploy');

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	meta: {
		banner:
		'/* \n'+
		' * <%= pkg.name %> v<%= pkg.version %> \n'+
		' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> \n'+
		' * <%= pkg.author %> \n'+
		' * \n'+
		' * Licensed under the <%= pkg.license %> license. \n'+
		' * \n'+
		' * Source: \n'+
		' * <%= pkg.repository.url %> \n'+
		' */\n'
	},
	clean: {
		js: {
			src: ['dist/*.js']
		},
		css: {
			src: ['dist/*.css']
		},		
		images: {
			src: ['dist/images/*']
		}		
	},
	jshint: {
		options: {
			globals: {
				console: true,
				module: true
			},
			"-W099": true,	//ignore tabs and space warning
			"-W044": true,	//ignore regexp
			"-W033": true
		},
		files: ['src/**/.js']
	},
	jsonlint: {
		sample: {
			src: [ 'i18n/*.json' ]
		}
	},
	copy: {
		fenixmapconfig: {
			nonull: true,
			src: 'src/FenixMapConfig.js',
			dest: 'dist/fenix-ui-map-config.js'
		},
		imageslayers: {
			nonull: true,
			expand: true,
			cwd: "src/css/images/",
			src: '**',
			dest: "dist/images/"
		},
		i18n: {
			nonull: true,
			expand: true,
			cwd: 'src/i18n/',
			src: '*',
			dest: 'dist/i18n/'
		}		
	},
	concat: {
		options: {
			banner: '<%= meta.banner %>',
			separator: ';\n',
			stripBanners: {
				block: true
			}
		},
		fenixmap: {
			src: [
				'src/FenixMap.js',
				'src/core/Class.js',
				'src/core/Util.js',
				'src/core/HashMap.js',
				//TODO move to lib
				'src/core/UIUtils.js',
				'src/core/WMSUtils.js',
				'src/core/fullScreenApi.js',
				//TODO move to lib
				'src/map/config/*.js',
				'src/map/Map.js',
				'src/map/utils/LayerLegend.js',
				'src/map/controller/MapController.js',
				'src/map/html/gui-controller.js',
				'src/map/html/gui-map.js',
				'src/map/utils/*.js ',
				'src/map/layer/*.js'
			],
			dest: 'dist/fenix-ui-map.src.js'
		}
	},
	uglify: {
		options: {
			banner: '<%= meta.banner %>'
		},
		fenixmap: {
			files: {
				'dist/fenix-ui-map.min.js': ['dist/fenix-ui-map.src.js']
			}
		}
	},
	cssmin: {
		options: {
			banner: '<%= meta.banner %>'
		},
		combine: {
			src: [
				'src/css/fenix-ui-leaflet.css',
				'src/css/fenix-ui-map.css'
			],
			dest: 'dist/fenix-ui-map.min.css'
		},
		minify: {
			expand: true,
			cwd: 'dist/',
			src: '<%= cssmin.combine.dest %>'
		}
	},
	'sftp-deploy': {
		build: {
			auth: {
				host: 'fenixrepo.fao.org',
				port: 22,
				authKey: {
					username: 'root'
				}
			},
			cache: 'sftpCache.json',
			src: 'dist',
			dest: '/work/prod/nginx/www/cdn/fenix/<%= pkg.name %>/<%= pkg.version %>',
			serverSep: '/',
			concurrency: 4,
			progress: true
		}
	},
	watch: {
		dist: {
			options: { livereload: true },
			files: ['src/**/*','Gruntfile.js'],
			tasks: ['clean:js','clean:css','copy:fenixmapconfig','concat','cssmin','jshint']
		}
	}
});

grunt.registerTask('default', [
	//'jshint',
	'clean',
	'concat:fenixmap',
	'uglify:fenixmap',
	'cssmin',
	'jsonlint',	
	'copy'
]);

grunt.registerTask('deploy', [
	'sftp-deploy',
]);

};
