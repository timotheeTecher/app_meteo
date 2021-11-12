import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';

const CLE_API = "75d1a2a075e642215d446266ebae4bfd";
let resultatsAPI;

const temps                = document.querySelector('.temps');
const temperature          = document.querySelector('.temperature');
const localisation         = document.querySelector('.localisation');
const heure                = document.querySelectorAll('.heure-nom-prevision')
const tempPourH            = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv             = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv         = document.querySelectorAll('.jour-prevision-temp');
const imgIcone             = document.querySelector('.logo-meteo');
const chargementContainer  = document.querySelector('.overlay-icone-chargement');

const appelAPI = (long, lat) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLE_API}`)
    .then(reponse => {
        return reponse.json();
    })
    .then(data => {
        resultatsAPI = data;
        temps.textContent = resultatsAPI.current.weather[0].description;
        temperature.textContent = `${Math.trunc(resultatsAPI.current.temp)}°`;
        localisation.textContent = resultatsAPI.timezone;
        
        //Affichge de l'heure toutes les 3 heures
        let heureActuelle = new Date().getHours();
        for (let i = 0; i < heure.length; i++) {
            let heureIncr = heureActuelle + i * 3;
            if (heureIncr > 24) {
                heure[i].textContent = `${heureIncr - 24}h`;
            } else if (heureIncr === 24) {
                heure[i].textContent = "00h";
            } else {
                heure[i].textContent = `${heureIncr}h`;
            }
        }

        //Affichage de la température toute les 3 heures
        for (let i = 0; i < tempPourH.length; i++) {
            tempPourH[i].textContent = `${Math.trunc(resultatsAPI.hourly[i * 3].temp)}°`;
        }

        //Afficher les 3 premières lettres des jours 
        for (let i = 0; i < tabJoursEnOrdre.length; i++) {
            joursDiv[i].textContent = tabJoursEnOrdre[i].slice(0 ,3);
        }

        //Afficher les températures pour chaque jour
        for (let i = 0; i < 7; i++) {
            tempJoursDiv[i].textContent = `${Math.trunc(resultatsAPI.daily[i + 1].temp.day)}°`;
        }

        //Icône dynamique
        if (heureActuelle >= 6 && heureActuelle < 21) {
            imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`;
        } else {
            imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`;
        }

        chargementContainer.classList.add('disparition');
    })
}

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        appelAPI(long, lat);
    }, () => {
        alert("Vous avez refusé la géolocalistaion, l'application ne peut pas fonctionner, veuillez l'activer !");
    });
}