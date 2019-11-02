use paperspace;
CREATE TABLE addresses (
  address_id INT auto_increment NOT NULL,
  name VARCHAR(50),
  street VARCHAR(100),
  city VARCHAR(50),
  state VARCHAR(50),
  country VARCHAR(50),
  PRIMARY KEY (address_id)
);
INSERT INTO addresses(name, street, city, state, country)
VALUES(
    'Linkin park',
    'Metora drive',
    'New york',
    'New York',
    'United states of america'
  ),(
    'Kurt lobain',
    'Heart shape box',
    'New york',
    'New York',
    'United states of america'
  ),(
    'nav',
    'Ontario drive',
    'ontario',
    'Ontario',
    'canada'
  ),(
    'Drake',
    'Ontario drive',
    'ontario',
    'Ontario',
    'canada'
  ),(
    'Rob pike',
    'Pineapple stree',
    'New york',
    'New York',
    'United states of america'
  );