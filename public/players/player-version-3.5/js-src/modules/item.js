// Module reference argument, assigned at the bottom
(function(Item) {

    Item.Model = Backbone.Model.extend(
    {
        defaults: {
            "flag": false
        },

        initialize: function() {
        },


        // override if item is not answerable
        answerable: function() {
          return(true);
        },

        // Make item the current one
        make_current: function() {

            var chapter = this.chapter();
            var previous_item = chapter.get("current_item");

            // Make previous item "non current"
            if(previous_item) {
              previous_item.set({ current: false });
            }
            this.set({ current: true });

            // if no response was given set it to 0
            if(!this.has_response()) this.set({response: "0"}, {silent: true});

            // Set this item on chapter as current_item
            chapter.set_current_item(this);

            // Handle associated kernel
            var kernel = this.get_kernel();
            if(this.get("element_type") == "TX" && this.chapter().line_numbers()){
                 var question_number = this.get("number");
                 var question_text_id =  "qt_" + question_number;
                 $("#" + question_text_id).parent().linenumbers(); 
            }

            if(kernel) {
                kernel.set({current_kernel: true});
            }
            chapter.set_current_kernel(kernel);  // if kernel=null, previous kernel will be reset

            //Remove Old editors and builds new ones            
            if(chapter.needs_editor()) {
                if(previous_item) {
                  var previous_number = previous_item.get("number");
                  chapter.get("editor").remove_editors(previous_item);//try send only the item and not the model
                }
                chapter.get("editor").build_editors(this);      
            }


        },

        toggle_flag: function() {
            this.set({ flag: !this.get("flag") })
        },

        is_tx: function() {return false},  // This function is overriden by item_tx model

        // If super_element_indes fied is non-null, then item has kernel
        has_kernel: function() {
            return(this.has("super_element_index"));
        },

        // Fetch the kernel item from chapter's all_items collection
        get_kernel: function() {
            var index = this.get("super_element_index");
            if(index!= null)
              return(this.chapter().get("all_items").at(index));
            else
              return(null);
        },

        is_last: function() {
            var chapter = this.chapter();
            return(this.get("index_in_chapter") == chapter.get("all_items").length-1);
        },

        has_response: function() {
          var response = this.get('response');
          return(response && response != "-9" && response != "0")
        },

        set_response: function(value) {
            this.set({response: value});
        },

        authoring: function() {return(this.chapter.authoring)},  // getter

        // Construct element id of item in html
        construct_id: function(options) {
            var id = [this.get("index_in_chapter"), this.get("unit_index"),
                    this.get("index_in_unit")].join("_");
            if (options && options['prefix']) id = [options['prefix'], id].join("_");
            return(id);
        },

        chapter: function() {
          return NITE.chapter_model;
        }

    
    });//model

    Item.ButtonView = {

        initialize: function(options) {
            // Bind render to the context of current <this>
            _.bindAll(this,'render');
            // Whenever the model changes, re-render
            this.model.bind('change', this.render);
            // Create button id
            this.el.id = this.model.construct_id({prefix: "button"});
            this.el.className = this.model.get("element_type");
            this.el.value = this.button_text();
            this.el.type = "button";
            this.response = null;
        },

        events: {
            "click": "button_click"
        },

        render: function() {
            // If the item is the 'current' one - add current class, else remove it
            this.model.get('current') ? $(this.el).addClass("current") : $(this.el).removeClass("current");
            this.model.get('flag') ? $(this.el).addClass("flagged") : $(this.el).removeClass("flagged");
            if(this.model.has_response()) $(this.el).addClass("answered");
             return(this);
      },

        // Look up translation in translations.js file
        translate_label: function(txt, chapter=null) {
           // replace spaces with underscores and turn to lower case letters
            //alert("translate" + txt);
            var normalized_txt = txt.replace(/ /g,"_").toLowerCase();
            if(chapter) {
              if((chapter.get("exam_type_name") == "psycho") && chapter.english_chapter()){
                return txt;
              }
            }
            return (NITE.translate.exam.side[normalized_txt] || txt);

        },




       button_click: function(e) {
         NITE.router.jump(this.model.get("index_in_chapter"));
      }
    };

    // This object may be used by specific item types moduls for common tasks
    Item.ContentView = {

       el: $('.question_text').parent(),
        initialize: function(options) {
            //this.inst_template = _.template($("#inst-item-template").html());
            _.bindAll(this,'render');
            this.model.bind('change:current', this.show_or_hide, this);
           /// this.model.bind('change:current', this.set_editable, this);
            //this.model.bind('change:current', this.render);
            this.el.id = this.model.construct_id({prefix: "item"});
            this.el.className = "item " + this.model.get("element_type");
            this.render();   //.invisible();  // not hide() in order to preload resources
       //     $("#qt_" + this.model.get("number")).attr("contenteditable",'true');
        },

        build_editors: function() {
         chapter =  this.model.chapter();
          if(chapter.needs_editor())  {
              chapter.get("editor").build_editors(this.model);    
           }
        },

        remove_editors: function(){
           chapter =  this.model.chapter();
           current_item = chapter.get("current_item");
           if(current_item)
               chapter.get("editor").remove_editors(current_item);  
        },

        render: function() {
            var model = this.model; 
            var element = $(this.el);
            var chapter = model.chapter();
            var mode = model.chapter().get("mode"); // authoring or testing

 	    var viewHelper = {
            getAnswer: function(answers,answer_index) {

	    
	       if(_.isEmpty(answers)){
		
		 return model.get("answer" + answer_index + "_text");
		}
			
	       var answer = ""; 
               answer = _.findWhere(answers, {answer_index: answer_index});
         
               if(answer){
         
                return answer.answer_text;
                }     
               else
               return answer; 

          }
        };
        
            var data = $.extend(model.toJSON(), { mode: mode }, viewHelper)
//////////////////////
	   
	  
            element.html(this.templ(data));//.show();
  
          if(chapter.has_math_formulas())
            element.find("math").attr("mathvariant","normal");//.attr("overflow", "scale");
            return(element);
        },

        set_current: function() {
            var element = $(this.el);
            $("#main").scrollTop(0);
            this.model.get("current") ? element.addClass("current") : element.removeClass("current");
            return(element);
        },

        // prefetch embed tags src (used for displaying swf files), otherwise the request for the swf
        // will happen only when the item gets visible (resulting in a delay until image appears)
        prefetch_embeds: function() {
            this.$("embed").each(function(index, embed){
             $.get(embed.src, function() {}).error(function(){});
           });
           return(this);
        }

    };

    Item.InfoView = {
      initialize: function(options) {
        this.el = "#extra_buttons #item_info";
        _.bindAll(this,'render');
        this.model.bind('change:current', this.render, this);
      },

      render: function() {
        // display number of current item in authoring mode
        if(this.model.get("current")) {
          $(this.el).val(this.model.get("number") + "-" + this.model.get("item_version"));
        } else
          $(this.el).val("");
        return(this);
      }
    };
  /*
    // key-value store
    Item.ViewUtils = {
      // Utils
      value_for: function(key, val) {
               return(val === undefined ? this[key] : (this[key] = val));
      },

      increment: function(key) {
             return(this[key] === undefined ? this[key] = 1 : this[key] += 1);
      }
    };
    */
/*
    jQuery.fn.visible = function() {
      return this.css('visibility', 'visible');
    };

    jQuery.fn.invisible = function() {
      return this.css('visibility', 'hidden');
    };
*/

})(NITE.module("item"));
