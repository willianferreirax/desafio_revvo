FROM php:8.4-apache

RUN docker-php-ext-install pdo_mysql

RUN a2enmod rewrite
