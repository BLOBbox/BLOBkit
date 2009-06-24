<?php

require_once "HTTP/Request.php";

$ts = sprintf("'%s'",time());

$msg = json_decode(stripslashes(urldecode($_GET['params'])), true);


/*
echo "<h1>RECEIVED</h1>";
echo "<pre>" . print_r($msg, true) . "</pre>";
$msg = array(
		'user'=> array(),
		'show'=> array(
				'type'=>0,
				'metadata'=>array(
						'media_id'=>1,
						'channel_id'=>0,
						'timestamp'=> $ts,
						'duration'=>'1000',
						'publisher_id'=>1,
						'tags'=>array(),
						'dvbresources'=>array(
								'network_id'=>0,
								'transport_stream_id'=>0,
								'service_id'=>0
							)
					),
				'ads' => array(
						'36px140',
						'36px141',
						'36px142',
						'36px143',
						'36px144',
						'36px145',
						'36px146',
						'36px147'
					)
				)
	);

echo "<h1>HARDCODED</h1>";
echo "<pre>" . print_r($msg, true) . "</pre>";
*/

// Verifico che esista la azione
if (isset($_GET['action'])) {
	$action = $_GET['action'];
} else {
	$arr = array(
		'error'=>true,
		'value'=>'No provided action'
	);
	die(json_encode($arr));
}

$restMethod = 'GET';

switch ($action) {
	case 'sendRequest':
		$msg['show']['metadata']['timestamp'] = $ts;
		$serverUri = 'http://ad2.neodatagroup.it/ad/tvblob.jsp?params=' . json_encode($msg);
		//echo "<h1>$serverUri</h1>";
		break;
	case 'sendConfirm':
		$serverUri = 'http://ad2.neodatagroup.it/ad/tvblob.jsp?params=' . json_encode($msg);
		//echo "<h1>$serverUri</h1>";
		break;
	default:
		$arr = array(
			'error'=>true,
			'value'=>'Wrong action'
		);
		die(json_encode($arr));
}

$req =& new HTTP_Request($serverUri);

switch ($restMethod) {
	case 'POST':
		$req->setMethod(HTTP_REQUEST_METHOD_POST);
		break;
	case 'GET':
	default:
		$req->setMethod(HTTP_REQUEST_METHOD_GET);
}

if (!PEAR::isError($req->sendRequest())) {
	//$results = json_decode($req->getResponseBody());
	if ($req->getResponseCode() == 200) {
		echo $req->getResponseBody();
		//echo json_decode($req->getResponseBody());
		return;
	} else {
		$arr = array(
			'error'=>true,
			'value'=>'Wrong response code',
			'code'=>$req->getResponseCode(),
			'header'=>$req->getResponseHeader(),
			'uri'=>$serverUri
		);
	}
} else {
	$arr = array(
		'error'=>true,
		'value'=>'Error sending request',
		'uri'=>$serverUri
	);
}

$response = json_encode($arr);
echo $response;

?>
