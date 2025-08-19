import { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { AddExpense } from "./AddExpense";
import PieChart from "../components/PieChart";
import PieIcon from "../assets/pie-chart-32px.png"

export function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [editingExpense, setEditingExpense] = useState(null);
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [openPieChart, setOpenPieChart] = useState(false);

    // Fetch expenses from API
    const refreshExpenses = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://686faa6c91e85fac42a203ee.mockapi.io/expense");
            // Sort by latest first
            setExpenses(res.data.reverse());
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshExpenses();
    }, []);

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    const filteredExpenses = expenses.filter((expense) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            expense.description?.toLowerCase().includes(search) ||
            expense.category?.toLowerCase().includes(search) ||
            expense.type?.toLowerCase().includes(search) ||
            String(expense.amount).includes(search);

        const matchesCategory =
            selectedCategory === "All" || expense.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setOpenAddExpense(true);
    };

    const handleAddExpenseClose = () => {
        setEditingExpense(null);
        setOpenAddExpense(false);
    };

    const handlePieChartClose = () => {
        setOpenPieChart(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://686faa6c91e85fac42a203ee.mockapi.io/expense/${id}`);
            setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        } catch (error) {
            console.error("Failed to delete expense:", error);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <>
            <div className="home-bg">
                <div className="heading-body">
                    <div className="total-expense-body">
                        <h3>Total monthly expense</h3>
                        <h1>₹ {totalExpense}</h1>
                    </div>
                    <div className="search-body">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            className="dropdown"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Food">Food</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Education">Education</option>
                            <option value="Phone Bill">Phone Bill</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Medical">Medical</option>
                        </select>
                    </div>
                </div>

                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={8} className="empty-expense-table">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && selectedExpenses.length === 0 && (
                            <tr>
                                <td colSpan={8} className="empty-expense-table">
                                    No Expenses Added.
                                </td>
                            </tr>
                        )}

                        {selectedExpenses.map((expense, index) => (
                            <tr key={expense.id}>
                                <td>{startIndex + index + 1}</td>
                                <td>{expense.description}</td>
                                <td>{expense.category}</td>
                                <td>{expense.date}</td>
                                <td>₹{expense.amount}</td>
                                <td>{expense.type}</td>
                                <td>
                                    <button className="btn-blue" onClick={() => handleEdit(expense)}>
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button className="btn-red" onClick={() => handleDelete(expense.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedExpenses.length > 0 && (
                    <div className="pagination">
                        <button
                            className={currentPage === 1 ? "btn-blue-disable" : "btn-blue"}
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >Previous
                        </button>
                        {currentPage}
                        <button
                            className={currentPage === totalPages ? "btn-red-disable" : "btn-red"}
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >Next
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            {/* FAB for Pie Chart */}
            <button
                className={`fab pie-fab ${openPieChart ? "fab-open" : ""}`}
                onClick={() => setOpenPieChart(!openPieChart)}
                aria-label={openPieChart ? "Close Chart" : "View Chart"}
                title={openPieChart ? "Close Chart" : "View Chart"}
            >
                <img className="fab-icon" src={PieIcon} />
            </button>

            {/* FAB for Add Expense */}
            <button
                className={`fab ${openAddExpense ? "fab-open" : ""}`}
                onClick={() => setOpenAddExpense(!openAddExpense)}
                aria-label={openAddExpense ? "Close Expense" : "Add Expense"}
                title={openAddExpense ? "Close Expense" : "Add Expense"}
            >
                <span className="fab-icon">+</span>
            </button>


            {/* Modal */}
            {openPieChart && (
                <PieChart
                    handlePieChartClose={handlePieChartClose}
                />
            )}
            {openAddExpense && (
                <AddExpense
                    handleAddExpenseClose={handleAddExpenseClose}
                    editingExpense={editingExpense}
                    setExpenses={setExpenses}
                    refreshExpenses={refreshExpenses}
                />
            )}
        </>
    );
}