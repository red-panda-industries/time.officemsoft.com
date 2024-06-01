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
        timeInChicago: 'The time in Chicago is:',
        timeInSaoPaulo: 'The time in São Paulo is:',
        ipAddress: 'Your IP address is:',
        locale: 'Your locale is:',
        timeZone: 'Your time zone is:',
        httpBinHeaders: `HTTP headers from <a href="${HTTPBIN_HEADERS_URL}">${HTTPBIN_HEADERS_URL}</a>:`,
        services: 'Global time services provided by <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a> <small>(not affiliated with Microsoft)</small>.',
        viewing: 'You are viewing:',
    },
    pt: {
        title: 'Hora Office MSoft',
        timeInUTC: 'O horário em UTC é:',
        timeInChicago: 'O horário em Chicago é:',
        timeInSaoPaulo: 'O horário em São Paulo é:',
        ipAddress: 'Seu endereço IP é:',
        locale: 'Sua localidade é:',
        timeZone: 'Seu fuso horário é:',
        httpBinHeaders: `Cabeçalhos HTTP de <a href="${HTTPBIN_HEADERS_URL}">${HTTPBIN_HEADERS_URL}</a>:`,
        services: 'Serviços de horário global fornecidos por <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a> <small>(não afiliado à Microsoft)</small>.',
        viewing: 'Você está visualizando:',
    },
    es: {
        title: 'Hora Office MSoft',
        timeInUTC: 'La hora en UTC es:',
        timeInChicago: 'La hora en Chicago es:',
        timeInSaoPaulo: 'La hora en São Paulo es:',
        ipAddress: 'Tu dirección IP es:',
        locale: 'Tu localidad es:',
        timeZone: 'Tu zona horaria es:',
        httpBinHeaders: `Encabezados HTTP de <a href="${HTTPBIN_HEADERS_URL}">${HTTPBIN_HEADERS_URL}</a>:`,
        services: 'Servicios de hora global proporcionados por <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a> <small>(no afiliado con Microsoft)</small>.',
        viewing: 'Estás viendo:',
    },
    fr: {
        title: 'Heure Office MSoft',
        timeInUTC: 'L\'heure en UTC est :',
        timeInChicago: 'L\'heure à Chicago est :',
        timeInSaoPaulo: 'L\'heure à São Paulo est :',
        ipAddress: 'Votre adresse IP est :',
        locale: 'Votre localité est :',
        timeZone: 'Votre fuseau horaire est :',
        httpBinHeaders: `En-têtes HTTP de <a href="${HTTPBIN_HEADERS_URL}">${HTTPBIN_HEADERS_URL}</a> :`,
        services: 'Services de temps global fournis par <a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a> <small>(non affilié à Microsoft).',
        viewing: 'Vous consultez :',
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
    appContainer:               () => $('#app'),
    currentDateTimeUTC:         () => $('#current-date-time-utc'),
    currentDateTimeChicago:     () => $('#current-date-time-chicago'),
    currentDateTimeSaoPaulo:    () => $('#current-date-time-sao-paulo'),
    ipAddress:                  () => $('#ip-address'),
    httpBinHeaders:             () => $('#httpbin-headers'),
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

    let currentDateTimeChicago = new Date().toLocaleString(MESSAGE_LOCALE, { timeZone: 'America/Chicago' });
    Targets.currentDateTimeChicago().textContent = currentDateTimeChicago;

    let currentDateTimeSaoPaulo = new Date().toLocaleString(MESSAGE_LOCALE, { timeZone: 'America/Sao_Paulo' });
    Targets.currentDateTimeSaoPaulo().textContent = currentDateTimeSaoPaulo;
}

function buildInitialView() {
    return `
        <h1>${MESSAGES.title}</h1>
        <hr>
        <p>${MESSAGES.timeInUTC} <b><time id="current-date-time-utc"></time></b></p>
        <p>${MESSAGES.timeInChicago} <b><time id="current-date-time-chicago"></time></b></p>
        <p>${MESSAGES.timeInSaoPaulo} <b><time id="current-date-time-sao-paulo"></time></b></p>
        <hr>
        <p>${MESSAGES.ipAddress} <b id="ip-address">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></p>
        <p>${MESSAGES.locale} <b>${MESSAGE_LOCALE}</b></p>
        <p>${MESSAGES.timeZone} <b>${USER_TIMEZONE}</b></p>
        <hr>
        <p><small>${MESSAGES.httpBinHeaders}</small></p>
        <p><small><code id="httpbin-headers"><br><br><br><br><br><br><br><br><br></code></small></p>
        <hr>
        <p><small>${MESSAGES.services}</small></p>
        <p><small>${MESSAGES.viewing} <a href="${window.location.href}">${window.location.href}</a></small></p>
    `;
}
