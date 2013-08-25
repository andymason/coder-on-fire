/*global module,process */
/*jshint camelcase:false */
module.exports = function(grunt) {
    'use strict';
    var isDev = (grunt.option('dev')) || process.env.GRUNT_ISDEV === '1';
    if (isDev) {
        grunt.log.subhead('Running Grunt in DEV mode');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: [
                'build/index.html', 'build/assets', 'build/experiments',
                'build/articles/*.html', 'build/articles/misc'
            ],
            homepage: ['build/index.html'],
            articles: ['build/articles/*.html']
        },

        jshint: {
            options: { jshintrc: '.jshintrc'},
            all: ['Gruntfile.js', 'src/assets/*.js']
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['experiments/**'],
                        dest: 'build'
                    }
                ]
            },
            assets: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: [
                        'articles/misc/**',
                        'assets/images/**'
                    ],
                    dest: 'build/'
                }]
            }
        },

        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'build',
                    keepalive: true
                }
            }
        },

        requirejs: {
            assets: {
                options: {
                    almond: true,
                    baseUrl : 'src/assets/js',
                    name: 'libs/almond',
                    include: ['main'],
                    insertRequire: ['main'],
                    out: 'build/assets/js/<%= pkg.name %>.min.js',
                    paths: {
                        hljs: 'libs/highlight.pack',
                        webfont: 'libs/webfont'
                    },
                    shim: { webfont: { exports: 'webfont' } },
                    preserveLicenseComments: (isDev) ? true : false,
                    optimize: (isDev) ? 'none' : 'uglify',
                    uglify: { max_line_length: 1000 }
                }
            }
        },

        watch: {
            options: {
                spawn: false,
                debounceDelay: 400
            },
            src: {files: 'src/articles/*.*', tasks: ['default']},
            css: {files: 'src/assets/css/*.*', tasks: ['sass']},
            js: {files: 'src/assets/js/*.*', tasks: ['jshint', 'requirejs']},
            images: {files: 'src/articles/images/*.*', tasks: ['resizeImages']},
            html: {
                files: ['src/*.*', 'src/articles/*.*', 'src/templates/*.*'],
                tasks: ['clean:articles', 'assemble']
            },

            assets: {
                files: ['src/assets/images/*.*', 'src/articles/misc/*.*'],
                tasks: ['copy:assets']
            }
        },

        assemble: {
            options: {
                pkg: '<%= pkg %>',
                engine: 'handlebars',
                data: 'src/base_data.json',
                assets: 'build/assets'
            },
            articles: {
                options: { layout: 'src/templates/article.hbs' },
                files: [{
                    expand: true,
                    cwd: 'src',
                    dest: 'build/',
                    src: ['articles/*.md']
                }]
            },
            homepage: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    dest: 'build/',
                    src: ['*.hbs']
                }]
            }
        },

        sass: {
            main: {
                options: { outputStyle: 'compressed' },
                files: {
                    'build/assets/css/<%= pkg.name %>.min.css':
                        'src/assets/css/main.scss'
                }
            }
        },

        resizeImages: {
            articleImages: {
                src: ['src/articles/images/*.*'],
                dest: 'build/articles/images/'
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-resize-images');
    grunt.loadNpmTasks('assemble');

    // Tasks
    grunt.registerTask(
        'default', ['clean:articles', 'resizeImages', 'assemble:articles']
    );

    grunt.registerTask(
        'build', [
            'jshint', 'clean', 'requirejs', 'sass', 'copy', 'resizeImages',
            'assemble'
        ]
    );
};
