import React from 'react';
import "./Dashboard.css";
import axios from 'axios';
import Summary from '../expenseOverview/Summary.jsx';
import ExpensesList from '../ListAllExpense/ExpensesList.jsx';


const Dashboard = () => {
  return (
    <div>
        <h1>Expenses Board</h1>
        <Summary/>
        <ExpensesList/>
        

    </div>
  )
}

export default Dashboard