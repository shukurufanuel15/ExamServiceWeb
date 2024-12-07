
// Import the functions you need from the SDKs you need
import {collection, addDoc} from "https:www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const numero_telephone = document.getElementById('numero_telephone').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        try {
            const docRef = await addDoc(collection(window.db, "contact"), {
                nom: nom,
                prenom: prenom,
                numero_telephone: numero_telephone,
                email: email,
                message: message,
                timestamp: new Date() 
            });
            alert("Votre message a été envoyé avec succès !");
        } catch (e) {
            console.error("Erreur lors de l'ajout du document: ", e);
            alert("Une erreur s'est produite lors de l'envoi de votre message : " + e.message);
        }

        // Réinitialiser le formulaire
        form.reset();
    });
});