<?php

// Require the Composer autoloader at the very top
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load environment variables from .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize and retrieve form data
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone']));
    $project = htmlspecialchars(trim($_POST['project']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Basic validation
    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($phone) || empty($project) || empty($message)) {
        http_response_code(400);
        echo "Veuillez remplir tous les champs du formulaire.";
        exit;
    }

    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings - Simplified Gmail configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = trim($_ENV['SMTP_USERNAME'], '"');
        $mail->Password = trim($_ENV['SMTP_PASSWORD'], '"');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';

        // Recipients
        $mail->setFrom(trim($_ENV['MAIL_FROM_ADDRESS'], '"'), trim($_ENV['MAIL_FROM_NAME'], '"'));
        
        // Handle multiple recipients
        $recipients = explode(',', trim($_ENV['MAIL_TO_ADDRESS'], '"'));
        foreach ($recipients as $recipient) {
            $mail->addAddress(trim($recipient));
        }
        
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true); // Switch to HTML format
        $mail->Subject = 'Nouvelle demande de devis pour : ' . $project;
        
        // HTML formatted email body with professional styling
        $email_body = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: linear-gradient(135deg, #007BFF, #0056b3); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 300; }
                .content { padding: 30px; }
                .field-group { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #007BFF; }
                .field-label { font-weight: bold; color: #007BFF; font-size: 14px; text-transform: uppercase; margin-bottom: 5px; }
                .field-value { font-size: 16px; color: #333; }
                .message-section { margin-top: 25px; padding: 20px; background: #f1f3f4; border-radius: 8px; }
                .message-label { font-weight: bold; color: #007BFF; font-size: 16px; margin-bottom: 10px; }
                .message-content { font-size: 15px; line-height: 1.8; color: #444; white-space: pre-wrap; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #dee2e6; }
                .highlight { color: #007BFF; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📧 Nouvelle Demande de Devis</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Home Renov\' Inc.</p>
                </div>
                
                <div class="content">
                    <p style="font-size: 16px; margin-bottom: 25px;">
                        Vous avez reçu une nouvelle demande de devis via votre site web.
                    </p>
                    
                    <div class="field-group">
                        <div class="field-label">👤 Nom du client</div>
                        <div class="field-value">' . htmlspecialchars($name) . '</div>
                    </div>
                    
                    <div class="field-group">
                        <div class="field-label">📧 Adresse e-mail</div>
                        <div class="field-value"><a href="mailto:' . htmlspecialchars($email) . '" style="color: #007BFF; text-decoration: none;">' . htmlspecialchars($email) . '</a></div>
                    </div>
                    
                    <div class="field-group">
                        <div class="field-label">📞 Téléphone</div>
                        <div class="field-value"><a href="tel:' . htmlspecialchars($phone) . '" style="color: #007BFF; text-decoration: none;">' . htmlspecialchars($phone) . '</a></div>
                    </div>
                    
                    <div class="field-group">
                        <div class="field-label">🏠 Type de projet</div>
                        <div class="field-value"><span class="highlight">' . htmlspecialchars($project) . '</span></div>
                    </div>
                    
                    <div class="message-section">
                        <div class="message-label">💬 Message du client :</div>
                        <div class="message-content">' . nl2br(htmlspecialchars($message)) . '</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>📅 Reçu le ' . date('d/m/Y à H:i') . '</p>
                    <p style="margin: 10px 0 0 0;">
                        <strong>Home Renov\' Inc.</strong> - Votre partenaire pour tous vos projets de rénovation
                    </p>
                </div>
            </div>
        </body>
        </html>';
        
        $mail->Body = $email_body;
        
        // Plain text version for email clients that don't support HTML
        $mail->AltBody = "Nouvelle demande de devis\n\n" .
                        "Nom : " . $name . "\n" .
                        "Email : " . $email . "\n" .
                        "Téléphone : " . $phone . "\n" .
                        "Type de projet : " . $project . "\n\n" .
                        "Message :\n" . $message . "\n\n" .
                        "Reçu le " . date('d/m/Y à H:i');

        $mail->send();
        echo 'Merci! Votre message a été envoyé.';

    } catch (Exception $e) {
        http_response_code(500);
        echo "Le message n'a pas pu être envoyé. Erreur : {$mail->ErrorInfo}";
    }

} else {
    http_response_code(403);
    echo "Il y a eu un problème avec votre envoi, veuillez réessayer.";
    exit;
} 