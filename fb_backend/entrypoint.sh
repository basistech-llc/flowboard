#!/bin/sh

# The key purpose of this file is to isolate .venv in the docker container from the copy
# on the host. This is critical for native libraries running on Apple silicon.

if [ ! -e Pipfile.lock ] || [ Pipfile -nt Pipfile.lock ] || [ ! -d .venv ] || [ -z "$(ls -A .venv)" ]; then
    echo "ENTRYPOINT Generating Pipfile.lock..."
    pipenv lock
    pipenv install --dev
fi

echo "ENTRYPOINT Starting the application..."

exec pipenv run python -c "
import uvicorn
uvicorn.run('src.main:app', host='0.0.0.0', port=${FB_BACKEND_PORT}, reload=True)
"
