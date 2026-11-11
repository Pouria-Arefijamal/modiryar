package handler

import "net/http"

func ReportsSummaryHandler(w http.ResponseWriter, r *http.Request) {
	data := []map[string]interface{}{
		{"month": "فروردین", "income": 8500, "expense": 6200},
		{"month": "اردیبهشت", "income": 12000, "expense": 8500},
		{"month": "خرداد", "income": 9500, "expense": 7100},
		{"month": "تیر", "income": 15000, "expense": 10500},
	}

	var totalIncome, totalExpense float64
	for _, m := range data {
		totalIncome += m["income"].(float64)
		totalExpense += m["expense"].(float64)
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"monthly":       data,
		"total_income":  totalIncome,
		"total_expense": totalExpense,
		"net_profit":    totalIncome - totalExpense,
	})
}