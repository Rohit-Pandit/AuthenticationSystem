import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AppContext from "../../context/app.context.js";
import "./Restore.css";
import { useNavigate } from "react-router-dom";

const Restore = () => {
  const { backendUrl } = useContext(AppContext);
  const [deletedExpenses, setDeletedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDeletedExpenses = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/expenses/deleted-expenses`,
        { withCredentials: true },
      );

      if (data.success) {
        setDeletedExpenses(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch deleted expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedExpenses();
  }, []);

  const handleRestore = async (id) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/v1/expenses/restore/${id}`,
        {},
        { withCredentials: true },
      );

      if (data.success) {
        toast.success("Expense restored");
        // Remove restored item from list
        setDeletedExpenses((prev) => prev.filter((e) => e._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Restore failed");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="restore-page">
      <h2>🗑️ Trash (Deleted Expenses)</h2>
      <button className="navigate-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

      {deletedExpenses.length === 0 ? (
        <p>No deleted expenses 🎉</p>
      ) : (
        <table className="restore-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deletedExpenses.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.title}</td>
                <td>₹{exp.amount}</td>
                <td>{exp.category}</td>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="restore-btn"
                    onClick={() => handleRestore(exp._id)}
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Restore;
