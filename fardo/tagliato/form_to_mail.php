<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

//Impostare a true per vedere un messaggio dettaggliato di eventuali errori
$debug = false;

/*********************************
 * IMPOSTAZIONI SMTP MAIL SERVER
 * *******************************/
 $mail_host = 'mail.dominiquefardo.com';
 $username = 'send@dominiquefardo.com';
 $password = 'nP!dNYs9kNRJ';
 $port = 465;

//Da impostare a true se prevista crittografia
$encryption_flag = true;
//Tipologia di crittografia
$encryption_type = 'ssl';
//SMTPAuth
$SMTPAuth = true;
/*********************************/




/*********************************
 * MITTENTE E DESTINATARIO EMAIL
 * *******************************/
$mittente_email = 'send@dominiquefardo.com';
$mittente_nome = 'Modulo Contatti Sito';
$destinatario_email = 'info@dominiquefardo.com';
$destinatario_nome = 'Dominique Fardo';
/*********************************/




//Variabili di output
$errors = [];
$data = [];


/*******************************
 * CONTROLLO DATI OBBLIGATORI
 * *****************************/

//Nome
if (empty($_POST['name'])) {
    $errors['name'] = 'The name field is required.';
}
//Email
if (empty($_POST['email'])) {
    $errors['email'] = 'The email field is required.';
}
//Messaggio
if (empty($_POST['text'])) {
    $errors['text'] = 'The text field is required.';
}

//Verifica se ci sono dati obbligatori vacanti
if (!empty($errors)) {
    $data['success'] = false;
    $data['errors'] = $errors;
}
/*********************************/
else{


	/********************************
	 * SANITIZE INPUT E CONTROLLO
	 ********************************/
	//Nome
	$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
	$name = filter_var($name, FILTER_SANITIZE_SPECIAL_CHARS);
	$name = filter_var($name, FILTER_SANITIZE_ADD_SLASHES);
	//Cognome
	$lastname = filter_var($_POST['lastname'], FILTER_SANITIZE_STRING);
	$lastname = filter_var($lastname, FILTER_SANITIZE_SPECIAL_CHARS);
	$lastname = filter_var($lastname, FILTER_SANITIZE_ADD_SLASHES);
	//Telefono
	$phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
	$phone = filter_var($phone, FILTER_SANITIZE_SPECIAL_CHARS);
	$phone = filter_var($phone, FILTER_SANITIZE_ADD_SLASHES);

	//Email
	$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

	if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
	    $errors['email'] = 'Il formato mail non è corretto.';
	}

	//Messaggio
	$text = filter_var($_POST['text'], FILTER_SANITIZE_STRING);
	$text = filter_var($text, FILTER_SANITIZE_SPECIAL_CHARS);
	$text = filter_var($text, FILTER_SANITIZE_ADD_SLASHES);


	//Presenza di errori nei dati
	if (!empty($errors)) {
	    $data['success'] = false;
	    $data['errors'] = $errors;
	}
	/*********************************/
	else{

		/*******************************
		 * COSTRUZIONE CONTENUTO EMAIL
		 * *****************************/
		$oggetto = 'Oggetto della mail';
		$contenuto_html =
			'<b>Nome:</b><br>'.$name.'<br><br>'.
			'<b>Cognome:</b><br>'.$lastname.'<br><br>'.
			'<b>Email:</b><br>'.$email.'<br><br>'.
			'<b>Telefono:</b><br>'.$phone.'<br><br>'.
			'<b>Messaggio:</b><br>'.$text;

		$contenuto_non_html =
			'Nome: '.$name.'.'.
			'Cognome: '.$lastname.'.'.
			'Email: '.$email.'.'.
			'Telefono: '.$phone.'.'.
			'Messaggio: '.$text;

		/*********************************/



		/*********************************
		 * INVIO MAIL
		 *********************************/

		$mail = new PHPMailer(true);

		try {
		    //SERVER SETTING

		    //Enable verbose debug output
		   	//$mail->SMTPDebug = SMTP::DEBUG_SERVER;

		    //Send using SMTP
		    $mail->isSMTP();
		    //Set the SMTP server to send through
		    $mail->Host = $mail_host;
		    //Enable SMTP authentication
		    $mail->SMTPAuth = $SMTPAuth;
		    $mail->Username = $username;
		    $mail->Password = $password;
		    if($encryption_flag){
		    	$mail->SMTPSecure = $encryption_type;
		    }
		    $mail->Port = $port;


		    //Recipients
		    $mail->setFrom($mittente_email, $mittente_nome);
		    $mail->addAddress($destinatario_email, $destinatario_nome);

		    //Content
		    $mail->isHTML(true);
		    $mail->Subject = $oggetto;
		    $mail->Body    = $contenuto_html;
		    $mail->AltBody = $contenuto_html;

		    $mail->send();


		    $data['success'] = true;
			$data['message'] = 'Your message has been sent successfully.';
		}
		catch (Exception $e) {

			if($debug){
				$errors['send_mail'] = "The message was not sent. Errors: {$mail->ErrorInfo}";
			}
			else{
				$errors['send_mail'] = "An error occurred, the message was not sent.";
			}

			$data['success'] = false;
	    	$data['errors'] = $errors;
		}

	}

}

echo json_encode($data, JSON_UNESCAPED_UNICODE);

?>
