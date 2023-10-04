CREATE DATABASE video_streaming;
USE video_streaming;
CREATE TABLE video_library (video_id INT NOT NULL AUTO_INCREMENT, video_title VARCHAR(255) NOT NULL, video_path VARCHAR(255) NOT NULL, PRIMARY KEY (video_id));

