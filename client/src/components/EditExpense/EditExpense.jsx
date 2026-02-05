import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../../context/app.context";
import { toast } from "react-toastify";
import "./EditExpense.css";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);

  // 1 Fetch expense by ID
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/expenses/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          const exp = response.data.data;
          setFormData({
            title: exp.title,
            amount: exp.amount,
            type: exp.type,
            category: exp.category,
            date: exp.date.slice(0, 10), // for input[type=date]
            notes: exp.notes || "",
          });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, backendUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2️ Update expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/expenses/update/${id}`,
        { ...formData, amount: Number(formData.amount) },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Expense updated successfully!");
        navigate("/dashboard"); // or wherever your list page is
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  return (
  <div className="expense-page">
    <div className="expense-card">
      <h2>Edit Expense</h2>

      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
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
          <input name="category" value={formData.category} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} />
        </div>

        <button className="submit-btn" type="submit">
          Update Expense
        </button>

        <button className="cancel-btn" type="button" onClick={() => navigate("/dashboard")}>
          Cancel
        </button>
      </form>
    </div>
  </div>
);
}

export default EditExpense