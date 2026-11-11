package model

import (
	"time"

	"github.com/google/uuid"
)

type Project struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	Manager    string    `json:"manager"`
	StartDate  string    `json:"start_date"`
	EndDate    string    `json:"end_date"`
	Budget     float64   `json:"budget"`
	Income     float64   `json:"income"`
	Expense    float64   `json:"expense"`
	Progress   int       `json:"progress"`
	Status     string    `json:"status"`
	Province   string    `json:"province"`
	Domain     string    `json:"domain"`
	CreatedBy  uuid.UUID `json:"created_by"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Task struct {
	ID          uuid.UUID `json:"id"`
	ProjectID   uuid.UUID `json:"project_id"`
	Name        string    `json:"name"`
	Responsible string    `json:"responsible"`
	Progress    int       `json:"progress"`
	Status      string    `json:"status"`
	OrderIndex  int       `json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
}

type Participant struct {
	ID          uuid.UUID `json:"id"`
	ProjectID   uuid.UUID `json:"project_id"`
	Name        string    `json:"name"`
	Role        string    `json:"role"`
	Email       string    `json:"email"`
	Phone       string    `json:"phone"`
	CreatedAt   time.Time `json:"created_at"`
}

type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Name         string    `json:"name"`
	Role         string    `json:"role"`
}

// Request/Response DTOs
type CreateProjectRequest struct {
	Name      string  `json:"name"`
	Manager   string  `json:"manager"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
	Budget    float64 `json:"budget"`
	Province  string  `json:"province"`
	Domain    string  `json:"domain"`
}

type CreateTaskRequest struct {
	Name        string `json:"name"`
	Responsible string `json:"responsible"`
}

type CreateParticipantRequest struct {
	Name      string `json:"name"`
	Role      string `json:"role"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	ProjectID string `json:"project_id"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type DashboardStats struct {
	TotalProjects    int     `json:"total_projects"`
	ActiveProjects   int     `json:"active_projects"`
	CompletedProjects int    `json:"completed_projects"`
	TotalBudget      float64 `json:"total_budget"`
	TotalIncome      float64 `json:"total_income"`
	TotalExpense     float64 `json:"total_expense"`
	TotalTasks       int     `json:"total_tasks"`
	TotalParticipants int    `json:"total_participants"`
	AvgProgress      float64 `json:"avg_progress"`
}