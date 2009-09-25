<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

if (isset($_GET['id'])) {
	if (!deactivate_video($_GET['id'])) {
		print "<p>" . ERR_DEACTIVATING . "</p>";
	}
}

include 'list.php';

?>
