<?php
// index.php

// 1. Determine locale from Accept-Language
$acceptLang = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';
$locale    = 'en';
if (preg_match('/^([a-z]{2})/i', $acceptLang, $m) && in_array(strtolower($m[1]), ['en','pt','es','fr'])) {
    $locale = strtolower($m[1]);
}

// 2. Define link snippets
$officeLink  = '<a href="https://www.officemsoft.com/">Office&nbsp;MSoft</a>';

// 3. Your i18n messages
$LOCALE_MESSAGES = [
    'en' => [
        'title'             => 'Office MSoft Time',
        'timeInUTC'         => 'The time in UTC is:',
        'timeInChicago'     => 'The time in Chicago is:',
        'timeInSaoPaulo'    => 'The time in São Paulo is:',
        'ipAddress'         => 'Your public IP address is:',
        'locale'            => 'Your locale is:',
        'timeZone'          => 'Your time zone is:',
        'httpHeaders'       => 'HTTP headers:',
        'services'          => "Global time services provided by $officeLink <small>(not affiliated with Microsoft)</small>.",
        'viewing'           => 'You are viewing:',
        'errorFetchingIp'   => 'Error fetching IP address:',
        'errorFetchingHeaders' => 'Error fetching headers:',
    ],
    'pt' => [
        'title'             => 'Hora Office MSoft',
        'timeInUTC'         => 'O horário em UTC é:',
        'timeInChicago'     => 'O horário em Chicago é:',
        'timeInSaoPaulo'    => 'O horário em São Paulo é:',
        'ipAddress'         => 'Seu endereço IP público é:',
        'locale'            => 'Sua localidade é:',
        'timeZone'          => 'Seu fuso horário é:',
        'httpHeaders'       => 'Cabeçalhos HTTP:',
        'services'          => "Serviços de horário global fornecidos por $officeLink <small>(não afiliado à Microsoft)</small>.",
        'viewing'           => 'Você está visualizando:',
        'errorFetchingIp'   => 'Não foi possível obter o endereço IP:',
        'errorFetchingHeaders' => 'Não foi possível obter os cabeçalhos:',
    ],
    'es' => [
        'title'             => 'Hora Office MSoft',
        'timeInUTC'         => 'La hora en UTC es:',
        'timeInChicago'     => 'La hora en Chicago es:',
        'timeInSaoPaulo'    => 'La hora en São Paulo es:',
        'ipAddress'         => 'Tu dirección IP pública es:',
        'locale'            => 'Tu localidad es:',
        'timeZone'          => 'Tu zona horaria es:',
        'httpHeaders'       => 'Encabezados HTTP:',
        'services'          => "Servicios de hora global proporcionados por $officeLink <small>(no afiliado con Microsoft)</small>.",
        'viewing'           => 'Estás viendo:',
        'errorFetchingIp'   => 'No se pudo obtener la dirección IP:',
        'errorFetchingHeaders' => 'No se pudieron obtener los encabezados:',
    ],
    'fr' => [
        'title'             => 'Heure Office MSoft',
        'timeInUTC'         => 'L’heure en UTC est :',
        'timeInChicago'     => 'L’heure à Chicago est :',
        'timeInSaoPaulo'    => 'L’heure à São Paulo est :',
        'ipAddress'         => 'Votre adresse IP publique est :',
        'locale'            => 'Votre localité est :',
        'timeZone'          => 'Votre fuseau horaire est :',
        'httpHeaders'       => 'En‑têtes HTTP :',
        'services'          => "Services de temps global fournis par $officeLink <small>(non affilié à Microsoft)</small>.",
        'viewing'           => 'Vous consultez :',
        'errorFetchingIp'   => 'Impossible de récupérer l’adresse IP :',
        'errorFetchingHeaders' => 'Impossible de récupérer les en‑têtes :',
    ],
];

$msg = $LOCALE_MESSAGES[$locale];

// 4. Build DateTime objects
$dtUTC       = new DateTime('now', new DateTimeZone('UTC'));
$dtChicago   = new DateTime('now', new DateTimeZone('America/Chicago'));
$dtSaoPaulo = new DateTime('now', new DateTimeZone('America/Sao_Paulo'));

