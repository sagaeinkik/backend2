'use strict';
const experienceContainer = document.querySelector('div.experience-container'); //Container som posterna ska in i

//Gör fetch-anrop när sidan har laddat
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    //Meddelande medan man väntar
    const waitP = document.createElement('p');
    waitP.innerText = 'Var god vänta...';
    experienceContainer.appendChild(waitP);
});
let url = 'https://cv-api-nqg3.onrender.com/api/cv';

//Funktion som hämtar all data
async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        //alternativt meddelande om det inte finns nå data
        if (data.length < 1) {
            const noDataP = document.createElement('p');
            noDataP.innerText = 'Det finns inga jobb att visa ännu...';
            experienceContainer.appendChild(noDataP);
            return;
        }
        //Anropa funktion som skriver ut till skärmen
        printData(data);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

//Funktion som skriver ut data till skärm
function printData(data) {
    //Töm container på alla tidigare rader
    experienceContainer.innerHTML = `<h2>Erfarenheter</h2>`;

    if (data.length < 1) {
        experienceContainer.innerHTML += '<p>Det finns inget att visa...</p>';
    }

    //Loopa igenom
    data.forEach((job) => {
        //Variabler för datum
        let startDate = job.start_date;
        startDate = hyphenToDot(startDate);
        let endDate = job.end_date;
        if (job.end_date !== null) {
            endDate = hyphenToDot(endDate);
        }
        /* Målet: 
        <article> 
            <section>
                <p class="jobtitle">(titel)</p><span class="dates">(startdatum) &ndash; (slutdatum)</span>
                <p class="companyname">(företagsnamn)</p>
                <p class="jobdesc">(Jobbeskrivning)</p>
            </section>
            <div class="controls">
                <button class="edit"><i class="fa-regular fa-pen-to-square"></i></button>
                <button class="delete"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        </article> */

        const articleEl = document.createElement('article');
        const sectionEl = document.createElement('section');

        //Jobbtitel
        const titleP = document.createElement('p');
        titleP.classList.add('jobtitle');
        titleP.innerText = job.title;

        //Datum
        const spanP = document.createElement('span');
        spanP.classList.add('dates');
        let jobStatus = '';
        if (job.end_date === null) {
            jobStatus = 'pågående';
            spanP.innerHTML = `${startDate} &ndash; ${jobStatus}`;
        } else {
            spanP.innerHTML = `${startDate} &ndash; ${endDate}`;
        }

        //Företagsnamn
        const employerP = document.createElement('p');
        employerP.classList.add('employername');
        employerP.innerText = job.employer;

        //Jobbeskrivning
        const descP = document.createElement('p');
        descP.classList.add('jobdesc');
        descP.innerText = job.description;

        //In i section-elementet och lägg i article-element
        sectionEl.appendChild(titleP);
        sectionEl.appendChild(spanP);
        sectionEl.appendChild(employerP);
        sectionEl.appendChild(descP);
        articleEl.appendChild(sectionEl);

        //Knapparna
        const controlsDiv = document.createElement('div');
        controlsDiv.classList.add('controls');

        //edit-knapp:
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit');
        editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
        //Eventlistener för uppdatering
        editBtn.addEventListener('click', () => {
            const id = job.id;
            window.location.href = `/edit.html?id=${id}`;
        });

        //Delete-knapp
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
        // Eventlistener för radering
        deleteBtn.addEventListener('click', () => {
            deleteJob(job.id);
        });

        controlsDiv.appendChild(editBtn);
        controlsDiv.appendChild(deleteBtn);
        articleEl.appendChild(controlsDiv);

        //Peta in i DOM
        experienceContainer.appendChild(articleEl);
    });
}

//Funktion som gör om bindestreck till punkt
function hyphenToDot(string) {
    return string.replace(/-/g, '.');
}

//Funktion som raderar
async function deleteJob(jobId) {
    try {
        const response = await fetch(`${url}/${jobId}`, {
            //Skicka med metod och headers
            method: 'DELETE',
            headers: {
                'content-type': 'Application/json',
            },
        });
        //Kolla om det gick bra, isåfall uppdatera vyn
        if (response.ok) {
            const data = await response.json();
            fetchData();
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}
