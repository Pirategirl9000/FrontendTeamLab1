import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProductTile from './components/ProductTile.jsx'

export default function App() {
  const [products, setProducts] = useState([]);
  
  // Filtering stuff
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [categorySelected, setCategorySelected] = useState("All");

  // Pull in the products from the json and format them
  useEffect(() => {
    fetch('/products.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');

        return res.json();
      })
      .then(data => {
        // lowercase all categories for filtering
        const lowercasedData = data.map(prod => ({
          ...prod,
          productCategories: prod.productCategories.map(cat => cat.toLowerCase())
        }));

        setProducts(lowercasedData); // set the products state with the lowercased data
        setFilteredProducts(lowercasedData); // set the filtered products state with the lowercased data
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    setFilteredProducts(filterProducts);
  }, [categorySelected, searchText]);


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
   * @param {Event} e The event that triggered this filtering to occur
   * @returns {Array[Object]} an array of the products filtered and sorted
   */
  function filterProducts(e) {
    let filteredProducts = products;
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


    return filteredProducts.sort(alphabetCompare);
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
      .filter((val, index, arr) => arr.indexOf(val) === index);       // Remove duplicates and return it
  }

  // TODO: Isaiah this is your stuff below, your job is to create the proper flow for the document, I (Violet) added my stuff below
  // TODO: Make sure you create the header, footer, and any other items for the structure of the page and style it :)
  return (
    <>
      <Header />
      {/* TODO: Add filter clearing button */}
      <section className="filterForm">
        {/* DO NOT CHANGE THE CLASS NAME ON THE FILTER INPUTS THEY ARE LINKED TO FILTERING LOGIC */}
        <select className="selectFilter" onChange={updateFilters}>
          <option value="All">All</option>
          {getUniqueCategories(products).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="text" placeholder="Search for products" className="searchFilter" onChange={updateFilters}></input>
      </section>

      {/* TODO: Isaiah add some conditional rendering here so when there are no products something gets displayed */}
      <section className="products">
        {filteredProducts.map(prod => <ProductTile product={prod} key={prod.productID}></ProductTile>)}
      </section>
      <Footer />
    </>
  )
}
