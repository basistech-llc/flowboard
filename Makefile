# Define the Docker Compose project name
PROJECT_NAME = flowboard
BACKEND_SERVICE = fb_backend
BACKEND_DIR = fb_backend
NGINX_SERVICE = fb_nginx
DB_SERVICE = fb_db
DASHBOARD_SERVICE = fb_dashboard
DASHBOARD_DIR = fb_dashboard
DASHBOARD_CONTAINER = ${PROJECT_NAME}-${DASHBOARD_SERVICE}-1

.DEFAULT_GOAL := help

# Set the shell to run all recipe lines in a single shell session
.ONESHELL:

# Show this help message
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
	    helpMessage = match(lastLine, /^# (.*)/); \
	    if (helpMessage) { \
	        helpCommand = $$1; sub(/:$$/, "", helpCommand); \
	        printf "  %-20s %s\n", helpCommand, substr(lastLine, RSTART + 2, RLENGTH - 2); \
	    } \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ""
.PHONY: help

# Define a phony target to check whether the container is running
.container-check:
	if [ -z `docker ps -q -f name=${DASHBOARD_CONTAINER}` ]; then \
		echo "Starting container..."; $(MAKE) up; fi
.PHONY: .container-check

# Restart developmeent services
rebuild:
	$(MAKE) down
	$(MAKE) build
	$(MAKE) logs

# Build the docker image for the app
build:
	docker compose build
.PHONY: build

# Run the app in development mode
up:
	docker compose up -d
.PHONY: up

# Run the app and start showing the logs
up-logs:
	$(MAKE) up
	$(MAKE) logs
.PHONY: up-logs

# Stop and remove the running containers
down:
	docker compose down
.PHONY: down

# Show the logs (with '-f'-style ongoing results)
logs: .container-check
	docker compose logs -f $(DASHBOARD_SERVICE) $(BACKEND_SERVICE) $(NGINX_SERVICE)
.PHONY: logs

# Start a shell in the running container
shell: .container-check
	docker compose exec ${DASHBOARD_SERVICE} sh
.PHONY: shell

# Run tests
test: .container-check
	docker compose exec ${DASHBOARD_SERVICE} npm run test
.PHONY: test

# Remove all docker artifacts associated with this project
clean-all:
	docker compose down --volumes --remove-orphans
	docker rmi ${PROJECT_NAME}-${DASHBOARD_SERVICE}
.PHONY: clean-all
