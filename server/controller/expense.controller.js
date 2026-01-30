import Expense from "../model/Expense.models.js";
import mongoose from "mongoose";

const createExpense = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be income or expense",
      });
    }

    const expense = await Expense.create({
      userId: req.userId,
      title,
      amount,
      type,
      category,
      date,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.userId,
      isDeleted: false,
    }).sort({ date: -1 });
    if (expenses.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No expenses found for this user",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, userId: req.userId });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Expense retrieved successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be income or expense",
      });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true },
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { isDeleted: true },
      { new: true },
    );

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: deletedExpense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getExpenseSummary = async (req, res) => {
  //Total income, expense, balance
  try {
    const userId = req.userId;
    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
        },
      },
      { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } },
    ]);
    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach((item) => {
      if (item._id === "income") totalIncome = item.totalAmount;
      else if (item._id === "expense") totalExpense = item.totalAmount;
    });
    const balance = totalIncome - totalExpense;

    return res.status(200).json({
      success: true,
      message: "Expense summary retrieved successfully",
      data: {
        totalIncome,
        totalExpense,
        balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const getCategoryWiseExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const categoryWiseExpenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
          isDeleted: false,
        },
      },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
    ]);
    if (categoryWiseExpenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expenses found for this user",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category-wise expenses retrieved successfully",
      data: categoryWiseExpenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const getMonthlyExpenseSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const monthlyExpenseSummary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Monthly expense summary retrieved successfully",
      data: monthlyExpenseSummary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const restoreDeletedExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const restoredExpense = await Expense.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
    if (!restoredExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Expense restored successfully",
      data: restoredExpense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getCategoryWiseExpenses,
  getMonthlyExpenseSummary,
  restoreDeletedExpense,
};
