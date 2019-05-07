// Module reference argument, assigned at the bottom
(function(ItemIn) {

    var Item = NITE.module("item");

//    var ItemIn = {};
    ItemIn.Model = Item.Model.extend(
     {
        module_object: ItemIn,
        initialize: function() {},
        answerable: function() {return(false)},  // the item takes no responses
          
     });

    ItemIn.ButtonView = Backbone.View.extend({

        tagName: 'input',

        initialize: function(options){
          Item.ButtonView.initialize.apply(this,[options]);
        },

        button_text: function() {
            var txt = this.model.get("button_text");

            if(txt) {
              return(this.add_counter_to_button_text(txt));
            } else {
              return this.deduce_label();
            }
            //return (txt ? Item.ButtonView.translate_label(txt) : this.deduce_label());
        },

        add_counter_to_button_text: function(txt) {
            var chapter = this.model.chapter();
           
            if (chapter.total_num_items_for_property("button_text", txt) > 1){
               return (Item.ButtonView.translate_label(txt, chapter) + " " + this.model.get("index_of_type"));
            }    
            else
                return(Item.ButtonView.translate_label(txt, chapter));
        },

        deduce_label: function() {
            var chapter = this.model.chapter();
            var txt;
            if(chapter.instructions_chapter())
                txt = NITE.translate.exam.side.explanations;
            else
                txt = NITE.translate.exam.side.instructions;
            return(txt);
        },

        render: function() {
          return(Item.ButtonView.render.apply(this));
        },

       //Events Handling
        events: Item.ButtonView.events, // Events registration object

        button_click: function(e) {
           return(Item.ButtonView.button_click.apply(this))
        }


    });

    ItemIn.InfoView = Backbone.View.extend({
      initialize: function(options) {
          Item.InfoView.initialize.apply(this,[options]);
      },
      render: function()     {
           return(Item.InfoView.render.apply(this));
      }
    });

    ItemIn.ContentView = Backbone.View.extend({

      tagName: 'div',
      

      initialize: function(options) {
          Item.ContentView.initialize.apply(this,[options]);
      },

      build_editors: function() {
          Item.ContentView.build_editors.apply(this);
      }, 

      remove_editors: function() {
         Item.ContentView.remove_editors.apply(this);
      }, 

      render: function() {
           var element = Item.ContentView.render.apply(this);
     //       $(':not(#main)').live('click', this.remove_editors())
     //      this.prefetch_embeds();
           return(element);
      },

      show_or_hide: function() {
            var element = $(this.el);
            Item.ContentView.set_current.apply(this); // add/remove "current" class
            return(this);
      },

      set_editable: function() {
          Item.ContentView.set_editable.apply(this, $(this.el));
      },


   //   item_editable: function(element) {
   //       Item.ContentView.item_editable.apply(this, element);
   //    },

     templ:
            _.template(" \
                  <div class='question_part' id='q_{{ number }}'> \
                    <div class='question_text' id='qt_{{ number }}'> {{ question_text }} </div> \
                  </div> \
            ")

    });
})(NITE.module("item_in"));
