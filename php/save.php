<?php
	// requires php5
	define('UPLOAD_DIR', 'images/');
	$img = $_POST['imgBase64'];
	// $img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace('data:image/jpeg;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = UPLOAD_DIR . uniqid() . '.jpg';
	try {
		$success = file_put_contents($file, $data);
		print $success ? $file : "Unable to save the file. $success";
	} catch(Exception $e) {
		$error = $e;
		echo $error;
	}
	
?>