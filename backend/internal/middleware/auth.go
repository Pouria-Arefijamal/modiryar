package middleware

import "net/http"

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		if token != "Bearer demo-token-modiryar-admin" && token != "Bearer demo-token-modiryar-user" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error":"دسترسی غیرمجاز"}`))
			return
		}
		next.ServeHTTP(w, r)
	})
}