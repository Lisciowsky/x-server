TAG_LAMBDA := converter-latest
CONVERTER_LAMBDA_IMAGE_NAME := media_converter
ECR_REPOSITORY_URI := 654654262492.dkr.ecr.eu-central-1.amazonaws.com/dev-fastapi-app-repo

build_converter_lambda:
	docker build -t $(CONVERTER_LAMBDA_IMAGE_NAME):$(TAG_LAMBDA) -f Dockerfile.media .

tag-converter-lambda:
	docker tag $(CONVERTER_LAMBDA_IMAGE_NAME):$(TAG_LAMBDA) $(ECR_REPOSITORY_URI):$(TAG_LAMBDA)

push-converter-lambda:
	docker push $(ECR_REPOSITORY_URI):$(TAG_LAMBDA)

deploy-converter: build_converter_lambda tag-converter-lambda push-converter-lambda