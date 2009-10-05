<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

$db_conn = null;

if (version_compare(PHP_VERSION, '5.3.0', '<')) {
	if (version_compare(PHP_VERSION, '5.0.0', '<')) {
		die ("ERROR: PHP 5.0.0 or greater is required");
	} else {
		$sqlite3 = false;
	}
} else {
	$sqlite3 = true;
}

$available_languages = Array('it', 'en');

if ($force_language) {
	require $force_language . ".php";
} else {
	$base_lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
	if (in_array($base_lang, $available_languages)) {
		require $base_lang . ".php";
	} else {
		require 'en.php';
	}
}

function open_db_connection() {
	global $db_conn, $data_file;
	$sql_create = "CREATE TABLE items (
		id INTEGER PRIMARY KEY ASC,
		title TEXT,
		subtitle TEXT,
		description TEXT,
		file_name TEXT,
		thumbnail TEXT,
		is_published BOOLEAN DEFAULT 0,
		date_published DATETIME,
		last_modified DATETIME,
		hit INT DEFAULT 0
	)";
	$sql_fetch = "SELECT id FROM items LIMIT 1";
				
	if ($sqlite3) {
		// SQlite 3 edition
		if ($db_conn = new SQLite3($data_file)) {
			if ($res = @$db_conn->query($sql_fetch)) {
				// db already exists
				// update db data
			} else {
				// initialize new db
				if (!@$db_conn->exec($sql_create)) {
					show_error(ERR_DB_CREATION);
				}
			}
			return true;
		} else {
			show_error(ERR_DB_OPEN);
			return false;
		}
	} else {
		// SQlite 2 edition
		if ($db_conn = new SQLiteDatabase($data_file)) {
			if ($res = @$db_conn->query($sql_fetch)) {
				// db already exists
				// update db data
			} else {
				// initialize new db
				if (!@$db_conn->queryExec($sql_create)) {
					show_error(ERR_DB_CREATION);
				}
			}
			return true;
		} else {
			show_error(ERR_DB_OPEN);
			return false;
		}		
	}
}

function close_db_connection() {
	global $db_conn;
	if ($sqlite3) {
		$id = $db_conn->close();
	}
	return true;
}

function add_new_video($title, $subtitle, $description, $data) {
	global $db_conn;
	
	if ($sqlite3) {
		$title = $db_conn->escapeString($title);
		$subtitle = $db_conn->escapeString($subtitle);
		$description = $db_conn->escapeString($description);
		$data = $db_conn->escapeString($data);
	} else {
		$title = sqlite_escape_string($title);
		$subtitle = sqlite_escape_string($subtitle);
		$description = sqlite_escape_string($description);
		$data = sqlite_escape_string($data);
	}
	
	$sql  = "INSERT INTO items (title, subtitle, description, file_name, thumbnail, date_published, last_modified, hit, is_published) ";
	$sql .=" VALUES('$title', '$subtitle', '$description', NULL, NULL, '$data', 'now', 0, 'false')"; 
	
	if ($sqlite3) {
		@$db_conn->exec($sql);
	} else {
		@$db_conn->queryExec($sql);
	}
	$id = $db_conn->lastInsertRowID();
	return $id;
}

function load_video_list($all = false) {
	global $db_conn, $base_thumb_url, $base_video_url;
	if ($all == true) {
		$sql = "SELECT * FROM items WHERE file_name != '' AND thumbnail != '' ORDER BY date_published DESC";
	} else {
		$sql = "SELECT * FROM items WHERE file_name != '' AND thumbnail != '' AND is_published=1 ORDER BY date_published DESC";
	}
	$results = @$db_conn->query($sql);
	$dat = Array();
	if ($sqlite3) {
		while ($row = $results->fetchArray()) {
			$newdat = Array();
			$newdat['id'] = $row['id'];
			$newdat['title'] = $row['title'];
			$newdat['subtitle'] = $row['subtitle'];
			$newdat['description'] = $row['description'];
			$newdat['file_name'] = $base_video_url . "/" . $row['file_name'];
			$newdat['thumbnail'] = $base_thumb_url . "/" . $row['thumbnail'];
			$newdat['is_published'] = $row['is_published'];
			$newdat['date_published'] = $row['date_published'];
			$newdat['last_modified'] = $row['last_modified'];
			$newdat['hit'] = $row['hit'];
			array_push($dat, $newdat);
		}
		$results->finalize();
	} else {
		while ($row = $results->fetch(SQLITE_ASSOC)) {
			$newdat = Array();
			$newdat['id'] = $row['id'];
			$newdat['title'] = $row['title'];
			$newdat['subtitle'] = $row['subtitle'];
			$newdat['description'] = $row['description'];
			$newdat['file_name'] = $base_video_url . "/" . $row['file_name'];
			$newdat['thumbnail'] = $base_thumb_url . "/" . $row['thumbnail'];
			$newdat['is_published'] = $row['is_published'];
			$newdat['date_published'] = $row['date_published'];
			$newdat['last_modified'] = $row['last_modified'];
			$newdat['hit'] = $row['hit'];
			array_push($dat, $newdat);
		}
	}
	return $dat;
}

