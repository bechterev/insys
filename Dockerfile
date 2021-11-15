version: "1.0"
services:
  postgres:
    image: postgres:12-alpine
    environment:
      POSTGRES_DB: "insys"
      POSTGRES_USER: "postgres"
      POSTGRES_PASSWORD: "noV2021"
    ports:
      - "5435:5432"