# Use the AWS Lambda Python runtime as a base image
FROM public.ecr.aws/lambda/python:3.11
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
# WORKDIR /var/task

# Install system dependencies
# RUN yum install -y vim

# Copy the Python requirements file into the container
COPY requirements.txt .

# Install dependencies, including both production and development packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the necessary project files and directories into the container
COPY settings.py lambda_handler.py alembic.ini ./ 
COPY src ./src
COPY alembic ./alembic

# [Optional] If your application uses the `app.env` file for environment variables,
# you might want to include it. Ensure no sensitive data is stored within.
COPY app.env . 

# Set the command to run your application
# CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]

# For AWS Lambda deployment, use the Mangum handler
# Adjust "lambda_handler.handler" if your handler import path is different
CMD ["lambda_handler.handler"]
