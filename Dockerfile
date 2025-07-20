FROM trafex/php-nginx
COPY src/ /var/www/html
COPY default.conf /etc/nginx/conf.d/default.conf
