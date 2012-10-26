/**
 * uptimeApi
 *
 * up.time Monitoring Station API access file for PHP
 *
 * @package    uptimeApi
 * @author     Patrick Lui <patrick.lui@uptimesoftware.com>, Joel Pereira <joel.pereira@uptimesoftware.com>
 * @copyright  2012 uptime software inc
 * @license    BSD License
 * @version    Release: 1.0
 * @link       http://support.uptimesoftware.com
 */
// Class uptimeApi
function uptimeApi (username,password,hostname,port,version,ssl) {	// constructor
	//////////////////////////////////////////////////////////
	// Private Variables (var)
	var apiUsername = username;
	var apiPassword = password;
	var apiHostname = hostname;
	var apiPort     = 9997;
	var apiSSL      = true;
	var apiVersion  = "v1";
	
	// check if they entered the values: port, version, ssl
	if (typeof port != "undefined") {
		apiPort = port;
	}
	if (typeof version != "undefined") {
		apiVersion = version;
	}
	if (typeof ssl != "undefined") {
		if (ssl == true) {
			apiSSL = true;
		}
		else if (ssl == false) {
			apiSSL == false
		}
		else {
			// do nothing
		}
	}

	
	//////////////////////////////////////////////////////////
	// Public Functions (this.)
	this.getApiInfo = function(callback) {
		this.getJSON('',callback);	// just call the api to get the version info
	}
	// we have to apply the filter, so let's have an anonymous callback function here for the filter
	this.getElements = function(filter,callback) {
		this.getJSON('/'+apiVersion+'/elements/',function(data){
			// run through the filter engine
			output = runFilter(data, filter);
			callback(output);
		});
	}
	this.getMonitors = function(filter,callback) {
		this.getJSON('/'+apiVersion+'/monitors/',function(data){
			// run through the filter engine
			output = runFilter(data, filter);
			callback(output);
		});
	}
	this.getGroups = function(filter,callback) {
		this.getJSON('/'+apiVersion+'/groups/',function(data){
			// run through the filter engine
			output = runFilter(data, filter);
			callback(output);
		});
	}
	// no filter, so let's just return via the callback
	this.getElementStatus = function(id,callback) {
		this.getJSON('/'+apiVersion+'/elements/'+id+'/status',callback);
	}
	this.getMonitorStatus = function(id,callback) {
		this.getJSON('/'+apiVersion+'/monitors/'+id+'/status',callback);
	}
	this.getGroupStatus = function(id,callback) {
		this.getJSON('/'+apiVersion+'/groups/'+id+'/status',callback);
		
	}
	
	// Make the call to the up.time API via JSON
	this.getJSON = function(APICall,callback) {
		var apiProxyUrl = "apiProxy.php?user=" + apiUsername + "&pass=" + apiPassword + "&host=" + apiHostname + "&cmd=" + APICall;
		
		//console.log("API Proxy URL: " + apiProxyUrl);
		
		$.ajax( {
			url      : apiProxyUrl,
			dataType : 'json',
			cache    : false,
			username : apiUsername,
			password : apiPassword,
			success  : function( data ) {

				//console.log(data);	// debug
				
				// return the data output
				callback(data);
			}
		});
	}


	//////////////////////////////////////////////////////////
	// Private Functions

	// Read filter string and put it into an array
	// The valid filter string format is: "var1=x&var2=y"
	var parseFilterString = function(filter) {
		var rv = {keys: new Array(), values: new Array()};
		// check if there is a filter
		if (filter && filter != "") {
			// check if there's more than one filter ("&")
			if (filter.search("&") != -1) {
				var filterArray = filter.split("&");
			}
			else {
				// single filter, so just put it in the array
				var filterArray = new Array();
				filterArray.push(filter);
			}
			// Parse through the filters
			for (i=0; i < filterArray.length; i++) {
				var tmpArray = filterArray[i].split("=",2);
				// make sure it's a valid filter (format: a=b)
				if (tmpArray.length == 2 && tmpArray[0].length > 0 && tmpArray[1].length > 0) {
					// place the key and value in their own arrays within the filter object
					rv.keys.push(tmpArray[0].trim());
					rv.values.push(tmpArray[1].trim());
				}
			}
		}
		//console.log("Filter string parsed:");
		//console.log(rv);	// debug filter string
		return rv;
	}
	// Run through all filters
	// The value will be checked as a regex with case-insensitivity
	var runFilter = function(data, filter) {
		// parse the filter string
		var filterArr = parseFilterString(filter);

		// check if we need to apply filter(s)
		if (filterArr.keys.length > 0) {
			// first, check if we're dealing with an object or an array of objects
			if (data instanceof Array) {
				/////////////////////////////////////
				// array of objects
				var output = new Array();
				
				// foreach array object (if there is any)
				var addToArray = false;
				$.each(data, function(data_id, data_obj) {
					// let's apply the filter to each object
					addToArray = true;	// assume we can add everything until we can't
					for (i=0; i < filterArr.keys.length; i++) {
						// setup the pattern string
						var pattern = new RegExp(filterArr.keys[i], 'ig');
						// check if the key exists and if the value matches (regex)
						if (data_obj.hasOwnProperty(filterArr.keys[i])) {
							// convert value to string for regex string matching
							var tmpStr = String(data_obj[filterArr.keys[i]]);
							// now let's check the regex expression
							if (tmpStr.match(filterArr.values[i])) {
								// passed this filter
							}
							else {
								// failed the filter, so let's not add it
								addToArray = false;
							}
						}
						else {
							// key doesn't exist; let's not add it
							addToArray = false;
						}
					}
					// check if we can add the current object
					if (addToArray) {
						// value matched, so let's add it to the filtered array
						output.push(data_obj);
					}
				});
				return output;
			}
			else {
				/////////////////////////////////////
				// single object
				//don't apply filter on these
				var output = data;
			}
			return output;
		}
		else {
			// no filter, so just return the array/object
			return data;
		}

	}
	
}


	
// make sure String(s) can trim
if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}