CREATE DATABASE IF NOT EXISTS `ajax_lesson` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `ajax_lesson`;

CREATE TABLE IF NOT EXISTS `todolist` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` LONGTEXT not null,
    `description` LONGTEXT not null,
    PRIMARY KEY (`id`)
);
