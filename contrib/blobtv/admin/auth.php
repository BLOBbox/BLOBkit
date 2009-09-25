<?php

session_start();

if (isset($_SESSION['login']) && isset($_SESSION['password']) && $_SESSION['login'] == $admin_user && $_SESSION['password'] == $admin_pass) {
	$_SESSION['last_action'] = time();
} else {
	// user not logged in
	$logged = false;
	if (isset($_POST['username']) && isset($_POST['password']) && strlen($_POST['username']) > 0 && isset($_POST['password'])) {
		if ($_POST['username'] == $admin_user && $_POST['password'] == $admin_pass) {
			$logged = true;
			$_SESSION['login'] = $_POST['username'];
			$_SESSION['password'] = $_POST['password'];
			$_SESSION['last_action'] = time();
		} 
	}
	if ($logged == false) {
		include 'header.php';
		?>
		
	    <div id="login" class="login">
	        <form id="loginform" action='?a=' method='POST'>
	            <label for="username">
	                <?php print USERNAME; ?>
	            </label>
	            <br/>
	            <input type="text" id="username" name="username"/>
	            <br/>
	            <label for="password">
	                <?php print PASSWORD; ?>
	            </label>
	            <br/>
	            <input type="password" id="password" name="password"/>
	            <br/>
	            <input type='submit' name='login' value='<?php print LOGIN; ?>' /> 
	        </form>
	    </div>
		
		<script type='text/javascript'>
			document.getElementById('username').focus();
		</script>
		
		<?php
		include 'footer.php';
		die();
	}
}

?>