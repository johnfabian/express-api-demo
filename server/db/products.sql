CREATE TABLE products (
  id          SERIAL  PRIMARY KEY,
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  stock       INTEGER NOT NULL,
  category    TEXT    NOT NULL
);

INSERT INTO products (name, description, price, stock, category)
SELECT
    'Product ' || i,
    'High-quality item number ' || i,
    round((10 + random() * 490)::numeric, 2),
    floor(random() * 200)::int,
    (ARRAY['Electronics', 'Books', 'Clothing', 'Home', 'Toys'])[1 + floor(random() * 5)::int]
FROM generate_series(1, 50) AS i;
