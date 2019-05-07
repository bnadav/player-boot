
// Module reference argument, assigned at the bottom
(function(Chapter) {

    // Dependencies
    var Item = NITE.module("item");

    // Define a chapter model
    Chapter.Model = Backbone.Model.extend({
        url: NITE.SUB_URI + "/api/v" + NITE.API_VERSION,
        timers: [],
        edited: {},

        defaults: {

            backup_failure_counter: 0
        },

        initialize: function() {
          _.bindAll(this, 'submit', 'backup', 'fetch_data', 'start_chapter', 'update_timer', 'backup_error');
          var collection = NITE.module("item_collection");
          this.set('all_items', new collection.Model());
          //console.log("all items initialized");
        },

        set_editor: function(nite_editor){
            this.set({
                editor: nite_editor
            });
        },


        fetch_data: function() {
            this.fetch({
                success: this.start_chapter,
                error: this.fetch_error
            });
        },

        //start_chapter: function(model, response) {
        start_chapter: function() {
          //this.create_item_list(model, response);
          this.create_item_list();
          if(this.testing()) {
            this.start_timers();
          }
          if(this.authoring()){
          // this.set_editor(model)
          }
        },

        // Create a form, populate it item responses as hidden fields and submit
        submit: function() {

          if ($("#submit_form").length != 0) { return }  // Guard against double submit

          var form = $(document.createElement('form'));
          form.attr("method","post").attr("action", this.url).attr("id", "submit_form");
          // csrf token
          form.append($('<input>').attr({type: 'hidden',
            name: 'authenticity_token',
            value: $('meta[name="csrf-token"]').attr('content')}));

          // responses values
          _.each(this.collect_data(), function(data) {
            form.append($('<input>').attr({
              type: 'hidden',
              name: data['name'],
              value: data['value']
             }));
          });
          form.appendTo("#side").submit();
        },

        // Create an array of objects, each object contain name of input filed and it's value
        // For each item create an object with item index as name and response as value.
        // Add object to represent response time and append to end of array.
        collect_data: function() {
            var data = this.get("all_items").map(function(item){
                      return({name: "responses[" + item.get("index_in_chapter") + "]",
                              value: (item.get("response") || "-9") });
            });

            data = _.toArray(data);
            data.push({
              name: 'response_time',
              value: this.get("due_time") - this.get("allowed_time")
            });
            data.push({
              name: 'chapter_index',
              value: this.get("chapter_index")
            });
            data.push({
              name: 'backup_failure_counter',
              value: this.get("backup_failure_counter")
            });
            return(data);
        },

        // Construct all_items collection. For each item also save
        // it's unit-index, index-in-unit and index-in-chapter.
        create_item_list: function()
        {

            //var all_items = model.get("all_items");
            var all_items = this.get("all_items");
            var last_tx_item_index, i;  // lst item of type tx
            _.each(this.get('units'), function (unit, unit_index) {
                _.each(unit.items, function(item, index_in_unit) {
                    all_items.add(item, {extra_attrs: {
                      unit_index: unit_index,
                      index_in_unit: index_in_unit},
                      silent: true});
                });
            });
            // Pick trnaslation language object as a hash
            NITE.translate =
            new NITE.Translation(this.get("lang_abbr")).translation_object;
            //NITE.translateEN = new NITE.Translation(this.get("en")).translation_object;
            // Trigger data-ready event
            if(this.needs_editor()){
              this.create_editor();
            }

            this.trigger('data-ready');
        },

        // only for authoring
        create_editor: function() {
          $('head').append('<script src="' + NITE.BASE_PATH + 'js-src/modules/editor.js" type="text/javascript"></script>');
          $('head').append('<script> var CKEDITOR_BASEPATH = "' + NITE.BASE_PATH + 'javascripts/ckeditor/";</script>');
          $('head').append('<script src="' + NITE.BASE_PATH + 'javascripts/ckeditor/ckeditor.js" type="text/javascript"></script>');

          if(NITE.DEBUG_MODE) {
            console.log("adding ckeditor");
          }
          var editor = NITE.module("editor");
          this.set_editor(new editor.Model());
          if(NITE.DEBUG_MODE) {
            console.log("item list created for mode:" + this.get("mode"));
          }
        },

        fetch_error: function(model, response) {
            throw "Error fetching data from the server!";
        },

        // Move to next item (as a result from pusing the "Next" button)
        get_next_item: function() {
            var all_items = this.get("all_items");
            var item_index = this.item_index();
            if (item_index < (all_items.length - 1))
              return(all_items.at(item_index + 1))
            else
              return(null);
        },

        get_previous_item: function() {
            var all_items = this.get("all_items");
            var item_index = this.item_index();
            if (item_index > 0)
              return(all_items.at(item_index -1))
            else
              return(null);
        },

        set_current_item: function(item) {
            if(item == this.get("current_item")) {
                return
            };
            this.set({
                current_item: item
            });
        },

        set_current_kernel: function(kernel) {
          var previous = this.get("current_kernel");
          if(previous && previous != kernel) {  // kernel was changed
            previous.set({current_kernel: false});
          }
          this.set({current_kernel: kernel});
        },

        // Timers
        // Set up timers for clock, submit, backup
        start_timers: function() {
          var allowed_time = parseInt(this.get("allowed_time"));
          this.set({due_time: allowed_time});
          // Submit timer
          //this.timers.push(window.setTimeout(this.submit, allowed_time * 1000));
          // Backup timer
         // this.timers.push(window.setInterval(this.backup, backup_interval * 1000));
          // Seconds conuter timer for clock
          this.timers.push(window.setInterval(this.update_timer, 1000));
        },

        // Perform backup operation. Call handlers upon success and failure
        backup: function() {
          var model = this;
          $.ajax({
            url: NITE.SUB_URI + "/api/v" + NITE.API_VERSION + '/backup',
            type: 'POST',
            data:  this.collect_data(),
            error: this.backup_error,
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
            success: function() {
              model.set("backup_failure_counter", 0);
            }
          });
        },

        // I backup fails, try a few more shots and then send a communicatin_error event
        // and cleear all timers. The communication_error event should be caught by the view
        // and clear it.
        backup_error: function(jqXHR, textStatus, errorThrown) {
              this.set("backup_failure_counter", this.get("backup_failure_counter")+1);
              // try again in 10 secs
              this.timers.push(window.setTimeout(this.backup, 10000));
              if (this.get("backup_failure_counter") > NITE.MAX_BACKUP_FAILURES) {
                this.clear_timers();
                this.trigger("communication_error"); // Event is caught by view
              }
        },

        // Reset all timers and intervals
        clear_timers: function() {
          //try {
            _.each(this.timers, function(t) {
              //clearTimeout(t);
              clearInterval(t);
            })
          //}
          //catch(e){}
        },

        // trigers change:allowed_time event
        update_timer: function() {
          // If examinee opened an alert box - calc the time spent watching it and later substract
          // from allowed_time. Finally reset confirm_box_opened_at to null.
          var confirm_box_opened_at = this.get("confirm_box_opened_at");
          // substract a second from allowed time anyway
          var new_allowed_time = this.get("allowed_time") -1;
          // substract time spent on confirm box - if opened
          if (confirm_box_opened_at != null) {
            var time_spent_on_confirm_box = Math.round(((new Date).getTime() - confirm_box_opened_at.getTime())/1000);
            //console.log("Time spent on confirm box = " + time_spent_on_confirm_box);
            new_allowed_time -= time_spent_on_confirm_box;
            // reset variable for possible another confirm box openning
            this.set("confirm_box_opened_at", null);
          }
          // Save new allowed_time and fire a change event
          // if new_allowed_time is < 0, set it to 0 and wait for submit event to happen
          this.set("allowed_time", new_allowed_time > 0 ? new_allowed_time : 0);
          this.submit_if_time_is_up() || this.backup_if_time_is_up();  // First try to submit
        }   ,

        submit_if_time_is_up: function() {
           if(this.allowed_time() == 0) {
             this.clear_timers();  // Stop timer, so no more backups will be sent
             this.submit();
             return(true);
           }
           else
             return(false);
        },

        backup_if_time_is_up: function() {
          if((this.get("due_time") - this.allowed_time()) % this.time_between_backups() == 0)
          //if(this.allowed_time() % this.time_between_backups() == 0)
            this.backup()
        },

        // Utility
        //========
        allowed_time: function() {
          return(parseInt(this.get("allowed_time")));
        },

        formatted_time: function() {
          var timer_value = "";
          var allowed_time = this.get("allowed_time");
          var hours = Math.floor(allowed_time / 3600);
          var minutes = Math.floor((allowed_time - hours*3600) / 60);
          var seconds = allowed_time - hours*3600 - minutes*60;
          if (seconds < 10 ) {seconds = "0" + seconds};
          if (hours > 0) {timer_value = hours + ":" + minutes + ":" + seconds}
          else if (minutes > 0) {timer_value = minutes + ":" + seconds}
          else {timer_value = seconds}
          return (timer_value);
        },

        time_between_backups: function() {
           return(parseInt(this.get("time_between_backups")));
        },

        //
        // Count and cache number of items of each 'element_type' e,g: IN, MC, RC
        // count all items for whose poperty field equals to the given value
        total_num_items_for_property : function(property, requested_value) {
            var key = "total_num_of_" + property + "_" + requested_value;
            if(this[key] === undefined) {
                // reduce is proxied by backbone to underscore.js
                this[key] = this.get("all_items").reduce(
                    function(num, item) {
                        var current_value = item.get(property);
                        if(current_value && current_value.toLowerCase() === requested_value){
                          return(num+1);
                        } else {
                          return(num);
                        }
                    }, 0);
            }
            return(this[key]);
        },


        instructions_chapter: function() {
           return(this.name_contains_instructions() || this.first_chapter_in_testing_mode());
        },

        last_chapter: function() {
          return(this.get("last_chapter"));
        },

        testing: function() {
           return (this.get("mode") == "testing");
        },

        must_answer_all_items: function() {
          return (this.get("must_answer_all_items"));
        },

        authoring: function() {
           return ((this.get("mode") == "authoring") || (this.get("mode") == "administring"));
        },

	      administring: function() {
           return (this.get("mode") == "administring");
        },

        has_editor:function(){
            return (this.get("editor") != undefined);
        },

        needs_editor: function(){
            return  (this.authoring() && localStorage['editor_enabled']=='true')
        },

        need_mathjax: function() {
             return( this.get("need_mathjax")  ) ;
        },

        fsingle_item_view: function() {
           return(this.authoring && this.get("start_from_item"));
        },

        fill_the_blank: function() {
          return(this.get("fill_the_blank") == true);
        },

       show_number: function() {
          return (this.get("show_number") == true);
       },

        // fetch value from items collection
        all_items_answered: function() {
          return(this.get("all_items").all_answered());
        },

        name_contains_instructions: function() {
          return (this.get("name").indexOf("instructions") != -1);
        },

        first_chapter_in_testing_mode: function() {
         return (this.testing() && this.get("chapter_index") == 0)
        },

        total_num_items_for_type: function(item_type) {
            if(this["total_num_of_" + item_type] === undefined) {
           //      reduce is proxied by backbone to underscore.js
                this["total_num_of_" + item_type] = this.get("all_items").reduce(function(num, item) {
                        return((item.get("element_type").toLowerCase() === item_type) ? num+1 : num);
                    }, 0);
            }
           return (this["total_num_of_" + item_type]);
        },

        verbal_chapter: function() {
          return (this.get("domain").toLowerCase() == "ve" || this.get("domain").toLowerCase() == "lc"  ||
                  this.get("domain").toLowerCase() == "lg" || this.get("domain").toLowerCase() == "va"  ||
                  this.get("domain").toLowerCase() == "an" || this.get("domain").toLowerCase() == "ta"  ||
                  this.get("domain").toLowerCase() == "mr" || this.get("domain").toLowerCase() == "in"  ||
                  this.get("domain").toLowerCase() == "yc" || this.get("domain").toLowerCase() == "yo"  ||
                  this.get("domain").toLowerCase() == "rd");

        
        },

        has_math_formulas: function() {
          return (this.get("domain").toLowerCase() == "qu" || this.get("domain").toLowerCase() == "ka"  ||
                  this.get("domain").toLowerCase() == "di" || this.get("domain").toLowerCase() == "se"  ||
                  this.get("domain").toLowerCase() == "fo") ;
        },

        needs_formulas_page: function() {
          return (this.get("domain").toLowerCase() == "qu" || 
                  this.get("domain").toLowerCase() == "ka"  || 
                  this.instructions_chapter() && this.get("domain").toLowerCase() != "yc"); 
        },

              
       quantitive_chapter: function() {
            return(this.get("domain").toLowerCase() == "qu" || this.get("domain").toLowerCase() == "ka" );
        },

        english_chapter: function() {
            return(this.get("domain").toLowerCase() == "en");
        },

        is_open_chapter: function() {
            return(this.get("domain").toLowerCase() == "yo");
        },

        is_writing_chapter: function() {
            return(this.get("domain").toLowerCase() == "wr");
        },


        // Do not line-number quantitative chapters, unless instruction chapter
        line_numbers: function() {
            return(this.instructions_chapter() || this.verbal_chapter() || this.english_chapter());
        },

        chapter_name: function() {
        if(this.instructions_chapter())
            return(NITE.translate.explanations_chapter);
        else if(this.authoring() || this.show_number()){
            // Should return chapter serial number in testing
            var chapter_spec = (this.get("chapter_spec") != "0" ? ( this.get("chapter_spec") + " ") : "");

            return( chapter_spec + NITE.translate.chapter_number + " " + this.get("number"));

          }
        else
            return(NITE.translate.chapter_number + " " + this.get("chapter_index"));

        },

        chapter_domain: function() {
            var str="";
            switch(this.get("exam_type_name")) {
                case("amir"):
                    str = NITE.translate.english;
            }
            return(str);
        },


        has_prev_edited_changes: function(){
          return (Object.keys(this.edited).length > 0);
        },

        item_index: function() {
           return (this.get("current_item").get("index_in_chapter"));
        }

    });//model




    Chapter.View = Backbone.View.extend({
        initialize: function() {
            this.el = $('#columns_inner_container');
            this.side = new Chapter.SideView({
                model: this.model
            });
            this.mobile_buttons = new Chapter.MobileButtonsView({
              model: this.model
            }); 
            var item_collection_module = NITE.module("item_collection");
            this.buttons = new item_collection_module.ButtonsView({
              collection: this.model.get("all_items")});

            this.contents = new item_collection_module.ContentView({
              collection: this.model.get("all_items")});
            /*
            this.main = new Chapter.MainView({
                model: this.model

            });
            */

            _.bindAll(this, 'render');

            // register render functions to be triggerd when data has finished loading
            this.model.bind('data-ready', this.render, this);

            this.model.bind('render-ready', this.navigate_to_initial_item, this);
            this.model.bind('render-ready', this.mathjax_render, this);

            // register communication_error event
            this.model.bind('communication_error', this.communication_error, this);
        },

        events: {
        },

        render: function() {

            var lang_abbr =  this.model.get("lang_abbr");
            this.set_examination_type();
            this.set_language_and_domain();
            this.set_item_title();
            this.side.render();
            this.buttons.render();
            this.contents.render();

            //^^^start_item.make_current();
            this.set_flag_button();   
            this.set_visible(true);
            this.enable_swipe();

            Backbone.history.start();
            this.model.trigger('render-ready');
            return(this);
        },

        navigate_to_initial_item: function() {
            var start_item;
            if(this.model.get("start_from_item")){
               start_item = this.model.get("all_items").findWhere({number: this.model.get("start_from_item")});
               console.log("start item:" + start_item); 
               this.side.disable_all_but_submit_button();

            }
            else {
              start_item = this.model.get("all_items").first();
            }
            if(this.model.needs_editor() ) {
               this.model.get("editor").build_editors(start_item);
            }
            //Backbone.history.start({pushState: true});
            NITE.router.jump(start_item.get("index_in_chapter"));
        },

        set_item_title: function() {
           if(this.model.fsingle_item_view){
             $(document).attr("title", this.get_item_title());
           }

        },

        set_flag_button: function() {
          
          if(this.model.is_writing_chapter()) {
            $("#flag_button").hide();
            
          }
        }
        ,
        get_item_title: function() {
          var item_title="";
          var start_from_item = this.model.get("start_from_item");
          var start_from_version =  this.model.get("start_from_item_version");
          if(start_from_item) {
            item_title = start_from_item + "-" + start_from_version;
            var start_from_item_subversion =  this.model.get("start_from_item_subversion");
            if(start_from_item_subversion)
              item_title +=  "(" + start_from_item_subversion+")";

          }

          return(item_title);
       },

        

        set_visible: function(bool) {
            if(bool) {
                $("#spinner").hide(); // hide spinner
                this.el.css({"visibility": "visible"});
            }
        },

      enable_swipe: function() {
        // Enable swipe detection only on mobile in testing mode
        if(!this.model.needs_editor()) {
          $("body").swipe( {
            //Generic swipe handler for all directions
            swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
              if($(window).width() <=1020) {
                if(direction == "left") { $(".next_button").click()}
                if(direction == "right") { $(".previous_button").click()}
              }
            }
          });
        }
      },

        set_examination_type: function() {
          $("body").addClass(this.model.get("exam_type_name"));
        },

        //Append lang_abbr and domain classes to body tag
        set_language_and_domain: function() {
           $("body").addClass("lang_" + this.model.get("lang_abbr")).
                     addClass("domain_" + this.model.get("domain"));
          if(this.model.verbal_chapter()){
               $("body").addClass("verbal");
          }
          if(this.model.has_math_formulas()){           
               $("body").addClass("math");
          }          
           
          if(this.model.instructions_chapter()) {
            $("body").addClass("instructions");
            $("body").addClass("number_" + this.model.get("number"));//to find the css for each chapter-if rtl or ltr
           }
        },

        // Append stylesheet for exam to head section
        create_css_node: function(exam_type_name, lang_abbr) {
            var path = NITE.BASE_PATH + "/stylesheets/" + exam_type_name + "_" + lang_abbr + ".css";
            $("head").append('<link rel="stylesheet" type="text/css" href="' + path + '" />')
        },

        communication_error: function() {
          alert("Communication error -- aborting");
          this.el.html("<div></div>");
        },

        mathjax_render: function() {
          if(this.model.need_mathjax() && this.model.has_math_formulas() && (navigator.userAgent.indexOf("Firefox") == -1)) {

          $('head').append('<script type="text/x-mathjax-config">MathJax.Hub.Config({ SVG: { scale: 85 } });</script>');
          // $('head').append('<script type="text/x-mathjax-config"> MathJax.Hub.Config({ root: ["' + NITE.BASE_PATH + '/javascripts/MathJax/"] });</script>');

          //   $('head').append('<script src="' + NITE.BASE_PATH + 'javascripts/MathJax/MathJax.js?config=TeX-AMS-MML_SVG-full.js" type="text/javascript"></script>');
           $('head').append('<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=MML_SVG-full.js" async></script>');

          //   MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

            }

        }

    });


    Chapter.SideView =  Backbone.View.extend({
        //current_item: null,
        el:  "#side",

        initialize: function() {
           _.bindAll(this, 'submit', 'update_timer', 'enable_or_disable_submit_button');
          // _.bindAll(this, 'toggle_flag', 'next_item', 'submit', 'update_timer', 'enable_or_disable_submit_button');
          this.model.bind('change:allowed_time', this.update_timer);
          // when all items have been answered, the items-collection attached to the chapter fires an event
          this.model.get("all_items").bind("change:all_items_answered", this.enable_or_disable_submit_button);
        },

        events: {
            "click #submit_button": 'submit'
        },

        render: function() {
            this.set_chapter_name();
            this.set_chapter_domain();
            this.set_formulas_link();
            this.$("label[for=timer]").text(NITE.translate.exam.side.time_left);
            this.$("label[for=word_count]").text(NITE.translate.exam.side.word_count);
            // Disable submit button if testing mode -
            // it should be enabled only after examinee answered all items
            this.enable_or_disable_submit_button();
            // show or hide item_info according to display mode
            this.show_or_hide_item_info();
            this.show_or_hide_formulas();
            this.set_submit_button_value();
            return(this);
        },
        
        // Add Chapter name, number and domain to top of view
        set_chapter_name: function() {
            this.$("#chapter_number").prepend(this.model.chapter_name());
        },

        set_chapter_domain: function() {
            if(!this.model.instructions_chapter()) {
                this.$("#chapter_label").html(this.model.chapter_domain());
            }
            // Hide if empty
            if(this.$("#chapter_label").html() == "")
                this.$("#chapter_label").hide();
        },

        set_formulas_link: function() {
            if (this.model.needs_formulas_page()) {
              var exam = this.model.get("exam_type_name");
              var lang = this.model.get("lang_abbr");
              var img_path = NITE.BASE_PATH + "img/formulas/formulas_" + exam + "_" + lang + ".svg";

              var formulas_box = document.querySelector("#formulas_box");
              var close_button = document.querySelector("#formulas_box #close");
              var link = document.querySelector("#formulas_link");

              formulas_box.querySelector("img").src = img_path;               //set image path
              link.onclick = () => formulas_box.className = "visible";        // show image when clicked
              // click anywhere except the img itself, will close the formulas page
              formulas_box.onclick = function(e) {
                if(e.target.tagName.toLowerCase() != "img") {
                  formulas_box.className = "hidden"; 
                }
              }
              link.innerHTML = NITE.translate.exam.side.formulas_button;
              close_button.innerHTML = NITE.translate.close_formulas_page;
            }
        },

        send_editors_changes: function() {
          var model = this;
          var last_item = this.model.get("current_item");
          if(last_item) {
             var last_number = last_item.get("number");
             this.model.get("editor").remove_editors(last_item);
          }
	//alert(this.model.edited);
       $.ajax({
            url: '/editor_items/update',
            type: 'POST',
            data:  {chapter: this.model.get("id"), items: this.model.edited},
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
            success: function() {
             
              window.opener.location.reload();
              window.close();
            }
          });

        },
        // If in a testing mode - submit responses, else close current window
        submit: function() {

         if(this.model.testing()) {
            if (Chapter.GeneralViewUtils.confirm_move_chapter(this.model)) {
              this.$("#submit_button").attr("disabled", "disabled");  // prevent double clicks
              this.model.submit();
            }
          }
           else if (this.model.has_editor() && (this.model.get("editor").have_changed()|| this.model.has_prev_edited_changes())){
             var msg_close = NITE.translate.about_to_close_chapter;
             var msg_save = NITE.translate.about_to_save_changes_to_chapter;

             var msg_close = NITE.translate.about_to_close_chapter;
             var msg_save = NITE.translate.about_to_save_changes_to_chapter;

            if(confirm(msg_save)){
                    this.send_editors_changes();
             }
             if(confirm(msg_close)){
                        window.close();        
             }

             
            }

        else {

            window.close();

        }

        }, 

        // In authoring mode, when requesting to view a single item - the start_from_item attribute
        // is non null and points to the requested item indes. In such a case disable all side buttons
        // except for the submit button.
        disable_all_but_submit_button: function() {
            //if( this.model.get("start_from_item")){
                
                this.$("#item_buttons input[type='button']").attr("disabled", "disabled");
                this.$('#submit_button').attr("disabled", false);               
                this.$("#next_button").attr("disabled", "disabled");
               

            //}
        },

        // if in testing mode, enable of disable submit button according to whether
        // all items have been answered
        enable_or_disable_submit_button: function() {
          if(this.model.testing() && this.model.must_answer_all_items()) {
            var enabled = this.model.all_items_answered();
           
            if(enabled) {this.$("#submit_button").removeAttr("disabled");}
            else {this.$("#submit_button").attr("disabled", "disabled");}

          }

        },

        // show/hide item number according to mode
        show_or_hide_item_info: function() {
            if (this.model.testing()) this.$("#item_info").hide();
        },

        show_or_hide_formulas: function() {
            var formulas_link = this.$("#formulas_link");
            if (this.model.needs_formulas_page()) {
                formulas_link.show();
                //prelaod the formulas image
              //var m = new Image();
              // m.src = formulas_link.attr("href");
            }
            else
                formulas_link.hide();
        },

        // Set submit button value
        set_submit_button_value: function() {
          if(this.model.last_chapter())
            {this.$("#submit_button").val(NITE.translate.end);}
          else if (this.model.instructions_chapter())
            {this.$("#submit_button").val(NITE.translate.start_exam);}
          else
            {this.$("#submit_button").val(NITE.translate.next_chapter);}
        },

        update_timer: function() {
          var allowed_time = this.model.get("allowed_time");
          var formatted_time = this.model.formatted_time();
          // blink timer label in the last minute of the chapter
          if ((allowed_time == 60)) {
              $("label[for=timer]").blink();
          }
          $("#timer").val(formatted_time);
        },


    });

    Chapter.MobileButtonsView =  Backbone.View.extend({
        el:  "#mobile_buttons",
        
        initialize: function(options) {
          _.bindAll(this,'update_timer');
          this.model.bind('change:current_item', this.render, this);
          this.model.bind('change:allowed_time', this.update_timer);
          this.return_to_index = null;
        },

        events: {
          "click .goto_text_button": 'goto_text',
          "click .next_button":      'next_item',
          "click .previous_button":  'previous_item',
        },

        render: function() {
          var current_item = this.model.get("current_item");
          if(current_item.has_kernel()) {
            $('.goto_text_button').removeClass("hidden");
          } else {
            $('.goto_text_button').addClass("hidden");
          }
          this.update_item_counter();
        },

        update_timer: function() {
          $('.timer').html(this.model.formatted_time());
        },

        next_item: function() {
          var is_last = this.model.get("current_item").is_last();
          var next_item = this.model.get_next_item();
          if(is_last) {
            //console.log("submitting...");
            if(Chapter.GeneralViewUtils.confirm_move_chapter(this.model)) {
              this.model.submit();
            }
            return;
          }
          if(this.return_to_index) {
            NITE.router.jump(this.return_to_index);
            this.return_to_index=null;
          } else if(next_item) {
            NITE.router.jump(next_item.get("index_in_chapter"));
          }
        },

        previous_item: function() {
          var item = this.model.get_previous_item();
          if(item) {
            NITE.router.jump(item.get("index_in_chapter"));
          }
        },

        goto_text: function() {
          var current_item = this.model.get("current_item");
          if(current_item.has_kernel()) {
            this.return_to_index = current_item.get("index_in_chapter");
            NITE.router.jump(current_item.get("super_element_index"));
          }
        },
        
        update_item_counter: function() {
          var current_item = this.model.get("current_item");
          var txt;
          var counter_text = `${current_item.get("index_of_type")} / 
              ${NITE.module("item_collection").GeneralUtils.count_by_prefix(current_item.get("element_type"))}` 
          if(current_item.is_tx()) {
            $(".item_counter").html(current_item.get("index_of_type") + " קטע");
          } else if (current_item.answerable()) {
            $(".item_counter").html(counter_text + " שאלה");
          } else {
            $(".item_counter").html("");
          }
        }
    });

       // jquey plugin for blinking an element
      jQuery.fn.blink = function() {
        var e = $(this);
        setInterval(function(){
            e.each( function(){
                e.css('visibility' , e.css('visibility') === 'hidden' ? '' : 'hidden')
                } );
            }, 500);
        return(e);
      };

      Chapter.GeneralViewUtils = {
        // Utility
        // Construct a message according to chapter index
        // and present to examinee in a confirm box
        // Before presenting the confirm box - set model.confirm_box_opened_at to a new Date obj
        // Attention: As of Firefox version 61, ther is a bug that does not open the confirm box in responsive desgin view !
        confirm_move_chapter: function(model) {
          model.set("confirm_box_opened_at", new Date());
          var msg="";
          if(model.instructions_chapter()) {
            msg = NITE.translate.about_to_start_exam;
          } else if(model.last_chapter()) {
            msg = NITE.translate.about_to_finish_exam;
          } else {
            msg = NITE.translate.about_to_move_chapter;
          }
          return confirm(msg);
        }
      }


})(NITE.module("chapter"));




