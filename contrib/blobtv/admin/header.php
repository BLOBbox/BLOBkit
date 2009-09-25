<!DOCTYPE PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name='Author' value='Francesco Facconi francesco.facconi@tvblob.com' />
        <title><?php print $title . " - " . ADMIN_TITLE; ?></title>
        <link rel="stylesheet" type="text/css" href="admin.css" />
    </head>
    <body>
        <div id="title">
            <h1>TVBLOB</h1>
        </div>
        
        <div class='clear'>&nbsp;</div>
        
        <div id='messagebar'></div>
        
        <div id='container'>
        
            <div id='topbar'></div>
            
            <div id="content">
            
                <div id='titlebar'>
                	<h2><?php print $title . " - " . ADMIN_TITLE; ?></h2>
					<?php
					if ($_SESSION['login'] == $admin_user) {
						?>
                		<div id='actions'><a href='?a=l'><?php print SHOW_ALL; ?></a> | <a href='?a=l&t=p'><?php print SHOW_PUBLISHED; ?></a> | <a href='?a=a'><?php print ADD; ?></a> | <a href='?a=o'><?php print LOGOUT; ?></a></div>
						<?php
					}
					?>
                </div>
                
                <div id="inner">
