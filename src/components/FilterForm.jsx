import { useEffect } from 'react';

/**
 * Element containing a small form for filtering the products
 * @param {Object} props The jsx props for this component
 * @param {Array<Object>} props.products All of the current products
 * @param {Function} props.setter A state setter for assigning new product state
 * @returns {React.JSX.Element} A JSX element containing all the filtering components
 */
export default function FilterForm({products, setter}) {
    // We call filter when the form mounts that way the products are in alphabetic order
    // This means the FilterForm must come before the ProductGrid
    useEffect(filter, []);

    /**
     * Filters the products by the current filtering queries, alphabetizes the results, and then sets the state using the setter provided to the FilterForm
     */
    function filter() {
        setter(products  // TODO: do all the filtering in here and alphabetize it



        );
    }

    /**
     * Takes the products given to the filter form and pulls out all the unique categories
     * @param {Array<Object>} products All the products
     * @returns {Array<String>} All the unique categories for objects
     */
    function getUniqueCategories() {
        return products
            .map(prod => prod.productCategory)                              // Grab each of the products categories (map does not mutate)
            .flat()                                                         // Flatten the array of categories into a 1D array
            .filter((val, index, arr) => arr.indexOf(val) === index);       // Remove duplicates and return it
    }

    return (
        <>
        <select className="selectFilter" onChange={filter}>
            {getUniqueCategories(products).map(cat => <Option key={cat}>{cat}</Option>)}
        </select>
        <input type="text" placeholder="Search for products" className="searchFilter" onChange={filter}></input>


        </>
    )
}