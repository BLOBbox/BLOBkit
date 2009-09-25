<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

if (isset($_GET['id']) && $_GET['id'] > 0) {
	if (!$recovered = get_video_details($_GET['id'])) {
		die("<p>" . ERR_NOT_FOUND . "</p>");
	}
	$title = $recovered['title'];
	$subtitle = $recovered['subtitle'];
	$description = $recovered['description'];
	$data = $recovered['date_published'];
	$errors = 100;
} else {
	die("<p>" . ERR_NOT_FOUND . "</p>");
}


if (isset($_POST['submit']) && isset($_POST['data']) && isset($_POST['title']) && isset($_POST['subtitle']) && isset($_POST['description'])) {
	$errors = 0;
	
	if (strlen($_POST['title']) > 0) {
		$title = stripslashes($_POST['title']);
	} else {
		print "<p>" . ERR_EMPTY_TITLE . "</p>";
		$title = '';
		$errors++;
	}
	
	if (strlen($_POST['subtitle']) > 0) {
		$subtitle = stripslashes($_POST['subtitle']);
	} else {
		print "<p>" . ERR_EMPTY_SUBTITLE . "</p>";
		$subtitle = '';
		$errors++;
	}

	if (strlen($_POST['description']) > 0) {
		$description = stripslashes($_POST['description']);
	} else {
		print "<p>" . ERR_EMPTY_DESCRIPTION . "</p>";
		$description = '';
		$errors++;
	}

	if (strlen($_POST['data']) > 0) {
		$data = stripslashes($_POST['data']);
	} else {
		print "<p>" . ERR_EMPTY_DATE . "</p>";
		$data = '';
		$errors++;
	}
}

if ($errors > 0) {
?>
<script type="text/javascript">
	var beforeSubmit = function() {
		try {
			document.getElementById('submit').disabled = true;
			document.getElementById('submit').value = "<?php print LOADING; ?>";
			return true;
		} catch (e) {
			alert (e.message);
		}
	};
</script>

<form action='?a=e&id=<?php print $_GET['id']; ?>' method='post' id='addform' name='addform' enctype='multipart/form-data' accept-charset='UTF-8'>
	<input type="hidden" name="id" value="<?php print $_GET['id']; ?>" />
	<table summary='<?php print EDIT_VIDEO; ?>' id='video_add'>
		<tbody>
			<tr>
				<th><?php print TITLE; ?></th>
				<td><input type='text' name='title' class='inp' value='<?php print $title; ?>'/></td>
			</tr>
			<tr>
				<th><?php print SUBTITLE; ?></th>
				<td><input type='text' name='subtitle' class='inp' value='<?php print $subtitle; ?>'/></td>
			</tr>
			<tr>
				<th><?php print PUBDATE; ?></th>
				<td><input type='text' name='data' class='inp' value='<?php print $data; ?>'/></td>
			</tr>
			<tr>
				<th><?php print DESCRIPTION; ?></th>
				<td><textarea name='description'><?php print $description; ?></textarea></td>
			</tr>
			<tr>
				<th>&nbsp;</th>
				<td><input type='submit' id='submit' name='submit' value='<?php print UPDATE; ?>' /></td>
			</tr>
		</tbody>
	</table>

</form>
<?php
} else {
	if ($_GET['id'] == $_POST['id']) {
		$id = $_GET['id'];
		if (aggiorna_video($id, $title, $subtitle, $data, $description)) {
			print "<p>" . str_replace("%%TITLE%%", "<strong>" . $title . "</strong>", EDIT_DONE) . "</p>";
		} else {
			print "<p>" . str_replace("%%TITLE%%", "<strong>" . $title . "</strong>", ERR_EDIT) . "</p>";
		}
	} else {
		print "<p>" . ERR_SERVER_COMM . "</p>";
	}
}
?>
