module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
            	files: {
            		'static/prod/css/styles.css': 'static/dev/css/styles.scss'
            	}
            }
        },
        cssmin: {
        	css:{
        		src: 'static/prod/css/styles.css',
        		dest: 'static/prod/css/styles.min.css'
        	},
            font_awesome: {
                src: 'static/prod/css/font-awesome.css',
                dest: 'static/prod/css/font-awesome.min.css'
            }

        },
        watch: {
            options: {
                livereload: true,
            },
            css: {
            	files: ['static/dev/css/styles.scss', 'index.html'],
            	tasks: ['sass', 'cssmin']
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['cssmin:font_awesome']);
};
