package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	"modiryar/internal/handler"
	"modiryar/internal/middleware"
	"modiryar/internal/repository"
)

func main() {
	godotenv.Load()

	// Database (optional - works without it for demo)
	if err := repository.ConnectDB(); err != nil {
		log.Println("⚠️  Database not available, using in-memory data")
	} else {
		defer repository.CloseDB()
		repository.RunMigrations()
	}

	r := chi.NewRouter()

	// Middleware
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.Timeout(30 * time.Second))

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{frontendURL},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// Health
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","service":"modiryar-api"}`))
	})

	// API Routes
	r.Route("/api/v1", func(r chi.Router) {
		// Public
		r.Post("/auth/login", handler.LoginHandler)
		r.Post("/auth/register", handler.RegisterHandler)

		// Protected
		r.Group(func(r chi.Router) {
			r.Use(middleware.AuthMiddleware)

			r.Get("/dashboard", handler.DashboardHandler)

			r.Get("/projects", handler.ListProjectsHandler)
			r.Post("/projects", handler.CreateProjectHandler)
			r.Get("/projects/{id}", handler.GetProjectHandler)
			r.Put("/projects/{id}", handler.UpdateProjectHandler)
			r.Delete("/projects/{id}", handler.DeleteProjectHandler)

			r.Get("/projects/{id}/tasks", handler.ListTasksHandler)
			r.Post("/projects/{id}/tasks", handler.CreateTaskHandler)
			r.Put("/tasks/{id}", handler.UpdateTaskHandler)
			r.Delete("/tasks/{id}", handler.DeleteTaskHandler)

			r.Get("/participants", handler.ListParticipantsHandler)
			r.Post("/participants", handler.CreateParticipantHandler)
			r.Delete("/participants/{id}", handler.DeleteParticipantHandler)

			r.Get("/reports/summary", handler.ReportsSummaryHandler)
		})
	})

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🚀 Modir Yar starting on http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}