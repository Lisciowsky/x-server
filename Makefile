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

nuke:
	aws-nuke-v2.25.0-linux-amd64 -c nuke-config.yaml --no-dry-run

infracost:
	infracost breakdown --show-skipped --path .

example_lambda:
	zip lambda_function.zip example_handler.py

coverage:
	coverage run -m pytest

html:
	coverage html

# package_lambda:
# 	mkdir -p "deployment_package"
# 	docker run --rm -v "$PWD":/var/task --entrypoint /bin/bash public.ecr.aws/lambda/python:3.11 -c "pip install -r requirements.txt -t /var/task/deployment_package/; exit"
# 	cp lambda_handler.py settings.py ./deployment_package/
# 	cp -r src/ "./deployment_package/"
# 	cd deployment_package && zip -r ../lambda_function.zip . && cd ..
# 	$(RM) -r "deployment_package/"

# push_packaged_lambda:
# 	aws s3 cp lambda_function.zip s3://x-server-packaged-lambda-code-bucket/lambda_function.zip

# Variables
AWS_REGION := eu-central-1
ECR_REPOSITORY_URI := 654654262492.dkr.ecr.eu-central-1.amazonaws.com/my-fastapi-app-repo
IMAGE_NAME := x-server
TAG := latest

build:
	docker build -t x-server .

# Log in to Amazon ECR
login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REPOSITORY_URI)

# Tag the local image for ECR
tag:
	docker tag $(IMAGE_NAME):$(TAG) $(ECR_REPOSITORY_URI):$(TAG)

# Push the image to ECR
push:
	docker push $(ECR_REPOSITORY_URI):$(TAG)

# All-in-one command to log in, tag, and push
deploy: build login tag push

run-local:
	docker run --rm -p 9000:8080 x-server
test-local:
	curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"path": "/v1/users/lisciowsky", "httpMethod": "GET", "headers": {"Host": "localhost"}, "requestContext": {"http": {"method": "GET", "path": "/your-path"}}, "body": null}'
enter-local:
	docker run -it --entrypoint /bin/bash x-server

