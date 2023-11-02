CREATE DATABASE IF NOT EXISTS video_streaming;
USE video_streaming;
CREATE TABLE IF NOT EXISTS video_library (video_id INT NOT NULL AUTO_INCREMENT, video_title VARCHAR(255) NOT NULL, video_path VARCHAR(255) NOT NULL, PRIMARY KEY (video_id));
CREATE USER IF NOT EXISTS 'express'@'%' IDENTIFIED BY 'password';
CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, user VARCHAR(50) NOT NULL, pass VARCHAR(50) NOT NULL, PRIMARY KEY (video_id));
INSERT INTO users (user, pass, token) VALUES ("peter", "piper");
INSERT INTO users (user, pass, token) VALUES ("chris", "cross");
INSERT INTO users (user, pass, token) VALUES ("tristan", "two");
GRANT ALL PRIVILEGES ON video_streaming.* TO 'express'@'%';