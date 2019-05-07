var WebEQAppletPath = "/webeq/.";
var _webeq_editorIcon = CKEDITOR.basePath + '/plugins/webeq/icons/webeq1.gif';
// setup a path to our plugin
var pluginLocation = CKEDITOR.basePath + '/plugins/webeq/';



CKEDITOR.plugins.add( 'webeq', {
    
    icons: _webeq_editorIcon,
      
    init: function( editor ) {
    
        // Plugin logic goes here...
        editor.addCommand( 'webeqDialog', new CKEDITOR.dialogCommand( 'webeqDialog' ) );
        editor.ui.addButton( 'webeq', {
           label: 'Insert Math Equation',
            command: 'webeqDialog',
            toolbar: 'insert',
            icon: _webeq_editorIcon
        });
     
       dialog = CKEDITOR.dialog.add( 'webeqDialog', this.path + '/dialogs/webeq.js' );  
    //   alert(CKEDITOR.dialog.getCurrent().getSize().width);
}}); 


//var width = dialogObj.getSize().width;
/*    // this function opens a dialog containing the WebEQ editor
InsertEquationCommand.Execute = function() {
	if(window.showModalDialog){ // IE
        	window.showModalDialog(pluginLocation + 'insert_eq.html', self, 'center:no;dialogWidth:800px;dialogHeight:470px;scroll:no');
        } else {
        	winHandle = window.open(pluginLocation + 'insert_eq.html',self,'modal,center=no,dialogWidth=800px,dialogHeight=470px,scroll=no');
        	winHandle.focus();
        }
}
        //---------------------------------------------------
        //now from the old code:
        var mml;

        var pointSize = 12;
        // if we have a previous selection get the MathML
		if ( editor.getSelection().getType() == CKEDITOR.SELECTION_TEXT ){//need to check instead of 
		//CKEDITOR.SELECTION_NONE

    		var selectedElement = editor.getSelection().getSelectedElement();
            
            //	    selectedText = editor.getSelection().getSelectedText();//or getHtml
		    //console.log(selectedText);
    		mml = selectedElement.getHtml();//FCK.Selection.GetSelectedElement().innerHTML;
		}
		
//		if(FCK.Selection && editor.getSelection()..getSelectedText() ){
//            console.log(FCK.Selection.GetSelectedElement().innerHTML);
////			mml = FCK.Selection.GetSelectedElement().getFormattedMathML(1,1,false,"",1);
//			mml = FCK.Selection.GetSelectedElement().innerHTML;
//			// alert('mml = ' + mml );
//		}

		// find the DIV that will hold the applet
		var aDiv = document.getElementById('anApplet');

		// build the applet tag
		//var html = '<object id="MathPlayer" classid="clsid:32F66A20-7614-11D4-BD11-00104BD3F987"></object>';
		//html += '<?import namespace="m" implementation="#MathPlayer"?>';
		var html = "<applet codebase=\"\/webeq\" height=\"300\" archive=\"\/webeq\/WebEQApplet.jar\" width=\"700\" align=\"middle\" code=\"webeq3.editor.InputControl.class\" name=\"editor\">";

		if(mml){
			html += "<param name=\"eq\" value=\"" + mml + "\" />";
		}
		html += "<param value=\"black\" name=\"foreground\" />"
		html += "<param value=\"white\" name=\"background\" />"
		html += "<param value=\"true\" name=\"selection\" />"
		html += "<param value=\"mathml\" name=\"parser\" />"
		html += "<param value=\"" + pointSize + "\" name=\"size\" /></applet>";

		 //alert("html="+html);
		// insert the applet tag into the div
		aDiv.innerHTML = html;
        
    }
});

// This variable sets the font size for the equation
	

	// This is called when the user wants to insert/update the equation
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

	

	// this function will insert the html button into the form
	function GetButtonText(){

		var FCK = GetFCKEditor();

		if(FCK.Selection && FCK.Selection.GetSelectedElement() ){
			buttonText = GetParentWin().FCKLang['DlgUpdateEQShort'];
		} else {
			buttonText = GetParentWin().FCKLang['DlgInsertEQShort'];
		}
		//alert("getting button" + buttonText );
		document.write('<input onClick="ok();" type="button" value="' + buttonText + '">');
	}

	// this function will return the parent window that opened this dialog
	function GetParentWin(){
		// grab the argument passed from the parent window
		if(window.opener){
			parentwin = window.opener;

		} else {
			parentwin = window.dialogArguments;
		}
		return parentwin;
	}
	// this function will return the FCK editor
	function GetFCKEditor(){
		var parentwin = GetParentWin();

     //   alert(parentwin.aParams[0].replace(/InstanceName=/,""));
		// find the FCK editor instance
		var FCK = parentwin.FCKeditorAPI.GetInstance(parentwin.aParams[0].replace(/InstanceName=/,""));

		return FCK;
	}
*/




