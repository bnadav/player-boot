/* LineNumbers plugin                */
/* line numbers in text paragraphs   */



(function($) {
    $(".TX p br").before("<span class='break'>*</span>")
    $.fn.linenumbers = function(options) {
      
  		var opts = $.extend({
                    			col_width: '50px',
                    			max_lines: 500,
                    			show_each_number_of_lines: 5,
                                height: '700'
                    		},options); 

          
          var current_text = $(this).find(".question_text"); 
          var numbers_div = $(this).find(".line_numbers");
          if(options){
              current_text.html(options);
            //  alert("there are options:" + options);
          }
          
     
          if (! numbers_div.length) {
             numbers_div = $("<div class='line_numbers' ></div>"); 
             current_text.before(numbers_div);
          }  

          numbers_div.css("width", opts.col_width);
          numbers_div.css("height", current_text.height() + "px");

  
           var all_line_numbers = "";
	   all_line_numbers = "<span data-line-number=1'>(1)</span>";
           var all_paragraphs = current_text.find("p");
           var current_line_number = 1; 
            
           all_paragraphs.each( function() {
            var number_lines_in_paragraph =   $(this).find("br").length +1 ;

            for (i = current_line_number ; i< current_line_number + number_lines_in_paragraph ; i++) {
              // if it is the line to show its number- write it down
               if(i % opts.show_each_number_of_lines == 0) {

                    all_line_numbers += "(" +i + ")";
 
               }
               
               all_line_numbers += "<br />";//"<span class='break'>*</span><br />";

            }

            // adding break for end of paragrph
            all_line_numbers += "<br />"; 
            current_line_number += number_lines_in_paragraph;

            });
            
            
            numbers_div.html(all_line_numbers);
            
            return current_text.html();

    };
})(jQuery);
