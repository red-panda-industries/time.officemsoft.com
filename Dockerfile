FROM trafex/php-nginx

# Copy the configuration files
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY config/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copy the website
COPY html/ /var/www/html/

# Test the configuration
RUN nginx -t
