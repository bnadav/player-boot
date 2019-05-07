// Module reference argument, assigned at the bottom
(function(ItemMc) {

    var Item = NITE.module("item");

    ItemMc.Model = Item.Model.extend(
    {
        module_object: ItemMc,
        initialize: function() {
        },
        // Item is sentence completion if it's questino text includes a span with class "blank"
        /*
        is_sc: function() {
            var text = $(this.get('question_text'));
            return(text.children(".blank").length > 0 ||
                   text.filter(".blank").length > 0);
        },
        */
        
        // Create an array of phrases to fill in the blanks for each distractor
        get_sc_answer_text: function() {
            // response is the index of the current answer
          //var selected_distractor = this.get("item_answers").findWhere({answer_index: this.get("response")}).answer_text;//not checked yet          
          var response = this.get("response");
          var selected_distractor = this.get("item_answers")[(parseInt(response) - 1)];
          //console.log(selected_distractor);
          // split / sperated string into array
          var splitted_selected_distractor = selected_distractor.answer_text.split("\/");
          // trim all entries
          return splitted_selected_distractor.reduce(function(arr, distract){ arr.push(distract.trim()); return arr}, []);
        },

    
 
    });

    ItemMc.ButtonView = Backbone.View.extend({

        tagName: 'input',

        initialize: function(options){

          Item.ButtonView.initialize.apply(this,[options]);
        },

        button_text: function() {
            return (this.model.get("button_text") || this.model.get("index_of_type"));
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

    ItemMc.InfoView = Backbone.View.extend({
      initialize: function(options) {
          Item.InfoView.initialize.apply(this,[options]);
      },
      render: function()     {
           return(Item.InfoView.render.apply(this));
      }
    });

    ItemMc.ContentView = Backbone.View.extend({

      tagName: 'div',

      initialize: function(options) {
          Item.ContentView.initialize.apply(this,[options]);
          // bind change of response to rendering of blank span in question text

          if(this.model.chapter().fill_the_blank()) {
            // if(this.model.is_sc()) {
                _.bindAll(this,'fill_the_blank');
                this.model.bind("change:response", this.fill_the_blank);
            //  }
          }
      },


      build_editors: function() {
          Item.ContentView.build_editors.apply(this);
      },  

      events: {"click input" : "set_response",
               "click .answer_options th" : "trigger_click",
               "click .answer_options td" : "trigger_click" 
      },
      

     set_big_display_type: function() {
          if(this.model.get_kernel())
            if(this.model.get_kernel().get("display_type") == "big_kernel"){
           // alert("with kernel display type");
            $(this.el).addClass("big_kernel");
          }
     },   
    
    render: function() {
          
	   var element = Item.ContentView.render.apply(this);
           this.prefetch_embeds();
           this.set_big_display_type();
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

      fill_the_blank: function() {
          var element = $(this.el);
          var answer_texts = this.model.get_sc_answer_text();
          element.find(".blank").each(function(index, elem) {
            $(elem).html(answer_texts[index]).addClass("with_content");
          });
          return(element);
      },

      show_or_hide: function() {
            var element = $(this.el);
            Item.ContentView.set_current.apply(this); // add/remove "current" class
            if(this.model.get("current") && this.model.get_kernel()){
                element.addClass("with_kernel");
                
            }
            else
                element.removeClass("with_kernel");
            return(this);
      },

      set_response: function(e) {
            this.model.set_response(e.target.value);
            //this.model.set({response: e.target.value});
      },


       templ: _.template(" \
         <div class='question_part' id='q_{{ number }}'> \
         <div class='instructions' id='in_{{ number }}'> {{ instruction_text }}  </div> \
         <div class='question_text' id='qt_{{ number }}' > {{ question_text }} </div> \
         <div class='answer_options' id='a_{{ number }}'>  \
       [[ if ((display_type != 'sentence')) { ]] \
         <table class='display_type_{{ display_type }}'>\
         [[for (var answer_counter = 1 ; answer_counter <= num_answers ; answer_counter++ ){ ]] \
           [[ if ((display_type == 'normal') || (answer_counter %2)) { ]] \
           <tr id='a_{{ number }}_{{ answer_counter }}' > \
               [[}]] \
            <th>\
             <input type='radio' id='a_{{ number }}_A_{{ answer_counter }}' \
                                 name='a_{{ number }}'\
                                 value='{{ answer_counter }}'\
                                 [[ if (parseInt(response) == answer_counter) { ]]\
                                    checked='checked'\
                                 [[ } ]]/>\
             </th>\
             <td>\
              <div id='a_{{ number }}_td_{{ answer_counter }}'>\
		[[ if (typeof item_answers !== 'undefined'){]]	           \
		   {{ getAnswer(item_answers, answer_counter)  }}\
		[[} ]]\
              </div>\
             </td>\
        [[ if ((display_type == 'normal') || !(answer_counter %2)) { ]] \
           </tr>\
         [[}]] \
         [[} ]] \
        </table>\
	  [[} ]] \
        </div> \
        </div> "
        )
    });
})(NITE.module("item_mc"));
