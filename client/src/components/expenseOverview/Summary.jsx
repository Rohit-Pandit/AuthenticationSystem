import React from "react";
import "./Summary.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/app.context.js";
import { useNavigate } from "react-router-dom";
import AddExpense from "../AddExpense/AddExpense.jsx";

const Summary = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/expenses/summary`,
          {
            withCredentials: true,
          },
        );
        const data = response.data.data;
        console.log("Summary Data:", response.data);
        setSummaryData(data);
      } catch (error) {
        toast.error("Failed to fetch summary data");
      }
    };
    fetchSummaryData();
  }, [backendUrl]);
  return (
    <div className="overview-container">
      {/* Header */}
      <div className="overview-header">
        <h2>Expenses Overview</h2>

        <div className="actions">
          <button className="btn-outline">Change plans</button>
          <button
            className="btn-primary"
            onClick={() => navigate("/add-expense",{
              state : { summaryData : summaryData },
            })}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="overview-cards">
        <div className="card blue">
          <p>Your balance</p>
          <h3>₹ {summaryData.balance}</h3>
        </div>

        <div className="card purple">
          <p>Total Income</p>
          <h3>₹ {summaryData.totalIncome}</h3>
        </div>

        <div className="card dark">
          <p>Total Expense</p>
          <h3>₹ {summaryData.totalExpense}</h3>
        </div>
      </div>
    </div>
  );
};

export default Summary;
