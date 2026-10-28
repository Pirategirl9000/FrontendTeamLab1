// Brayden this is yours
import '../Styles/ProductTile.css';

export default function ProductTile( {product}) {

    const isAvailable = product.productAvailable

    return (
        <article className="product-tile">
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
