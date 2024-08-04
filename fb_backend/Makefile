PYTHON:=python
PIPENV:=pipenv
SRC_DIR:=src

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


# Setup pipenv environment and git hooks
install:
	@$(PIPENV) install --dev
	@pre-commit install
.PHONY: install


# Clean up
clean:
	@rm -rf build docs dist *.egg-info
	@rm -rf .mypy_cache .pytest_cache .venv Pipfile.lock
	@find . -type d -name '__pycache__' -exec rm -rf {} +
	@find . -type f -name '*.pyc' -delete
	@find . -type f -name '*.pyo' -delete
.PHONY: clean


# Lint the code
lint:
	@$(PIPENV) run flake8 $(SRC_DIR)
.PHONY: lint


# Run tests
test:
	@PYTHONPATH=$(SRC_DIR) $(PIPENV) run pytest
.PHONY: test


# List outdated dependencies
outdated:
	@pipenv install --dev
	@pipenv update --outdated
.PHONY outdated:


# Run the application
run:
	@$(PIPENV) run uvicorn src.main:app --host 0.0.0.0 --port 2482 --reload
.PHONY: run
