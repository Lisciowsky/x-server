postgres:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:14-alpine

createdb:
	docker exec -it postgres createdb --username=root --owner=root twitter_db

mockpostgres:
	docker run --name mockpostgres -p 5433:5432 -e POSTGRES_USER=testuser -e POSTGRES_PASSWORD=testpass -d postgres:14-alpine
mockdb:
	docker exec -it mockpostgres createdb --username=testuser --owner=testuser testdb


alembic:
	alembic revision --autogenerate -m "Initial migration"

pycache:
	find . -type d -name "__pycache__" -exec rm -r {} +

test:
	python run_tests.py