/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
;
    CKEDITOR.stylesSet.add( 'my_styles', [
    // Block-level styles.

    // Inline styles.
      //{ name: 'Blue Title', element: 'span', styles: { color: 'Blue' } },
      // { name: 'Red Title',  element: 'span', styles: { color: 'Red' } },
      //{ name: 'CSS Style', element: 'span', attributes: { 'class': 'my_style' } },
      // { name: 'Marker: Yellow', element: 'span', styles: { 'background-color': 'Yellow' } }
      { name: 'Blue', element: 'span', attributes: { 'class': 'blue_phrase' } },
      //  { name: 'Red', element: 'span', attributes: { 'class': 'red_phrase' } },
      { name: 'Marker', element: 'span', attributes: { 'class': 'yellow_marker' } }
]); 

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config
   
   

   config.toolbar = [
	{name: "mode", items : ['Sourcedialog']} ,
	{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline' ] },
    { name: 'insert', items: [ 'Image', 'Flash',  'SpecialChar', 'insertblank' ] },
	{ name: 'webeq',   items : [ 'webeq' ]},
     { name: 'styles', items: [ 'Styles' ] },
   ]   

  config.stylesSet = 'my_styles';
   // !----> check this option too
    config.fillEmptyBlocks = true; 
    config.ignoreEmptyParagraph = false;
    config.forceEnterMode = true;
    config.enterMode = CKEDITOR.ENTER_P;
    config.shiftEnterMode = CKEDITOR.ENTER_BR;
    config.scayt_autoStartup = false;
    config.autoParagraph = false;
    config.allowedContent = true;
    // Make dialogs simpler.
  	//config.docType = '';
    config.disableObjectResizing = true;
  	config.baseHref = '';
  	config.removeDialogTabs = 'image:advanced;link:advanced';
    config.contentsLangDirection = 'rtl';
    config.contentsLanguage = 'he';
    config.language = 'he';
    config.tabIndex = 0;

    CKEDITOR.dtd.$removeEmpty['span'] = 0;
    CKEDITOR.dtd.$editable.label = 1;
    CKEDITOR.dtd.$editable.td = 1;
    //CKEDITOR.plugins.add( 'indentlist' );

    //-! --> check if this can help out with the &nbsp bug; 
    config.basicEntities = true;//false;
    config.filebrowserImageUploadUrl =  '/items/upload_image'
  //  config.startupFocus = true;
    
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'sourcedialog';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'webeq';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'dialog';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'dialogui';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'fakeobjects';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'flash';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'insertblank';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'filebrowser';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'popup';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'image';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'tab';
    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'clipboard';
//    config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'pastefromword';
  
  
   
//    config.extraPlugins = 'removeformat';
//http://10.0.4.14:3000/players/player-version-1/javascripts/ckeditor//plugins/ckeditor_wiris/integration/cas.php?lang=en

};
