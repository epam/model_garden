FROM python:3.8-slim
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    libssl-dev \
    postgresql-client

RUN mkdir /src
WORKDIR /src

COPY ./requirements.txt /src/
RUN pip install --no-cache-dir -U pip && pip install --no-cache-dir -r requirements.txt
COPY ./model_garden/ /src/model_garden/
COPY ./manage.py /src/
COPY ./worker.py /src/

RUN apt-get purge -y --auto-remove \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*
