con = console

grunt = require('grunt')

grunt.loadNpmTasks('grunt-contrib-coffee')
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.initConfig(
  watch:
    coffee:
      files: ["#{__dirname}/src/*.coffee"]
      tasks: ['coffee:compile']

  coffee:
    compile:
      expand: true,
      flatten: true,
      cwd: "#{__dirname}/src/",
      src: ['*.coffee'],
      dest: 'js/',
      ext: '.js'
)



# grunt.registerTask("compile", "", () ->
#   # (true)
#   con.log('compile ok')
# )

# grunt.registerTask("default", "", () ->
#   # (true)
#   con.log('ok')
# )
