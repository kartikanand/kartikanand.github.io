module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
            	files: {
            		'static/prod/styles.css': 'static/dev/styles.scss'
            	}
            }
        },
        cssmin: {
        	css:{
        		src: 'static/prod/styles.css',
        		dest: 'static/prod/styles.min.css'
        	}
        },
        watch: {
            options: {
                livereload: true,
            },
            css: {
            	files: ['static/dev/styles.scss', 'index.html'],
            	tasks: ['sass', 'cssmin']
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['sass:dist', 'cssmin:css']);
};
