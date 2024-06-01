'use strict';

const LOCALE_MESSAGES = {
    en: {
        timeInUTC: 'The time in UTC is:',
        timeInCST: 'The time in CST is:',
        timeInBRT: 'The time in BRT is:',
        ipAddress: 'Your IP address is:',
        locale: 'Your locale is:',
        timeZone: 'Your time zone is:',
        userAgent: 'Your user agent is:',
        services: 'Global time services provided by <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>.',
    },
    pt: {
        timeInUTC: 'O horário em UTC é:',
        timeInCST: 'O horário em CST é:',
        timeInBRT: 'O horário em BRT é:',
        ipAddress: 'Seu endereço IP é:',
        locale: 'Sua localidade é:',
        timeZone: 'Seu fuso horário é:',
        userAgent: 'Seu agente de usuário é:',
        services: 'Serviços de horário global fornecidos pelo <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>.',
    },
    es: {
        timeInUTC: 'La hora en UTC es:',
        timeInCST: 'La hora en CST es:',
        timeInBRT: 'La hora en BRT es:',
        ipAddress: 'Tu dirección IP es:',
        locale: 'Tu localidad es:',
        timeZone: 'Tu zona horaria es:',
        userAgent: 'Tu agente de usuario es:',
        services: 'Servicios de hora global proporcionados por <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>.',
    },
    fr: {
        timeInUTC: 'L\'heure UTC est :',
        timeInCST: 'L\'heure à CST est :',
        timeInBRT: 'L\'heure en BRT est :',
        ipAddress: 'Votre adresse IP est :',
        locale: 'Votre langue est :',
        timeZone: 'Votre fuseau horaire est :',
        userAgent: 'Votre agent utilisateur est :',
        services: 'Services d\'heure globale fournis par <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>.',
},
};

const DEFAULT_MESSAGE_LOCALE = 'en-US';

const MESSAGE_LOCALE = navigator.language || DEFAULT_MESSAGE_LOCALE;
const MESSAGE_LOCALE_MAJOR = MESSAGE_LOCALE.split('-')[0];
const DEFAULT_MESSAGE_LOCALE_MAJOR = DEFAULT_MESSAGE_LOCALE.split('-')[0];
const MESSAGES = LOCALE_MESSAGES[MESSAGE_LOCALE_MAJOR] || LOCALE_MESSAGES[DEFAULT_MESSAGE_LOCALE_MAJOR];

const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

////////////////////////

const Targets = {
    appContainer: () => document.getElementById('app'),
    currentTimeUTC: () => document.getElementById('current-time-utc'),
    currentTimeCST: () => document.getElementById('current-time-cst'),
    currentTimeBRT: () => document.getElementById('current-time-brt'),
    ipAddress: () => document.getElementById('ip-address'),
};

////////////////////////

document.addEventListener('DOMContentLoaded', main);

function main() {
    start();
    asyncStart();
    loop();
}

function start() {
    let initialView = buildInitialView();
    Targets.appContainer().innerHTML = initialView;
}

function loop() {
    refreshTimeDisplays();
    setTimeout(loop, 1000);
}

function refreshTimeDisplays() {
    let currentTimeInUTC = new Date().toLocaleTimeString('en-US', {timeZone: 'UTC'});
    Targets.currentTimeUTC().textContent = currentTimeInUTC;

    let currentTimeInCST = new Date().toLocaleTimeString('en-US', {timeZone: 'America/Chicago'});
    Targets.currentTimeCST().textContent = currentTimeInCST;

    let currentTimeInBRT = new Date().toLocaleTimeString('en-US', {timeZone: 'America/Sao_Paulo'});
    Targets.currentTimeBRT().textContent = currentTimeInBRT;
}

function buildInitialView() {
    return `
        <p>${MESSAGES.timeInUTC} <b id="current-time-utc"></b></p>
        <p>${MESSAGES.timeInCST} <b id="current-time-cst"></b></p>
        <p>${MESSAGES.timeInBRT} <b id="current-time-brt"></b></p>
        <p>${MESSAGES.ipAddress} <b id="ip-address">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></p>
        <p>${MESSAGES.userAgent} <b>${navigator.userAgent}</b></p>
        <p>${MESSAGES.locale} <b>${MESSAGE_LOCALE}</b></p>
        <p>${MESSAGES.timeZone} <b>${USER_TIMEZONE}</b></p>
        <p><small>${MESSAGES.services}</small></p>
    `;
}

////////////////////////

async function asyncStart() {
    let userIpAddress = await ipify();
    Targets.ipAddress().textContent = userIpAddress;
}

// Fetch the user's IP address
function ipify() {
    return fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip);
}
