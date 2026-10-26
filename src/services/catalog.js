// Starter catalogue a seller can import into their own store in one click.
// These are written to the seller's Firestore products collection, then edited or deleted freely.
const img = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=85`;

export const CATEGORIES = ['Clothing', 'Footwear', 'Accessories', 'Electronics', 'Beauty', 'Home & Living'];

export const starterCatalogue = [
  // Clothing
  { name: 'Soft Knit Set', category: 'Clothing', price: 28000, stock: 8, image: img('1551232864-3f0890e580d9'), featured: true, description: 'An easy-to-style knit set for relaxed days. Breathable, stretchy and gentle on skin.' },
  { name: 'Weekend Linen Shirt', category: 'Clothing', price: 18500, stock: 11, image: img('1598033129183-c4f50c736f10'), description: 'A lightweight linen shirt that keeps you cool from morning to evening.' },
  { name: 'Essential Cotton Tee', category: 'Clothing', price: 7500, stock: 40, image: img('1521572163474-6864f9cf17ab'), description: 'Heavyweight 100% cotton tee with a clean fit that goes with everything.' },
  { name: 'Graphic Street Tee', category: 'Clothing', price: 9500, stock: 26, image: img('1618354691373-d851c5c3a990'), description: 'Relaxed-cut tee with a soft hand-feel and a bold everyday look.' },
  { name: 'Heritage Denim Jeans', category: 'Clothing', price: 24000, stock: 15, image: img('1542272604-787c3835535d'), description: 'Straight-leg jeans in durable stretch denim that gets better with every wear.' },
  { name: 'Cloud Fleece Hoodie', category: 'Clothing', price: 21000, stock: 18, image: img('1556821840-3a63f95609a7'), featured: true, description: 'A brushed-fleece hoodie that feels like a hug. Roomy hood, kangaroo pocket.' },
  { name: 'Merino Crew Sweater', category: 'Clothing', price: 26500, stock: 9, image: img('1620799140408-edc6dcb6d633'), description: 'Fine-gauge crew neck sweater, warm without the bulk.' },
  { name: 'Stone Leather Jacket', category: 'Clothing', price: 78000, stock: 5, image: img('1551028719-00167b16eac5'), description: 'A timeless leather jacket with a soft lining and a sharp silhouette.' },
  { name: 'Utility Field Jacket', category: 'Clothing', price: 39000, stock: 7, image: img('1591047139829-d91aecb6caea'), description: 'Water-resistant field jacket with four pockets and an adjustable waist.' },
  // Footwear
  { name: 'Classic Sneakers', category: 'Footwear', price: 32000, stock: 6, image: img('1542291026-7eec264c27ff'), featured: true, description: 'A clean, versatile sneaker for everyday wear with a cushioned insole.' },
  { name: 'Court White Trainers', category: 'Footwear', price: 29500, stock: 14, image: img('1595950653106-6c9ebd614d3a'), description: 'Minimal white trainers in smooth leather. Easy to dress up or down.' },
  { name: 'Street Runner', category: 'Footwear', price: 35000, stock: 12, image: img('1491553895911-0055eca6402d'), description: 'Lightweight runner with a responsive sole built for long city days.' },
  { name: 'Everyday Lace-Ups', category: 'Footwear', price: 27000, stock: 10, image: img('1549298916-b41d501d3772'), description: 'Comfortable lace-ups with a flexible outsole and breathable lining.' },
  { name: 'Block Heel Sandals', category: 'Footwear', price: 22500, stock: 9, image: img('1543163521-1bf539c55dd2'), description: 'Elegant block heels that stay comfortable from the office to the evening.' },
  // Accessories
  { name: 'Everyday Tote', category: 'Accessories', price: 12500, stock: 14, image: img('1590874103328-eac38a683ce7'), description: 'A roomy canvas tote for work, errands and weekends.' },
  { name: 'Daily Carry Pouch', category: 'Accessories', price: 8500, stock: 22, image: img('1606760227091-3dd870d97f1d'), description: 'Keep your small essentials together wherever you go.' },
  { name: 'Minimal Wristwatch', category: 'Accessories', price: 24000, stock: 4, image: img('1524805444758-089113d48a6d'), featured: true, description: 'A slim stainless-steel watch with a clean dial and a leather strap.' },
  { name: 'Voyager Backpack', category: 'Accessories', price: 31000, stock: 13, image: img('1553062407-98eeb64c6a62'), description: 'Padded 18L backpack with a laptop sleeve and weather-resistant fabric.' },
  { name: 'Structured Handbag', category: 'Accessories', price: 42000, stock: 6, image: img('1584917865442-de89df76afd3'), description: 'A polished structured handbag with a detachable shoulder strap.' },
  { name: 'Crossbody City Bag', category: 'Accessories', price: 19500, stock: 17, image: img('1548036328-c9fa89d128fa'), description: 'Compact crossbody with secure zip closure and an adjustable strap.' },
  { name: 'Aviator Sunglasses', category: 'Accessories', price: 14500, stock: 20, image: img('1572635196237-14b3f281503f'), description: 'UV400 polarised lenses in a lightweight frame.' },
  // Electronics
  { name: 'Studio Wireless Headphones', category: 'Electronics', price: 58000, stock: 10, image: img('1505740420928-5e560c06d30e'), featured: true, description: 'Over-ear Bluetooth headphones with deep bass and 30-hour battery life.' },
  { name: 'Pulse Smartwatch', category: 'Electronics', price: 46000, stock: 12, image: img('1546868871-7041f2a55e12'), description: 'Heart-rate, sleep and step tracking with a bright always-on display.' },
  { name: 'Aura Over-Ear Headset', category: 'Electronics', price: 36000, stock: 16, image: img('1583394838336-acd977736f90'), description: 'Comfortable headset with a clear built-in microphone for calls and music.' },
  { name: 'Slimbook 14 Laptop', category: 'Electronics', price: 520000, stock: 3, image: img('1496181133206-80ce9b88a853'), description: '14-inch ultraportable with a fast SSD, 16GB memory and all-day battery.' },
  { name: 'Lumen X Smartphone', category: 'Electronics', price: 245000, stock: 7, image: img('1511707171634-5f897ff02aa9'), description: '6.5-inch OLED display, 128GB storage and a sharp dual-camera system.' },
  { name: 'Frame Mirrorless Camera', category: 'Electronics', price: 395000, stock: 2, image: img('1526170375885-4d8ecf77b99f'), description: 'Compact mirrorless camera for crisp photos and 4K video.' },
  // Beauty
  { name: 'Glow Serum 30ml', category: 'Beauty', price: 11500, stock: 30, image: img('1556228453-efd6c1ff04f6'), featured: true, description: 'Brightening vitamin-C serum that evens tone and adds natural glow.' },
  { name: 'Daily Hydration Cream', category: 'Beauty', price: 9800, stock: 28, image: img('1612817288484-6f916006741a'), description: 'Lightweight moisturiser with hyaluronic acid for all-day softness.' },
  { name: 'Skin Ritual Duo', category: 'Beauty', price: 16500, stock: 18, image: img('1571781926291-c477ebfd024b'), description: 'Cleanser and toner pair for a simple, effective morning and night routine.' },
  { name: 'Studio Makeup Palette', category: 'Beauty', price: 13500, stock: 21, image: img('1596462502278-27bfdc403348'), description: 'Twelve blendable, richly pigmented shades from neutral to bold.' },
  { name: 'Ember Eau de Parfum', category: 'Beauty', price: 34000, stock: 11, image: img('1585386959984-a4155224a1ad'), description: 'A warm amber and vanilla fragrance with long-lasting wear.' },
  { name: 'Botanical Soap Trio', category: 'Beauty', price: 6500, stock: 35, image: img('1608248543803-ba4f8c70ae0b'), description: 'Three cold-process soaps with shea butter and natural oils.' },
  // Home & Living
  { name: 'Haven Lounge Chair', category: 'Home & Living', price: 98000, stock: 4, image: img('1586023492125-27b2c045efd7'), description: 'A deep-seated accent chair with solid wood legs and soft upholstery.' },
  { name: 'Linen Sofa, Three-Seater', category: 'Home & Living', price: 340000, stock: 2, image: img('1555041469-a586c61ea9bc'), description: 'A generous three-seater with removable linen covers and firm cushions.' },
  { name: 'Oak Dining Chair', category: 'Home & Living', price: 45000, stock: 12, image: img('1493663284031-b7e3aefcae8e'), description: 'Solid oak dining chair with a curved back. Sold individually.' },
  { name: 'Stoneware Mug Set', category: 'Home & Living', price: 8800, stock: 25, image: img('1514228742587-6b1558fcca3d'), description: 'Set of two hand-glazed stoneware mugs. Dishwasher safe.' },
  { name: 'Steel Insulated Bottle', category: 'Home & Living', price: 7200, stock: 45, image: img('1602143407151-7111542de6e8'), description: 'Keeps drinks cold for 24 hours or hot for 12. Leak-proof lid.' },
  { name: 'The Reader’s Bundle', category: 'Home & Living', price: 15500, stock: 19, image: img('1544947950-fa07a98d237f'), description: 'A curated bundle of three bestselling paperbacks for slow evenings.' },
];

// Automatic product photos: sellers never add images. A photo is chosen from the product's name,
// falling back to its category. Only verified image ids are used.
const KEYWORD_IMAGES = [
  [/hood|fleece/, ['1556821840-3a63f95609a7']], [/sweater|knit|jumper|cardigan/, ['1620799140408-edc6dcb6d633', '1551232864-3f0890e580d9']],
  [/leather jacket|jacket|coat|blazer/, ['1551028719-00167b16eac5', '1591047139829-d91aecb6caea']], [/jean|denim|trouser|pant/, ['1542272604-787c3835535d']],
  [/tee|t-shirt|tshirt|shirt|top|polo|blouse/, ['1521572163474-6864f9cf17ab', '1618354691373-d851c5c3a990', '1598033129183-c4f50c736f10']],
  [/sandal|heel|slide|slipper/, ['1543163521-1bf539c55dd2']], [/sneaker|trainer|runner|shoe|boot|loafer|lace/, ['1542291026-7eec264c27ff', '1595950653106-6c9ebd614d3a', '1491553895911-0055eca6402d', '1549298916-b41d501d3772']],
  [/backpack|rucksack/, ['1553062407-98eeb64c6a62']], [/handbag|purse|clutch|crossbody/, ['1584917865442-de89df76afd3', '1548036328-c9fa89d128fa']], [/tote|bag|pouch|wallet/, ['1590874103328-eac38a683ce7', '1606760227091-3dd870d97f1d']],
  [/watch|wristwatch/, ['1524805444758-089113d48a6d', '1523275335684-37898b6baf30']], [/sunglass|glasses|shades/, ['1572635196237-14b3f281503f']],
  [/smartwatch|fitness band/, ['1546868871-7041f2a55e12']], [/headphone|headset|earphone|earbud|speaker/, ['1505740420928-5e560c06d30e', '1583394838336-acd977736f90']],
  [/laptop|computer|notebook pc/, ['1496181133206-80ce9b88a853']], [/phone|iphone|android|smartphone/, ['1511707171634-5f897ff02aa9']], [/camera|lens/, ['1526170375885-4d8ecf77b99f']],
  [/perfume|fragrance|cologne|parfum|scent/, ['1585386959984-a4155224a1ad', '1541643600914-78b084683601', '1594035910387-fea47794261f']], [/makeup|lipstick|palette|foundation|mascara|cosmetic/, ['1596462502278-27bfdc403348', '1522335789203-aabd1fc54bc9']],
  [/serum|cream|lotion|moistur|cleanser|toner|skin|face/, ['1556228453-efd6c1ff04f6', '1612817288484-6f916006741a', '1571781926291-c477ebfd024b']], [/soap|bath|body wash/, ['1608248543803-ba4f8c70ae0b', '1608571423902-eed4a5ad8108']],
  [/sofa|couch/, ['1555041469-a586c61ea9bc']], [/chair|stool|seat/, ['1586023492125-27b2c045efd7', '1493663284031-b7e3aefcae8e']], [/mug|cup|plate|bowl|ceramic|stoneware/, ['1514228742587-6b1558fcca3d', '1517256064527-09c73fc73e38']],
  [/bottle|flask|tumbler/, ['1602143407151-7111542de6e8']], [/book|novel|paperback/, ['1544947950-fa07a98d237f']],
];
const CATEGORY_IMAGES = {
  clothing: ['1521572163474-6864f9cf17ab', '1556821840-3a63f95609a7', '1542272604-787c3835535d'], footwear: ['1542291026-7eec264c27ff', '1595950653106-6c9ebd614d3a'],
  accessories: ['1524805444758-089113d48a6d', '1590874103328-eac38a683ce7', '1572635196237-14b3f281503f'], electronics: ['1505740420928-5e560c06d30e', '1496181133206-80ce9b88a853', '1511707171634-5f897ff02aa9'],
  beauty: ['1556228453-efd6c1ff04f6', '1596462502278-27bfdc403348', '1585386959984-a4155224a1ad'], 'home & living': ['1586023492125-27b2c045efd7', '1514228742587-6b1558fcca3d', '1555041469-a586c61ea9bc'],
};
const GENERIC = ['1523381210434-271e8be1f52b', '1590874103328-eac38a683ce7', '1524805444758-089113d48a6d'];
const hash = text => [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
export function pickImage(name = '', category = '') {
  const text = String(name).toLowerCase();
  const hit = KEYWORD_IMAGES.find(([re]) => re.test(text));
  const pool = hit ? hit[1] : CATEGORY_IMAGES[String(category).toLowerCase()] || GENERIC;
  return img(pool[hash(text) % pool.length]);
}

export const naira = amount =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(amount) || 0);

export const slugify = value =>
  String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
