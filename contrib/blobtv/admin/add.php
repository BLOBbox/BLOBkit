<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

$title = '';
$subtitle = '';
$description = '';
$data = @date("Y-m-d");
$thumbnail = '';
$video = '';
$errors = 100;

if (isset($_POST['submit']) && isset($_POST['data']) && isset($_POST['title']) && isset($_POST['subtitle']) && isset($_POST['description'])) {
	$errors = 0;
	
	if (strlen($_POST['title']) > 0) {
		$title = stripslashes($_POST['title']);
	} else {
		print "<p>" . ERR_EMPTY_TITLE . "</p>";
		$errors++;
	}
	
	if (strlen($_POST['subtitle']) > 0) {
		$subtitle = stripslashes($_POST['subtitle']);
	} else {
		print "<p>" . ERR_EMPTY_SUBTITLE . "</p>";
		$errors++;
	}

	if (strlen($_POST['description']) > 0) {
		$description = stripslashes($_POST['description']);
	} else {
		print "<p>" . ERR_EMPTY_DESCRIPTION . "</p>";
		$errors++;
	}

	if (strlen($_POST['data']) > 0) {
		$data = stripslashes($_POST['data']);
	} else {
		print "<p>" . ERR_EMPTY_DATE . "</p>";
		$errors++;
	}

	if (isset($_POST['thumbnail_orig']) && isset($_POST['thumbnail'])) {
		$thumbnail_orig = $_POST['thumbnail_orig'];
		$thumbnail = $_POST['thumbnail'];
	} else {
		if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] == 0) {
			$thumbnail_orig = $_FILES['thumbnail']['tmp_name'];
			$thumbnail = $_FILES['thumbnail']['name'];
		} else {
			print "<p>" . ERR_EMPTY_PREVIEW . "</p>";
			$errors++;
		}
	}

	if (isset($_POST['video_orig']) && isset($_POST['video'])) {
		$video_orig = $_POST['video_orig'];
		$video = $_POST['video'];
	} else {
		if (isset($_FILES['video']) && $_FILES['video']['error'] == 0) {
			$video_orig = $_FILES['video']['tmp_name'];
			$video = $_FILES['video']['name'];
		} else {
			if (isset($_FILES['video']) && $_FILES['video']['error'] == 2) {
				print "<p>" . ERR_VIDEO_SIZE . "</p>";
			} else {
				print "<p>" . ERR_EMPTY_VIDEO . "</p>";
			}
			$errors++;
		}
	}
}

if ($errors > 0) {
	if ($errors != 100) {
		print "<p>" . ERR_EMPTY_FIELDS . "</p>";
	}
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

<form action='?a=a' method='post' id='addform' name='addform' enctype='multipart/form-data' accept-charset='UTF-8'>
	<!-- MAX_FILE_SIZE must precede the file input field -->
    <input type="hidden" name="MAX_FILE_SIZE" value="1073741824" />	
	<table summary='<?php print NEW_VIDEO; ?>' id='video_add'>
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
				<th><?php print THUMBNAIL; ?></th>
				<?php
				print "<td><input type='file' name='thumbnail' class='inp'/></td>";
				/*
				if ($thumbnail == '') {
					print "<td><input type='file' name='thumbnail' class='inp'/></td>";
				} else {
					print "<td>$thumbnail";
					print "<input type='hidden' name='thumbnail_orig' value='$thumbnail_orig' />";
					print "<input type='hidden' name='thumbnail' value='$thumbnail' />";
					print "</td>\n";
				}
				*/
				?>
			</tr>
			<tr>
				<th><?php print VIDEO; ?></th>
				<?php
				print "<td><input type='file' name='video' class='inp'/></td>";
				/*
				if ($video == '') {
					print "<td><input type='file' name='video' class='inp'/></td>";
				} else {
					print "<td>$video";
					print "<input type='hidden' name='video_orig' value='$video_orig' />";
					print "<input type='hidden' name='video' value='$video' />";
					print "</td>\n";
				}
				*/
				?>
			</tr>
			<tr>
				<th>&nbsp;</th>
				<td><input type='submit' id='submit' name='submit' value='<?php print UPLOAD; ?>' /></td>
			</tr>
		</tbody>
	</table>

</form>
<?php
} else {
	$newID = add_new_video($title, $subtitle, $description, $data);
	
	try {
		$thumb_parts = explode('.', basename($thumbnail));
		if (count($thumb_parts) > 1) {
			$thumb_ext = $thumb_parts[count($thumb_parts) - 1];
		} else {
			$thumb_ext = 'png';
		}
		move_uploaded_file($thumbnail_orig, "$base_thumb_folder/thumb_$newID.$thumb_ext");
		if (!insert_thumb_url($newID, "thumb_$newID.$thumb_ext")) {
			throw new Exception(ERR_COPYING_THUMB);
		}

		$video_parts = explode('.', basename($video));
		if (count($video_parts) > 1) {
			$video_ext = $video_parts[count($video_parts) - 1];
		} else {
			$video_ext = 'mp4';
		}
		move_uploaded_file($video_orig, "$base_video_folder/video_$newID.$video_ext");
		if (!insert_video_url($newID, "video_$newID.$video_ext")) {
			throw new Exception(ERR_COPYING_THUMB);
		}
		$processDone = true;
	} catch (Exception $e) {
		delete_video($newID);
		print "<p>" . ERR_VIDEO_INSERT . "</p>";
		print "<p>" . str_replace("%%EXCEPTION%%", $e->getMessage(), ERR_EXCEPTION) . "</p>";
		$processDone = false;
	}
	
	if ($processDone) {
		print "<p>" . str_replace("%%TITLE%%", $title, VIDEO_UPLOADED) . "</p>";
		print "<p>" . str_replace("%%ID%%", $newID, VIDEO_ACTIVATE) . "</p>";
	}

}
?>
