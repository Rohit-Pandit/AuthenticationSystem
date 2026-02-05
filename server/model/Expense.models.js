import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    title : {
        type : String,
        required : true,
        trim : true,
    },
    amount : {
        type : Number,
        required : true,
        min : 0,
    },
    type : {
        type : String,
        enum : ["income","expense"],
        required : true,
    },
    category : {
        type : String,
        enum : ["Food🍔","Transport🚕","Rent🏠","Shopping🛍️","Healthcare🏥","Entertainment🎮","Bills💡","Salary💼", "Credits💰","Groceries🛒","Education🎓","Other📦"],
        required : true
    },
    date : {
        type : Date,  // we r using ISO standard [yyyy-mm-dd]
        required : true,
    },
    notes : {
        type : String
    },
    isDeleted : {
        type : Boolean,
        default : false
    }

},{timestamps : true});

const Expense = mongoose.model("Expense",expenseSchema);

export default Expense