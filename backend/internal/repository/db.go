package repository

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB() error {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/modiryar?sslmode=disable"
	}

	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		return fmt.Errorf("unable to parse database URL: %w", err)
	}

	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = 30 * time.Minute

	DB, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %w", err)
	}

	if err := DB.Ping(context.Background()); err != nil {
		return fmt.Errorf("unable to ping database: %w", err)
	}

	log.Println("✅ Connected to PostgreSQL successfully")
	return nil
}

func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}

func RunMigrations() error {
	queries := []string{
		`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
		`CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255) NOT NULL,
			role VARCHAR(50) DEFAULT 'user',
			created_at TIMESTAMP DEFAULT NOW()
		)`,
		`CREATE TABLE IF NOT EXISTS projects (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name VARCHAR(255) NOT NULL,
			manager VARCHAR(255) DEFAULT '',
			start_date VARCHAR(50) DEFAULT '',
			end_date VARCHAR(50) DEFAULT '',
			budget DECIMAL(15,0) DEFAULT 0,
			income DECIMAL(15,0) DEFAULT 0,
			expense DECIMAL(15,0) DEFAULT 0,
			progress INT DEFAULT 0,
			status VARCHAR(50) DEFAULT 'active',
			province VARCHAR(100) DEFAULT '',
			domain VARCHAR(100) DEFAULT '',
			created_by UUID REFERENCES users(id),
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		)`,
		`CREATE TABLE IF NOT EXISTS project_tasks (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
			name VARCHAR(255) NOT NULL,
			responsible VARCHAR(255) DEFAULT '',
			progress INT DEFAULT 0,
			status VARCHAR(50) DEFAULT 'pending',
			order_index INT DEFAULT 0,
			created_at TIMESTAMP DEFAULT NOW()
		)`,
		`CREATE TABLE IF NOT EXISTS project_participants (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
			name VARCHAR(255) NOT NULL,
			role VARCHAR(100) DEFAULT '',
			email VARCHAR(255) DEFAULT '',
			phone VARCHAR(20) DEFAULT '',
			created_at TIMESTAMP DEFAULT NOW()
		)`,
	}
	for _, q := range queries {
		if _, err := DB.Exec(context.Background(), q); err != nil {
			return fmt.Errorf("migration failed: %w", err)
		}
	}
	log.Println("✅ Migrations complete")
	return nil
}