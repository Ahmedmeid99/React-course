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
const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SENDING":
      return { isLoading: true, error: false };
    case "LOADED":
      return { ...httpState, isLoading: false };
    case "ERROR":
      return { ...httpState, error: action.errorMessage };
    case "CLEAR":
      return { isLoading: false, error: null };
    default:
      throw new Error("should not get there!");
  }
};
const Ingredients = () => {
  const [listState, dispath] = useReducer(reducerFun, []);

  const [httpState, dispathHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: false,
  });

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const onLoadIngredient = useCallback((filteredIngredients) => {
    dispath({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addItemHandler = (enteredObject) => {
    dispathHttp({ type: "SENDING" });
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
        dispathHttp({ type: "LOADED" });
        return response.json();
      })
      .then((data) => {
        dispath({
          type: "ADD",
          ingredient: { id: data.name, ...enteredObject },
        });
      });
  };

  const removeItemHandler = (ingredientId) => {
    dispathHttp({ type: "SENDING" });
    fetch(
      `https://react-http-f4f9d-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        dispathHttp({ type: "LOADED" });

        dispath({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        dispathHttp({ type: "ERROR", errorMessage: error.message });
      });
  };
  const closeErrorHandler = () => {
    dispathHttp({ type: "CLEAR" });
  };
  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={closeErrorHandler}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        listFun={addItemHandler}
        isLoading={httpState.isLoading}
      />

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
