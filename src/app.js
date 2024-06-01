'use strict';

const IPIFY_API_URL = 'https://api.ipify.org?format=json';

function fetchUserIpFromIpify() {
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

const IPIFY_LINK = '<a href="https://www.ipify.org/">ipify.org</a>';
const HTTPBIN_LINK = '<a href="https://httpbin.org/">httpbin.org</a>';
const OFFICE_MSOFT_LINK = '<a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>';

const LOCALE_MESSAGES = {
    en: {
        title: 'Office MSoft Time',
        timeInUTC: 'The time in UTC is:',
        timeInChicago: 'The time in Chicago is:',
        timeInSaoPaulo: 'The time in São Paulo is:',
        ipAddress: 'Your public IP address is:',
        locale: 'Your locale is:',
        timeZone: 'Your time zone is:',
        httpBinHeaders: `HTTP headers from ${HTTPBIN_LINK}:`,
        services: `Global time services provided by ${OFFICE_MSOFT_LINK} <small>(not affiliated with Microsoft)</small>.`,
        viewing: 'You are viewing:',
        ipAddressObtained: `IP address obtained from ${IPIFY_LINK}.`,
        errorFetchingIp: 'Error fetching IP address:',
        errorFetchingHeaders: 'Error fetching headers:',
    },
    pt: {
        title: 'Hora Office MSoft',
        timeInUTC: 'O horário em UTC é:',
        timeInChicago: 'O horário em Chicago é:',
        timeInSaoPaulo: 'O horário em São Paulo é:',
        ipAddress: 'Seu endereço IP público é:',
        locale: 'Sua localidade é:',
        timeZone: 'Seu fuso horário é:',
        httpBinHeaders: `Cabeçalhos HTTP de ${HTTPBIN_LINK}:`,
        services: `Serviços de horário global fornecidos por ${OFFICE_MSOFT_LINK} <small>(não afiliado à Microsoft)</small>.`,
        viewing: 'Você está visualizando:',
        ipAddressObtained: `Endereço IP obtido de ${IPIFY_LINK}.`,
        errorFetchingIp: 'Não foi possível obter o endereço IP:',
        errorFetchingHeaders: 'Não foi possível obter os cabeçalhos:',        
    },
    es: {
        title: 'Hora Office MSoft',
        timeInUTC: 'La hora en UTC es:',
        timeInChicago: 'La hora en Chicago es:',
        timeInSaoPaulo: 'La hora en São Paulo es:',
        ipAddress: 'Tu dirección IP pública es:',
        locale: 'Tu localidad es:',
        timeZone: 'Tu zona horaria es:',
        httpBinHeaders: `Encabezados HTTP de ${HTTPBIN_LINK}:`,
        services: `Servicios de hora global proporcionados por ${OFFICE_MSOFT_LINK} <small>(no afiliado con Microsoft)</small>.`,
        viewing: 'Estás viendo:',
        ipAddressObtained: `Dirección IP obtenida de ${IPIFY_LINK}.`,
        errorFetchingIp: 'No se pudo obtener la dirección IP:',
        errorFetchingHeaders: 'No se pudieron obtener los encabezados:',
    },
    fr: {
        title: 'Heure Office MSoft',
        timeInUTC: 'L\'heure en UTC est :',
        timeInChicago: 'L\'heure à Chicago est :',
        timeInSaoPaulo: 'L\'heure à São Paulo est :',
        ipAddress: 'Votre adresse IP publique est :',
        locale: 'Votre localité est :',
        timeZone: 'Votre fuseau horaire est :',
        httpBinHeaders: `En-têtes HTTP de ${HTTPBIN_LINK} :`,
        services: `Services de temps global fournis par ${OFFICE_MSOFT_LINK} <small>(non affilié à Microsoft).`,
        viewing: 'Vous consultez :',
        ipAddressObtained: `Adresse IP obtenue de ${IPIFY_LINK}.`,
        errorFetchingIp: 'Impossible de récupérer l’adresse IP :',
        errorFetchingHeaders: 'Impossible de récupérer les en-têtes :',
    },
};
const DEFAULT_MESSAGE_LOCALE = 'en';

const MESSAGE_LOCALE = (navigator.language && navigator.language.split('-')[0]) || DEFAULT_MESSAGE_LOCALE;
const MESSAGES = LOCALE_MESSAGES[MESSAGE_LOCALE] || LOCALE_MESSAGES[DEFAULT_MESSAGE_LOCALE];

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

    fetchUserIpFromIpify().then(userIpAddress => {
        Targets.ipAddress().textContent = userIpAddress;
    })
    .catch(error => {
        Targets.ipAddress().textContent = `${MESSAGES.errorFetchingIp} ${error}`;
    });

    fetchRequestHeadersFromHttpBin().then(httpHeaders => {
        Targets.httpBinHeaders().textContent = JSON.stringify(httpHeaders, null, 2);
    })
    .catch(error => {
        Targets.httpBinHeaders().textContent = `${MESSAGES.errorFetchingHeaders} ${error}`
    });
}

const refreshRateInMilliseconds = 1000;

function loop() {
    updateClockTargets();
    setTimeout(loop, refreshRateInMilliseconds);
}

function updateClockTargets() {
    let currentDateTimeUTC = new Date().toLocaleString(undefined, { timeZone: 'UTC' });
    Targets.currentDateTimeUTC().textContent = currentDateTimeUTC;

    let currentDateTimeChicago = new Date().toLocaleString(undefined, { timeZone: 'America/Chicago' });
    Targets.currentDateTimeChicago().textContent = currentDateTimeChicago;

    let currentDateTimeSaoPaulo = new Date().toLocaleString(undefined, { timeZone: 'America/Sao_Paulo' });
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
        <p>${MESSAGES.ipAddress} <b id="ip-address">XX.XXX.XXX.XX</b><sup>*</sup></p>
        <p>${MESSAGES.locale} <b>${MESSAGE_LOCALE}</b></p>
        <p>${MESSAGES.timeZone} <b>${USER_TIMEZONE}</b></p>
        <hr>
        <p><small>${MESSAGES.httpBinHeaders}</small></p>
        <p><small><code id="httpbin-headers"><br><br><br><br><br><br></code></small></p>
        <hr>
        <p><small>${MESSAGES.services}</small></p>
        <p><sup><b>*</b></sup><small>${MESSAGES.ipAddressObtained}</small></p>
        <p><small>${MESSAGES.viewing} <a href="${window.location.href}">${window.location.href}</a></small></p>
    `;
}
