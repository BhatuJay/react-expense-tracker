import "../pages/AddExpense.css";
import axios from "axios";
import { useFormInput } from "../hooks/useFormInput";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export function AddExpense({ handleAddExpenseClose, editingExpense, refreshExpenses }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const description = useFormInput("", (val) => val.trim() !== "", "Description is required");
    const category = useFormInput("Food", (val) => val.trim() !== "", "Category is required");
    const date = useFormInput("", (val) => val.trim() !== "", "Date is required");
    const amount = useFormInput("", (val) => !isNaN(val) && Number(val) > 0, "Valid amount is required");
    const type = useFormInput("expense", (val) => val === "income" || val === "expense", "Type is required");

    const resetForm = () => {
        description.setValue("");
        category.setValue("Food");
        date.setValue("");
        amount.setValue("");
        type.setValue("expense");

        description.setError("");
        category.setError("");
        date.setError("");
        amount.setError("");
        type.setError("");
    };

    useEffect(() => {
        if (editingExpense) {
            description.setValue(editingExpense.description || "");
            category.setValue(editingExpense.category || "Food");
            date.setValue(editingExpense.date || "");
            amount.setValue(editingExpense.amount || "");
            type.setValue(editingExpense.type || "expense");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingExpense]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputs = [description, category, date, amount, type];
        const allValid = inputs.every((input) => {
            if (!input.value || (input.error && input.error !== "")) {
                input.setError("This field is required");
                return false;
            }
            return true;
        });

        if (!allValid) return;

        const expenseData = {
            description: description.value,
            category: category.value,
            date: date.value,
            amount: Number(amount.value),
            type: type.value,
        };

        setIsSubmitting(true);

        try {
            if (editingExpense) {
                await axios.put(
                    `https://686faa6c91e85fac42a203ee.mockapi.io/expense/${editingExpense.id}`,
                    expenseData
                );
                toast.success("Expense updated successfully!");
            } else {
                await axios.post(
                    "https://686faa6c91e85fac42a203ee.mockapi.io/expense",
                    expenseData
                );
                toast.success("Expense added successfully!");
            }

            if (typeof refreshExpenses === "function") {
                await refreshExpenses();
            }

            resetForm();
            setTimeout(() => {
                handleAddExpenseClose();
            }, 1000);
        } catch (err) {
            console.error("Error submitting expense:", err);
            toast.error("Failed to submit expense. Try again.");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="add-expense-modalOverlay">
            <div className="add-expense-modal">
                <h1>{editingExpense ? "Edit Expense" : "Add Expense"}</h1>
                <p className="para">{editingExpense ? "Update existing expense" : "Let's add new expense"}</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <input
                            autoFocus
                            className={description.error ? "invalid-input" : "input"}
                            type="text"
                            id="description"
                            placeholder="Description"
                            {...description}
                        />
                        <p className="register-error">{description.error}</p>
                    </div>

                    <div>
                        <label htmlFor="category">Category:</label>
                        <select
                            className={category.error ? "invalid-input" : "input"}
                            id="category"
                            {...category}
                        >
                            <option>Food</option>
                            <option>Shopping</option>
                            <option>Transportation</option>
                            <option>Education</option>
                            <option>Phone Bill</option>
                            <option>Entertainment</option>
                            <option>Medical</option>
                        </select>
                        <p className="register-error">{category.error}</p>
                    </div>

                    <div>
                        <label htmlFor="date">Date:</label>
                        <input
                            className={date.error ? "invalid-input" : "input"}
                            type="date"
                            id="date"
                            placeholder="Date"
                            {...date}
                        />
                        <p className="register-error">{date.error}</p>
                    </div>

                    <div>
                        <label htmlFor="amount">Amount:</label>
                        <input
                            className={amount.error ? "invalid-input" : "input"}
                            type="number"
                            id="amount"
                            placeholder="Amount"
                            {...amount}
                        />
                        <p className="register-error">{amount.error}</p>
                    </div>

                    <div>
                        <label>Type:</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={type.value === "expense"}
                                    onChange={type.onChange}
                                    onBlur={type.onBlur}
                                />
                                Expense
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={type.value === "income"}
                                    onChange={type.onChange}
                                    onBlur={type.onBlur}
                                />
                                Income
                            </label>
                        </div>
                        <p className="register-error">{type.error}</p>
                    </div>

                    <div className="add-expense-btn-grp">
                        <button type="button" className="btn-blue" onClick={handleAddExpenseClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-red" disabled={isSubmitting}>
                            {isSubmitting
                                ? editingExpense
                                    ? "Updating..."
                                    : "Submitting..."
                                : editingExpense
                                    ? "Update"
                                    : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}