// Module reference argument, assigned at the bottom
(function(ItemTx) {

    var Item = NITE.module("item");
//    var ItemIn = {};
    ItemTx.Model = Item.Model.extend(
    {
        module_object: ItemTx,
        initialize: function() {},
        is_tx: function() {return true},
        answerable: function() {return false}, // the item takes no responses


     });

    ItemTx.ButtonView = Backbone.View.extend({

        tagName: 'input',

        initialize: function(options){
          Item.ButtonView.initialize.apply(this,[options]);
        },

        button_text: function() {
            // public part
            var txt = this.model.get("button_text");
            var chapter = this.model.chapter();
            var final_txt = (txt ? Item.ButtonView.translate_label(txt, chapter) : deduce_label(chapter));
            var index_of_type = this.model.get("index_of_type");

            return(add_counter_to_button_text(final_txt)); // and 1,2 etc...


            //private helper functions
            function deduce_label(chapter){
              if(chapter.has_math_formulas())
                return(NITE.translate.exam.side.drawing);
              else
                return(NITE.translate.exam.side.text);
            }

            function add_counter_to_button_text(txt) {
              if (chapter.total_num_items_for_property("element_type","tx") > 1)
                if(chapter.get("domain") == "DI")
                  return(Item.ButtonView.translate_label("hasaka") + " " + index_of_type +  ": " + txt)
                else {
                  return (txt + " " + index_of_type);
                }
              else
                return(txt);
            }
        },

        render: function() {
          return(Item.ButtonView.render.apply(this));
        },


       //Events Handling
        events: Item.ButtonView.events, // Events registration object

        button_click: function(e) {

        result = (Item.ButtonView.button_click.apply(this));

           return result;
        }

    });

    ItemTx.InfoView = Backbone.View.extend({
      initialize: function(options) {
          Item.InfoView.initialize.apply(this,[options]);
      },
      render: function()     {
           return(Item.InfoView.render.apply(this));
      }
    });

    ItemTx.ContentView = Backbone.View.extend({

      tagName: 'div',

      initialize: function(options) {
          Item.ContentView.initialize.apply(this,[options]);
          //$(this.el, "li").hide();  // hide li in texts, otherwise line number stay visible
          this.model.bind('change:current_kernel', this.show_or_hide, this);
      },


      build_editors: function() {
          Item.ContentView.build_editors.apply(this);
      },

      remove_editors: function() {
          Item.ContentView.remove_editors.apply(this);
      },

     events: {
       //  "click .question_text, .instructions"  : "build_editors"
     },

      set_big_display_type: function() {
          
          if(this.model.get("display_type") == "big_kernel"){
            //alert("big display type");
            $(this.el).addClass("big_kernel");
          }

        },

      render: function()  {
           this.set_big_display_type();
           var element = Item.ContentView.render.apply(this);
                   
           //this.prefetch_embeds();
           return(element);
      },

      show_or_hide: function() {

            var element = $(this.el);

            Item.ContentView.set_current.apply(this);// add/remove "current" class
            if(this.model.get("current_kernel")){

                element.addClass("kernel");
                if(this.model.chapter().line_numbers()) {
                  element.linenumbers();
                }
            }

            else
                element.removeClass("kernel");
                this.set_instructions_visibility(element[0]);
            return(this);
      },

      // Show the "use the scroll bar" sentence only when scroll is shown
      set_instructions_visibility: function(html_element) {

        if(html_element.scrollHeight > html_element.clientHeight) {
          $(".instructions em", html_element).show();
        } else {
          $(".instructions em", html_element).hide();
        }

      },

      // Do counter reset for lines counter in text, or otherwise all line number appear
      // on re-showing the item as zeros on intenet-explorer
      reset_counter: function() {
        $(this).css({"counter-reset": "itemx", "overflow": "auto"});
        return(this);
      },

     templ: _.template("\
           <div class='instructions' id='in_{{ number }}'> {{ instruction_text }} </div> \
             <div class='question_text' id='qt_{{ number }}'> {{ question_text }} </div>"
    
    
      )

    });

})(NITE.module("item_tx"));

// jquery plugin for detecting appearance of vertical scrollbar
/*
(function($) {
    $.fn.setScrollbarMessage = function() {
        var is_scrolling = this.get(0).scrollHeight > this.get(0).clientHeight;
        var show_msg = is_scrolling && !this.is(".kernel"); // if kernel, scrolling msg is shown in the item
        var msg = $(".instructions em", this);  // scroling msg is the italics in the instructins div
        show_msg ? msg.show() : msg.hide();
//        console.log(this.not(".kernel"));
        return(this);
    }
})(jQuery);
*/
