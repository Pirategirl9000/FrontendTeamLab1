import { useState, useEffect } from 'react';
import './Styles/App.css';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProductGrid from './components/ProductGrid.jsx'


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

  const [selectedProduct, setSelectedProduct] = useState(-1);

  /**
   * Fetches the products from the JSON file
   * @returns The products fetched and formatted
   */
  async function fetchProducts() {
    const response = await fetch("/products.json");

    if (!response.ok) throw new Error("Failed to fetch products");

    const json = await response.json();

    return json.map((prod, index) => ({
      id: prod.id || index + 1,  // If the product doesn't have an id we will assign it one based on its index in the array
      ...prod,
      productCategories: prod.productCategories.map(cat => cat.toLowerCase())
    }));
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

  function deleteProducts(e) {
    setProducts(products => products.filter(prod => prod.productID !== selectedProduct));
    setSelectedProduct(-1);
    alert("Product Deleted");
  }

  function createProducts(e) {
    const name = e.target.productName?.value.trim();
    const categories = e.target.productCategories?.value.split(",").map(cat => cat.trim()).filter(cat => cat);
    const seller = e.target.productSeller?.value.trim();
    const price = e.target.productPrice?.value.trim();
    const desc = e.target.productDescription?.value.trim();
    const available = e.target?.checked;

    if (!name || categories.length === 0 || !seller || !price || price < 0 || !desc) {
      alert("Creating product failed due to invalid inputs");
      return;
    }
    
    let newID = 1;
    
    products.forEach(prod => {
      if (prod.productID > newID) {  // Bad way to do things but ideally a RDBMS would handle this
        newID = prod.productID;
      }
    })

    newID++;


    const newProd = {
      productID: newID,
      productName: name,
      productSeller: seller,
      productPrice: price,
      productDescription: desc,
      productAvailable: available,
      productCategories: categories
    }


    setProducts(prods => [...prods, newProd]);
    setSelectedProduct(-1);
    alert("Product Created");
  }

  function updateProducts(e) {
    setProducts(products.map(prod => {
      if (prod.productID !== selectedProduct) return prod;

      const name = e.target.productName?.value.trim();
      const categories = e.target.productCategories?.value.split(",").map(cat => cat.trim()).filter(cat => cat);
      const seller = e.target.productSeller?.value.trim();
      const price = e.target.productPrice?.value.trim();
      const desc = e.target.productDescription?.value.trim();
      const available = e.target?.checked;

      const newProd = prod;

      if (name) newProd.productName = name;
      if (categories.length) newProd.productCategories = categories;
      if (seller) newProd.productSeller = seller;
      if (price && price > 0) newProd.productPrice = price;
      if (desc) newProd.productDescription = desc;
      newProd.productAvailable = available; 

      return newProd;
      }))

      alert("Product Updated");
    }

  function handleFormSubmit(e) {
    e.preventDefault();

    switch (e.target.act.value) {
      case "create":
        createProducts(e);
        break;
      case "delete":
        deleteProducts(e);
        break;
      case "update":
        updateProducts(e);
        break;
    }
  }

  return (
    <>
      <Header />
      <section className="listingSection">
        {(selectedProduct !== -1) ? <h2>{"Selected Product: " + products.filter(prod => prod.productID === selectedProduct)[0].productName}</h2> : <h2>No Product Selected</h2>}
        <form className="listingForm" onSubmit={handleFormSubmit}>
          <select className="listingSelect" name="act">
            <option className="listingOption" value="create">Create Listing</option>
            <option className="listingOption" value="delete">Delete Listing</option>
            <option className="listingOption" value="update">Update Listing</option>
          </select>
          <input className="productNameInput" type="text" name="productName" placeholder="Product Name"></input>
          <input className="productPriceInput" type="number" min="0" step="0.01" name="productPrice" placeholder="Product Price"></input>
          <input className="productSellerInput" type="text" name="productSeller" placeholder="Product Seller"></input>
          <input className="productCategoriesInput" type="text" name="productCategories" placeholder="Product Categories (comma-separated)"></input>
          <label>
            Product Available
            <input className="productAvailableInput" type="checkbox" value="yes" name="productAvailable"></input>
          </label>

          <textarea className="productDescriptionInput" name="productDescription" placeholder="Product Description"></textarea>
          <button className="listingSubmit" type="submit">Submit</button>
        </form>
      </section>

      <section className="filterForm">
        <p>Filter Products</p>
        <select className="selectFilter" onChange={updateFilters}>
          <option value="All">All</option>
          {getUniqueCategories(products).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="text" placeholder="Search for products" className="searchFilter" onChange={updateFilters}></input>
      </section>

      <section className="products">
        <ProductGrid selectSetter={setSelectedProduct} prods={filteredProducts}></ProductGrid>
      </section>

      <Footer />
    </>
  )
}
