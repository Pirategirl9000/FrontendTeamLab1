// Brayden this is yours
import '../Styles/ProductTile.css';

export default function ProductTile( {product, selectSetter}) {

    const isAvailable = product.productAvailable

    /**
     * Selects a product for CRUD operations
     * @param {Event} e The event sent by a product tile
     */
    function selectProduct(e) {
        const ID = e.target.getAttribute("prodid");
        console.log(ID);

        selectSetter((prev) => {
            if (prev !== -1)
                document.querySelector(`.product-tile["prod-id=${prev}"]`).classList.remove("selected");  // Remove old selection
            
            if (e.target.classList.contains("selected")){
                e.target.classList.remove("selected");
                return -1;  // Nothing is selected
            }

            e.target.classList.add("selected");
            return ID;
        });
    }

    if (isAvailable == false){
        return (
            <article className="product-tile" prod-id={product.productID} onClick={selectProduct}>
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
            <article className="product-tile" prod-id={product.productID} onClick={selectProduct}>
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
