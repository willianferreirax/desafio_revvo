CREATE database IF NOT EXISTS revvo_db DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

use revvo_db;

CREATE TABLE IF NOT EXISTS courses (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  description text NOT NULL,
  img_url varchar(255) NOT NULL,
  slide_img_url varchar(255) NULL,
  slide_link varchar(255) NOT NULL,
  should_show_on_slider tinyint(1) NOT NULL DEFAULT '0',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;