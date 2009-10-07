<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

include 'config.php';
include 'admin/common.php';
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><?php print $title; ?></title>
		<link rel='stylesheet' type='text/css' href='admin/blobtv.css' />
		<?php
		if (isset($css) && $css != false) {
			print "<link rel='stylesheet' type='text/css' href='" . $css . "' />"; 
		}
		?>
		<script type="text/javascript" src='http://www.blobforge.com/static/lib/tvb-min.js'></script>
	</head>
	<body>
		<div id='container'></div>
		<div id='pager'><?php print LOADING; ?></div>
		<script type="text/javascript">
			<?php
			if (isset($title) && $title != null) {
				print "TVB.widget.titleBar.setTitle(\"" . $title . "\");";
			} else {
				print "TVB.widget.titleBar.setTitle('BLOBtv Producer');";
			}
			if (isset($title_icon) && $title_icon != null) {
				print "TVB.widget.titleBar.setIcon('" . $title_icon . "');";
			}
			print "TVB.widget.titleBar.render();";
			print "var page_string = \"" . PAGE_X_OF_Y . "\";";
			print "var nodata_string = \"" . NO_DATA . "\";";
			print "var menuData = [];";
			$dat = load_video_list(false);
			foreach ($dat as $item) {
				$id = $item['id'];
				$title = $item['title'];
				$subtitle = $item['subtitle'];
				$description = $item['description'];
				$date = $item['date_published'];
				$thumbnail = $item['thumbnail'];
				$video = $item['file_name'];
				print "\n\t\t\tmenuData.push({ id: $id, title: \"$title\", subtitle: \"$subtitle\", description: \"$description\", date: \"$date\", thumbnail: \"$thumbnail\", video: \"$video\" });";
			}
			?>
		</script>
		<script type="text/javascript" src='admin/webtv.js'></script>
	</body>
</html>
