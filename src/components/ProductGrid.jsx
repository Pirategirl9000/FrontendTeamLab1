import ProductTile from './ProductTile';

/**
 * Returns a section containing all the products given or a span indicating that there were no products
 * @param {Array<Object>} prods An array of product objects for the ProductTile's 
 * @returns 
 */

export default function ProductGrid({prods, selectedIDs = [], onSelect}) {
    return (
        <section className="products">
            {(prods.length) ? prods.map(prod => <ProductTile selectSetter={selectSetter} product={prod} key={prod.productID}></ProductTile>) : <span>No products found</span>}
        </section>
    );
}