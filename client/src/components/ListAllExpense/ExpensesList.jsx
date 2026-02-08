import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AppContext from "../../context/app.context";
import { toast } from "react-toastify";
import "./ExpensesList.css";
import { useNavigate } from "react-router-dom";

const ExpensesList = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/v1/expenses/all-expenses?page=${pageNumber}&limit=${limit}`,
        { withCredentials: true },
      );

      if (response.data.success) {
        // Adjust this according to your backend response
        setExpenses(response.data.data.expenses || response.data.data);
        setTotalPages(response.data.data.totalPages || 1);
        setPage(pageNumber);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(1);
  }, []);

  const handlePrev = () => {
    if (page > 1) {
      fetchExpenses(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      fetchExpenses(page + 1);
    }
  };

  return (
    <div className="expenses-page">
      <h2>Your Expenses</h2>

      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        <>
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date (MM DD YYYY)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{exp.title}</td>
                  <td>{exp.amount}</td>
                  <td>{exp.type}</td>
                  <td>{exp.category}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>
                   
                      <button
                        className="action-btn edit-btn"
                        onClick={() => navigate(`/expenses/${exp._id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => navigate(`/expenses/${exp._id}/delete`)}
                      >
                        Delete
                      </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 1}>
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpensesList;
