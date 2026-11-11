package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

var tasks = []map[string]interface{}{
	{"id": "1", "project_id": "1", "name": "تحلیل نیازمندی‌ها", "responsible": "دانیال", "progress": 100, "status": "done", "order_index": 1},
	{"id": "2", "project_id": "1", "name": "طراحی معماری", "responsible": "مارک", "progress": 80, "status": "in_progress", "order_index": 2},
	{"id": "3", "project_id": "1", "name": "پیاده‌سازی", "responsible": "علی", "progress": 40, "status": "in_progress", "order_index": 3},
}

func ListTasksHandler(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "id")
	var filtered []map[string]interface{}
	for _, t := range tasks {
		if t["project_id"] == projectID {
			filtered = append(filtered, t)
		}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"tasks": filtered})
}

func CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "id")
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	req["id"] = uuid.New().String()
	req["project_id"] = projectID
	req["progress"] = 0
	req["status"] = "pending"
	tasks = append(tasks, req)
	writeJSON(w, http.StatusCreated, req)
}

func UpdateTaskHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	for i, t := range tasks {
		if t["id"] == id {
			for k, v := range req { tasks[i][k] = v }
			writeJSON(w, http.StatusOK, tasks[i])
			return
		}
	}
	writeError(w, http.StatusNotFound, "فعالیت یافت نشد")
}

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	for i, t := range tasks {
		if t["id"] == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			writeJSON(w, http.StatusOK, map[string]string{"message": "حذف شد"})
			return
		}
	}
	writeError(w, http.StatusNotFound, "فعالیت یافت نشد")
}