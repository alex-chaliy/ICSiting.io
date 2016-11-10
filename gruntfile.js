module.exports = (grunt) => {
	grunt.initConfig({
		concat: {
			css: {
				src: ['markup/sass/*.scss', '!markup/sass/all.scss'],
				dest: 'markup/sass/all.scss'
			}
		},
		sass: {
		    dist: {
				files: [{
					expand: true,
					cwd: 'markup/sass/',
					src: ['all.scss'],
					dest: 'markup/sass/',
					ext: '.css'
				}]
		    }
		},
		cssmin: {
			my_target: {
				files: [{
					expand: true,
					cwd: 'markup/sass/',
					src: ['all.css'],
					dest: 'markup/css/',
					ext: '.min.css'
				}]
			}
		},
		watch: {
			css: {
				files: 'markup/sass/*.scss',
				tasks: ['concat', 'sass', 'cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
}