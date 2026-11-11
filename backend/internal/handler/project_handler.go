package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

var projects = []map[string]interface{}{
	{"id": "1", "name": "پروژه مشهد", "manager": "علی", "progress": 75, "budget": 500, "income": 320, "expense": 180, "province": "مشهد", "domain": "فناوری", "tasks_count": 10, "status": "active", "start_date": "۱۴۰۴/۰۱/۱۵", "end_date": "۱۴۰۴/۰۶/۳۰"},
	{"id": "2", "name": "پروژه تهران", "manager": "سارا", "progress": 60, "budget": 420, "income": 250, "expense": 170, "province": "تهران", "domain": "شبکه", "tasks_count": 8, "status": "active", "start_date": "۱۴۰۴/۰۲/۰۱", "end_date": "۱۴۰۴/۰۸/۱۵"},
	{"id": "3", "name": "پروژه اصفهان", "manager": "دانیال", "progress": 80, "budget": 380, "income": 300, "expense": 200, "province": "اصفهان", "domain": "اتوماسیون", "tasks_count": 9, "status": "active", "start_date": "۱۴۰۳/۱۲/۰۱", "end_date": "۱۴۰۴/۰۴/۳۰"},
	{"id": "4", "name": "پروژه شیراز", "manager": "مریم", "progress": 45, "budget": 650, "income": 200, "expense": 150, "province": "شیراز", "domain": "امنیت", "tasks_count": 12, "status": "active", "start_date": "۱۴۰۴/۰۳/۰۱", "end_date": "۱۴۰۴/۰۹/۳۰"},
	{"id": "5", "name": "پروژه تبریز", "manager": "رضا", "progress": 100, "budget": 300, "income": 300, "expense": 280, "province": "تبریز", "domain": "داده", "tasks_count": 6, "status": "completed", "start_date": "۱۴۰۳/۰۹/۰۱", "end_date": "۱۴۰۴/۰۲/۱۵"},
}

func ListProjectsHandler(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]interface{}{"projects": projects})
}

func CreateProjectHandler(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	req["id"] = uuid.New().String()
	req["progress"] = 0
	req["status"] = "active"
	req["tasks_count"] = 0
	req["income"] = 0
	req["expense"] = 0
	req["created_at"] = time.Now().Format("2006-01-02")
	projects = append([]map[string]interface{}{req}, projects...)
	writeJSON(w, http.StatusCreated, req)
}

func GetProjectHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	for _, p := range projects {
		if p["id"] == id {
			writeJSON(w, http.StatusOK, p)
			return
		}
	}
	writeError(w, http.StatusNotFound, "پروژه یافت نشد")
}

func UpdateProjectHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	for i, p := range projects {
		if p["id"] == id {
			for k, v := range req {
				projects[i][k] = v
			}
			writeJSON(w, http.StatusOK, projects[i])
			return
		}
	}
	writeError(w, http.StatusNotFound, "پروژه یافت نشد")
}

func DeleteProjectHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	for i, p := range projects {
		if p["id"] == id {
			projects = append(projects[:i], projects[i+1:]...)
			writeJSON(w, http.StatusOK, map[string]string{"message": "حذف شد"})
			return
		}
	}
	writeError(w, http.StatusNotFound, "پروژه یافت نشد")
}