<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

// Errors
define("ERR_ACTIVATING", "Error activating video, please try again.");
define("ERR_COPYING_THUMB", "Error copying thmbnail file.");
define("ERR_COPYING_VIDEO", "Error copying video file.");
define("ERR_DB_CREATION", "Error creating database file");
define("ERR_DB_OPEN", "Error opening database file");
define("ERR_DEACTIVATING", "Error deactivating video, please try again.");
define("ERR_DELETING", "Error removing video, please try again.");
define("ERR_EDIT", "Error updating video %%TITLE%%.");
define("ERR_EMPTY_DATE", "Warning: it is not possible to set an empty publication date.");
define("ERR_EMPTY_DESCRIPTION", "Warning: it is not possible to set an empty description.");
define("ERR_EMPTY_FIELDS", "Warning: every field is mandatory.");
define("ERR_EMPTY_PREVIEW", "Warning: the thumbnail file is mandatory.");
define("ERR_EMPTY_SUBTITLE", "Warning: it is not possible to set an empty subtitle.");
define("ERR_EMPTY_TITLE", "Warning: it is not possible to set an empty title.");
define("ERR_EMPTY_VIDEO", "Warning: the video file is mandatory.");
define("ERR_EXCEPTION", "The server returned the following exception: %%EXCEPTION%%");
define("ERR_NOT_FOUND", "Error, file not found.");
define("ERR_SERVER_COMM", "The server didn't receive the date.");
define("ERR_UNABLE_TO_DEL", "Unable to delete %%FILE%%, please remove it manually from the server.");
define("ERR_VIDEO_INSERT", "Error uploading video, please try again.");
define("ERR_VIDEO_SIZE", "The video file is greater then the maximum file size (1Gbyte).");

// Interface
define("ACTIONS", "Actions");
define("ACTIVE_NO", "Unactive");
define("ACTIVE_NO_CONFIRM", "You are going to publish this video. Are you sure?");
define("ACTIVE_NO_HINT", "The video is NOT active nor published. Click here to enable it.");
define("ACTIVE_YES", "Active");
define("ACTIVE_YES_CONFIRM", "You are going to deactivate this video. Are you sure?");
define("ACTIVE_YES_HINT", "The video is active and published. Click here to disable it.");
define("ADD", "Add New");
define("ADMIN_TITLE", "Administration Area");
define("DATE", "Date");
define("DEETE", "Delete");
define("DELETE_CONFIRM", "You are going to delete this video. Are you sure?");
define("DESCRIPTION", "Description");
define("EDIT", "Edit");
define("EDIT_VIDEO", "Edit video");
define("EDIT_DONE", "The video %%TITLE%% has been updated.");
define("LOADING", "Loading...");
define("LOGIN", "Login");
define("LOGOUT", "Logout");
define("NEW_VIDEO", "New video");
define("NO_DATA", "No videos are present");
define("NO_VIDEOS", "No video is currently available in this Web TV.");
define("PAGE_X_OF_Y", "Page %%X%% of %%Y%%");
define("PASSWORD", "Password:");
define("PREVIEW", "Preview");
define("PUBDATE", "Publication date (AAAA-MM-GG)");
define("SHOW_ALL", "List all");
define("SHOW_PUBLISHED", "Published Only");
define("SUBTITLE", "Subtitle");
define("THUMB", "Preview");
define("THUMBNAIL", "Thumbnail (120x90 pixel)");
define("TITLE", "Title");
define("UPDATE", "Update");
define("UPLOAD", "Upload");
define("USERNAME", "Username:");
define("VIDEO", "Video");
define("VIDEO_ACTIVATE", "Is is <strong>non published</strong>. If you want to activate now, <a href='?a=y&id=%%ID%%'>clik here</a>.");
define("VIDEO_UPLOADED", "The video <strong>%%TITLE%%</strong> is now available for publishing.");

?>