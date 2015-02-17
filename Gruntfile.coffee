module.exports = (grunt) ->
	grunt.initConfig
		clean: ['dist']
		svgmin:
			dist:
				files: [
					expand: true
					cwd: 'src/svg/'
					dest: 'dist/svg/'
					src: ['*.svg']
				]

	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-svgmin'

	grunt.registerTask 'default', ['svgmin']