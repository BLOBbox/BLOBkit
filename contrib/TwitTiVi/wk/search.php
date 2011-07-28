<?php
require_once "HTTP/Request.php";
$q = urlencode($_GET['q']);
		$uri = "http://search.twitter.com/search.json?rpp=10&q=%23" . $q;
		$req = & new HTTP_Request($uri);
		$req->setMethod(HTTP_REQUEST_METHOD_POST);

		if (!PEAR::isError($req->sendRequest()))
		{
			if ($req->getResponseCode() == 200)
			{
				$ret = $req->getResponseBody();
			}

			//$json = json_decode($ret,true);
			print json_encode($ret);
			return;
			$movies = $json['movies_result']['movie'];

			if (isset($_GET['DEBUG']))
			{
				echo "<pre>";
				print_r($movies);
				echo "</pre>";
			}
			else
			{
//				echo "var json = " . json_encode($movies).";";
				echo "" . json_encode($movies)."";
			}
		}

?>
