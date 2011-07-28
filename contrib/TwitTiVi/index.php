<?php
$ua = $_SERVER['HTTP_USER_AGENT'];
if (substr($ua, 0, 9) == "Blobkit/1") header("Location: es/");
elseif (substr($ua, 0, 9) == "Blobkit/2") header("Location: wk/");
else header("Location: http://www.blobbox.tv/");
?>