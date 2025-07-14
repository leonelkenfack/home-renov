# Use an official PHP image with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies needed for Composer and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Install required PHP extensions
RUN docker-php-ext-install zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Add a custom php.ini to display errors
RUN echo "display_errors = On" > /usr/local/etc/php/conf.d/docker-php-display-errors.ini

# Copy application source code
COPY . /var/www/html/

# Install Composer dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Set permissions for Apache
RUN chown -R www-data:www-data /var/www/html/

# The container will listen on port 80
EXPOSE 80 