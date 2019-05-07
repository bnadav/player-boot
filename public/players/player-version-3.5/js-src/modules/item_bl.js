// Module reference argument, assigned at the bottom
(function(ItemBl) {

    var Item = NITE.module("item");

    ItemBl.Model = Item.Model.extend(
    {
        module_object: ItemBl,

        initialize: function() {
          if(this.online_writting()) {
            var prev_content = this.has_response() ? this.get("response") : "";  // in case of recovery
            this.count_words(prev_content);
            new ItemBl.WordCountView({model: this}).render();
          }
        },

        online_writting: function() {
          //return (this.chapter().get('chapter_spec') == 'A');
          return (this.chapter().get("exam_type_name") == "psycho")
          
        },

        count_words_and_set_response: function(content) {
            this.count_words(content);
            this.set_response(content);
        },

        count_words: function(content) {
            this.set({word_counter: content.trim().split(/\s+/).filter(n => n !== "").length});
        }
    });

    ItemBl.WordCountView = Backbone.View.extend({

      el: "#side #word_count",

      initialize: function() {
        _.bindAll(this,'render');
        this.model.bind('change:word_counter', this.render);
        this.model.bind('change:current', this.render);
      },

      render: function() {
          if(this.model.online_writting() && this.model.get("current")) {
            this.$el.val(this.model.get("word_counter")).closest('div').show();
          } else {
            this.$el.closest('div').hide();
          }
      }

    })

    ItemBl.ButtonView = Backbone.View.extend({

        tagName: 'input',

        initialize: function(options){

          Item.ButtonView.initialize.apply(this,[options]);
        },

        button_text: function() {
            var txt = this.model.get("button_text");
            if(txt == null) txt = NITE.translate.writing;
            return(txt);
        },

        render: function() {
          return(Item.ButtonView.render.apply(this));
        },
        //Events Handling
        events: Item.ButtonView.events, // Events registration object

        button_click: function(e) {
           return(Item.ButtonView.button_click.apply(this));
        }

    });

    ItemBl.InfoView = Backbone.View.extend({
      initialize: function(options) {
          Item.InfoView.initialize.apply(this,[options]);
      },
      render: function()     {
          return(Item.InfoView.render.apply(this));
      }
    });

    ItemBl.ContentView = Backbone.View.extend({

      tagName: 'div',

      initialize: function(options) {
          Item.ContentView.initialize.apply(this,[options]);
      },

      events: {
        "keyup textarea"  : "set_response",
        "click textarea"  : "set_response",
      },

      render: function()     {
           var element = Item.ContentView.render.apply(this);
           this.prefetch_embeds();
           return(element);
      },

      prefetch_embeds: function() {
           return(Item.ContentView.prefetch_embeds.apply(this));
      },

      trigger_click: function(e) {
          // if th clicked, trigger it's input child
          // if td clicked, trigger input child of previous sibling th
          var th = $("input", e.target);
          var td = $("input", $(e.currentTarget).prev("th"));
          th.add(td).click();
      },

      show_or_hide: function() {
            var element = $(this.el);
            Item.ContentView.set_current.apply(this); // add/remove "current" class
            return(this);
      },

      set_response: function(e) {
            this.model.count_words_and_set_response(e.target.value);
      },

       templ: _.template(" \
         <div class='question_part' id='q_{{ number }}'> \
         <div class='instructions' id='in_{{ number }}'> {{ instruction_text }}  </div> \
         <div class='question_text' id='qt_{{ number }}' > {{ question_text }}</div> \
         [[ if (this.model.online_writting()) ]] <textarea id='a_{{ number }}' placeholder='{{ NITE.translate.enter_text_here }}'>[[ if (this.model.has_response()) ]]{{response.trim()}}</textarea>  \
        </div> ")
    });
})(NITE.module("item_bl"));
