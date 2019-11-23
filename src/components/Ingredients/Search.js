import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Enteredfilter will be the old enteredFilter the user entered 500 ms ago
      // inputRef.current.value = current value of the enteredFilter
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ?
          '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-update-10777.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    // Cleanup function runs if the array contents below change (not on the initial render)
    return () => {
      clearTimeout(timer);
    };
    // Array element = If any of the elements in the array change, then the useEffect runs again
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
