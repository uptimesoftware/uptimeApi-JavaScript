<?php
/**
 * remoteAPI
 *
 * PHP File to access a remote API source to get around JavaScript browser limitations
 *
 * @package    remoteAPI
 * @author     Joel Pereira <joel.pereira@uptimesoftware.com>
 * @copyright  2012 uptime software inc
 * @license    BSD License
 * @version    Release: 1.0
 * @link       http://support.uptimesoftware.com
 */

// Include the uptimeApi library file
require("uptimeApi.php");

// Get uptime API variables from request variables
if ( isset($_REQUEST['user']) &&
		isset($_REQUEST['pass']) &&
		isset($_REQUEST['host']) &&
		isset($_REQUEST['cmd'])) {

	$username = $_REQUEST['user'];
	$password = $_REQUEST['pass'];
	$hostname = $_REQUEST['host'];
	$port = 9997;
	$version = "v1";
	$ssl = true;
	$cmd = trim($_REQUEST['cmd']);
	
	if (isset($_REQUEST['port']) && intval($_REQUEST['port']) > 1000 && intval($_REQUEST['port']) < 65500) {
		$port = $_REQUEST['port'];
	}
	
	if (isset($_REQUEST['ver'])) {	// api version
		$version = $_REQUEST['ver'];
	}
	if (isset($_REQUEST['ssl'])) {	// ssl
		if (strtolower($_REQUEST['ssl'] == "true")) {
			$ssl = true;
		}
		else if (strtolower($_REQUEST['ssl'] == "false")) {
			$ssl = false;
		}
	}

	// setup API object
	$uptime = new uptimeApi($username, $password, $hostname, $port, $version, $ssl);
	// call the API command
	print $uptime->getJSON($cmd, $error, true, false);
}
else {
	// print example
?>
<br/>
<?php echo $_SERVER['PHP_SELF']; ?>?ARGUMENTS
<br/><br/>

(Required) Arguments:<br/>
user : username to connect to the API<br/>
pass : password to connect to the API<br/>
host : hostname to connect to the API<br/>
cmd : command to send to the API. Example: "/v1/elements/"<br/>
<br/>
(Optional) Arguments:<br/>
port : port to connect to the API (default is 9997)<br/>
ssl : use SSL to connect to the API (values: true / false) (default is true)<br/>
<br/><br/>
Example:<br/>
<?php echo $_SERVER['PHP_SELF']; ?>?user=admin&pass=admin&host=localhost&port=9997&cmd=elements/

<?php
}
?>
