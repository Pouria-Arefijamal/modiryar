package handler

import (
	"net/http"
)

func DashboardHandler(w http.ResponseWriter, r *http.Request) {
	stats := map[string]interface{}{
		"total_projects":     5,
		"active_projects":    4,
		"completed_projects": 1,
		"total_budget":       2250,
		"total_income":       1420,
		"total_expense":      980,
		"total_tasks":        45,
		"total_participants": 12,
		"avg_progress":       72,
	}
	writeJSON(w, http.StatusOK, stats)
}