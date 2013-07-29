/*global module,process */
module.exports = function(grunt) {
    'use strict';
    var isDev = (grunt.option('dev')) || process.env.GRUNT_ISDEV === '1';
    if (isDev) {
        grunt.log.subhead('Running Grunt in DEV mode');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            clean: ['build']
        },

        jshint: {
            options: { jshintrc: '.jshintrc'},
            all: ['Gruntfile.js', 'src/assets/*.js']
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
                    'build/assets/css/<%= pkg.name %>.min.css': [
                        'src/assets/css/highlight-github.css',
                        'src/assets/css/normalize.css',
                        'src/assets/css/site.css'
                    ]
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
                        dest: 'build'
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            'articles/images/**',
                            'articles/misc/**'
                        ],
                        dest: 'build/'
                    }
                ]
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
            common: {
                options: {
                    almond: true,
                    baseUrl : 'src/assets/js',
                    name: 'libs/almond',
                    include: ['main'],
                    insertRequire: ['main'],
                    out: 'build/assets/js/<%= pkg.name %>.min.js',
                    paths: {
                        hljs: 'libs/highlight.pack'
                    },
                    optimize: (isDev) ? 'none' : 'uglify2',
                    preserveLicenseComments: (isDev) ? true : false
                }
            }
        },

        watch: {
            src: {
                files: 'src/**/*.*',
                tasks: ['default'],
                options: {
                    interrupt: true,
                    spawn: false,
                    debounceDelay: 400
                }
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
                options: {
                    layout: 'src/templates/article.hbs'
                },
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
                    src: ['index.hbs']
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
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble');

    // Tasks
    grunt.registerTask(
        'default',
        ['jshint', 'clean', 'requirejs', 'cssmin', 'copy', 'assemble']
    );
};
