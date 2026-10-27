// What a store can sell. Each category has its own reviewed photo library (see imageLibrary.js),
// so a store only ever shows pictures of the kinds of product its seller chose.
import { photo } from './imageLibrary.js';

export const CATEGORY_INFO = [
  { id: 'Gadgets', hint: 'Phones, laptops, audio, cameras' },
  { id: 'Clothing', hint: 'Tops, dresses, jeans, jackets' },
  { id: 'Footwear', hint: 'Sneakers, boots, heels, loafers' },
  { id: 'Bags & Accessories', hint: 'Bags, watches, jewelry, sunglasses' },
  { id: 'Beauty', hint: 'Skincare, makeup, fragrance' },
  { id: 'Home & Living', hint: 'Furniture, lighting, decor, kitchen' },
];
export const CATEGORIES = CATEGORY_INFO.map(c => c.id);

// p(category, photoGroup, photoIndex, name, price, stock, description, featured)
const p = (category, group, index, name, price, stock, description, featured = false) =>
  ({ name, category, price, stock, description, featured, image: photo(category, group, index) });

// Starter products for a store. Every photo is a picture of the product it is named after.
export const starterCatalogue = [
  // Gadgets
  p('Gadgets', 'laptop', 0, 'Slimbook Pro 14 Laptop', 520000, 3, '14-inch ultraportable with a fast SSD, 16GB memory and all-day battery.', true),
  p('Gadgets', 'laptop', 3, 'UltraBook 13 Laptop', 480000, 5, 'Lightweight 13-inch laptop with a sharp display for work and study.'),
  p('Gadgets', 'phone', 0, 'Lumen X Smartphone', 245000, 7, '6.5-inch OLED display, 128GB storage and a sharp dual-camera system.', true),
  p('Gadgets', 'phone', 4, 'Nova 5G Smartphone', 210000, 9, 'Fast 5G, a bright display and a battery that lasts the full day.'),
  p('Gadgets', 'tablet', 0, 'Tab S 10-inch Tablet', 190000, 6, 'Large crisp screen for streaming, reading and note-taking.'),
  p('Gadgets', 'headphones', 1, 'Studio Wireless Headphones', 58000, 10, 'Over-ear Bluetooth headphones with deep bass and 30-hour battery life.', true),
  p('Gadgets', 'headphones', 2, 'Quiet Pro Noise-Cancelling Headphones', 72000, 8, 'Active noise cancelling for flights, commutes and focus time.'),
  p('Gadgets', 'earbuds', 0, 'AirBuds Wireless Earbuds', 38000, 16, 'True wireless earbuds with a pocket charging case.'),
  p('Gadgets', 'smartwatch', 0, 'Pulse Smartwatch', 46000, 12, 'Heart-rate, sleep and step tracking with a bright always-on display.'),
  p('Gadgets', 'camera', 0, 'Frame Mirrorless Camera', 395000, 2, 'Compact mirrorless camera for crisp photos and 4K video.'),
  p('Gadgets', 'speaker', 0, 'Boom Portable Bluetooth Speaker', 42000, 14, 'Water-resistant speaker with big sound and 12 hours of playtime.'),
  p('Gadgets', 'peripherals', 0, 'Slim Wireless Keyboard', 15000, 22, 'Quiet low-profile keys with a long-lasting rechargeable battery.'),
  p('Gadgets', 'peripherals', 1, 'Precision Wireless Mouse', 9500, 30, 'Comfortable ergonomic mouse with smooth tracking.'),
  // Clothing
  p('Clothing', 'tee', 4, 'Essential White Tee', 7500, 40, 'Heavyweight 100% cotton tee with a clean fit that goes with everything.', true),
  p('Clothing', 'tee', 1, 'Classic Black Tee', 7500, 36, 'Soft, breathable cotton tee in a relaxed everyday cut.'),
  p('Clothing', 'tee', 0, 'Colour Block Tee Pack', 21000, 18, 'A pack of four premium tees in versatile colours.'),
  p('Clothing', 'shirt', 0, 'Oxford Dress Shirt', 18500, 14, 'Crisp cotton shirt for the office and smart occasions.'),
  p('Clothing', 'shirt', 2, 'Denim Button Shirt', 16500, 11, 'A soft denim shirt that layers well in any season.'),
  p('Clothing', 'dress', 0, 'Flame Red Maxi Dress', 34000, 8, 'A flowing maxi dress made to turn heads at any event.', true),
  p('Clothing', 'dress', 1, 'Floral Wrap Dress', 28500, 10, 'Light floral dress with an easy wrap fit.'),
  p('Clothing', 'jeans', 2, 'Skinny Blue Jeans', 24000, 15, 'Stretch denim skinny jeans that hold their shape.'),
  p('Clothing', 'jeans', 1, 'Distressed Denim Jeans', 26000, 12, 'Straight-leg jeans with a worn-in, street-ready finish.'),
  p('Clothing', 'hoodie', 0, 'Cloud Fleece Hoodie', 21000, 18, 'A brushed-fleece hoodie that feels like a hug.'),
  p('Clothing', 'jacket', 0, 'Stone Leather Jacket', 78000, 5, 'A timeless leather jacket with a soft lining and a sharp silhouette.', true),
  p('Clothing', 'jacket', 1, 'Rust Bomber Jacket', 39000, 7, 'Lightweight zip bomber for cool evenings.'),
  p('Clothing', 'suit', 0, 'Navy Two-Piece Suit', 95000, 4, 'A sharply tailored two-piece suit for work and weddings.'),
  p('Clothing', 'sweater', 1, 'Cream Knit Poncho', 23000, 9, 'A cosy hand-feel knit poncho with a fringed hem.'),
  // Footwear
  p('Footwear', 'sneakers', 3, 'Court White Sneakers', 29500, 14, 'Minimal white sneakers that go with everything.', true),
  p('Footwear', 'sneakers', 2, 'Volt Training Shoes', 35000, 12, 'Lightweight trainers with a responsive sole for the gym.'),
  p('Footwear', 'sneakers', 4, 'City Runner Sneakers', 33000, 10, 'Cushioned runners built for long city days.'),
  p('Footwear', 'sneakers', 5, 'Heritage Orange Sneakers', 38000, 6, 'A bold retro sneaker with a chunky air-cushioned sole.', true),
  p('Footwear', 'sneakers', 7, 'Street Skate Shoes', 27000, 13, 'Durable low-top skate shoes with a grippy sole.'),
  p('Footwear', 'sneakers', 8, 'Flyknit Olive Trainers', 36000, 9, 'Breathable knit trainers with a snug, sock-like fit.'),
  p('Footwear', 'sneakers', 12, 'Pastel Court Sneakers', 31000, 11, 'Soft pastel sneakers for a fresh everyday look.'),
  p('Footwear', 'sneakers', 14, 'Carob Leather Sneakers', 34000, 8, 'Premium leather sneakers in a warm earthy tone.'),
  p('Footwear', 'boots', 0, 'Trail Leather Boots', 52000, 7, 'Hard-wearing leather boots with a sturdy sole.'),
  p('Footwear', 'formal', 0, 'Moss Suede Loafers', 28000, 9, 'Soft suede loafers that dress up any outfit.'),
  p('Footwear', 'heels', 0, 'Floral Stiletto Heels', 22500, 9, 'Statement stilettos in a vivid floral print.'),
  // Bags & Accessories
  p('Bags & Accessories', 'backpack', 0, 'Voyager Backpack', 31000, 13, 'Padded 18L backpack with a laptop sleeve and weather-resistant fabric.', true),
  p('Bags & Accessories', 'backpack', 2, 'Urban Commuter Backpack', 26000, 15, 'A sleek everyday backpack with plenty of organised pockets.'),
  p('Bags & Accessories', 'handbag', 0, 'Blush Chain Bag', 24000, 10, 'A compact blush shoulder bag with a gold chain strap.'),
  p('Bags & Accessories', 'handbag', 2, 'Ruby Structured Handbag', 42000, 6, 'A polished structured handbag in a bold red.', true),
  p('Bags & Accessories', 'handbag', 3, 'Quilted Crossbody Bag', 46000, 5, 'Quilted black crossbody with a chain strap and secure zip.'),
  p('Bags & Accessories', 'handbag', 4, 'Woven Basket Handbag', 29000, 8, 'A handwoven basket bag with a leather top handle.'),
  p('Bags & Accessories', 'wallet', 0, 'Leather Bifold Wallet', 12500, 25, 'Slim full-grain leather wallet with card slots.'),
  p('Bags & Accessories', 'sunglasses', 0, 'Round Gold Sunglasses', 14500, 20, 'UV400 round lenses in a lightweight gold frame.'),
  p('Bags & Accessories', 'sunglasses', 2, 'Classic Wayfarer Sunglasses', 16500, 18, 'The timeless black frame, with polarised lenses.'),
  p('Bags & Accessories', 'watch', 0, 'Heritage Chronograph Watch', 54000, 4, 'A classic chronograph with a leather strap.', true),
  p('Bags & Accessories', 'watch', 1, 'Automatic Skeleton Watch', 72000, 3, 'A self-winding watch with a visible movement.'),
  p('Bags & Accessories', 'jewelry', 1, 'Sapphire Drop Earrings', 19500, 12, 'Statement drop earrings with sapphire-blue stones.'),
  p('Bags & Accessories', 'jewelry', 0, 'Gold Pendant Necklace', 15500, 16, 'A delicate layered necklace with a pendant.'),
  p('Bags & Accessories', 'jewelry', 3, 'Halo Crystal Ring', 21000, 9, 'A sparkling halo ring set with brilliant crystals.'),
  // Beauty
  p('Beauty', 'skincare', 9, 'Glow Dropper Serum 30ml', 11500, 30, 'Brightening serum that evens tone and adds a natural glow.', true),
  p('Beauty', 'skincare', 0, 'Gentle Gel Cleanser', 8500, 34, 'A soft gel cleanser that removes make-up without drying skin.'),
  p('Beauty', 'skincare', 1, 'Silk Body Lotion 200ml', 9800, 28, 'Lightweight body lotion with all-day moisture.'),
  p('Beauty', 'skincare', 2, 'Clarifying Face Cream', 10500, 24, 'Oil-free cream that calms and clears blemish-prone skin.'),
  p('Beauty', 'skincare', 3, 'Glow Skincare Set', 28000, 15, 'A complete routine: cleanser, cream and a facial roller.'),
  p('Beauty', 'skincare', 8, 'Restorative Hair Mask', 12500, 20, 'Deep-conditioning mask for dry, damaged hair.'),
  p('Beauty', 'makeup', 0, 'Gloss Lip & Nail Duo', 9500, 26, 'A matching high-shine lip colour and nail polish.'),
  p('Beauty', 'makeup', 2, 'Bronzer & Highlighter Palette', 13500, 21, 'Blendable shades to sculpt and glow.', true),
  p('Beauty', 'makeup', 3, 'Rose Makeup Brush Kit', 14500, 17, 'Soft-bristle brushes for a flawless blend.'),
  p('Beauty', 'perfume', 0, 'Midnight Blue Eau de Parfum', 34000, 11, 'A fresh aromatic fragrance with a long-lasting finish.', true),
  p('Beauty', 'perfume', 2, 'Amber Rose Parfum', 38000, 9, 'A warm, feminine fragrance of amber and rose.'),
  p('Beauty', 'perfume', 3, 'Noir Eau de Parfum', 41000, 8, 'A deep, elegant scent for evenings out.'),
  // Home & Living
  p('Home & Living', 'sofa', 3, 'Emerald Velvet Sofa', 340000, 2, 'A generous three-seater in rich velvet with solid wood legs.', true),
  p('Home & Living', 'sofa', 1, 'Sky Blue Three-Seater Sofa', 295000, 3, 'A bright button-tufted sofa with removable cushions.'),
  p('Home & Living', 'sofa', 2, 'Tan Modular Sofa', 310000, 2, 'A soft, deep sofa in a warm leather-look finish.'),
  p('Home & Living', 'chair', 0, 'Tufted Accent Chair', 98000, 4, 'A tufted accent chair with turned legs for a touch of elegance.'),
  p('Home & Living', 'chair', 3, 'Mustard Reading Chair', 88000, 5, 'A comfy reading chair with slim wooden legs.', true),
  p('Home & Living', 'chair', 1, 'Oak Bar Stool', 45000, 12, 'A solid wood stool for counters and workbenches.'),
  p('Home & Living', 'lamp', 1, 'Arc Floor Lamp', 52000, 7, 'A sweeping arc lamp that lights up a reading corner.'),
  p('Home & Living', 'lamp', 0, 'Industrial Pendant Light', 24000, 14, 'A matte metal pendant for kitchens and dining spaces.'),
  p('Home & Living', 'storage', 1, 'Walnut Sideboard', 165000, 3, 'Mid-century sideboard with plenty of room for storage.'),
  p('Home & Living', 'storage', 0, 'Wall Storage Cabinet', 58000, 6, 'A slim wall cabinet with open shelves.'),
  p('Home & Living', 'bedroom', 0, 'Linen Bed Set', 62000, 9, 'Soft, breathable linen bedding in a calm neutral.'),
  p('Home & Living', 'decor', 2, 'Ceramic Vase Set', 17500, 20, 'A set of three matte ceramic vases for dried stems.'),
  p('Home & Living', 'drinkware', 0, 'Stoneware Mug', 4500, 40, 'A hand-glazed stoneware mug. Dishwasher safe.'),
  p('Home & Living', 'drinkware', 1, 'Latte Cup & Saucer', 6800, 25, 'A wide ceramic cup and saucer for your morning coffee.'),
  p('Home & Living', 'bottle', 0, 'Steel Insulated Bottle', 7200, 45, 'Keeps drinks cold for 24 hours or hot for 12.'),
];

export const startersFor = categories => starterCatalogue.filter(item => !categories?.length || categories.includes(item.category));

export const naira = amount =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(amount) || 0);

export const slugify = value =>
  String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
