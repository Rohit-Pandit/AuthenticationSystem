import React from 'react';
import "./Dashboard.css";
import axios from 'axios';
import Summary from '../expenseOverview/Summary.jsx';
import ExpensesList from '../ListAllExpense/ExpensesList.jsx';


const Dashboard = () => {
  return (
    <div>
        <Summary/>
        <ExpensesList/>
        

    </div>
  )
}

export default Dashboard