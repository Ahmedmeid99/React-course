import React, { useState, useReducer, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
const reducerFun = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.id
      );
    default:
      throw new Error("should not get there!");
  }
};
const Ingredients = () => {
  const [listState, dispath] = useReducer(reducerFun, []);
  // const [listState, setListState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const onLoadIngredient = useCallback((filteredIngredients) => {
    // setListState(filteredIngredients);
    dispath({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addItemHandler = (enteredObject) => {
    setIsLoading(true);
    fetch(
      "https://react-http-f4f9d-default-rtdb.firebaseio.com/ingredient.json",
      {
        method: "POST",
        body: JSON.stringify(enteredObject),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((data) => {
        // setListState((prevState) => {
        //   return [...prevState, enteredObject];
        // });
        dispath({
          type: "ADD",
          ingredient: { id: data.name, ...enteredObject },
        });
      });
  };

  const removeItemHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-http-f4f9d-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        setIsLoading(false);
        // const newIngredients = listState.filter(
        //   (ingredient) => ingredient.id !== ingredientId
        // );
        // setListState(newIngredients);
        dispath({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        setError("Something went wrong!");
        setIsLoading(false);
      });
  };
  const closeErrorHandler = () => {
    setError(null);
    setIsLoading(false);
  };
  return (
    <div className="App">
      {error && <ErrorModal onClose={closeErrorHandler}>{error}</ErrorModal>}
      <IngredientForm listFun={addItemHandler} isLoading={isLoading} />

      <section>
        <Search listState={listState} onLoadIngredient={onLoadIngredient} />
        {/* Need to add list here! */}

        <IngredientList
          ingredients={listState}
          onRemoveItem={removeItemHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
