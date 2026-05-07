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
    name,
    description,
    round((10 + random() * 490)::numeric, 2),
    floor(random() * 200)::int,
    category
FROM (VALUES
    ('Wireless Earbuds',      'Premium wireless earbuds with active noise cancellation',         'Electronics'),
    ('Smartphone Stand',      'Adjustable smartphone stand for desks and nightstands',           'Electronics'),
    ('USB-C Hub',             '7-in-1 USB-C hub with HDMI, ethernet, and SD card reader',        'Electronics'),
    ('Mechanical Keyboard',   'RGB mechanical keyboard with hot-swappable switches',             'Electronics'),
    ('4K Webcam',             '4K webcam with autofocus and built-in dual microphones',          'Electronics'),
    ('Bluetooth Speaker',     'Portable bluetooth speaker with 24-hour battery life',            'Electronics'),
    ('Smart Watch',           'Fitness-tracking smart watch with heart rate and GPS',            'Electronics'),
    ('Laptop Sleeve',         'Padded laptop sleeve fits up to 16-inch notebooks',               'Electronics'),
    ('Power Bank',            '20000mAh power bank with fast charging USB-C output',             'Electronics'),
    ('HDMI Cable',            '6-foot 4K HDMI cable with gold-plated connectors',                'Electronics'),

    ('Mystery Novel',         'Gripping mystery novel from a bestselling crime author',          'Books'),
    ('Cookbook',              'Illustrated cookbook with 200 weeknight dinner recipes',          'Books'),
    ('Sci-Fi Anthology',      'Sci-fi anthology featuring twelve award-winning short stories',   'Books'),
    ('Travel Guide',          'Travel guide covering hidden gems across Southeast Asia',         'Books'),
    ('History of Rome',       'A vivid history of Rome from the Republic to the late Empire',    'Books'),
    ('Self-Help Journal',     'Guided self-help journal with daily prompts and exercises',       'Books'),
    ('Picture Book',          'Children''s picture book about a curious little fox',             'Books'),
    ('Poetry Collection',     'Modern poetry collection exploring identity and memory',          'Books'),
    ('Programming Manual',    'Hands-on programming manual for systems engineers',               'Books'),
    ('Biography',             'Biography of a 20th-century inventor and his pivotal patents',    'Books'),

    ('Cotton T-Shirt',        'Soft cotton t-shirt available in eight colors',                   'Clothing'),
    ('Denim Jeans',           'Slim-fit denim jeans with stretch comfort',                       'Clothing'),
    ('Wool Sweater',          'Merino wool sweater for cool autumn days',                        'Clothing'),
    ('Running Shoes',         'Lightweight running shoes with responsive cushioning',            'Clothing'),
    ('Winter Jacket',         'Insulated winter jacket rated for sub-zero temperatures',         'Clothing'),
    ('Baseball Cap',          'Adjustable baseball cap with embroidered logo',                   'Clothing'),
    ('Leather Belt',          'Full-grain leather belt with brushed steel buckle',               'Clothing'),
    ('Athletic Socks',        'Six-pack of cushioned athletic socks',                            'Clothing'),
    ('Casual Hoodie',         'Heavyweight casual hoodie with kangaroo pocket',                  'Clothing'),
    ('Summer Dress',          'Breezy summer dress in floral print',                             'Clothing'),

    ('Throw Pillow',          'Decorative throw pillow with hypoallergenic filling',             'Home'),
    ('Coffee Maker',          '12-cup programmable coffee maker with thermal carafe',            'Home'),
    ('Bath Towel Set',        'Plush bath towel set, four-piece, fast-drying cotton',            'Home'),
    ('Scented Candle',        'Hand-poured scented candle with lavender and vanilla',            'Home'),
    ('Wall Clock',            'Silent wall clock with minimalist Scandinavian design',           'Home'),
    ('Knife Set',             'Stainless steel kitchen knife set with wooden block',             'Home'),
    ('Plant Pot',             'Ceramic indoor plant pot with drainage tray',                     'Home'),
    ('Floor Lamp',            'Arc floor lamp with adjustable warm-white LED',                   'Home'),
    ('Bedding Set',           'Queen-size bedding set with duvet cover and pillow shams',        'Home'),
    ('Cutting Board',         'End-grain wooden cutting board, 18 inches wide',                  'Home'),

    ('Building Blocks',       'Classic wooden building blocks, 100-piece set',                   'Toys'),
    ('Teddy Bear',            'Plush teddy bear with embroidered eyes and soft fur',             'Toys'),
    ('Toy Car',               'Die-cast toy car with rubber wheels and pull-back motor',         'Toys'),
    ('Jigsaw Puzzle',         '1000-piece jigsaw puzzle of a coastal village at sunset',         'Toys'),
    ('Action Figure',         'Articulated action figure with accessories and display stand',    'Toys'),
    ('Board Game',            'Family-friendly board game for two to six players',               'Toys'),
    ('Yo-Yo',                 'Aluminum yo-yo with concave bearing for advanced tricks',         'Toys'),
    ('Coloring Book',         'Coloring book with 60 intricate mandala designs',                 'Toys'),
    ('Remote Drone',          'Beginner-friendly remote drone with HD camera',                   'Toys'),
    ('Stuffed Dinosaur',      'Oversized stuffed dinosaur, soft and machine washable',           'Toys')
) AS seed(name, description, category);
