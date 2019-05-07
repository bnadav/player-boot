// Change default signs for interpolation and evaluation,
// in order not to confuse with erb
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g,
  evaluate: /\[\[(.+?)\]\]/g
};

var NITE = {
  PLAYER_VERSION: '3.5',
  get SUB_URI() {if(typeof NITE_DEFAULTS === undefined) {return('')} else {return(NITE_DEFAULTS.SUB_URI)}},
  get BASE_PATH() {return this.SUB_URI + '/players/player-version-3.5/'},
  API_VERSION: '2',
  MAX_BACKUP_FAILURES: 3,
  t: null,
  DEBUG_MODE: false,

  // Create this closure to contain the cached modules
  module: function() {
    // Internal module cache.
    modules = {};
    // Create a new module reference scaffold or load an
    // existing module.
    return function(name) {
      // If this module has already been created, return it.

      if (modules[name]) {
        return modules[name];
      }
      // Create a module and save it under this name
      return modules[name] = { Views: {} };
    };
  }(),

  start: function() {
    var chapter = NITE.module("chapter");
    // var editor = NITE.module("editor");
    this.chapter_model = new chapter.Model(); // Also sets translation language
    this.router.set_chapter(this.chapter_model);  // initialize router with chapter model

    var chapter_view = new chapter.View({model: this.chapter_model});
    // editor_model = new editor.Model();
    // var editor_view = new editor.View({model: editor_model});
    this.chapter_model.fetch_data();
  }
};


// Start the app in the on ready handler -- Needed ??

//window.onload = function() {
$(function() {
  NITE.start();
});

$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('X-CSRF-Token',
                         $('meta[name="csrf-token"]').attr('content'));
  }
});

window.onload = function(e) {
  //$('body').css('display', 'block');  // show chapter only after all resources have been loaded
  $('body').css('display', 'flex');  // show chapter only after all resources have been loaded
}

//$('td[id^="a_"]').live('focus', function(){
$(document).on('focus','td[id^="a_"]', function(){
  if(NITE.DEBUG_MODE)
    console.log($(this).prev('th').find('input').attr('id'));
  var radioButton = $(this).prev('th').find('input');
  radioButton.prop('checked', true);

  radioButton.trigger("click");

});



