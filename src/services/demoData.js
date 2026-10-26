export const store = { id: 'demo-store', name: 'Sunday Studio', slug: 'sunday-studio', tagline: 'Everyday pieces, thoughtfully picked.' };
export const products = [
  { id:'p1', name:'Everyday Tote', category:'Accessories', price:12500, stock:14, image:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85', description:'A roomy everyday tote for work, errands, and weekends.' },
  { id:'p2', name:'Soft Knit Set', category:'Clothing', price:28000, stock:8, image:'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=85', description:'An easy-to-style knit set for relaxed days.' },
  { id:'p3', name:'Classic Sneakers', category:'Footwear', price:32000, stock:6, image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', description:'A clean, versatile sneaker for everyday wear.' },
  { id:'p4', name:'Daily Carry Pouch', category:'Accessories', price:8500, stock:22, image:'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=85', description:'Keep your small essentials together wherever you go.' },
  { id:'p5', name:'Weekend Shirt', category:'Clothing', price:18500, stock:11, image:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85', description:'A lightweight shirt for easy everyday styling.' },
  { id:'p6', name:'Minimal Wristwatch', category:'Accessories', price:24000, stock:4, image:'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85', description:'A minimal accessory for weekdays and weekends.' }
];
export const naira = amount => new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', maximumFractionDigits:0 }).format(amount);
