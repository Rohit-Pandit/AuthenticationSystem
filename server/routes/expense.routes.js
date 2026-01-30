import express from "express";

import { createExpense, 
        getAllExpenses,
        getExpenseById,
        updateExpense,
        deleteExpense,
        getExpenseSummary,
        getCategoryWiseExpenses,
        getMonthlyExpenseSummary,
        restoreDeletedExpense
 } from "../controller/expense.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/create-expense", authMiddleware, createExpense);

router.get("/all-expenses", authMiddleware, getAllExpenses);
router.get("/summary", authMiddleware, getExpenseSummary);
router.get("/category-summary", authMiddleware, getCategoryWiseExpenses);
router.get("/monthly-summary", authMiddleware, getMonthlyExpenseSummary);

router.patch("/restore/:id", authMiddleware, restoreDeletedExpense);
router.put("/update/:id", authMiddleware, updateExpense);
router.delete("/delete/:id", authMiddleware, deleteExpense);

router.get("/:id", authMiddleware, getExpenseById); // ✅ ALWAYS LAST


export default router;