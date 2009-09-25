<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

include '../config.php';
include 'common.php';

if (isset($_GET['a']) && $_GET['a'] == 'o') {
	session_start();
	session_destroy();
	header("Location: ?a=");
}

include 'auth.php';

$actions_available = Array('a', 'd', 'e', 'y', 'n', 'l', 'c', 'o');

include 'header.php';

if (isset($_GET['a']) && in_array($_GET['a'], $actions_available)) {
	switch ($_GET['a']) {
		case 'a':
			include 'add.php';
			break;
		case 'd':
			include 'delete.php';
			break;
		case 'e':
			include 'edit.php';
			break;
		case 'y':
			include 'activate.php';
			break;
		case 'n':
			include 'deactivate.php';
			break;
		case 'l':
			include 'list.php';
			break;
	}
} else {
	include 'list.php';
}

include 'footer.php';
?>