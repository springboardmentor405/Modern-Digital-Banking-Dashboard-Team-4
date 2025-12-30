import React from "react";

/* Inline CSS to avoid integration errors */
const styles = {
  page: {
    padding: "24px",
    color: "#0f172a",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  createBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  summaryCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
  spent: { color: "#f97316" },
  remaining: { color: "#22c55e" },
  budgetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  budgetCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
  progressBar: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "6px",
    margin: "10px 0",
  },
  progress: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "6px",
  },
  badgeGreen: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  badgeYellow: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },
};

const budgets = [
  { name: "Food & Dining", icon: "🍔", spent: 450, total: 500 },
  { name: "Shopping", icon: "🛍️", spent: 320, total: 400 },
  { name: "Transportation", icon: "🚗", spent: 180, total: 300 },
  { name: "Entertainment", icon: "🎬", spent: 95, total: 150 },
  { name: "Utilities", icon: "⚡", spent: 240, total: 250 },
  { name: "Healthcare", icon: "🏥", spent: 120, total: 200 },
];

const Budgets = () => {
  const totalBudget = budgets.reduce((a, b) => a + b.total, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2>Budgets</h2>
          <p>Monthly limits & spending overview</p>
        </div>
        <button style={styles.createBtn}>+ Create Budget</button>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <h4>Total Budget</h4>
          <h2>₹{totalBudget}</h2>
          <p>Across {budgets.length} categories</p>
        </div>

        <div style={styles.summaryCard}>
          <h4>Total Spent</h4>
          <h2 style={styles.spent}>₹{totalSpent}</h2>
          <p>{((totalSpent / totalBudget) * 100).toFixed(1)}% of budget</p>
        </div>

        <div style={styles.summaryCard}>
          <h4>Remaining</h4>
          <h2 style={styles.remaining}>₹{remaining}</h2>
          <p>Available to spend</p>
        </div>
      </div>

      {/* Budget Cards */}
      <div style={styles.budgetGrid}>
        {budgets.map((item, index) => {
          const used = (item.spent / item.total) * 100;
          const nearLimit = used >= 95;

          return (
            <div key={index} style={styles.budgetCard}>
              <h3>{item.icon} {item.name}</h3>
              <p>₹{item.spent} of ₹{item.total}</p>

              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progress,
                    width: `${used}%`,
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{used.toFixed(1)}% used</span>
                <span style={nearLimit ? styles.badgeYellow : styles.badgeGreen}>
                  {nearLimit ? "Near Limit" : "On Track"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;
