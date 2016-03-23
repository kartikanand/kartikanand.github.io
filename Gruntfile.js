module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        staticDir: 'static/',
        devDir: '<%= staticDir %>dev/',
        prodDir: '<%= staticDir %>prod/',
        sass: {
            dist: {
            	files: {
            		'<%= devDir %>css/styles.css': '<%= devDir %>scss/styles.scss'
            	}
            }
        },
        cssmin: {
        	css:{
        		src: '<%= devDir %>css/styles.css',
        		dest: '<%= prodDir %>css/styles.min.css'
        	}
        },
        uglify: {
            js: {
                files: {
                    '<%= prodDir %>js/main.min.js': ['<%= devDir %>js/main.js']
                }    
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            src: {
                files: ['index.html'],
                tasks: []
            },
            js: {
                files: ['<%= devDir %>js/main.js'],
                tasks: ['uglify']
            },
            css: {
            	files: ['<%= devDir %>scss/styles.scss', 'index.html'],
            	tasks: ['sass', 'cssmin']
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['watch']);
};
