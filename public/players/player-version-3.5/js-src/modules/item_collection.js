(function(ItemCollection){
  ItemCollection.Model = Backbone.Collection.extend({
    // Collection supports polymorphic items by defining model as a fuction rather then
    // as an attribute.
    model: function(attrs, options) {
      var _this = options.collection;

      var set_last_kernel_index = function(item) {
        if(item.is_tx()) {
          _this.last_tx_item_index = _this.length;
        }
      }
      var super_element_index = function() {
        
        return (attrs['super_element_index'] != null) ? _this.last_tx_item_index : null;
      }
      var create_item =  function() {
        var module_name = "item_" + attrs.element_type.toLowerCase();
        var m = NITE.module(module_name);
        //console.log("Module name is " + module_name)
        //console.log(m)
        
        model = new m.Model(_.extend(attrs, options["extra_attrs"],
                                     { 'super_element_index': super_element_index(),
                                       'index_in_chapter': _this.length,
                                       'index_of_type': ItemCollection.GeneralUtils.increment(`${attrs.element_type}-${attrs.button_text}`),
                                       }));
                                       set_last_kernel_index(model);
                                       return(model);
      };

      return create_item();
    },

    initialize: function() {
      this.all_items_answered = false;
      this.last_tx_item_index = undefined;

      _.bindAll(this,'all_answered');
      // response event originates from the item model - a collection fires on it's objects events
      this.bind("change:response", this.all_answered);
    },

    // return true if all items have been answered, false otherwise.
    // once all items have been answered - fire a change:all_items_answered event - listen by chapter side view
    all_answered: function() {
      // once all_items_answered is true, there is no need to recheck - skip to return statement
      if(!this.all_items_answered) {
        // count number of unanswered items
        var num_unanswered = this.reduce(function(num, item){
          if (item.answerable() && !item.has_response())
            num++;
          return(num)
        }, 0);
        // update attribute & fire event if all items have been answered
        if (num_unanswered == 0) {
          this.all_items_answered = true;
          this.trigger("change:all_items_answered");
        }
      }
      return(this.all_items_answered);
    }
  });

  ItemCollection.ButtonsView = Backbone.View.extend({
    el: "#item_buttons",

    events: {
      "click #flag_button":  'toggle_flag',
      "click #next_button":  'next_item',
    },


    add_one: function(item, container) {
      button = new item.module_object.ButtonView({model: item});
      // Adapt flag button to current item
      item.bind('change', this.set_flag_button, this);
      // Adapt next button view
      item.bind('change:current', this.set_next_button, this);
      //item.bind('change', this.set_next_button);
      container.appendChild(button.render().el);
      //add info view
      if(NITE.chapter_model.authoring()) {
        new item.module_object.InfoView({model: item});
      }
    },

    render: function() {
      var container = document.createDocumentFragment();
      var _this = this;
      this.collection.forEach(function(item) {
        _this.add_one(item, container);
      });
      this.$el.prepend(container);
      this.$("#flag_button").val(NITE.translate.mark_reminder);
    },
    // function is triggered whenver current-item is changed or item_flag is changed
    set_flag_button: function(item) {
      //console.log("set_flag_button");
      if(item.get('current') == true) {
        if(item.get('flag') == true)
          this.$("#flag_button").val(NITE.translate.cancel_reminder);
        else
          this.$("#flag_button").val(NITE.translate.mark_reminder);
      }
    },

    set_next_button: function(item) {
      var button = this.$("#next_button");
      button.val(NITE.translate.exam.side.next);  // set button text
      // Set disable attribute of button
      item.is_last() ? button.attr("disabled", "disabled") : button.removeAttr("disabled");
    },

    // Fetch current item cached on chapter, and call #toggle_flag on it.
    // The call to item.toggle_flag will triger the change:flag event which is binded
    // to #set_flag_button
    toggle_flag: function() {
      var item = NITE.chapter_model.get("current_item");
      if(item && item.answerable()) {
        item.toggle_flag();
      }
    },

    // Proxy movement to next_item to chapter model
    next_item: function() {
      var next_item = NITE.chapter_model.get_next_item();
      if(next_item) {
        //next_item.make_current();
        NITE.router.jump(next_item.get("index_in_chapter"));
      }
    },

    previous_item: function() {
      var previous_item = NITE.chapter_model.get_previous_item();
      if(previous_item) {
        //next_item.make_current();
        NITE.router.jump(previous_item.get("index_in_chapter"));
      }
    },

  });


  ItemCollection.ContentView = Backbone.View.extend({
    el:  "#main",
    add_one: function(item, container) {
      var item_view = new item.module_object.ContentView({model: item});
      container.appendChild(item_view.el);
    },
    render: function() {
      var container = document.createDocumentFragment();
      var _this = this;
      this.collection.forEach(function(item) {
        _this.add_one(item, container);
      });
      this.$el.append(container);
    }
  })

  // key-value store
  ItemCollection.GeneralUtils = {
    // Utils
    store : {},
    value_for: function(key, val) {
           return(val === undefined ? this.store[key] : (this.store[key] = val));
    },

    increment: function(key) {
           return(this.store[key] === undefined ? this.store[key] = 1 : this.store[key] += 1);
    },
    
    // count total of values for keys with given prefix
    count_by_prefix: function(prefix) {
           return Object.keys(this.store).reduce((count, key) => {
              if(key.split("-")[0] == prefix) { count += this.store[key]};
              return count;
            },0); 
    }

  };


}
)(NITE.module("item_collection"));
