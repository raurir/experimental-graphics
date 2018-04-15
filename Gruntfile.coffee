con = console

grunt = require("grunt")
require("load-grunt-tasks")(grunt);

grunt.loadNpmTasks("grunt-contrib-coffee")
grunt.loadNpmTasks("grunt-contrib-watch")
grunt.loadNpmTasks("grunt-contrib-stylus")
grunt.loadNpmTasks("grunt-contrib-jade")
grunt.loadNpmTasks("grunt-contrib-uglify")

grunt.initConfig(
  watch:
    coffee:
      files: ["#{__dirname}/src/*.coffee"]
      tasks: ["coffee:compile"]
    stylus:
      files: ["#{__dirname}/stylus/*.styl"]
      tasks: ["stylus:compile"]
    jade:
      files: ["#{__dirname}/jade/*.jade"]
      tasks: ["jade:compile"]
    babel:
      files: ["#{__dirname}/js/*.src"]
      tasks: ["babel"]


  babel:
    options:
      sourceMap: false
      presets: ["env"]
    dist:
      files: [{
        expand: true
        cwd: "src/" # TODO change to src
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



)

# grunt.registerTask("default", ["watch"])
grunt.registerTask("default", [
  "babel"
  "uglify:separate"
])