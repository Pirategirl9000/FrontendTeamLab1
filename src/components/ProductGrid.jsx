import ProductTile from './ProductTile';

/**
 * Returns a section containing all the products given or a span indicating that there were no products
 * @param {Array<Object>} prods array of product objects for the ProductTile's 
 * @param {Array<Number>} selectedIDs The ids of the products that are currently selected
 * @param {Function} onSelect Called with a product id when its tile is clicked
 * @returns 
 */

export default function ProductGrid({prods, selectedIDs = [], onSelect}) {
    return (
        <section className="products">
            {(prods.length) ? prods.map(prod => (
                // div handles click and highlight 
                <div
                    key={prod.productID}
                    // Adds the selected class when this product id is in the selected list
                    className={selectedIDs.includes(prod.id) ? "selectable selected" : "selectable"}
                    //Tells which product was selected
                    onClick={() => onSelect && onSelect(prod.id)}
                >
                    <ProductTile product={prod}></ProductTile>
                </div>
            )) : <span>No products found</span>}
        </section>
    );
}