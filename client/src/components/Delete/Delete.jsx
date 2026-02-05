import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AppContext from "../../context/app.context";
import { toast } from "react-toastify";
import "./Delete.css";

const DeleteExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch expense details (optional but nice UX)
  const fetchExpense = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/expenses/${id}`,
        { withCredentials: true }
      );

      if (data.success) {
        setExpense(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch expense");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/v1/expenses/delete/${id}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Expense deleted successfully");
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="delete-page">
      <div className="delete-card">
        <h2>Delete Expense</h2>

        {expense && (
          <div className="expense-preview">
            <p><strong>Title:</strong> {expense.title}</p>
            <p><strong>Amount:</strong> ₹{expense.amount}</p>
            <p><strong>Category:</strong> {expense.category}</p>
            <p><strong>Date:</strong> {new Date(expense.date).toDateString()}</p>
          </div>
        )}

        <p className="warning-text">
          ⚠️ Are you sure you want to delete this expense? This action can be undone only if you restore it.
        </p>

        <div className="delete-actions">
          <button className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpense;
