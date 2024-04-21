'use strict';

//Gör fetch-anrop när sidan har laddat
document.addEventListener('DOMContentLoaded', fetchData);
let url = 'https://cv-api-nqg3.onrender.com/api/cv';

//Funktion som hämtar all data
async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        printData(data);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

function printData(data) {
    console.log(data);
    const experienceContainer = document.querySelector('div.experience-container'); //Container som posterna ska in i
    experienceContainer.innerHTML = '';

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
        const companyP = document.createElement('p');
        companyP.classList.add('companyname');
        companyP.innerText = job.company;

        //Jobbeskrivning
        const descP = document.createElement('p');
        descP.classList.add('jobdesc');
        descP.innerText = job.description;

        //In i section-elementet och lägg i article-element
        sectionEl.appendChild(titleP);
        sectionEl.appendChild(spanP);
        sectionEl.appendChild(companyP);
        sectionEl.appendChild(descP);
        articleEl.appendChild(sectionEl);

        //Knapparna
        const controlsDiv = document.createElement('div');
        controlsDiv.classList.add('controls');

        //edit-knapp:
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit');
        editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;

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
        //Kolla om det gick bra, i så fall skriv ut meddelandet till konsollen
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //Uppdatera vyn
            fetchData();
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}