// 5. Find client IP (supports X-Forwarded-For)
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $userIp = trim($parts[0]);
} else {
    $userIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

// 6. getallheaders fallback for non‑Apache
if (!function_exists('getallheaders')) {
    function getallheaders(): array {
        $h = [];
        foreach ($_SERVER as $k => $v) {
            if (strpos($k, 'HTTP_') === 0) {
                $name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($k, 5)))));
                $h[$name] = $v;
            }
        }
        return $h;
    }
}
$headers = getallheaders();

// 7. Current URL for “viewing”
$scheme     = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$currentUrl = $scheme.'://'.($_SERVER['HTTP_HOST'] ?? '').($_SERVER['REQUEST_URI'] ?? '');

?><!DOCTYPE html>
<html lang="<?= htmlspecialchars($locale) ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title><?= htmlspecialchars($msg['title']) ?></title>
    <link rel="stylesheet" href="style.css">
    <style>
        @font-face {
    font-family: 'VT323';
    src: url('VT323-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

body {
    background: #081324;
    color: #11db2c;
    font-family: 'VT323', monospace;
    font-variant-ligatures: none;
    font-size: 24px;
    line-height: 24px;
    text-align: center;
    max-width: 36em;
    margin: auto;
    padding: 0.5em 0.25em 1em 0.25em;
}

h1 {
    font-weight: normal;
    color: #469dee;
    font-size: 1.75em;
    line-height: 2rem;
    margin: 0.5em 0;
}

p {
    margin: 0.5rem 0;
    word-break: keep-all;
}

a:link, a:visited {
    color: #65f360;
    text-decoration-thickness: 0.125em;
    text-underline-offset: 0.25em;
    text-decoration-color: #11430b;
}

small {
    font-size: 20px;
}

small small {
    font-size: 16px;
}

b {
    font-weight: normal;
    color: #daeeea;
}

time {
    font-size: 2.25rem;
    line-height: 1.5rem;
}

hr {
    margin: 1em 0;
    border: 0;
    border-top: 0.125em solid #19446d;
}

code {
    font-family: 'VT323', monospace;
    color: #97a6a3;
}

sup {
    line-height: 0;
}
</style>
</head>
<body>
<main id="app">
    <h1><?= htmlspecialchars($msg['title']) ?></h1>
    <hr>

    <p><?= htmlspecialchars($msg['timeInUTC']) ?>
       <b><?= htmlspecialchars($dtUTC->format('Y-m-d H:i:s')) ?></b>
    </p>
    <p><?= htmlspecialchars($msg['timeInChicago']) ?>
       <b><?= htmlspecialchars($dtChicago->format('Y-m-d H:i:s')) ?></b>
    </p>
    <p><?= htmlspecialchars($msg['timeInSaoPaulo']) ?>
       <b><?= htmlspecialchars($dtSaoPaulo->format('Y-m-d H:i:s')) ?></b>
    </p>

    <hr>
    <p><?= htmlspecialchars($msg['ipAddress']) ?>
       <b><?= htmlspecialchars($userIp) ?></b><sup>*</sup>
    </p>
    <p><?= htmlspecialchars($msg['locale']) ?>
       <b><?= htmlspecialchars($locale) ?></b>
    </p>
    <p><?= htmlspecialchars($msg['timeZone']) ?>
       <b id="user-timezone">—</b>
    </p>

    <hr>
    <p><?= htmlspecialchars($msg['httpHeaders']) ?><sup>*</sup></p>
    <pre><code><?= htmlspecialchars(json_encode($headers, JSON_PRETTY_PRINT)) ?></code></pre>

    <hr>
    <p><small><?= $msg['services'] ?></small></p>
    <p><small>
        <?= htmlspecialchars($msg['viewing']) ?>
        <a href="<?= htmlspecialchars($currentUrl) ?>"><?= htmlspecialchars($currentUrl) ?></a>
    </small></p>
</main>

<script>
// fill in client time zone unobtrusively
document.addEventListener('DOMContentLoaded', function() {
    try {
        var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.getElementById('user-timezone').textContent = tz;
    } catch(e) {
        // leave it as “—” if detection fails
    }
});
</script>
</body>
</html>
