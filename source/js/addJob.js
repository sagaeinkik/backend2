'use strict';

//Variabler
let errorSpan = document.querySelector('span.error'); //För error-meddelanden vid validering
const descriptionInput = document.getElementById('description'); // Textarea jobbeskrivning
const charCountSpan = document.querySelector('.charcount'); // span med siffra
const form = document.querySelector('form'); //formuläret
let url = 'https://cv-api-nqg3.onrender.com/api/cv'; //API

// händelselyssnare som uppdaterar räknaren vid input
descriptionInput.addEventListener('input', updateCharCount);
document.addEventListener('DOMContentLoaded', function (e) {
    updateCharCount();
});
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addJob(e);
});

//Funktion för att validera input
function validateInput(employer, title, description, startDate) {
    if (employer.length < 1) {
        errorSpan.innerText = 'Du måste ange arbetsgivare';
        return false;
    } else if (title.length < 1) {
        errorSpan.innerText = 'Du måste ange jobbtitel';
        return false;
    } else if (description.length < 1) {
        errorSpan.innerText = 'Du måste ange en beskrivning';
        return false;
    } else if (description.length > 255) {
        errorSpan.innertText = 'Beskrivningen får inte vara mer än 255 tecken lång.';
        return false;
    } else if (startDate.length < 1) {
        errorSpan.innerText = 'Ange ett startdatum för anställningen.';
        return false;
    }

    errorSpan.innerText = '';
    return true;
}

// Funktion för att uppdatera teckenräknaren och begränsa antalet tecken
function updateCharCount() {
    const maxLength = 255;
    const currentLength = descriptionInput.value.length;

    // Uppdatera teckenräknaren
    charCountSpan.textContent = maxLength - currentLength;

    // Kontrollera om den aktuella längden överskrider maxlängden
    if (currentLength >= maxLength) {
        // Klipp av texten om den är för lång
        descriptionInput.value = descriptionInput.value.substring(0, maxLength);
    }
}

//Lägg till jobb
async function addJob(e) {
    //Formulärfält värden
    let employer = document.getElementById('employer').value;
    let title = document.getElementById('title').value;
    let desc = descriptionInput.value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    if (!endDate) {
        endDate = null;
    }

    if (!validateInput(employer, title, desc, startDate)) {
        return;
    }
    let newJob = {
        employer: employer,
        title: title,
        description: desc,
        startDate: startDate,
        endDate: endDate,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'Application/json',
            },
            body: JSON.stringify(newJob),
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            errorSpan.innerText = error;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
