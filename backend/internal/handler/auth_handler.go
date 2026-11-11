package handler

import (
	"encoding/json"
	"net/http"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	if req.Email == "admin@modiryar.ir" && req.Password == "admin123" {
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"token": "demo-token-modiryar-admin",
			"user": map[string]interface{}{
				"id":    "550e8400-e29b-41d4-a716-446655440000",
				"email": "admin@modiryar.ir",
				"name":  "مدیر سیستم",
				"role":  "admin",
			},
		})
		return
	}

	if req.Email == "user@modiryar.ir" && req.Password == "user123" {
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"token": "demo-token-modiryar-user",
			"user": map[string]interface{}{
				"id":    "660e8400-e29b-41d4-a716-446655440001",
				"email": "user@modiryar.ir",
				"name":  "کاربر عادی",
				"role":  "user",
			},
		})
		return
	}

	writeError(w, http.StatusUnauthorized, "ایمیل یا رمز عبور اشتباه است")
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	if req.Email == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "ایمیل و رمز عبور الزامی است")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]string{"message": "ثبت‌نام با موفقیت انجام شد"})
}