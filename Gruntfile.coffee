con = console

grunt = require("grunt")
require("load-grunt-tasks")(grunt);

grunt.loadNpmTasks("grunt-contrib-coffee")
grunt.loadNpmTasks("grunt-contrib-jade")
grunt.loadNpmTasks("grunt-contrib-stylus")
grunt.loadNpmTasks("grunt-contrib-uglify")
grunt.loadNpmTasks("grunt-contrib-watch")
grunt.loadNpmTasks("grunt-newer")
grunt.loadNpmTasks("grunt-replace")

grunt.initConfig(
  watch:
    coffee:
      files: ["#{__dirname}/src/*.coffee"]
      tasks: ["newer:coffee:compile"]
    stylus:
      files: ["#{__dirname}/stylus/*.styl"]
      tasks: ["newer:stylus:compile"]
    jade:
      files: ["#{__dirname}/jade/*.jade"]
      tasks: ["newer:jade:compile"]
    babel:
      files: ["#{__dirname}/src/*.js"]
      tasks: ["newer:babel:compile"] # in turn runs: "newer:uglify:separate"


  babel:
    options:
      sourceMap: false
      presets: ["env"]
    compile:
      files: [{
        expand: true
        cwd: "src/"
        src: ["*.js"]
        dest: "es5/"
      }]


  uglify:
    options:
      # beautify: true
      mangle: false
      compress: false
      # reserved: ['jQuery', 'Backbone']
    separate:
      files: [{
        expand: true
        cwd: "es5"
        src: "*.js"
        dest: "jsmin/"
      }]
    composite:
      src: 'es5/*.js'
      dest: 'jsmin/composite.js'

  coffee:
    compile:
      expand: true
      flatten: true
      cwd: "#{__dirname}/src/"
      src: ["*.coffee"]
      dest: "es5/"
      ext: ".js"

  jade:
    compile:
      options: {
        client: false,
        pretty: true
        # data: (dest, src) ->
        #   console.log("log", dest,src)
        #   return {data:"hello", path:dest}
      }
      files: [
        {
          expand: true
          cwd: "jade/"
          src: ["**/*.jade"] # , "!**/_**"
          dest: "html/"
          ext: ".html"
        }
      ]

  stylus:
    compile:
      files: [
        {
          expand: true
          cwd: "#{__dirname}/stylus/"
          src: ["*.styl"]
          dest: "css"
          ext: ".css"
        }
      ]
      options:
        compress: false
        expand: true

  build:
    hash:
      files:
        'testdone.js': 'test.js'
      options:
        replacements: [{
          # pattern: /<!-- @import (.*?) -->/ig,
          pattern: /testing/ig,
          replacement: (match, p1) =>
            console.log(match, p1)
            return "hello" # grunt.file.read(__dirname + p1)
        }]
      }
    }
  }



)


grunt.registerTask("default", ["watch"])
grunt.registerTask("deploy", [
  "babel:compile"
  "coffee:compile"
  "stylus:compile"
  "uglify:separate"
  "uglify:composite"
])
