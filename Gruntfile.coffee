con = console

grunt = require('grunt')
# stylus = require('stylus')

grunt.loadNpmTasks('grunt-contrib-coffee')
grunt.loadNpmTasks('grunt-contrib-watch')
grunt.loadNpmTasks('grunt-contrib-stylus')
grunt.initConfig(
  watch:
    coffee:
      files: ["#{__dirname}/src/*.coffee"]
      tasks: ['coffee:compile']
    stylus:
      files: ["#{__dirname}/stylus/*.styl"]
      tasks: ['stylus:compile']
  coffee:
    compile:
      expand: true
      flatten: true
      cwd: "#{__dirname}/src/"
      src: ['*.coffee']
      dest: 'js/'
      ext: '.js'
  stylus:
    compile:
      files: [
        {
          expand: true
          cwd: "stylus/"
          src: ["*.styl"]
          dest: "css"
          ext: ".css"
        }
      ]
      options:
        compress: false
        expand: true
)



# grunt.registerTask("compile", "", () ->
#   # (true)
#   con.log('compile ok')
# )

# grunt.registerTask("default", "", () ->
#   # (true)
#   con.log('ok')
# )
