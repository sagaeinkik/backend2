'use strict';

//variabler
const button = document.querySelector('button.burgerbtn');
const nav = document.querySelector('nav');

//Händelselyssnare som togglar klasser
button.addEventListener('click', () => {
    button.classList.toggle('active');
    nav.classList.toggle('active');
});

// Stäng menyn vid klick utanför
document.addEventListener('click', (event) => {
    const target = event.target;
    // Kolla om klicket inträffade utanför menyn
    if (!nav.contains(target) && !button.contains(target)) {
        // Ta bort active för att stänga menyn
        button.classList.remove('active');
        nav.classList.remove('active');
    }
});
