'use strict';

//Variabler
let errorSpan = document.querySelector('span.error'); //För error-meddelanden vid validering
const descriptionInput = document.getElementById('description'); // Textarea jobbeskrivning
const charCountSpan = document.querySelector('.charcount'); // span med siffra
const form = document.querySelector('form'); //formuläret
let url = 'https://cv-api-nqg3.onrender.com/api/cv'; //API
/* import { validateInput, updateCharCount } from './addJob.js'; */

//Hämta ID från url
document.addEventListener('DOMContentLoaded', (e) => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    fetchJob(id);
});

// händelselyssnare som uppdaterar räknaren vid input
if (descriptionInput) {
    descriptionInput.addEventListener('input', updateCharCount);
}

//Inskick av formulär
form.addEventListener('submit', (e) => {
    e.preventDefault();
    updateJob();
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

async function fetchJob(id) {
    const updateUrl = url + '/' + id;
    console.log(updateUrl);
    try {
        const response = await fetch(updateUrl);
        const data = await response.json();
        fillForm(data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

//Funktion som fyller formulär
function fillForm(job) {
    //peta in värdena från databasen i fälten
    document.getElementById('employer').value = job[0].employer;
    document.getElementById('title').value = job[0].title;
    document.getElementById('description').value = job[0].description;
    //Formattera startDate
    const startDate = new Date(job[0].start_date);
    document.getElementById('startDate').value = formatDate(startDate);

    //Formattera end date om det finns
    if (job[0].end_date) {
        const endDate = new Date(job[0].end_date);
        document.getElementById('endDate').value = formatDate(endDate);
    }
}

//Formattera datum
function formatDate(date) {
    const year = date.getFullYear();
    //Se till att månad alltid är 2 siffror
    const month = String(date.getMonth() + 1).padStart(2, '0');
    //samma med dag
    const day = String(date.getDate()).padStart(2, '0');
    //returnera formatterade datumet
    return `${year}-${month}-${day}`;
}

//Uppdatera jobb!
async function updateJob() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const updateUrl = url + '/' + id;

    //Formulärvärden
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
    let updatedJob = {
        employer: employer,
        title: title,
        description: desc,
        startDate: startDate,
        endDate: endDate,
    };

    try {
        const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'content-type': 'Application/json',
            },
            body: JSON.stringify(updatedJob),
        });
        if (response.ok) {
            const data = await response.json();
            window.location.href = 'index.html';
            console.log(data);
        } else {
            errorSpan.innerText = error;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