function insert_thumb_url($id, $url) {
	global $db_conn;
	if ($sqlite3) {
		$url = $db_conn->escapeString($url);
		$res = @$db_conn->exec("UPDATE items SET thumbnail = '$url' WHERE id = $id");
	} else {
		$url = sqlite_escape_string($url);
		$res = @$db_conn->queryExec("UPDATE items SET thumbnail = '$url' WHERE id = $id");
	}
	return $res;
}

function insert_video_url($id, $url) {
	global $db_conn;
	if ($sqlite3) {
		$url = $db_conn->escapeString($url);
		$res = @$db_conn->exec("UPDATE items SET file_name = '$url' WHERE id = $id");
	} else {
		$url = sqlite_escape_string($url);
		$res = @$db_conn->queryExec("UPDATE items SET file_name = '$url' WHERE id = $id");
	}
	return $res;
}

function aggiorna_video($id, $title, $subtitle, $date, $description) {
	global $db_conn;
	if ($sqlite3) {
		$title = $db_conn->escapeString($title);
		$subtitle = $db_conn->escapeString($subtitle);
		$description = $db_conn->escapeString($description);
		$res = @$db_conn->exec("UPDATE items SET title = '$title', subtitle = '$subtitle', date_published = '$date', description = '$description' WHERE id = $id");
	} else {
		$title = sqlite_escape_string($title);
		$subtitle = sqlite_escape_string($subtitle);
		$description = sqlite_escape_string($description);
		$res = @$db_conn->queryExec("UPDATE items SET title = '$title', subtitle = '$subtitle', date_published = '$date', description = '$description' WHERE id = $id");
	}
	return $res;
}

function get_video_details($id) {
	global $db_conn;
	if ($sqlite3) {
		$res = @$db_conn->querySingle("SELECT * FROM items WHERE id = $id", true); 
	} else {
		$res = @$db_conn->singleQuery("SELECT * FROM items WHERE id = $id", true);
	}
	return $res;
}

function delete_video($id) {
	global $db_conn, $base_video_folder, $base_thumb_folder;
	if ($sqlite3) {
		$results = @$db_conn->querySingle("SELECT file_name, thumbnail FROM items WHERE id = $id", true);
	} else {
		$results = @$db_conn->singleQuery("SELECT file_name, thumbnail FROM items WHERE id = $id", true);
	}
	if (!@unlink($base_video_folder . "/" . $results['file_name'])) {
		print "<p>" . str_replace("%%FILE%%", $results['file_name'], ERR_UNABLE_TO_DEL) . "</p>";
	}
	if (!@unlink($base_thumb_folder . "/" . $results['thumbnail'])) {
		print "<p>" . str_replace("%%FILE%%", $results['thumbnail'], ERR_UNABLE_TO_DEL) . "</p>";
	}
	if ($sqlite3) {
		$res = @$db_conn->exec("DELETE FROM items WHERE id = $id");
	} else {
		$res = @$db_conn->queryExec("DELETE FROM items WHERE id = $id");
	}
	return $res;
}

function activate_video($id) {
	global $db_conn;
	if ($sqlite3) {
		$res = @$db_conn->exec("UPDATE items SET is_published = 1 WHERE id = $id");
	} else {
		$res = @$db_conn->queryExec("UPDATE items SET is_published = 1 WHERE id = $id");
	}
	return $res;
}

function deactivate_video($id) {
	global $db_conn;
	if ($sqlite3) {
		$res = @$db_conn->exec("UPDATE items SET is_published = 0 WHERE id = $id");
	} else {
		$res = @$db_conn->queryExec("UPDATE items SET is_published = 0 WHERE id = $id");
	}
	return $res;
}

function show_error($message) {
	global $css, $title, $title_icon;
	include 'error.php';
	die();
}

open_db_connection();

?>
