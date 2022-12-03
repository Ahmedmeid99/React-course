const redux = require("redux");
// Reducer Function
const reducerFun = (state = { counter: 0 }, action) => {
  if (action.type === "ADD_ONE") {
    return {
      counter: state.counter + 1,
    };
  } else if (action.type === "REMOVE_ONE") {
    return {
      counter: state.counter - 1,
    };
  }
};
// Store Data
const store = redux.createStore(reducerFun);
/////////////////////////////////////////////////
// without subscribing you can not use Redux

// Subscriber Function
const conuterSubscriber = () => {
  const latestState = store.getState();
  console.log(latestState);
};
// Subscribing
store.subscribe(conuterSubscriber);

/////////////////////////////////////////////////

// next time work
store.dispatch({ type: "ADD_ONE" }); // { counter: 1 }
store.dispatch({ type: "ADD_ONE" }); // { counter: 2 }
store.dispatch({ type: "REMOVE_ONE" }); // { counter: 1 }
store.dispatch({ type: "REMOVE_ONE" }); // { counter: 0 }
store.dispatch({ type: "REMOVE_ONE" }); // { counter: -1 }
