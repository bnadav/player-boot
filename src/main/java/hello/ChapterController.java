package hello;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;

@Controller
public class ChapterController {
	private static final Logger log = LoggerFactory.getLogger(ChapterController.class);

	@RequestMapping(value="/api/v2", method=RequestMethod.GET)
    public String index() {
	  log.info("-------------------------------");
      return "qu_item.json";
    }
	
	@RequestMapping(value="/editor_items/update")
    public @ResponseBody String update(@RequestBody String params){
	  log.info("+++++++++++++++++");
	  log.info(params);
      return "";
    }
}
