import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const { onLoadIngredient } = props;
  useEffect(() => {
    const query =
      enteredFilter.length === 0
        ? ""
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch(
      "https://react-http-f4f9d-default-rtdb.firebaseio.com/ingredient.json" +
        query
    )
      .then((response) => response.json())
      .then((data) => {
        let ingredientsArray = [];
        for (let key in data) {
          ingredientsArray.push({
            id: key,
            title: data[key].title,
            amount: data[key].amount,
          });
        }
        onLoadIngredient(ingredientsArray);
      });
  }, [enteredFilter, onLoadIngredient]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={(e) => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
