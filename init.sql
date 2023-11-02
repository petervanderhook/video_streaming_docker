CREATE DATABASE IF NOT EXISTS video_streaming;
USE video_streaming;
CREATE TABLE IF NOT EXISTS video_library (video_id INT NOT NULL AUTO_INCREMENT, video_title VARCHAR(255) NOT NULL, video_path VARCHAR(255) NOT NULL, PRIMARY KEY (video_id));
CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, user VARCHAR(50) NOT NULL, pass VARCHAR(72) NOT NULL, PRIMARY KEY (id));
CREATE USER IF NOT EXISTS 'express'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON video_streaming.video_library TO 'express'@'%';
GRANT ALL PRIVILEGES ON video_streaming.users TO 'express'@'%';
FLUSH PRIVILEGES;