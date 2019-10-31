CREATE DATABASE paperspace;
use paperspace;

CREATE TABLE addresses (
	address_id INT auto_increment NOT NULL,
    name VARCHAR(50),
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    PRIMARY KEY (address_id)
)