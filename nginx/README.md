# Nginx Setup for Bookzy

This directory contains the Nginx configuration needed to serve the Bookzy application as a unified platform on port `80`.

## Why Nginx?
We are running two separate development servers:
- **Frontend** (Vite + React) runs on `localhost:5173`
- **Backend** (Spring Boot + MySQL) runs on `localhost:8080`

Nginx acts as a **Reverse Proxy**, combining them into a single entry point (`http://localhost`):
- `http://localhost/` -> goes to Frontend
- `http://localhost/api/` -> goes to Backend

This prevents CORS issues and perfectly mimics a production environment.

## How to use on Windows

1. **Download Nginx:**
   - Go to http://nginx.org/en/download.html
   - Download the latest stable version for Windows (e.g., `nginx-1.24.0.zip`).
   
2. **Extract:**
   - Extract the zip file (e.g., to `C:\nginx`).

3. **Configure:**
   - Copy the `nginx.conf` file from this folder.
   - Replace the default `C:\nginx\conf\nginx.conf` with this file.

4. **Start Nginx:**
   - Open Command Prompt or PowerShell.
   - Navigate to the Nginx folder: `cd C:\nginx`
   - Run: `start nginx`

5. **Stop Nginx:**
   - Run: `nginx -s stop`
