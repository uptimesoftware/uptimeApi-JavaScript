uptimeApi-JavaScript
====================

API helper class for up.time 7.1+ API. This makes using the up.time API simple and powerful.
This will get around browser security preventing remote JSON requests by using a local PHP proxy file that makes the actual JSON request(s) and returns it to the JavaScript untouched.

Requirements
------------
* JQuery [http://jquery.com]
* Uses [uptimeApi-PHP][https://github.com/joelpereira/uptimeApi-PHP] [included]
* extension=php_curl.dll

If testing on the up.time Monitoring Station (which already includes Apache+PHP with the necessary modules), simply edit the up.time php.ini file (uptime_dir/apache/php/php.ini) and uncomment the following lines:
* extension=php_curl.dll

How to Use in JavaScript
------------------------
Have a look at the included example file.

First we import the necessary classes (in the correct order below):

	<script type='text/javascript' src='jquery.js'></script>
	<script type='text/javascript' src='uptimeApi.js'></script>

Next we initialize the uptimeApi object:

	<script type="text/JavaScript">
		// Setup uptime API variables
		var uptime_host = 'localhost';
		var uptime_user = 'admin';
		var uptime_pass = 'admin';
		var uptime_port = 9997;
		var uptime_ver = 'v1';
		var uptime_ssl = true;
		
		// Create API object
		uptime_api = new uptimeApi(uptime_user, uptime_pass, uptime_host, uptime_port, uptime_ver, uptime_ssl);


Now we can call any of the uptimeApi functions and use/manipulate the returned array objects:

	uptime_api.getApiInfo(function(apiInfo){
		console.log(apiInfo);
	});
	
	uptime_api.getElements("isMonitored=true", function(allElements) {
		$.each(allElements, function(index,element) {
			console.log(element);
		});
	});
	
	uptime_api.getMonitors("", function(allMonitors) {
		$.each(allMonitors, function(index,monitor) {
			console.log(monitor);
		});
	});
	
	uptime_api.getGroups("", function(allGroups) {
		$.each(allGroups, function(index,group) {
			console.log(allGroups);
		});
	});
	
	
	uptime_api.getElementStatus(1,function(elementStatus) {
		console.log(elementStatus);
	});
	
	uptime_api.getMonitorStatus(1,function(monitorStatus) {
		console.log(monitorStatus);
	});
	
	uptime_api.getGroupStatus(1,function(groupStatus) {
		console.log(groupStatus);
	});
	
	</script>

Happy Coding!
