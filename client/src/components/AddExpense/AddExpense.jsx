import React, { useState, useContext } from "react";
import axios from "axios";
import AppContext from "../../context/app.context";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddExpense.css";

const AddExpense = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const summaryData = location.state?.summaryData || {};

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === "expense" && summaryData) {
      const newBalance = summaryData.balance - Number(formData.amount);

      if (newBalance < 0) {
        const proceed = window.confirm(
          "⚠️ This expense will make your balance negative. Do you want to continue?",
        );

        if (!proceed) {
          setFormData({
          title: "",
          amount: "",
          type: "expense",
          category: "",
          date: "",
          notes: "",
        });
        navigate("/dashboard");
        return; // ❌ Stop submission
        }
      }
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/expenses/create-expense`,
        { ...formData, amount: Number(formData.amount) },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("Expense added successfully!");
        //reset form
        setFormData({
          title: "",
          amount: "",
          type: "expense",
          category: "",
          date: "",
          notes: "",
        });
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="add-expense-page">
      <div className="add-expense-card">
        <h2>Add Expense</h2>

        <form className="add-expense-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <button className="submit-btn" type="submit">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
