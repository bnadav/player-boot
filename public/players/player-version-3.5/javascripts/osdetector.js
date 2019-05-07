  $(function() {
      var os_name="Unknown";
      var user_agent = navigator.userAgent;
      if (user_agent.indexOf("Windows NT 6.2")!=-1) os_name="Win8";
      else if (user_agent.indexOf("Windows NT 6.1")!=-1) os_name="Win7";
      else if (user_agent.indexOf("Windows NT 6.0")!=-1) os_name="WinVista";
      else if (user_agent.indexOf("Windows NT 5.1")!=-1) os_name="WinXp";
      else if (user_agent.indexOf("Windows NT 5.0")!=-1) os_name="Win2000";
      else if (user_agent.indexOf("Mac")!=-1) os_name="Mac";
      else if (user_agent.indexOf("X11")!=-1) os_name="UNIX";
      else if (user_agent.indexOf("Linux")!=-1) os_name="Linux";
      $("html").addClass(os_name);
  });

