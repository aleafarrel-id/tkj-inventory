FROM php:8.2-fpm-alpine

RUN apk update && apk add --no-cache \
    mysql-client \
    curl-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    # Adding Cron and Timezone Data
    dcron \
    tzdata \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_mysql gd curl mbstring zip \
    && rm -rf /tmp/* /var/cache/apk/*

# Set Time
RUN echo "Asia/Jakarta" > /etc/timezone \
    && cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime \
    && rm -rf /var/cache/apk/*

# Hidden Error Message On Production
RUN echo "display_errors = Off" >> /usr/local/etc/php/conf.d/docker-vars.ini \
    && echo "error_reporting = E_ALL & ~E_DEPRECATED" >> /usr/local/etc/php/conf.d/docker-vars.ini

WORKDIR /var/www/html/tkj-inventory

# Copy Project & Database Setup
COPY . /var/www/html/tkj-inventory
COPY ./tkj_inventory.sql /var/www/html/tkj-inventory/tkj_inventory.sql

# Setup Cron Jobs
RUN mkdir -p /var/spool/cron/crontabs
RUN echo "* * * * * /usr/bin/php /var/www/html/tkj-inventory/cron/scheduler.php > /dev/null 2>&1" > /var/spool/cron/crontabs/www-data
RUN chmod 0600 /var/spool/cron/crontabs/www-data
RUN chown www-data:www-data /var/spool/cron/crontabs/www-data

# Entrypoint
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]