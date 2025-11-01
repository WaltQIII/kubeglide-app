# Port Conflict Resolution: Fixing "Port 5432 Already Allocated"

This document outlines the diagnosis, remediation, and validation steps to resolve the port conflict for the `db` service in the Kubeglide-App project.

## 1. Diagnosis

The following commands were used to identify the process using TCP port 5432.

### Docker

**Command:**
```bash
sudo docker ps --filter "publish=5432" --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}"
```

**Sample Output (No Conflict):**
```
CONTAINER ID   NAMES     PORTS
```

### WSL2

**Command:**
```bash
ss -lptn 'sport = :5432' || sudo lsof -iTCP:5432 -sTCP:LISTEN
```

**Sample Output (No Conflict):**
```
State      Recv-Q     Send-Q         Local Address:Port          Peer Address:Port     Process
```

### Windows Host (PowerShell)

**Command to find the process ID:**
```powershell
Get-NetTCPConnection -LocalPort 5432 -State Listen | Select-Object -First 1 -ExpandProperty OwningProcess
```
**Command to find the process name from the ID:**
```powershell
Get-Process -Id <PID_FROM_PREVIOUS_COMMAND>
```

**Sample Output (Conflict Found):**
```powershell
# First command output
1234

# Second command output
Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
    850      50   150152     185224       2.41   1234   1 postgres
```

## 2. Fix Applied

Based on the project requirements and best practices for containerized development, **Option A** was chosen. The `ports` mapping for the `db` service was removed from the `docker-compose.yml` file.

**Reasoning:**
*   **Isolation:** This prevents the containerized Postgres instance from conflicting with any other Postgres instances running on the Windows host or in WSL.
*   **Security:** It's more secure to not expose the database port to the host machine unless it's explicitly required for external tools.
*   **Project Requirements:** The backend service is designed to connect to the database using Docker's internal network (`db:5432`), so exposing the port on the host is unnecessary for the application to function.

## 3. Updated `docker-compose.yml`

The following snippet shows the updated `db` and `backend` services in `docker-compose.yml`.

```yaml
services:
  # ... other services
  backend:
    # ... other backend config
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: strapipassword
      POSTGRES_DB: strapi
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U strapi -d strapi"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - strapi-data:/var/lib/postgresql/data
```

## 4. Validation Checklist

To ensure the fix is working correctly, follow these steps:

1.  **Clean Recreate:**
    ```bash
    sudo docker compose down -v --remove-orphans
    sudo docker compose --profile dev up --build
    ```
2.  **Confirm Healthcheck:**
    *   Check the logs for the `db` service and confirm that the health check is passing.
    *   Look for a log line in the `backend` service that indicates a successful database connection.

3.  **Confirm Application Loads:**
    *   Access the frontend at `http://localhost:8080` and ensure the application loads and functions as expected.

## 5. Preventing Recurrence

*   **Avoid Multiple Stacks:** Be mindful of running multiple Docker Compose projects that might try to bind to the same default ports (e.g., 5432 for Postgres, 3306 for MySQL).
*   **Manage Windows Services:** If you have a native Postgres installation on Windows, ensure the service is stopped (`Stop-Service postgresql-x64-14`) and disabled (`Set-Service postgresql-x64-14 -StartupType Disabled`) during Docker development to prevent conflicts.
