

(function(Editor) {
//

    // Define a Editor model
    //using CKEDITOR inline
    Editor.Model = Backbone.Model.extend({

        initialize: function() {
           _.bindAll(this, 'has_editors', 'build_editors',  'remove_editors', 'have_changed');//?


        },
        
        has_editors: function(){

           var num_editors = Object.keys(CKEDITOR.instances).length;
           return (num_editors > 0);

        },
        
        
        build_editor: function(editor_id){

          $("#" + editor_id).attr("contenteditable",'true');

        // The inline editor is opened with option "allowedContent:true"
        // This option disables the filter of data.
        // Although added the config option in config.js file:
        //   CKEDITOR.dtd.$removeEmpty['span'] = 0;                
        // with this option the inline editor does not remove the empty span tags
        // in the question.
        //The commented option (on:insertHtml) is therefore not needed when both options exist.
         if (!(editor_id in CKEDITOR.instances)) {
          var editor =  CKEDITOR.inline(editor_id, {allowedContent: true});
          if(editor && NITE.DEBUG_MODE){
            console.log(editor_id + " in editor was successfully built");
           // alert(CKEDITOR.config.tabIndex);
        //    console.log("height:" + editor.height());
//              editor.on( 'doubleclick', function( event ) {
//                  console.log("double clicked");
//                  //var webeqObj = new CKEDITOR.dialog( editor, 'webeqDialog' );
//                 // CKEDITOR.dialog.add( 'webeqDialog', this.path + '/dialogs/webeq.js' );  
//                 // webeqObj.show();  
//                 //CKEDITOR.dialog.getCurrent().show();
//            
////             function( evt )
////        {
////            var element = evt.data.element;

////            if ( element.is( 'typeOfElement' ) )
////                evt.data.dialog = 'commandName';

////        });
////},
//            
//            
//                 var selectedText;
//                 if(event.listenerData)
//                 selectedText = event.listenerData.getSelectedText();
//                 editor.openDialog( 'webeqDialog', function(){ alert("selected text0:" + editor.getSelection().getSelectedText()); } );
//               },editor,editor.getSelection());
//            }

//      
//      
//     
//      
//      
//      
        }
          return editor;      
        }
        else
         return null;
         },
         
        // fill in the blank auto completed phrases are not considered an editing change, and must be reset
        // prior to checking for dirty items
        reset_fill_in_the_blanks: function() {
          all_blanks = document.querySelectorAll(".blank.with_content");
          if(all_blanks.length > 0)
            all_blanks.forEach(function(elem) {
            elem.classList.remove("with_content");
            elem.innerHTML = ""
          });
        },
        have_changed: function(){
            this.reset_fill_in_the_blanks();
            for(editor_id in CKEDITOR.instances) {
               if(CKEDITOR.instances[editor_id].checkDirty())
                  return true;
            }   
            return false;
        },
        
        has_changed: function(editor_id){
            this.reset_fill_in_the_blanks();
            if(editor_id in CKEDITOR.instances) 
                return(CKEDITOR.instances[editor_id].checkDirty())
            else
              return false;
                
        },
         
        get_editor_updates: function(editor_id){
           this.reset_fill_in_the_blanks();
           if(this.has_changed(editor_id)){
              
              return CKEDITOR.instances[editor_id].getData();
           }
           else 
            return null;
         },
        
        
        remove_editor: function(editor_id){
    
           $("#" + editor_id).attr("contenteditable",'false');
           if(NITE.DEBUG_MODE)
             console.log("destroying " + editor_id);         
            //returns undefined or false
            if (editor_id in CKEDITOR.instances) {
               return CKEDITOR.instances[editor_id].destroy(false);
            }
            else
             return false;
          
        },

        remove_editors: function(item){
    // all items include item IN
            var chapter = item.chapter();
            var item_type = item.get("element_type");
            var question_number = item.get("number");
            if (chapter.edited[question_number] == undefined)
             chapter.edited[question_number] = {};
  
           var num_editors = item.get("num_answers"); 
	
	// if the user is administrator, remove the editor for the instructions and save updated under "-1" key
	   if(chapter.administring()){
		 if(item_type == "MC" || item_type == "BL" || item_type == "TX") {
		    var instructions_id = "in_" + question_number;
		    var editor_updates = this.get_editor_updates(instructions_id);
		    if(editor_updates){
		       chapter.edited[question_number][-1] = editor_updates;
		    
		    }
		   var instructions_editor =   this.remove_editor(instructions_id);
 	   }
	}

      

        //item MC editors:
           if(item_type == "MC") {
	
           

	
              for(var i=1;i <= num_editors; i++){
                    var answer_id = "a_" + question_number + "_td_" + i;
                    var editor_updates = this.get_editor_updates(answer_id);
                    if(editor_updates != null){
                        chapter.edited[question_number][i] = editor_updates;
                    }
                    this.remove_editor(answer_id);
         
              }
         }  

             if(item_type == "TX") {
              if(chapter.line_numbers()){
                    
                       
                       //    $("span").remove(".break");  
                      }

             }

//            if(item_type == "TX") {
//               var instructions_id = "in_" + question_number;          
//               var editor_updates = this.get_editor_updates(instructions_id);
//               if(editor_updates){
//                   chapter.edited[question_number][1] = editor_updates;
//               }    
//               this.remove_editor(instructions_id);
//         
//            }
          
	    var question_id = "qt_" + question_number;
            var editor_updates = this.get_editor_updates(question_id);
            if(editor_updates){
               chapter.edited[question_number][0] = editor_updates;
            }

            if(_.isEmpty(chapter.edited[question_number]))
                delete chapter.edited[question_number];
       	   console.log("remove " + question_number + " ");	
            this.remove_editor(question_id);         
           
            
        },
        
        build_editors: function(item) {
           var chapter = item.chapter();
           var item_type = item.get("element_type");
           var question_number = item.get("number");
           var question_text_id =  "qt_" + question_number;
           var question_editor =   this.build_editor(question_text_id);
           var num_editors = item.get("num_answers"); 
	   console.log("build" + question_editor+ " " + question_text_id);	
	// if the user is administrator, add an editor for the instructions too
	if(chapter.administring()) {
		if ((item_type == "MC") || (item_type == "BL") || (item_type == "TX")){
			
			   var instructions_id = "in_" + question_number;
			   var instructions_editor =   this.build_editor(instructions_id);
		}
	}
	


        //item MC editors:
           if(item_type == "MC"){
	       CKEDITOR.dtd.$editable.td = 1;               
               for(var i=1;i <= num_editors; i++){
                   answer_id = "a_" + question_number + "_td_" + i;
                   this.build_editor(answer_id);
               }
           }
        
            //item TX editors:
            if(item_type == "TX"){
//                instructions_id = "in_" + question_number;          
//                if(!chapter.quantitive_chapter())      
//                 $("#" + question_text_id).parent().linenumbers(); 
//                 var instruction_editor = this.build_editor(instructions_id);
              
                if(question_editor){
                    question_editor.on( 'blur', function( e ) {
                     if(NITE.DEBUG_MODE)
                      console.log("blur");  
                      if(chapter.line_numbers()){
                           $("#" + question_text_id).parent().linenumbers(question_editor.getData());
                    
                           // if($(".break").length > 0)
                           //     $("span").remove(".break");  

                            // $(".TX .question_text p br").before("<span class='break'>*</span>");  
                      }
                      
//                     // this.remove_editors(item);

                  
                },this);
              }  
            }

        
        }
        


         
        });
        
         Editor.View =  Backbone.View.extend({
         
          initialize: function() {
          // this.parent_view = this.options.parent_view;
          _.bindAll(this);
        
          }

         
         });

})(NITE.module("editor"));


