import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { naira } from '../services/catalog.js';
import { ProductImage } from './common.jsx';

export default function ProductCard({ product, slug }) {
  const { addItem } = useCart();
  const soldOut = product.stock < 1;
  const low = product.stock > 0 && product.stock <= 5;
  const to = `/store/${slug}/product/${product.id}`;
  return (
    <article className="product-card">
      <Link to={to} className="product-photo">
        <ProductImage src={product.image} alt={product.name}/>
        {soldOut && <span className="tag tag-dark">Sold out</span>}
        {low && <span className="tag">Only {product.stock} left</span>}
        {product.featured && !soldOut && !low && <span className="tag tag-accent">Featured</span>}
      </Link>
      <div className="muted category">{product.category}</div>
      <div className="product-name-row">
        <Link to={to}><strong>{product.name}</strong></Link>
        <button className="plus" aria-label={`Add ${product.name} to bag`} disabled={soldOut} onClick={() => addItem(product, slug)}><Plus size={17}/></button>
      </div>
      <div className="price">{naira(product.price)}</div>
    </article>
  );
}
