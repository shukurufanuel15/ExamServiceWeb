require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Clé secrète Stripe chargée depuis une variable d'environnement

const app = express();
const port = 3000;

// Récupération des secrets depuis les variables d'environnement
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const twilioNumber = process.env.TWILIO_PHONE_NUMBER; 

const client = new twilio(accountSid, authToken);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'sms.html')); 
});

app.post('/send-sms', (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ status: 'Erreur : numéro de téléphone ou message manquant.' });
    }

    client.messages.create({
        body: message,
        from: twilioNumber,
        to: to
    })
    .then(message => {
        console.log(`Message SID: ${message.sid}`);
        res.json({ status: `Message envoyé avec succès : ${message.sid}` });
    })
    .catch(error => {
        console.error(`Erreur d'envoi : ${error.message}`);
        res.status(500).json({ status: 'Erreur lors de l\'envoi du message.' });    
    });
});

// Route pour créer une session de paiement Checkout
app.post('/create-checkout-session', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency,
                    product_data: {
                        name: 'Montant de paiement',
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error(`Erreur lors de la création de la session Checkout : ${error.message}`);
        res.status(500).send({ error: 'Erreur lors de la création de la session de paiement.' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});