import { useState } from 'react';
import './App.css';

export default function App() {
  const [products, setProducts] = useState([]);  // TODO: Jarrod you need to populate this later with the fetched products (It can't be the initial state since hooks need to be top-level)

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
   * Filters the products by the current filtering queries, alphabetizes the results, and then sets the state using the setter provided to the FilterForm
   * @param {Event} e The event that triggered this filtering to occur
   * @returns {Array[Object]} an array of the products filtered and sorted
   */
  function filter(e) {
    let filteredProducts = products;  // TODO: Add the filtering logic

    return filteredProducts.sort(alphabetCompare);
  }

  /**
   * Takes the products given to the filter form and pulls out all the unique categories
   * @param {Array<Object>} products All the products
   * @returns {Array<String>} All the unique categories for objects
   */
  function getUniqueCategories() {
    return products
      .map(prod => prod.productCategory)                              // Grab each of the products categories (map does not mutate)
      .flat()                                                         // Flatten the array of categories into a 1D array ~ We can't use flatmap since that only flattens one level :(
      .filter((val, index, arr) => arr.indexOf(val) === index);       // Remove duplicates and return it
  }

  return (
    <>
    {/* This contains filtering items, these need to be top level since it is tightly coupled to other components via products array */}
    {/* Unfortunately we can't really just pass down the setters otherwise shit gets gross and doesn't work pretty */}
    <section className="filterForm">
      <select className="selectFilter" onChange={filter}>
        {getUniqueCategories(products).map(cat => <Option key={cat}>{cat}</Option>)}
      </select>
      <input type="text" placeholder="Search for products" className="searchFilter" onChange={filter}></input>
    </section>

    </>
  )
}
