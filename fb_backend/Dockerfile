FROM python:3.12.1

LABEL maintainer="deg@basistech.com"
LABEL version="0.0.1"
LABEL description="TBD"

WORKDIR /fb_backend

RUN pip install --upgrade pip && \
    pip install pipenv

COPY Pipfile* ./
COPY entrypoint.sh entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
