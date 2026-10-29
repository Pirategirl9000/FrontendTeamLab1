// Brayden this is yours
import '../Styles/ProductTile.css';

/**
 * 
 * @param {Object} props The props for this component
 * @param {Object} props.product The product to render 
 * @param {Function} props.selectSetter Function for setting which product is selected for CRUD operations
 * @returns A product tile containing all the info
 */
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
                {(isAvailable) && <h3> {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.productPrice)}</h3> }
                {(isAvailable) ? <button>Buy Now</button> : <h2>Not Available</h2>}
            </article>
        );
}   
