'use strict';

const IPIFY_API_URL = 'https://api.ipify.org?format=json';

function fetchUserIp() {
    return fetch(IPIFY_API_URL)
        .then(response => response.json())
        .then(data => data.ip);
}

const HTTPBIN_HEADERS_URL = 'https://httpbin.org/headers';

function fetchRequestHeadersFromHttpBin() {
    return fetch(HTTPBIN_HEADERS_URL)
        .then(response => response.json())
        .then(data => data.headers);
}

////////////////////////

const LOCALE_MESSAGES = {
    en: {
        title: 'Office MSoft Time',
        timeInUTC: 'The time in UTC is:',
        timeInCST: 'The time in CST is:',
        timeInBRT: 'The time in BRT is:',
        ipAddress: 'Your IP address is:',
        locale: 'Your locale is:',
        timeZone: 'Your time zone is:',
        httpBinHeaders: `HTTP headers from <a href="${HTTPBIN_HEADERS_URL}">${HTTPBIN_HEADERS_URL}</a>:`,
        services: 'Global time services provided by <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>.',
    },
    pt: {
        title: 'Hora Office MSoft',
        timeInUTC: 'O horário em UTC é:',
        timeInCST: 'O horário em CST é:',
        timeInBRT: 'O horário em BRT é:',
        ipAddress: 'Seu endereço IP é:',
        locale: 'Sua localidade é:',
        timeZone: 'Seu fuso horário é:',
        httpBinHeaders: `Cabeçalhos HTTP de <a href="${HTTPBIN_HEADERS_URL}">${HTTPBIN_HEADERS_URL}</a>:`,
        services: 'Serviços de horário global fornecidos pelo <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>.',
    },
    es: {
        title: 'Hora Office MSoft',
        timeInUTC: 'La hora en UTC es:',
        timeInCST: 'La hora en CST es:',
        timeInBRT: 'La hora en BRT es:',
        ipAddress: 'Tu dirección IP es:',
        locale: 'Tu localidad es:',
        timeZone: 'Tu zona horaria es:',
        httpBinHeaders: `Encabezados HTTP de <a href="${HTTPBIN_HEADERS_URL}">${HTTPBIN_HEADERS_URL}</a>:`,
        services: 'Servicios de hora global proporcionados por <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>.',
    },
    fr: {
        title: 'Heure Office MSoft',
        timeInUTC: 'L\'heure en UTC est :',
        timeInCST: 'L\'heure en CST est :',
        timeInBRT: 'L\'heure en BRT est :',
        ipAddress: 'Votre adresse IP est :',
        locale: 'Votre localité est :',
        timeZone: 'Votre fuseau horaire est :',
        httpBinHeaders: `En-têtes HTTP de <a href="${HTTPBIN_HEADERS_URL}">${HTTPBIN_HEADERS_URL}</a> :`,
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

function $(selector) {
    return document.querySelector(selector);
}

const Targets = {
    appContainer:       () => $('#app'),
    currentDateTimeUTC: () => $('#current-date-time-utc'),
    currentDateTimeCST: () => $('#current-date-time-cst'),
    currentDateTimeBRT: () => $('#current-date-time-brt'),
    ipAddress:          () => $('#ip-address'),
    httpBinHeaders:     () => $('#httpbin-headers'),
};

////////////////////////

document.addEventListener('DOMContentLoaded', main);

function main() {
    start();
    loop();
}

function start() {
    document.title = MESSAGES.title;

    let initialView = buildInitialView();
    Targets.appContainer().innerHTML = initialView;

    fetchUserIp().then(userIpAddress => {
        Targets.ipAddress().textContent = userIpAddress;
    })
    .catch(error => {
        Targets.ipAddress().textContent = `Error fetching IP: ${error}`;
    });

    fetchRequestHeadersFromHttpBin().then(httpHeaders => {
        Targets.httpBinHeaders().textContent = JSON.stringify(httpHeaders, null, 2);
    })
    .catch(error => {
        Targets.httpBinHeaders().textContent = `Error fetching headers: ${error}`
    });
}

const refreshRateInMilliseconds = 1000;

function loop() {
    updateClockDisplays();
    setTimeout(loop, refreshRateInMilliseconds);
}

function updateClockDisplays() {
    let currentDateTimeUTC = new Date().toLocaleString(MESSAGE_LOCALE, { timeZone: 'UTC' });
    Targets.currentDateTimeUTC().textContent = currentDateTimeUTC;

    let currentDateTimeCST = new Date().toLocaleString(MESSAGE_LOCALE, { timeZone: 'America/Chicago' });
    Targets.currentDateTimeCST().textContent = currentDateTimeCST;

    let currentDateTimeBRT = new Date().toLocaleString(MESSAGE_LOCALE, { timeZone: 'America/Sao_Paulo' });
    Targets.currentDateTimeBRT().textContent = currentDateTimeBRT;
}

function buildInitialView() {
    return `
        <h1>${MESSAGES.title}</h1>
        <hr>
        <p>${MESSAGES.timeInUTC} <b><time id="current-date-time-utc"></time></b></p>
        <p>${MESSAGES.timeInCST} <b><time id="current-date-time-cst"></time></b></p>
        <p>${MESSAGES.timeInBRT} <b><time id="current-date-time-brt"></time></b></p>
        <hr>
        <p>${MESSAGES.ipAddress} <b id="ip-address">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></p>
        <p>${MESSAGES.locale} <b>${MESSAGE_LOCALE}</b></p>
        <p>${MESSAGES.timeZone} <b>${USER_TIMEZONE}</b></p>
        <p><small>${MESSAGES.httpBinHeaders}</small></p>
        <p><small><b id="httpbin-headers"><br><br><br><br><br><br><br><br><br></b></small></p>
        <hr>
        <p><small>${MESSAGES.services}</small></p>
        <p><small><a href="${window.location.href}">${window.location.href}</a></small></p>
    `;
}