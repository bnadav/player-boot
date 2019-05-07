var _insertblank_editorIcon = CKEDITOR.basePath + '/plugins/insertblank/icons/bottom.png';
var _blank_snippet = " <span class='blank'></span> ";




CKEDITOR.plugins.add( 'insertblank', {
    
    icons: _insertblank_editorIcon,
      
    init: function( editor ) {
    
        // Plugin logic goes here...
        editor.addCommand( 'insertblankDialog',  {
                            exec: function( editor ) {
                            editor.insertHtml(_blank_snippet);
                            }} );


       
        
        editor.ui.addButton( 'insertblank', {
           label: 'Insert blank in sentence competion ',
            command: 'insertblankDialog',
            toolbar: 'insert',
            icon: _insertblank_editorIcon
        });
     
     
}}); 



