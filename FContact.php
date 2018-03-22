<?php 
// Protection contre faille XSS  >>>> echo htmlspecialchars
// Utilisation de la super global SERVER, nous renvois a l'adresse de la page ou je suis au moment présent.

    $firstname = $name = $email = $phone = $message = "";               // initialisation des donnée à récuperer dans des variable >> String vide.
    $firstnameError = $nameError = $emailError = $phoneError = $messageError = "";
    $isSuccess = false;                                                 // Gere l'affichage du message de confirmation d'envoie du formulaire.
    $emailTo = "mathkala@gmail.com";
    
    if($_SERVER["REQUEST_METHOD"] == "POST" ) {                          // Si je suis dans la deuxieme lecture(POST) alors je rentre dans la condition.
                                                                        // Ou si la request method est post.
        $firstname = verifyInput($_POST["firstname"]);                  // La super global $POST nous permet de récuperer les informations.
        $name = verifyInput($_POST["name"]);                            // La liaison est effectué car le firstname dans le html a l'attribut "name = firstname"
        $email = verifyInput($_POST["email"]);
        $phone = verifyInput($_POST["phone"]);
        $message = verifyInput($_POST["message"]);
        $isSuccess = true;
        $emailText = "";
        
        if(empty($firstname)){       // Condition qui permet de controler coté serveur que les entrées sont bien valide.
            $firstnameError = "On veut connaitre ton prénom ! :)";
            $isSuccess = false;
        }else {
            $emailText .= "Firstname: $firstname\n";
        }
        if(empty($name)){                         
            $nameError = "On veut même connaitre ton nom ! :)";
            $isSuccess = false;
        }else {
            $emailText .= "Name: $name\n";
        }
        if(!isEmail($email)){
            $emailError = "On a besoin de ton Email pour te répondre voyons ! ;)";
            $isSuccess = false;
        } else {
            $emailText .= "Email: $email\n";
        }             
        if(!isPhone($phone)){
            $phoneError = "Uniquement des chiffres et des espaces :)";
            $isSuccess = false;
        }else {
            $emailText .= "Phone: $phone\n";
        }
        if(empty($message)){
            $messageError = "Et bien tu n'a rien a nous dire ? :)";
            $isSuccess = false;
        }else {
            $emailText .= "Message: $message\n";
        }
        
        if($isSuccess){         // seulement si tout les conditions sont remplis alors $isSuccess est égale a true.
            $headers = "From: $firstname $name <$email>\r\nReply-to: $email";
            mail($emailTo, "Message client ArcadeCrew !", $emailText, $headers);
            $firstname = $name = $email = $phone = $message = "";
        }
        
    }
    
    
    function isPhone($var){
        
        return preg_match("/^[0-9 ]*$/", $var); // Une expression régulière qui permet de verifier si le numéro 
                                                // de tel fournis respecte bien les lois de notre expression, return un boolean. 
    }
    
    
    function isEmail($var) {         // Fonction qui permet de verifier que l'on fournis bien un email valide, elle retourne un Boolean. 
        
        return filter_var($var, FILTER_VALIDATE_EMAIL);      
    }
    
    // Fonction qui permet de verifier les Inputs "Securité" avant d'être réexploité en deuxieme lecture.
    
    function verifyInput($var){
        
        $var = trim($var);              // La fonction trim retire tous les espace/tab/retour a la ligne suplementaire qui ne sont pas prévus.
        $var = stripcslashes($var);     // La fonction Stripcslashes retire tout les antislashs
        $var = htmlspecialchars($var);
        
        return $var;
    }
    
?>

<!DOCTYPE html>
<html>
	<head>
		
		<title>Contactez-nous</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>		
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">        
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>	
		<link href="http://fonts.googleapis.com/css?family=lato" rel="stylesheet" type="text/css">	
		<link rel= "stylesheet" href="css/styleFormulaire.css">
		
		
	</head>
	<body>
		<div class="container">
			<div class="divider"></div>
			<div class="heading">
					<h2 id="hformulaire">Contactez-nous</h2>
				</div>
				<div class="row">
					<div class="col-lg-12 col-lg-offset-1">
						<form id="contact-form" method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" role="form"> 
						
						<div class="col-xs-12 col-sm-10 col-md-10 col-lg-10">
            <nav id="navbar">
              <ul>
                <li><a href="indexClone.html">Accueil</a></li>
                <li><a href="snake.html">Snake</a></li>
                 <li><a href="PianoGame.html">PianoGame</a></li>
                <li><a href="apropos.html">à propos</a></li>
                <li class="current"><a href="FContact.php">Contact</a></li>
              </ul>
            </nav>
          </div>
						
						
						
						<div class="row">
						
							<div class="col-md-6">
							<label for="firstname">Prénom<span class="blue"> *</span></label>
							<input type="text" id="firstname" name="firstname"  class="form-control" placeholder="Votre prénom" 
							value= <?php echo $firstname; ?>>
							<p class="comments"><?php echo $firstnameError; ?></p>
							</div>
							
							<div class="col-md-6">
							<label for="name">Nom<span class="blue"> *</span></label>
							<input type="text" id="name" name="name" class="form-control" placeholder="Votre nom"
							value= <?php echo $name; ?>>
							<p class="comments"><?php echo $nameError; ?></p>
							</div>
							
							<div class="col-md-6">
							<label for="email">Email<span class="blue"> *</span></label>
							<input type="email"  id="email" name="email" class="form-control" placeholder="Votre email"
							value= <?php echo $email; ?>>
							<p class="comments"><?php echo $emailError; ?></p>
							</div>
							
							<div class="col-md-6">
							<label for="phone">Téléphone</label>
							<input type="tel" id="phone" name="phone" class="form-control" placeholder="Votre Téléphone"
							value= <?php echo $phone; ?>>
							<p class="comments"><?php echo $phoneError; ?></p>
							</div>	
												
							<div class="col-md-12">
							<label for="message">Message<span class="blue"> *</span></label>
							<textarea id="message" name="message" class="form-control" placeholder="Votre méssage" rows="4" 
							><?php echo $message; ?></textarea>
							<p class="comments"><?php echo $messageError; ?></p>
							</div>
							
							<div class="col-md-12">
							<p class="blue"><strong>* Ces informations sont requises</strong> </p>
							</div>
							
							
							<div class="col-md-12">
								<input type="submit" class="button1" value="Envoyer">
							</div>
							
							
						</div>
						
						<p class="thank-you" style="display:<?php if($isSuccess) echo'block'; else echo 'none'?>">Votre message a bien été envoyé. Merci de nous avoir contacté :) </p>
						
						</form>
					</div>
				</div>
     		</div>
		
	
	</body>
</html>



