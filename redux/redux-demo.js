const redux = require("redux");
// Reducer Function
const reducerFun = (state = { counter: 0 }, action) => {
  return {
    counter: state.counter + 1,
  };
};
// Store Data
const store = redux.createStore(reducerFun);
/////////////////////////////////
// first time work
console.log(store.getState()); //  { counter: 1 }

// Subscriber Function
const conuterSubscriber = () => {
  const latestState = store.getState();
  console.log(latestState);
};
store.subscribe(conuterSubscriber);

// next time work
store.dispatch({ type: "increment" }); // { counter: 2 }
store.dispatch({ type: "increment" }); // { counter: 3 }
