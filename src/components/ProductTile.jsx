// Brayden this is yours
import '../Styles/ProductTile.css';

export default function ProductTile( {product, selectedProduct, selectSetter}) {
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

    if (isAvailable == false){
        return (
            <article className="product-tile" prodid={product.productID} onClick={selectProduct}>
                <h2>
                    {product.productName}
                    <div className="category-label">Tags: {product.productCategories}</div>
                </h2>
                <h4>
                    <strong>Seller: </strong>
                    {product.productSeller}
                </h4>
                <p>
                    {product.productDescription}
                </p>
                <h2>
                    Not Available
                </h2>
            </article>
        );
    } else {
        return (
            <article className="product-tile" prodid={product.productID} onClick={selectProduct}>
                <h2>
                    {product.productName}
                    <div className="category-label">Tags: {product.productCategories}</div>
                </h2>
                <h4>
                    <strong>Seller: </strong>
                    {product.productSeller}
                </h4>
                <p>
                    {product.productDescription}
                </p>
                <h3>
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.productPrice)}
                </h3>
                <button>
                    Buy Now
                </button>
            </article>
        );
    }
}   
