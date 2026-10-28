// Brayden this is yours

export default function ProductTile( {product}) {

    const isAvailable = product.productAvailable

    return (
        <article className="product-tile">
            <h2>
                {product.productName}
                <span class="category-label">Tags: {product.productCategories}</span>
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
