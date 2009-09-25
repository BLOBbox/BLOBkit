<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

if (isset($_GET['t']) && $_GET['t'] == 'p') {
	$dat = load_video_list(false);
} else {
	$dat = load_video_list(true);
}



if (count($dat) == 0) {
	print "<p>" . NO_VIDEOS . "</p>";
} else {
	print "
	<table summary='Video' id='video_list'>
		<thead>
			<tr>
				<th class='thumb'>" . THUMB . "</th>
				<th>" . TITLE . "</th>
				<th>" . DATE . "</th>
				<th colspan='4'>" . ACTIONS . "</th>
			</tr>
		</thead>
		<tbody>
	";

	foreach($dat as $item) {
		$id = $item['id'];
		$title = $item['title'];
		$subtitle = $item['subtitle'];
		$description = $item['description'];
		$date = $item['date_published'];
		$thumbnail = $item['thumbnail'];
		$video = $item['file_name'];
		$con = $item['is_published'];
		$debug = print_r($item, true);
		if ($item['is_published'] == 1) {
			$pub = "<img src='on.png' width='16px' height='16px' alt='" . ACTIVE_YES . "' title='" . ACTIVE_YES_HINT . "'>";
			$pubact = "href='?a=n&id=$id' onclick='return confirm(\"" . ACTIVE_YES_CONFIRM . "\");'";
		} else {
			$pub = "<img src='off.png' width='16px' height='16px' alt='" . ACTIVE_NO . "' title='" . ACTIVE_NO_HINT . "'>";
			$pubact = "href='?a=y&id=$id' onclick='return confirm(\"" . ACTIVE_NO_CONFIRM . "\");'";
		}
		print "
		<tr>
			<td class='thumb'><img src='$thumbnail' width='120px' height='90px' alt='" . THUMB . "' />
			<td><span class='title'>$title</span><br /><span class='subtitle'>$subtitle</span><br /><span class='description'>$description</span></td>
			<td>$date</td>
			<td><a $pubact>$pub</a></td>
			<td><a href='?a=d&id=$id' onclick='return confirm(\"" . DELETE_CONFIRM . "\");'><img src='delete.png' width='16px' height='16px' alt='" . DELETE . "' title='" . DELETE . "'></a></td>
			<td><a href='?a=e&id=$id'><img src='edit.png' width='16px' height='16px' alt='" . EDIT . "' title='" . EDIT . "'></a></td>
			<td><a href='$video' target='_blank'><img src='play.png' width='16px' height='16px' alt='" . PREVIEW . "' title='" . PREVIEW . "'></a></td>
		</tr>
		";
		
	}
	print "
			</tbody>
	</table>
	";
}
?>