<?php

$errors = '';
$myemail = 'sam@madmog.co.uk';
if(empty($_POST['name'])  || 
   empty($_POST['email']) || 
   empty($_POST['message']))
{
    $errors .= "\n Error: all fields are required";
}
 
$name = $_POST['name']; 
$email_address = $_POST['email']; 
$message = $_POST['message']; 
 
if (!preg_match(
"/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i", 
$email_address))
{
    $errors .= "\n Error: Invalid email address";
}

if( empty($errors))
 
{
 
$to = $myemail;
 
$email_subject = "Contact form submission: $name";
 
$email_body = "You have received a new message from madmog.co.uk \n".
 
"From: $name \n ".
 
"Email: $email_address\n Message: \n $message";
$headers = "From: $myemailr\n";
 
$headers .= "Reply-To: $email_address";
 
//redirect to the 'thank you' page
 $sent = mail($to,$email_subject,$email_body,$headers);
if($sent){
	echo '<script language="javascript">';
	echo 'alert("Thank you for your message!")';
	echo '</script>';
	header('Location: ' . $_SERVER['HTTP_REFERER']);
} 
else { echo 'mail failed';}
 
}
?>