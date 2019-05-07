var WebEQAppletPath = "/webeq/.";

CKEDITOR.plugins.add( 'webeq', {
    icons: 'webeq',
    init: function( editor ) {
        // Plugin logic goes here...
        CKEDITOR.dialog.add( 'webeqDialog', this.path + 'dialogs/webeq.js' );  

    }
});

editor.addCommand( 'webeqDialog', new CKEDITOR.dialogCommand( 'webeqDialog' ) );

editor.ui.addButton( 'Webeq', {
    label: 'Insert Math Equation',
    command: 'webeqDialog',
    toolbar: 'insert'
});



