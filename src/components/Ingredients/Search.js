import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const {
    isLoading,
    data,
    error,
    sendRequest,
    clear
  } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Enteredfilter will be the old enteredFilter the user entered 500 ms ago
      // inputRef.current.value = current value of the enteredFilter
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ?
          '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest('https://react-hooks-update-10777.firebaseio.com/ingredients.json' + query, 'GET');
      }
    }, 500);
    // Cleanup function runs if the array contents below change (not on the initial render)
    return () => {
      clearTimeout(timer);
    };
    // Array element = If any of the elements in the array change, then the useEffect runs again
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
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
