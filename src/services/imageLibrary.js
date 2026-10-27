// Photo library used for automatic product images and starter products.
// Every photo was checked by eye: each group below only holds pictures of that kind of product.
// Generated from reviewed contact sheets; to add photos, append ids to a group.
const url = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=85`;

export const LIBRARY = {
  "Gadgets": {
    laptop: { keywords: /\b(?:laptop|notebook|macbook|computer|pc)/, photos: ['1517336714731-489689fd1ca8', '1498050108023-c5249f4df085', '1531297484001-80022131f5a1', '1588872657578-7efd1f1555ed', '1603302576837-37561b2e2302', '1496181133206-80ce9b88a853', '1593642632559-0c6d3fc62b89', '1491933382434-500287f9b54b'] },
    phone: { keywords: /\b(?:phone|iphone|android|smartphone|mobile|case)/, photos: ['1592899677977-9c10ca588bbd', '1598327105666-5b89351aff97', '1601784551446-20c9e07cdbdb', '1585060544812-6b45742d762f', '1580910051074-3eb694886505', '1565849904461-04a58ad377e0', '1605236453806-6ff36851218e', '1523206489230-c012c64b2b48', '1511707171634-5f897ff02aa9', '1544866092-1935c5ef2a8f', '1609091839311-d5365f9ff1c5'] },
    tablet: { keywords: /\b(?:tablet|ipad)/, photos: ['1527698266440-12104e498b76', '1544244015-0df4b3ffc6b0', '1561154464-82e9adf32764'] },
    earbuds: { keywords: /\b(?:earbud|airpod|earphone|buds)/, photos: ['1572569511254-d8f925fe2cbb', '1590658268037-6bf12165a8df', '1606220588913-b3aacb4d2f46', '1578319439584-104c94d37305'] },
    headphones: { keywords: /\b(?:headphone|headset|earmuff)/, photos: ['1550009158-9ebf69173e03', '1484704849700-f032a568e944', '1618366712010-f4ae9c647dcb', '1612444530582-fc66183b16f7', '1546435770-a3e426bf472b', '1585298723682-7115561c51b7', '1505740420928-5e560c06d30e'] },
    speaker: { keywords: /\b(?:speaker|soundbar|boombox|bluetooth)/, photos: ['1608043152269-423dbba4e7e1', '1545454675-3531b543be5d', '1558089687-f282ffcbc126'] },
    smartwatch: { keywords: /\b(?:watch|fitness|tracker|band)/, photos: ['1579586337278-3befd40fd17a', '1508685096489-7aacd43bd3b1', '1546868871-7041f2a55e12'] },
    camera: { keywords: /\b(?:camera|lens|dslr|mirrorless|polaroid)/, photos: ['1516035069371-29a1b244cc32', '1502920917128-1aa500764cbd', '1510127034890-ba27508e9f1c', '1519183071298-a2962feb14f4', '1526170375885-4d8ecf77b99f'] },
    peripherals: { keywords: /\b(?:keyboard|mouse|monitor|charger|cable|power ?bank)/, photos: ['1587829741301-dc798b83add3', '1527864550417-7fd91fc51a46', '1615663245857-ac93bb7c39e7', '1625948515291-69613efd103f', '1547394765-185e1e68f34e'] },
    gaming: { keywords: /\b(?:game|gaming|console|controller|playstation|xbox)/, photos: ['1600861194942-f883de0dfe96', '1593305841991-05c297ba4575'] },
  },
  "Clothing": {
    dress: { keywords: /\b(?:dress|gown|maxi|skirt)/, photos: ['1595777457583-95e059d581b8', '1572804013309-59a88b7e92f1', '1496747611176-843222e1e57c', '1515372039744-b8f02a3ae446'] },
    suit: { keywords: /\b(?:suit|blazer|tuxedo)/, photos: ['1507679799987-c73779587ccf', '1594938298603-c8148c4dae35'] },
    jeans: { keywords: /\b(?:jean|denim|trouser|pant|chino)/, photos: ['1604176354204-9268737828e4', '1582552938357-32b906df40cb', '1584370848010-d7fe6bc767ec', '1542272604-787c3835535d', '1525507119028-ed4c629a60a3'] },
    hoodie: { keywords: /\b(?:hood|sweatshirt|fleece|pullover)/, photos: ['1556821840-3a63f95609a7', '1620799140408-edc6dcb6d633'] },
    sweater: { keywords: /\b(?:sweater|knit|jumper|cardigan|poncho)/, photos: ['1578587018452-892bacefd3f2', '1434389677669-e08b4cac3105'] },
    jacket: { keywords: /\b(?:jacket|coat|bomber|windbreaker|leather)/, photos: ['1551028719-00167b16eac5', '1591047139829-d91aecb6caea', '1483985988355-763728e1935b', '1551232864-3f0890e580d9'] },
    tee: { keywords: /\b(?:t-shirt|tshirt|tee|top|vest|singlet)/, photos: ['1562157873-818bc0726f68', '1583743814966-8936f5b7be1a', '1523381210434-271e8be1f52b', '1489987707025-afc232f7ea0f', '1521572163474-6864f9cf17ab', '1618354691373-d851c5c3a990', '1503342217505-b0a15ec3261c'] },
    shirt: { keywords: /\b(?:shirt|blouse|polo|button)/, photos: ['1620012253295-c15cc3e65df4', '1602810318383-e386cc2a3ccf', '1596755094514-f87e34085b2c', '1621072156002-e2fccdc0b176', '1598033129183-c4f50c736f10'] },
    beanie: { keywords: /\b(?:beanie|hat|cap|scarf)/, photos: ['1576871337632-b9aef4c17ab9'] },
    rack: { keywords: /\b(?:collection|bundle|pack)/, photos: ['1445205170230-053b83016050', '1441984904996-e0b6ba687e04', '1490481651871-ab68de25d43d', '1542060748-10c28b62716f'] },
  },
  "Footwear": {
    heels: { keywords: /\b(?:heel|stiletto|pump|sandal|wedge)/, photos: ['1543163521-1bf539c55dd2'] },
    boots: { keywords: /\b(?:boot)/, photos: ['1520639888713-7851133b1ed0'] },
    formal: { keywords: /\b(?:loafer|oxford|brogue|formal|dress shoe|derby)/, photos: ['1560343090-f0409e92791a'] },
    sneakers: { keywords: /\b(?:sneaker|trainer|runner|running|shoe|skate|canvas|kick)/, photos: ['1560769629-975ec94e6a86', '1600185365483-26d7a4cc7519', '1606107557195-0e29a4b5b4aa', '1608231387042-66d1773070a5', '1595341888016-a392ef81b7de', '1514989940723-e8e51635b782', '1460353581641-37baddab0fa2', '1525966222134-fcfa99b8ae77', '1582588678413-dbf45f4823e9', '1542280756-74b2f55e73ab', '1603808033192-082d6919d3e1', '1542291026-7eec264c27ff', '1595950653106-6c9ebd614d3a', '1491553895911-0055eca6402d', '1549298916-b41d501d3772'] },
  },
  "Bags & Accessories": {
    backpack: { keywords: /\b(?:backpack|rucksack|school bag|laptop bag)/, photos: ['1491637639811-60e2756cc1c7', '1547949003-9792a18a2601', '1553062407-98eeb64c6a62'] },
    handbag: { keywords: /\b(?:handbag|purse|clutch|crossbody|tote|bag|satchel)/, photos: ['1566150905458-1bf1fc113f0d', '1594223274512-ad4803739b7c', '1584917865442-de89df76afd3', '1548036328-c9fa89d128fa', '1590874103328-eac38a683ce7'] },
    wallet: { keywords: /\b(?:wallet|cardholder|card holder)/, photos: ['1627123424574-724758594e93'] },
    sunglasses: { keywords: /\b(?:sunglass|glasses|shades|eyewear)/, photos: ['1511499767150-a48a237f0083', '1577803645773-f96470509666', '1572635196237-14b3f281503f'] },
    watch: { keywords: /\b(?:watch|chronograph|timepiece)/, photos: ['1509941943102-10c232535736', '1524805444758-089113d48a6d', '1523275335684-37898b6baf30'] },
    jewelry: { keywords: /\b(?:jewel|earring|necklace|bracelet|ring|pendant|chain|anklet|hoop)/, photos: ['1599643478518-a784e5dc4c8f', '1535632066927-ab7c9ab60908', '1573408301185-9146fe634ad0', '1605100804763-247f67b3557e', '1611591437281-460bfbe1220a', '1617038260897-41a1f14a8ca0', '1606760227091-3dd870d97f1d'] },
  },
  "Beauty": {
    perfume: { keywords: /\b(?:perfume|parfum|fragrance|cologne|scent|eau|spray)/, photos: ['1523293182086-7651a899d37f', '1587017539504-67cfbddac569', '1541643600914-78b084683601', '1594035910387-fea47794261f', '1585386959984-a4155224a1ad'] },
    makeup: { keywords: /\b(?:makeup|lipstick|lip|palette|foundation|mascara|brush|blush|powder|gloss|nail)/, photos: ['1586495777744-4413f21062fa', '1522338242992-e1a54906a8da', '1522335789203-aabd1fc54bc9', '1596462502278-27bfdc403348'] },
    skincare: { keywords: /\b(?:serum|cream|lotion|moistur|cleanser|toner|skin|face|oil|soap|hair|mask|body|shampoo|conditioner)/, photos: ['1556228720-195a672e8a03', '1620916566398-39f1143ab7be', '1608248597279-f99d160bfcbc', '1598440947619-2c35fc9aa908', '1631730486572-226d1f595b68', '1590439471364-192aa70c0b53', '1612817288484-6f916006741a', '1571781926291-c477ebfd024b', '1608248543803-ba4f8c70ae0b', '1608571423902-eed4a5ad8108'] },
  },
  "Home & Living": {
    sofa: { keywords: /\b(?:sofa|couch|loveseat|settee)/, photos: ['1513694203232-719a280e022f', '1484101403633-562f891dc89a', '1578500494198-246f612d3b3d', '1555041469-a586c61ea9bc', '1493663284031-b7e3aefcae8e'] },
    chair: { keywords: /\b(?:chair|stool|armchair|seat|bench)/, photos: ['1567538096630-e0c55bd6374c', '1503602642458-232111445657', '1618220179428-22790b461013', '1586023492125-27b2c045efd7'] },
    lamp: { keywords: /\b(?:lamp|light|lighting|chandelier|bulb)/, photos: ['1513506003901-1e6a229e2d15', '1524758631624-e2822e304c36'] },
    storage: { keywords: /\b(?:cabinet|shelf|shelves|storage|wardrobe|sideboard|drawer|table|desk)/, photos: ['1595428774223-ef52624120d2', '1585128792020-803d29415281'] },
    bedroom: { keywords: /\b(?:bed|mattress|duvet|pillow|bedding|linen)/, photos: ['1540518614846-7eded433c457'] },
    kitchen: { keywords: /\b(?:kitchen|pot|pan|cookware|cutlery)/, photos: ['1556911220-bff31c812dba', '1507089947368-19c1da9775ae'] },
    decor: { keywords: /\b(?:decor|vase|frame|candle|ornament|rug|plant)/, photos: ['1583847268964-b28dc8f51f92', '1616486338812-3dadae4b4ace', '1565193566173-7a0ee3dbe261'] },
    drinkware: { keywords: /\b(?:mug|cup|saucer|coffee|tea|glass)/, photos: ['1514228742587-6b1558fcca3d', '1517256064527-09c73fc73e38'] },
    bottle: { keywords: /\b(?:bottle|flask|tumbler)/, photos: ['1602143407151-7111542de6e8'] },
    books: { keywords: /\b(?:book|novel|paperback|notebook|journal)/, photos: ['1544947950-fa07a98d237f', '1589998059171-988d887df646'] },
  },
};

export const photo = (category, group, index = 0) => {
  const list = LIBRARY[category]?.[group]?.photos || [];
  return url(list[index % list.length]);
};

const hash = text => [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const pickFrom = (list, seed) => list[hash(seed) % list.length];

// Picks a photo for a product. It only ever uses the categories the store sells, so a gadget store
// never gets a clothing photo. Order: keyword match in the product's own category, keyword match in
// the store's other categories, then any photo from the product's category, then any allowed photo.
export function pickImage(name = '', category = '', allowed = []) {
  const text = String(name).toLowerCase();
  const pool = allowed.filter(c => LIBRARY[c]);
  const own = LIBRARY[category] ? [category] : [];
  const order = [...own, ...(pool.length ? pool : Object.keys(LIBRARY)).filter(c => c !== category)];
  for (const cat of order) {
    const hit = Object.values(LIBRARY[cat]).find(g => g.keywords.test(text));
    if (hit) return url(pickFrom(hit.photos, text));
  }
  const cat = order[0];
  const all = Object.values(LIBRARY[cat]).flatMap(g => g.photos);
  return url(pickFrom(all, text));
}

// A few photos from different categories, for store banners.
export const bannerPhotos = products => {
  const seen = new Set();
  const picks = [];
  for (const p of [...products].sort((a, b) => Number(b.featured) - Number(a.featured))) {
    if (p.image && !seen.has(p.category) && p.stock > 0) { seen.add(p.category); picks.push(p); }
    if (picks.length === 3) break;
  }
  for (const p of products) { if (picks.length >= 3) break; if (p.image && !picks.includes(p)) picks.push(p); }
  return picks;
};
