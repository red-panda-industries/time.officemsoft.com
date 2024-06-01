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

const IPIFY_API_URL = 'https://api.ipify.org?format=json';

function fetchUserIp() {
    return fetch(IPIFY_API_URL)
        .then(response => response.json())
        .then(data => data.ip);
}

const interestingHeaderNames = [
    'Accept-Language',
    'Authorization',
    'Cookie',
    'Origin',
    'Referer',
    'User-Agent',
    'Via',
    'X-Amz-Cf-Id',
    'X-Amzn-Trace-Id',
    'X-Forwarded-For',
];

function fetchInterestingHeadersFromReplay() {
    let replay = fetch(window.location.href, { method: 'HEAD' });
    return replay.then(response => {
        let headers = {};
        interestingHeaderNames.forEach(header => {
            headers[header] = response.headers.get(header);
        });
        return headers;
    });
}

////////////////////////

const Targets = {
    appContainer: () => document.getElementById('app'),
    currentDateTimeUTC: () => document.getElementById('current-date-time-utc'),
    currentDateTimeCST: () => document.getElementById('current-date-time-cst'),
    currentDateTimeBRT: () => document.getElementById('current-date-time-brt'),
    ipAddress: () => document.getElementById('ip-address'),
    interestingHeaders: () => document.getElementById('interesting-headers'),
};

////////////////////////

document.addEventListener('DOMContentLoaded', main);

function main() {
    start();
    loop();
}

function start() {
    let initialView = buildInitialView();
    Targets.appContainer().innerHTML = initialView;

    fetchUserIp().then(userIpAddress => {
        Targets.ipAddress().textContent = userIpAddress;
    });

    fetchInterestingHeadersFromReplay().then(headers => {
        Targets.interestingHeaders().innerHTML = JSON.stringify(headers, null, 2);
    });
}

function loop() {
    refreshTimeDisplays();
    setTimeout(loop, 1000);
}

function refreshTimeDisplays() {
    let currentDateTimeUTC = new Date().toLocaleString(MESSAGE_LOCALE, { timeZone: 'UTC' });
    Targets.currentDateTimeUTC().textContent = currentDateTimeUTC;

    let currentDateTimeCST = new Date().toLocaleString(MESSAGE_LOCALE, { timeZone: 'America/Chicago' });
    Targets.currentDateTimeCST().textContent = currentDateTimeCST;

    let currentDateTimeBRT = new Date().toLocaleString(MESSAGE_LOCALE, { timeZone: 'America/Sao_Paulo' });
    Targets.currentDateTimeBRT().textContent = currentDateTimeBRT;
}

function buildInitialView() {
    return `
        <h1>Office MSoft Time</h1>
        <hr>
        <p>${MESSAGES.timeInUTC} <b id="current-date-time-utc"></b></p>
        <p>${MESSAGES.timeInCST} <b id="current-date-time-cst"></b></p>
        <p>${MESSAGES.timeInBRT} <b id="current-date-time-brt"></b></p>
        <p>${MESSAGES.ipAddress} <b id="ip-address">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></p>
        <p>${MESSAGES.userAgent} <b>${navigator.userAgent}</b></p>
        <p>${MESSAGES.locale} <b>${MESSAGE_LOCALE}</b></p>
        <p>${MESSAGES.timeZone} <b>${USER_TIMEZONE}</b></p>
        <hr>
        <p><small><span id="interesting-headers"><br><br><br><br></span></p>
        <hr>
        <p><small>${MESSAGES.services}</small></p>
        <p><small><a href="${window.location.href}">${window.location.href}</a></small></p>
    `;
}