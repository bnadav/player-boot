CKEDITOR.dialog.add( 'webeqDialog', function ( editor ) {

    return {
        title: 'Insert Math Equation',
        minWidth: 500,
        minHeight: 280,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                    
                        type: 'html',
                        html: '<div id="anApplet"></div><form>\
                               <script language="javascript">GetButtonText();</script></form>'
                    }
                    
                ]
            }
            
        ],

        buttons: [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ],
        onShow: function() {
            var spanmml;
            var mml;
            var pointSize = 12;
           this.reset();

            // if we have a previous selection get the MathML
    	if ( editor.getSelection().getType() == CKEDITOR.SELECTION_ELEMENT ){//need to check instead of 

        		var selectedElement = editor.getSelection().getSelectedElement();

            		mml = selectedElement.getHtml();
            		
       		}
	    	if ( editor.getSelection().getType() == CKEDITOR.SELECTION_TEXT ){//need to check instead of 
	        	var selectedElement = editor.getSelection();
                
                selectedText = editor.getSelection().getSelectedText();//or getHtml
              
                if(selectedElement && (selectedElement.getSelectedText() != "")){
            		
            		mml = selectedElement.getCommonAncestor();

                    spanmml =$(mml.$).closest(".math_placeholder").clone();
                    mml = $("math",spanmml).removeAttr("mathvariant").html();
                    if(mml && NITE.DEBUG_MODE)
                        console.log("opened with text mml:" + mml );

	        }
        	}
    		var aDiv = document.getElementById('anApplet');

                     
                      
          var html = "<applet id=\"webeqapplet\" \
                       width=480 height=280 \
                       archive=\"/webeq/WebEQApplet1.jar\" \
                       code=\"webeq3.editor.InputControl.class\"\
                       codebase=\"/webeq\" \ \
                       name = \"editor\"  \
                       align = \"middle\" >";

	    	if(mml){

	    		html += "<param name=\"eq\" value=\"" + mml + "\" />";
	    	}
	    	html += "<param value=\"black\" name=\"foreground\" />";
	    	html += "<param value=\"pink\" name=\"background\" />";
	    	html += "<param value=\"true\" name=\"selection\" />";
	    	html += "<param value=\"mathml\" name=\"parser\" />";
	    	html += "<param value=\"true\"  name=\"separate_jvm\" />";
	    	html += "<param value=\"" + pointSize + "\" name=\"size\" /></applet>";

	    	aDiv.innerHTML = html;
        
        },
        
        onOk: function() {
            
            // find the WebEQ editor instance
            var webeqEditor = document.editor;

        
//  		    for(i in webeqEditor){
//                     console.log(webeqEditor[i])
//            }		

    		// grab the mathml from the WebEQ Editor
    		var mml = webeqEditor.getFormattedMathML(1,1,false,"",1);
          
    		if ( editor.getSelection().getType() == CKEDITOR.SELECTION_ELEMENT ){//need to check instead of 

        		var selectedElement = editor.getSelection().getSelectedElement();
        	      
       		}
       		else if ( editor.getSelection().getType() == CKEDITOR.SELECTION_TEXT ){//need to check instead of 
	        	var selectedElement = editor.getSelection();
                
                selectedText = editor.getSelection().getSelectedText();//or getHtml
                
              
                if(selectedElement && (selectedElement.getSelectedText() != "")){


            		oldmml = selectedElement.getCommonAncestor();
                    oldmml =$(oldmml.$).closest(".math_placeholder");

                //    spanmml =$(mml.$).closest(".math_placeholder");


                   
            	
            	   if(NITE.DEBUG_MODE) {
                        console.log("setting mml:" + mml);	
	                    console.log("old element text:" + oldmml.html());
	                }
    
                    oldmml.html(mml);
	                oldmml.prop("contenteditable", false);
                    $("math",oldmml).attr("mathvariant","normal");
        	        
                }            		
         		 else {
            			// insert new equation
                                              
                        var $mml = $(mml);
                          
	                $mml.prop("contenteditable", false);
                    $("math",$mml).attr("mathvariant","normal");
  
                        if(NITE.DEBUG_MODE)
                         console.log("insert mml=" + $mml.html());

                         editor.insertHtml( "<span class=\"math_placeholder\" contenteditable='false'><math mathvariant='normal'>" + $mml.html() + "</math></span>" ,"unfiltered_html");
                                      
    		       }

                    
	        }
       		
       	    webeqEditor.destroy();
        },
        
         onCancel: function(evt) {
            
            // find the WebEQ editor instance

//    		var mml = webeqEditor.getFormattedMathML(1,1,false,"",1);
//            $("math",$mml).attr("mathvariant","normal");
            var webeqEditor = document.editor; 
            
        }        
        ///------------------------------------------------------------------------
        
     

      
        /*// This is called when the user wants to insert/update the equation
	function ok(){
		// find the WebEQ editor instance
		var editor = document.editor;

		// find the FCK editor instance
		var FCK = GetFCKEditor();

		// grab the mathml from the WebEQ Editor
		var mml = editor.getFormattedMathML(1,1,false,"",1);
	//	mml = mml.replace(/<math>/, "<math><mstyle  fontfamily=\'Arial\'>");
	//	mml = mml.replace(/<\/math>/, "</mstyle></math>");

		// insert the applet tag into the FCK editor
		if(FCK.Selection && FCK.Selection.GetSelectedElement() ){
			// update equation
			//FCK.Selection.GetSelectedElement().setMathML(mml);
			FCK.Selection.GetSelectedElement().innerHTML = mml;


            //FCK.Selection.GetSelectedElement().height = height;
			//FCK.Selection.GetSelectedElement().width = width;
		} else {
			// insert new equation
            FCK.InsertHtml( "<span class=\"math_placeholder\">" + mml + "</span>" );
		}
		window.close();
    }
*/
    };
});



