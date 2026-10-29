// Brayden this is yours
import '../Styles/ProductTile.css';

export default function ProductTile( {product, selectSetter}) {
    const ID = product.productID;
    const isAvailable = product.productAvailable

    /**
     * Selects a product for CRUD operations
     * @param {Event} e The event sent by a product tile
     */
    function selectProduct(e) {
        selectSetter(ID)
        alert(`Product: ${product.productName} Selected`);  // Time crunch here so this looks like crap
    }

        return (
            <article className="product-tile" prodid={product.productID}>
                <span onClick={selectProduct}>
                    <h2>
                        {product.productName}
                        <div className="category-label">Tags: {product.productCategories.join(" ")}</div>
                    </h2>
                    <h4>
                        <strong>Seller: </strong>
                        {product.productSeller}
                    </h4>
                    <p>
                        {product.productDescription}
                    </p>
                </span>
                {(isAvailable) ? <button>Buy Now</button> : <h2>Not Available</h2>}
            </article>
        );
}   
