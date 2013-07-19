/*global module */
module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            clean: ['build']
        },

        jshint: {
            options: { jshintrc: '.jshintrc'},
            all: ['Gruntfile.js', 'src/assets/**/*.js']
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>' +
                    ' <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                report: 'gzip',
                preserveComments: 'all',
                compress: false,
                mangle: false,
                beautify: true
            },
            build: {
                src: 'src/assets/js/*.js',
                dest: 'build/assets/js/<%= pkg.name %>.min.js'
            }
        },

        cssmin: {
            combine: {
                options: {
                    banner: '/* My minified css file */',
                    report: 'gzip'

                },
                files: {
                    'build/assets/css/<%= pkg.name %>.min.css':
                        ['src/assets/css/**/*.css']
                }
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['experiments/**'],
                        dest: 'build/experiments'
                    }
                ]
            }
        },

        assemble: {
            articles: {
                options: {
                    pkg: '<%= pkg %>',
                    data: 'src/base_data.json',
                    ext: '',
                    layout: 'src/templates/article.hbs',
                    assets: 'build/assets'
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    dest: 'build/',
                    src: ['articles/*.md.hbs']
                }]
            }
        }

    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('assemble');

    // Tasks
    grunt.registerTask(
        'default',
        ['jshint', 'clean', 'uglify', 'cssmin', 'copy', 'assemble:articles']
    );
};
