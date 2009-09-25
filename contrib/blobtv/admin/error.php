<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><?php print $title; ?></title>
		<link rel='stylesheet' type='text/css' href='<?php print $css; ?>' />
		<script type="text/javascript" src='http://www.blobforge.com/static/lib/tvb-min.js'></script>
	</head>
	<body>
		<script type="text/javascript">
			TVB.widget.titleBar.setTitle("<?php print $title; ?>");
			TVB.widget.titleBar.setIcon("<?php print $title_icon; ?>");
			TVB.widget.titleBar.render();
		</script>
		
		<div id='error_message'><?php print $message; ?></div>
	</body>
</html>
