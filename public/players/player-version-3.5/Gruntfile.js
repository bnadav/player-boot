// Project configuration.
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      dist: {
        src: [ "javascripts/libs/jquery-1.11.3.min.js",
          "javascripts/libs/jquery.touchSwipe.min.js",
          "javascripts/libs/underscore-min.js",
          "javascripts/libs/backbone-min.js" ,
          "js-src/app.js",
          "javascripts/translation.js",
          "js-src/modules/item.js",
          "js-src/modules/item_in.js",
          "js-src/modules/item_mc.js",
          "js-src/modules/item_tx.js",
	        "js-src/modules/item_bl.js",
          "js-src/modules/chapter.js",
	        "js-src/router.js",	
	        "js-src/modules/item_collection.js",
          "javascripts/jquery-linenumbers.js"],
          dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
      },
    },
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat']);
};
