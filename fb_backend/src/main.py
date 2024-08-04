"""[TODO] Fill in this stub."""

from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile, Query
from fastapi.responses import StreamingResponse
from starlette.middleware.gzip import GZipMiddleware


from degel_python_utils import appEnv, setup_logger

APP_NAME = "BasisTech Flowboard CRM Manager"
APP_DESCRIPTION = (
    "Tools for maintaining the BasisTech LLC contact list and investment funnel"
)

logger = setup_logger(__name__)
# pylint: disable=logging-fstring-interpolation


@asynccontextmanager
async def server_lifespan(_: FastAPI):
    """Handle setup and teardown of server."""
    appEnv.set_app_name(APP_NAME)
    appEnv.show_env()
    logger.info(f"{APP_NAME} ready")

    yield

    logger.major("Shut down server")


app = FastAPI(
    title=APP_NAME,
    description=APP_DESCRIPTION,
    version="1.0",
    lifespan=server_lifespan,
    openapi_tags=[
        {"name": "API", "description": "Catch-all for now"},
    ],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/hello_world/", tags=["API"], summary="Toy endpoint")
async def process_file() -> str:
    return "Hi there"


# ###  # Run the application with Uvicorn
# ### if __name__ == "__main__":
# ###     import uvicorn
# ###
# ###     uvicorn.run(app, host="0.0.0.0", port=8000)
