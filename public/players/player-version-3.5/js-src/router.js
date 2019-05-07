(function(App) {
  App.router = new (Backbone.Router.extend({

    routes: {"item/:name": "show"},

    set_chapter: function(chapter_model) {
      //this.chapter = chapter_model;
      this.item_collection = chapter_model.get("all_items")
    },

    jump: function(index) {
      var name = this.item_collection.at(index).get("name");
      this.navigate("item/" + name, {trigger: true});
    },

    show: function(name) {
      //console.log("***" + name)
      //var item_collection = this.chapter.get("all_items");
      this.item_collection.findWhere({"name": name}).make_current();
    }
  }));
})(NITE);

