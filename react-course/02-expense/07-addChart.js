import { eventWrapper } from "@testing-library/user-event/dist/utils";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

//////////////////////////////////////////
const DUMMY_EXPENSES = [
  { id: "e1", title: "car", amount: 233, date: new Date(2021, 3, 28) },
  { id: "e2", title: "wood", amount: 109, date: new Date(2019, 7, 9) },
  { id: "e3", title: "course", amount: 130, date: new Date(2022, 1, 35) },
  { id: "e4", title: "chair", amount: 27, date: new Date(2021, 7, 12) },
  { id: "e5", title: "wall", amount: 27, date: new Date(2021, 3, 2) },
];
const App = () => {
  const [expenses, setexpenses] = useState(DUMMY_EXPENSES);
  const addExpenseHandler = (expense) => {
    setexpenses((prevExpenses) => {
      return [expense, ...prevExpenses];
    });
  };
  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Let`s get started</h1>
        </div>
      </header>
      <NewEpense onAddExpense={addExpenseHandler} />
      <List listData={expenses} />
    </div>
  );
};
const NewEpense = (props) => {
  const [form, setForm] = useState(false);
  const saveExpenseDateHandler = (enteredExpenseDate) => {
    const expenseDate = {
      ...enteredExpenseDate,
      id: Math.floor(Math.random() * 1000000),
    };
    props.onAddExpense(expenseDate);
  };
  const handleShowForm = () => {
    setForm(true);
  };
  const handleCancleForm = () => {
    setForm(false);
  };
  return (
    <div>
      {form && (
        <ExpenseForm
          onSaveExpenseDate={saveExpenseDateHandler}
          onCancle={handleCancleForm}
        />
      )}
      {!form && (
        <div className="show-form">
          <button
            className="btn btn-blue"
            type="button"
            onClick={handleShowForm}
          >
            Add New Expense
          </button>
        </div>
      )}
    </div>
  );
};
//////////////////////////////////////////
const ExpenseForm = (props) => {
  const [EnteredTitle, setEnteredTitle] = useState("");
  const [EnteredAmount, setEnteredAmount] = useState("");
  const [EnteredDate, setEnteredDate] = useState("");
  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };
  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };
  const dateChangeHandler = (event) => {
    setEnteredDate(event.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const newExpense = {
      title: EnteredTitle,
      amount: EnteredAmount,
      date: new Date(EnteredDate),
    };
    props.onSaveExpenseDate(newExpense);
    setEnteredTitle(" ");
    setEnteredAmount(" ");
    setEnteredDate(" ");
  };
  return (
    <form onSubmit={(e) => submitHandler(e)}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label>Title</label>
          <input
            type="text"
            value={EnteredTitle}
            onChange={titleChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>Amount</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={EnteredAmount}
            onChange={amountChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>Date</label>
          <input
            type="date"
            min="2019-01-01"
            max="2022-12-31"
            value={EnteredDate}
            onChange={dateChangeHandler}
          />
        </div>
        <div className="btn-container">
          <button className="btn btn-dark" onClick={props.onCancle}>
            Cancle
          </button>
          <button className="btn btn-blue">Add Expense</button>
        </div>
      </div>
    </form>
  );
};
//////////////////////////////////////////
const ExpensesChart = (props) => {
  const chartDataPoints = [
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 0 },
    { label: "May", value: 0 },
    { label: "Jun", value: 0 },
    { label: "Jul", value: 0 },
    { label: "Aug", value: 0 },
    { label: "Sep", value: 0 },
    { label: "Oct", value: 0 },
    { label: "Nov", value: 0 },
    { label: "Dec", value: 0 },
  ];

  for (const expense of props.expenses) {
    const expenseMonth = expense.date.getMonth(); // starting at 0 => January => 0
    chartDataPoints[expenseMonth].value += expense.amount;
  }

  return <Chart dataPoints={chartDataPoints} />;
};
const Chart = (props) => {
  const dataPointValue = props.dataPoints.map((dataPoint) => dataPoint.value);
  const totalMaximum = Math.max(...dataPointValue);
  return (
    <div className="chart">
      {props.dataPoints.map((dataPoint) => (
        <CharBar
          key={dataPoint.label}
          value={dataPoint.value}
          maxValue={totalMaximum}
          label={dataPoint.label}
        />
      ))}
    </div>
  );
};
const CharBar = (props) => {
  let barFilterHeight = "0%";
  if (props.maxValue > 0) {
    barFilterHeight = Math.round((props.value / props.maxValue) * 100) + "%";
  }
  return (
    <div className="chart-bar">
      <div className="chart-bar__inner">
        <div
          className="chart-bar__fill"
          style={{ height: barFilterHeight }}
        ></div>
      </div>
      <div className="chart-bar__label">{props.label}</div>
    </div>
  );
};
//////////////////////////////////////////
const List = (props) => {
  const [filteredYear, setfilteredYear] = useState("2020");
  const filterChangeHandler = (selectedYear) => {
    setfilteredYear(selectedYear);
  };
  const filteredExpenses = props.listData.filter((expense) => {
    return expense.date.getFullYear().toString() === filteredYear;
  });

  return (
    <div className="list-container">
      <FilterYears
        selected={filteredYear}
        onChangeFilter={filterChangeHandler}
      />
      <ExpensesChart expenses={filteredExpenses} />
      <ListItems filteredExpenses={filteredExpenses} />
    </div>
  );
};
const ListItems = (props) => {
  const expensesContent =
    props.filteredExpenses.length > 0 ? (
      props.filteredExpenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          title={expense.title}
          amount={expense.amount}
          date={expense.date}
        />
      ))
    ) : (
      <p className="empty-message">no expenses to show</p>
    );
  return <div className="list">{expensesContent}</div>;
};
//////////////////////////////////////////
const FilterYears = (props) => {
  const deopdownChangHandler = (e) => {
    props.onChangeFilter(e.target.value);
  };
  return (
    <div className="flex">
      <label className="filter__title">Filter by year</label>
      <select
        value={props.selected}
        onChange={deopdownChangHandler}
        className="select"
      >
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
        <option value="2019">2019</option>
      </select>
    </div>
  );
};
//////////////////////////////////////////

const ExpenseItem = (props) => {
  const [title, setTitle] = useState(props.title);
  const clickHandler = () => {
    setTitle("Updated");
  };
  return (
    <div className="list-item">
      <ExpenseDate date={props.date} />
      <div className="list-item-box">
        <h2 className="list-item__title">{title}</h2>
        <div className="list-item__price">${props.amount}</div>
      </div>
      {/* <button onClick={clickHandler}>Update</button> */}
    </div>
  );
};
//////////////////////////////////////////
const ExpenseDate = (props) => {
  const month = props.date.toLocaleString("en-US", { month: "long" });
  const day = props.date.toLocaleString("en-US", { day: "2-digit" });
  const year = props.date.getFullYear();
  return (
    <div className="list-item-date">
      <div className="month">{month}</div>
      <div className="year">{year}</div>
      <div className="day">{day}</div>
    </div>
  );
};
//////////////////////////////////////////

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
///////////////////////////////
reportWebVitals();
