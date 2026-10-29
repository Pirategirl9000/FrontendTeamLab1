import ProductTile from './ProductTile';

/**
 * Returns a section containing all the products given or a span indicating that there were no products
 * @param {Array<Object>} prods array of product objects for the ProductTile's 
 * @param {Function} onSelect state setter for the selected product
 * @returns A grid of product tiles or a span saying none were found
 */

export default function ProductGrid({prods, selectSetter}) {
    return (
        <section className="productGrid">
            {(prods.length) ? prods.map(prod => (
                <ProductTile selectSetter={selectSetter} product={prod}></ProductTile>
            )) : <span>No products found</span>}
        </section>
    );
}