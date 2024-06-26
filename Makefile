AWS_REGION := eu-central-1
ECR_REPOSITORY_URI := 654654262492.dkr.ecr.eu-central-1.amazonaws.com/dev-fastapi-app-repo
CORE_BACKEND_IMAGE_NAME := x-server
TAG_CORE_BACKEND_LAMBDA := lambda-latest
TAG_CORE_BACKEND_VPS := vps-latest
TAG_CONVERTER_LAMBDA := converter-latest
CONVERTER_LAMBDA_IMAGE_NAME := media_converter
CLOUDFRONT_DISTRIBUTION_ID := E6FH89ZELIAJ5
CLOUDFRONT_INVALIDATION_PATHS := "/*"


# Docker and Database Operations --------------------------------------------------------------------------------------------------------
.PHONY: postgres createdb mockpostgres mockdb
postgres:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -d postgres:14-alpine

createdb:
	docker exec -it postgres createdb --username=username --owner=username twitter_db

mockpostgres:
	docker run --name mockpostgres -p 5433:5432 -e POSTGRES_USER=testuser -e POSTGRES_PASSWORD=testpass -d postgres:14-alpine

createmockdb:
	docker exec -it mockpostgres createdb --username=testuser --owner=testuser testdb


# Testing and Coverage ------------------------------------------------------------------------------------------------------------------
.PHONY: cov html coverage test
cov:
	coverage run -m pytest

html:
	coverage html

coverage: cov html

test:
	python run_tests.py


# AWS and Docker Workflow ----------------------------------------------------------------------------------------------------------------
.PHONY: build-lambda build-vps login tag-lambda tag-vps push-lambda push-vps deploy-lambda deploy-vps
build-lambda:
	docker build -t $(CORE_BACKEND_IMAGE_NAME):$(TAG_CORE_BACKEND_LAMBDA) -f Dockerfile.lambda .

build-vps:
	docker build -t $(CORE_BACKEND_IMAGE_NAME):$(TAG_CORE_BACKEND_VPS) -f Dockerfile.vps .

login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REPOSITORY_URI)

tag-lambda:
	docker tag $(CORE_BACKEND_IMAGE_NAME):$(TAG_CORE_BACKEND_LAMBDA) $(ECR_REPOSITORY_URI):$(TAG_CORE_BACKEND_LAMBDA)

tag-vps:
	docker tag $(CORE_BACKEND_IMAGE_NAME):$(TAG_CORE_BACKEND_VPS) $(ECR_REPOSITORY_URI):$(TAG_CORE_BACKEND_VPS)

push-lambda:
	docker push $(ECR_REPOSITORY_URI):$(TAG_CORE_BACKEND_LAMBDA)

push-vps:
	docker push $(ECR_REPOSITORY_URI):$(TAG_CORE_BACKEND_VPS)

deploy-lambda: build-lambda login tag-lambda push-lambda
deploy-vps: build-vps login tag-vps push-vps


# Frontend Operations ------------------------------------------------------------------------------------------------------------------
.PHONY: front-images update-front invalidate
front-images:
	aws s3 cp ./x-front/public/ s3://dev-website-bucket-random-text-string-12/ --recursive

update-front:
	aws s3 sync ./x-front/out s3://dev-website-bucket-random-text-string-12/ --delete
	find ./x-front/out -name "*.html" | while read -r file; do \
		newname=$$(echo "$$file" | sed 's/\.html$$//'); \
		aws s3 cp "$$file" "s3://dev-website-bucket-random-text-string-12/$${newname#./x-front/out/}"; \
	done

invalidate:
	@echo "Invalidating CloudFront distribution $(CLOUDFRONT_DISTRIBUTION_ID) for paths $(CLOUDFRONT_INVALIDATION_PATHS)"
	@aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_DISTRIBUTION_ID) --paths $(CLOUDFRONT_INVALIDATION_PATHS)


# Converter Lambda Operations ---------------------------------------------------------------------------------------------------------
.PHONY: build-converter-lambda tag-converter-lambda push-converter-lambda deploy-converter
build-converter-lambda:
	docker build -t media_converter:converter-latest -f ./applications/video_converter/Dockerfile.media ./applications/video_converter/.

tag-converter-lambda:
	docker tag $(CONVERTER_LAMBDA_IMAGE_NAME):$(TAG_CONVERTER_LAMBDA) $(ECR_REPOSITORY_URI):$(TAG_CONVERTER_LAMBDA)

push-converter-lambda:
	docker push $(ECR_REPOSITORY_URI):$(TAG_CONVERTER_LAMBDA)

deploy-converter: build-converter-lambda tag-converter-lambda push-converter-lambda


# Utility Operations ------------------------------------------------------------------------------------------------------------------
.PHONY: nuke infracost alembic pycache delete-secret gen_pub_priv_cloudfront_keys gen_dummy_signed_url
nuke:
	aws-nuke-v2.25.0-linux-amd64 -c nuke-config.yaml --no-dry-run

infracost:
	infracost breakdown --show-skipped --path .

alembic:
	alembic revision --autogenerate -m "Initial migration"

pycache:
	find . -type d -name "__pycache__" -exec rm -r {} +

delete-secret:
	aws secretsmanager delete-secret --secret-id "arn:aws:secretsmanager:eu-central-1:654654262492:secret:dev_media_cdn_private_key-08K4MD" --force-delete-without-recovery

gen_pub_priv_cloudfront_keys:
	openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
	openssl rsa -pubout -in private_key.pem -out public_key.pem

gen_dummy_signed_url:
	aws cloudfront sign --url "https://d1aa0yisny9egq.cloudfront.net/output/lisciowsky/moto.mp4" --key-pair-id "K3QTFHGRUDWZ0T" --private-key file://private_key.pem --date-less-than '2024-12-31'


# Local Development ------------------------------------------------------------------------------------------------------------------
.PHONY: run-local test-local enter-local
run-local:
	docker run --rm -p 9000:8080 x-server

test-local:
	curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"path": "/v1/users/lisciowsky", "httpMethod": "GET", "headers": {"Host": "localhost"}, "requestContext": {"http": {"method": "GET", "path": "/your-path"}}, "body": null}'

enter-local:
	docker run -it --entrypoint /bin/bash x-server