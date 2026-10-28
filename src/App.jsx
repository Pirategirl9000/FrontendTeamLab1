import { useState, useEffect } from 'react';
import './Styles/App.css';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import SocialBar from './components/SocialBar.jsx'

/**
 * Returns the app for this website
 * @returns An app component containing all the content of the site
 */
export default function App() {
  const TESTING_ENV = true;  // True means we will run assertion tests before rendering
  let [products, setProducts] = useState([]);

  // Filtering stuff
  let [filteredProducts, setFilteredProducts] = useState([]);
  let [searchText, setSearchText] = useState("");
  let [categorySelected, setCategorySelected] = useState("All");

  //Crud form
  const [mode, setMode] = useState("Create");
  const [selectedProducts, setSelectedProducts] = useState([])
  const selectedProduct = (mode === "Update") ? products.find(prod => prod.id === selectedProducts[0]) : undefined;

  /**
   * Fetches the products from the JSON file
   * @returns The products fetched and formatted
   */
  async function fetchProducts() {
    const response = await fetch("/products.json");

    if (!response.ok) throw new Error("Failed to fetch products");

    const json = await response.json();

    return json.map((prod, index) => ({
      id: prod.id || prod.productID || index + 1,  // If the product doesn't have an id we will assign it one based on its index in the array
      ...prod,
      productCategories: prod.productCategories.map(cat => cat.toLowerCase())
    }));
  }

  /**
   * CRUD Functions
   */

  function createProduct(newProduct) {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  }

  function updateProduct(id, updatedProduct) {
    setProducts(prevProducts => prevProducts.map(prod => prod.id === id ? { ...prod, ...updatedProduct } : prod));
  }

  function deleteProduct(id) {
    setProducts(prevProducts => prevProducts.filter(prod => prod.id !== id));
  }


  function handleModeChange(e) {
    setMode(e.target.value);
    setSelectedProducts([]);
  }

   function handleProductSelect(id) {
    if (mode === "Create") return;
 
    if (mode === "Update") {
      // Clicking the already selected tile unselects it, otherwise only this one product is selected (the form fills in from it)
      setSelectedProducts(prev => prev.includes(id) ? [] : [id]);
      return;
    }
 
    // Delete mode
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(selectedID => selectedID !== id) : [...prev, id]);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (mode === "Delete") {
      if (selectedProducts.length === 0) {
        alert("Click on at least one product to select it for deletion.");
        return;
      }
      selectedProducts.forEach(id => deleteProduct(id));
      setSelectedProducts([]);
      return;
    }

    const form = e.target;
    const data = new FormData(form);
    const productName = data.get("productName").trim();
    const productDescription = data.get("productDescription").trim();
    const productPrice = data.get("productPrice");
    const productSeller = data.get("productSeller").trim();
    const productCategories = data.get("productCategories");

    if (!productName || !productDescription || productPrice === "" || !productSeller || !productCategories.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
 
    const productData = {
      productName,
      productDescription,
      productPrice: parseFloat(productPrice) || 0,
      productSeller,
      productCategories: productCategories.split(',').map(cat => cat.trim().toLowerCase()).filter(Boolean),  // Lowercase format as fetchproducts
      productAvailable: data.get("productAvailable") === "on"  // An unchecked checkbox isn't included in the form data at all
    };
 
    if (mode === "Update") {
      if (selectedProducts.length === 0) {
        alert("Click on a product to select it for updating.");
        return;
      }
      // UPDATE: PRODUCT[ID] = UPDATED-PRODUCT
      updateProduct(selectedProducts[0], productData);
    } else {
      // CREATE: PRODUCTS += NEW-PRODUCT
      const newID = Date.now(); // Using date as it can pass as a unique ID
      createProduct({ ...productData, id: newID, productID: newID });
    }
 
    // CLEAR SELECTED (and empty the boxes)
    setSelectedProducts([]);
    form.reset();
  }


  /**
   * If TESTING_ENV is set to true this function will run on mount and perform several assertion tests against expected values
   */
  async function test() {
    const fAssert = (value, expected = true, msg = "Assertion test failed") => {
      if (value !== expected) console.error("Assertion Fail: " + msg);
    }

    const prods = await fetchProducts();
    let filtered;

    fAssert(prods.length > 0, true, "Products did not pull in correctly");

    // CHECK FOR NO CATEGORY MATCH
    searchText = "";
    categorySelected = "˫˫˫˫˫˫˫˫";  // Shouldn't be any categories for this
    filtered = filterProducts(prods);
    fAssert(filtered.length, 0, "Returned products for invalid category filter");

    // CHECK FOR NO FILTERING
    categorySelected = "all";
    searchText = "";
    filtered = filterProducts(prods);
    fAssert(filtered.length, prods.length, "Did not pass check for no-filter");

    // CHECK FOR NO SEARCH MATCH
    searchText = "˫˫˫˫˫˫˫˫";  // Such an obscure character combo no one would ever have it ~ Ideally we would disallow it
    categorySelected = "all";
    filtered = filterProducts(prods);
    fAssert(filtered.length, 0, "Returned products for invalid search filter");

    // CHECK ALPHABETICAL - LIGHT CHECK AND ONLY CHECKS FIRST LETTER
    categorySelected = "all";
    searchText = "";
    filtered = filterProducts(prods);
    filtered = filtered.map(prod => prod.productName.charCodeAt(0));
    let biggest = 0;

    for (const cc of filtered) {
      fAssert(cc >= biggest, true, "Light check on alphabetic order failed");
      biggest = cc;
    }










    // Reset everything
    searchText = "";
    categorySelected = "all";
  }

  // Pull in the products from the json and format them
  useEffect(() => {
    fetchProducts()
      .then(result => {
        setProducts(result);
        setFilteredProducts(result);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    setFilteredProducts(filterProducts());
  }, [products, categorySelected, searchText]);


  if (TESTING_ENV) useEffect(() => { test() }, []);

  /**
   * Updates the state of the filters and then updates the filtered products triggering a rerender of the product grid
   * @param {Event} e The event that spurred this action 
   */
  function updateFilters(e) {
    switch (e.target.className) {
      case "selectFilter":  // Category selection changed 
        setCategorySelected(e.target.value);
        break;
      case "searchFilter":  // Search query changed
        setSearchText(e.target.value);
        break;
    }
  }

  /**
   * Compares two strings and returns a number indicating which comes first alphabetically (uses Array.prototype.sort predicate rules)
   * @param {String} a The first string
   * @param {String} b The second string
   */
  const alphabetCompare = (a, b) => {
    if (a === b) return 0;      // They are the same string so it doesn't matter which goes first

    for (let i = 0; i < a.length && i < b.length; i++) {
      if (a.charCodeAt(i) > b.charCodeAt(i)) return 1;          // b's letter comes first
      else if (a.charCodeAt(i) < b.charCodeAt(i)) return -1;    // a's letter comes first
    }

    // They have the same characters up to some point meaning we assess string length
    return (a.length > b.length) ? 1 : -1
  }

  /**
   * Filters the products by the current filtering queries, alphabetizes the results, and returns the filtered products
   * @param {Array<Object>} prods Products to use instead of the state products, used for testing
   * @returns {Array[Object]} an array of the products filtered and sorted
   */
  function filterProducts(prods = null) {
    let filteredProducts = (prods) ? prods : products;  // Grabs inputted products and will use those instead, for example when testing
    const searchQueries = searchText.toLowerCase().split('&');  // Allows multiple search queries
    const category = categorySelected.toLowerCase();
    const comparators = "<>=";
    let price;

    if (category !== "all") filteredProducts = filteredProducts.filter(prod => prod.productCategories.includes(category));  // Filter by category dropdown ~ productCategories should already be lowercase

    for (let query of searchQueries) {
      // FORMAT THE QUERY AND PULL ANY IMPORTANT INFO
      query = query.toLowerCase();
      let comparisonOp = "";  // this stores the comparator the user might be using for the search query

      // Peel off the first one or two characters if they are comparator symbols
      if (comparators.includes(query.charAt(0))) {  // They may want some kind of comparison
        comparisonOp += query.charAt(0);
        if (query.charAt(1) === '=') {  // They might be checking <= >= or ==
          comparisonOp += '=';
        }
      }

      if (comparisonOp) price = Number.parseFloat(query.slice(comparisonOp.length));

      // START THE FILTERING
      filteredProducts = filteredProducts.filter(prod => {
        // If we have a comparison operator and price is a number then we filter by price
        if (comparisonOp && !Number.isNaN(price)) {
          switch (comparisonOp) {
            case '=':
            case '==': return prod.productPrice === price;
            case '<': return prod.productPrice < price;
            case '>': return prod.productPrice > price;
            case '<=': return prod.productPrice <= price;
            case '>=': return prod.productPrice >= price;
          }
        }

        if (prod.productName.toLowerCase().includes(query)) return true;
        if (prod.productDescription.toLowerCase().includes(query)) return true;
        if (prod.productSeller.toLowerCase().includes(query)) return true;

        // Check for category match
        for (const cat of prod.productCategories) if (cat.includes(query)) return true;
      })
    }


    return filteredProducts.sort((a, b) => alphabetCompare(a.productName, b.productName));
  }

  /**
   * Takes the products given to the filter form and pulls out all the unique categories
   * @param {Array<Object>} products All the products
   * @returns {Array<String>} All the unique categories for objects
   */
  function getUniqueCategories() {
    return products
      .map(prod => prod.productCategories)                            // Grab each of the products categories (map does not mutate)
      .flat()                                                         // Flatten the array of categories into a 1D array ~ We can't use flatmap since that only flattens one level :(
      .filter((val, index, arr) => arr.indexOf(val) === index)        // Remove duplicates and return it
      .slice(0, 5);                                                   // Pull off the first five unique categories - or maybe it's 4, doesn't really matter
  }

  return (
    <>
      <Header />


      <section className="crudForm">
        <h3>Product Menu</h3>
        <form key ={mode + (selectedProducts[0] ?? "")} onSubmit = {handleFormSubmit}>
           <select className="crudMenu" value={mode} onChange={handleModeChange}>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
          </select>

          {mode !== "Delete" && (
            <>
              <input type="text" name="productName" placeholder="Product Name" defaultValue={selectedProduct?.productName ?? ""}></input> {/*Product Name*/}
              <input type="text" name="productDescription" placeholder="Product Description" defaultValue={selectedProduct?.productDescription ?? ""}></input> {/*Product Description*/}
              <input type="number" step="0.01" name="productPrice" placeholder="Product Price" defaultValue={selectedProduct?.productPrice ?? ""}></input> {/*Product Price*/}
              <input type="text" name="productSeller" placeholder="Product Seller" defaultValue={selectedProduct?.productSeller ?? ""}></input> {/*Product Seller*/}
              <input type="text" name="productCategories" placeholder="Product Categories" defaultValue={selectedProduct?.productCategories.join(', ') ?? ""}></input> {/*Product Category*/}

        <label>
              <input type="checkbox" name="productAvailable" defaultChecked = {Boolean(selectedProduct?.productAvailable)}></input> {/*Product Availability as a checkbox*/}
              Available
        </label>
          </>
          )}

          {mode === "Update" && <p>Click a product to select it, then edit its info above and submit.</p>}
          {mode === "Delete" && <p>Click the products you want to delete ({selectedProducts.length} selected), then submit.</p>}

          <div>
                <button type="submit">{mode}</button>
          </div> 
          </form>
    </section>

    <section className="filterForm">
        <select className="selectFilter" onChange={updateFilters}>
          <option value="All">All</option>
          {getUniqueCategories(products).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="text" placeholder="Search for products" className="searchFilter" onChange={updateFilters}></input>
      </section>

      <section className="products">
        <ProductGrid prods={filteredProducts} selectedIDs={selectedProducts} onSelect={handleProductSelect}></ProductGrid>
      </section>

      <SocialBar />  {/* TODO: Isaiah style this properly because right now its just a column, it returns a section that has a class name you could use */}
      <Footer />
    </>
  )
}