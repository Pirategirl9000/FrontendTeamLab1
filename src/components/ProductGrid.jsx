import ProductTile from './ProductTile';

export default function ProductGrid({prods}) {
    return (
        <section className="products">
            {(prods.length) ? prods.map(prod => <ProductTile product={prod} key={prod.productID}></ProductTile>) : <span>No matching products found</span>}
        </section>
    );
}