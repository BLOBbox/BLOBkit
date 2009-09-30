<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

/**
 * @var admin_user
 * @required
 * Username for the admin area
 * 
 * example:
 * $admin_user = 'tvblob';
 */
$admin_user = 'tvblob';

/**
 * @var admin_pass
 * @required
 * Password for the admin area
 * 
 * example:
 * $admin_pass = 'tvblob';
 */
$admin_pass = 'tvblob';

/**
 * @var data_file
 * @required
 * This variable contains the path to the database file that BLOBtv Producer creates and uses.
 * It must be writeble path and the file may not exists. BLOBtv Producer creates it if the file is not
 * present on the file system or it is not a valid BLOBtv Producer Database.
 * It is better to place this file outside the public web server documents folder, for security reasons.
 * 
 * example:
 * $data_file = "/home/webapp/blobtv.dat";
 */
$data_file = "/home/webapp/blobtv.dat";

/**
 * @var title
 * @optional, but strongly suggested
 * This variable configure the title in the title bar of the application and the name of the
 * bookmarkable page.
 * 
 * example:
 * $title = "My Personal BLOBtv";
 */
$title = "My Personal BLOBtv";

/**
 * @var title_icon
 * @optional
 * This variable configure the absolute path of a png or jpeg file (height: 72px, width variable)
 * that will be displayed on the page as an icon on the top left corner of the page, in the title
 * bar. It is possible to set it as 'false', and no icon will be displayed.
 * 
 * example: no icon on the top left corner
 * $title_icon = false;
 * 
 * example: a custom icon on the top left corner
 * $title_icon = "myicon.png";
 */
$title_icon = false;

/**
 * @var css
 * @optional
 * This variable configures an additional css file. It is used to skin and customize your BLOBtv.
 * If set as 'false', only default css are used.
 * 
 * example: use default css
 * $css = false;
 * 
 * example: use a custom css file
 * $css = "mycssfile.css";
 */
$css = false;

/**
 * @var force_language
 * @optional
 * This variable configures how BLOBtv is localized. It is possible to force the localizzation to a
 * defined language (if the language pack is installed in the admin folder), or let the system decide
 * what language pack is better to load for every session (using the i18n configuration of the BLOBbox
 * or the HTTP_ACCEPTED_LANGUAGE variable that the desktop browser sends to the server).
 * 
 * example: let the system decide for you
 * $force_language = false;
 * 
 * example: my BLOBtv contains only italian videos, all the messages must be in italian even on english BLOBboxes
 * $force_language = 'it';
 */
$force_language = false;

/**
 * @var base_video_folder
 * @required
 * This variable configures the path on the server file system where to place the video files.
 * This path must be writable by the web server and inside the web server's document folder.
 * NOTE: do not put the trailing slash at the end
 * 
 * example:
 * $base_video_folder = "/var/www/myblobtv/videos"; // do not put the trailing slash
 */
$base_video_folder = "/var/www/myblobtv/videos";

/**
 * @var base_video_url
 * @required
 * This variable configures the base URL for video playback; it must be an absolute URL
 * (eg: starting with http://) otherwise the player will not play the video properly.
 * NOTE: do not put the trailing slash at the end
 * 
 * example:
 * $base_video_url = "http://www.mywebsite.com/myblobtv/videos"; // do not put the trailing slash
 */
$base_video_url = "http://www.mywebsite.com/myblobtv/videos";

/**
 * @var base_thumbs_folder
 * @required
 * This variable configures the path on the server file system where to place the thumbnail files.
 * This path must be writable by the web server and inside the web server's document folder.
 * NOTE: do not put the trailing slash at the end
 * 
 * example:
 * $base_thumbs_folder = "/var/www/myblobtv/thumbs"; // do not put the trailing slash
 */
$base_thumb_folder = "/var/www/myblobtv/thumbs";

/**
 * @var base_thumb_url
 * @required
 * This variable configures the base URL for video playback; 
 * it can be a relative or absolute URL
 * NOTE: do not put the trailing slash at the end
 * 
 * example:
 * $base_thumnb_url = "/myblobtv/thumbs"; // do not put the trailing slash
 */
$base_thumb_url = "/myblobtv/thumbs";

?>