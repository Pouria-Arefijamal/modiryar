package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

var participants = []map[string]interface{}{
	{"id": "1", "project_id": "1", "name": "دانیال جی پارک", "role": "مشارکت‌کننده", "email": "danial@modiryar.ir", "phone": "۰۹۱۲۳۴۵۶۷۸۹", "project_name": "پروژه مشهد"},
	{"id": "2", "project_id": "2", "name": "مارک روخاس", "role": "مشارکت‌کننده", "email": "mark@modiryar.ir", "phone": "۰۹۱۲۳۴۵۶۷۸۹", "project_name": "پروژه تهران"},
	{"id": "3", "project_id": "1", "name": "اسکار", "role": "مدیر", "email": "oscar@modiryar.ir", "phone": "۰۹۱۲۳۴۵۶۷۸۹", "project_name": "پروژه مشهد"},
	{"id": "4", "project_id": "3", "name": "شخص ۱", "role": "مجری", "email": "person@modiryar.ir", "phone": "۰۹۱۲۳۴۵۶۷۸۹", "project_name": "پروژه اصفهان"},
}

func ListParticipantsHandler(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]interface{}{"participants": participants})
}

func CreateParticipantHandler(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	req["id"] = uuid.New().String()
	participants = append([]map[string]interface{}{req}, participants...)
	writeJSON(w, http.StatusCreated, req)
}

func DeleteParticipantHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	for i, p := range participants {
		if p["id"] == id {
			participants = append(participants[:i], participants[i+1:]...)
			writeJSON(w, http.StatusOK, map[string]string{"message": "حذف شد"})
			return
		}
	}
	writeError(w, http.StatusNotFound, "مشارکت‌کننده یافت نشد")
}