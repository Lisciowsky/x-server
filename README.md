# Welcome to the FullStack GitOps Application

Welcome to our FullStack application, designed as a comprehensive example to demonstrate the integration of modern full-stack development practices and GitOps methodologies. This application harnesses the power of Python and TypeScript, coupled with the robust infrastructure of AWS, to deliver a scalable and secure user experience.

# Quick Start Guide

This quick start guide will help you get the application up and running on your local development environment. Follow these steps to set up both the frontend and backend components.

## Running the Frontend

1. **Navigate to the Frontend Directory**:
    Open a terminal and change directory to the frontend folder:
    ```bash
    cd x-front
    ```

2. **Install Dependencies**:
    Ensure that you have Node.js and npm installed, then run:
    ```bash
    npm install
    ```

3. **Configure Axios**:
    Before starting the server, open the Axios configuration file and ensure the base URL points to your local server:
    ```javascript
    baseURL = 'http://localhost:8080/v1';
    ```
    ![Run the Frontend Demo](documentation/gifs/frontend_run.gif)

4. **Start the Frontend Server**:
    Run the following command to start the frontend:
    ```bash
    npm run dev
    ```

## Setting Up and Running the Backend

1. **Configure Local Development**:
    - Open the `settings.py` file located in your root folder directory.
    - Set the `LOCAL_DEVELOPMENT` flag to `True` to configure the application to run with settings suitable for local development.
    ```python3
    # NOTE Switch to local development if you re running the backend core locally
    
    LOCAL_DEVELOPMENT = True
    ```    

2. **Start the PostgreSQL Database**:
    - Ensure Docker is installed and running on your machine.
    - Open a terminal and run the PostgreSQL container:
      ```bash
      make postgres
      ```

3. **Run the Backend**:
    - Navigate to the backend directory.
    - Install the required Python packages. It is recommended to use a virtual environment and Python version that matches the Dockerfile >= 3.11:
      ```bash
      pip install -r requirements.txt
      ```
    - Start the backend server:
      ```bash
      python main.py
      ```
      ![Run the Backend Demo](documentation/gifs/backend_startup.gif)

## Running Backend Tests Locally

1. **Set Up the Test Database**:
    - To run the backend tests, you need a separate PostgreSQL instance. Start the mock PostgreSQL container:
      ```bash
      make mockpostgres
      ```
    - Create the test database:
      ```bash
      make createmockdb
      ```

2. **Configure Testing Environment**:
    - Ensure the `ENVIRONMENT` is Environment.Testing or "Testing"
    
3. **Execute Tests**:
    - Run the tests by executing:
      ```bash
      make tests
      ```
    - Run the tests and generate coverage report:
      ```bash
      make coverage
      ```
      ![Run the Tests Demo](documentation/gifs/run_tests.gif)


## Overview

Our application combines the efficiency of FastAPI and the flexibility of NextJS to create a dynamic full-stack solution. It is specifically designed to showcase essential features like user authentication, admin user management, and a user profile section where individuals can edit their profiles and upload media, such as videos.

## Key Features

- **User Authentication**: Secure and robust authentication system to manage user access.
- **Admin User Management**: Administrative features that allow for the management of user accounts.
- **Profile Management**: Users can easily edit their profiles and manage personal information.
- **Media Upload**: Users can upload videos, which are then processed and optimized for delivery.

## Backend

The backend of this application is built using **Python with FastAPI** and **SqlModel ORM**, creating an asynchronous webserver that is both fast and efficient. It includes:

- **AWS ECS Deployment**: The application is deployed on AWS ECS (Elastic Container Service) with support from ALB (Application Load Balancer) and WAF (Web Application Firewall) for enhanced security.
- **Database**: Utilizes PostgreSQL for reliable data storage.
- **Media Handling**: Integration with AWS MediaConvert for converting uploaded media to desired formats and parameters, managed by AWS Lambda for seamless media job triggering.

## Storage

- **AWS S3**: All media files are securely stored on AWS S3 and served through AWS CloudFront to ensure fast and secure access.

## Frontend

- **Hosting**: The frontend is hosted statically on an S3 Bucket, leveraging AWS CloudFront for efficient content delivery.

## Security

- **Route 53**: Manages SSL/TLS certificates, enhancing the security and reliability of the application.
- **WAF Integration**: Protects the application from web threats and DDoS attacks, ensuring uptime and data integrity.

This project also incorporates GitOps practices through the use of Terraform for infrastructure management and GitHub workflows for CI/CD, reinforcing the code-to-cloud automation philosophy.

Thank you for choosing our FullStack GitOps application. Dive into our documentation to set up, use, and contribute to the project, and explore how this application can be adapted and expanded to meet your needs.


# Terraform Deployment Steps

- **`1) build infrastructure`**: Creates AWS resources based on a terraform IaC configuration files.
  <details>
  <summary><strong>show build infrastructure</strong></summary>

  ![Apply Demo](documentation/gifs/terraform_apply.gif)

  </details>
  
  Couple of modules won't be created:
   - module.certificates.aws_acm_certificate_validation.szumi_dev_cert_validation: Still creating... [3m20s elapsed]

   - module.certificates.aws_acm_certificate_validation.szumi_dev_cert_validation_us_east_1: Still creating... [3m10s elapsed]
  
   - module.database.aws_db_instance.postgres_instance: Still creating... [4m40s elapsed]

   - creating Lambda Function (dev_media_convert_trigger): operation error Lambda: CreateFunction: Provide a valid source image.

   Let's go to AWS Management console and perform this changes:
   
- **`2) change domain server names`**: AWS Route 53 in order to resolve aws_acm_certificate_validation we have to overwrite the domain server names. I have purchased my domain on go daddy, so I will be changing then names there.
  <details>
  <summary><strong>show change domain server names</strong></summary>

  ![Apply Demo](documentation/gifs/dns_change.gif)

  </details>

- **`3) push docker images`**: Push media convert and core backend docker images. Your ECR image registry should be already created.
  <details>
  <summary><strong>show push docker images</strong></summary>

  ![Deploy Converter Demo](documentation/gifs/deploy_converter.gif)
  ![Deploy Backend Demo](documentation/gifs/deploy_backend.gif)
  ![Images Deployed](documentation/gifs/images_deployed.gif)

  </details>


# Makefile Overview
This Makefile is designed to streamline various development, testing, and deployment operations for a software project using Docker, AWS, and PostgreSQL. Below are the detailed sections covering each aspect of the Makefile.

<details>
<summary><strong>Docker and Database Operations</strong></summary>

### Docker and Database Operations
- **`postgres`**: Runs a Docker container named `postgres` on port 5432 with PostgreSQL version 14 and default credentials.
- **`createdb`**: Creates a database named `twitter_db` within the `postgres` container.
- **`mockpostgres`**: Runs a Docker container named `mockpostgres` for testing purposes with separate credentials and database.
- **`createmockdb`**: Creates a test database named `testdb` in the `mockpostgres` container.

</details>

<details>
<summary><strong>Testing and Coverage</strong></summary>

### Testing and Coverage

- **`cov`**: Executes tests using `pytest` with coverage tracking.
- **`html`**: Generates an HTML report of the code coverage.
- **`coverage`**: Combines the `cov` and `html` commands to provide complete coverage reporting.
- **`test`**: Runs a Python script to execute unit tests.

</details>

<details>
<summary><strong>AWS and Docker Workflow</strong></summary>

### AWS and Docker Workflow

- **`build-lambda`**: Builds a Docker image for AWS Lambda deployment using a specific Dockerfile.
- **`build-vps`**: Builds a Docker image for VPS deployment with a different Dockerfile.
- **`login`**: Authenticates with AWS ECR using the AWS CLI.
- **`tag-lambda`**: Tags the built Lambda image for pushing to AWS ECR.
- **`tag-vps`**: Tags the built VPS image for pushing to AWS ECR.
- **`push-lambda`**: Pushes the tagged Lambda image to AWS ECR.
- **`push-vps`**: Pushes the tagged VPS image to AWS ECR.
- **`deploy-lambda`**: Full workflow to build, tag, and push a Lambda image.
- **`deploy-vps`**: Full workflow to build, tag, and push a VPS image.

</details>

<details>
<summary><strong>Frontend Operations</strong></summary>

### Frontend Operations

- **`front-images`**: Copies static frontend images to an S3 bucket.
- **`update-front`**: Synchronizes the frontend build output to an S3 bucket and modifies paths.
- **`invalidate`**: Invalidates a CloudFront distribution to clear cached content.

</details>

<details>
<summary><strong>Converter Lambda Operations</strong></summary>

### Converter Lambda Operations

- **`build-converter-lambda`**: Builds a Docker image for a media converter Lambda.
- **`tag-converter-lambda`**: Tags the converter Lambda image for ECR.
- **`push-converter-lambda`**: Pushes the tagged converter Lambda image to ECR.
- **`deploy-converter`**: Complete build, tag, and push workflow for the converter Lambda.

</details>

<details>
<summary><strong>Utility Operations</strong></summary>

### Utility Operations

- **`nuke`**: Executes the `aws-nuke` command to remove AWS resources based on a configuration file.
  <details>
  <summary><strong>NUKE</strong></summary>

  ![NUKE Demo](documentation/gifs/nuke.gif)

  </details>
  
- **`infracost`**: Runs cost estimation for the infrastructure using Infracost.
  <details>
  <summary><strong>INFRACOST</strong></summary>

  ![INFRACOST Demo](documentation/gifs/infracost.gif)

  </details>
- **`alembic`**: Generates a new database migration with Alembic.
- **`pycache`**: Clears Python cache files from the project directory.
- **`delete-secret`**: Deletes a specific AWS Secrets Manager secret.
- **`gen_pub_priv_cloudfront_keys`**: Generates a new pair of RSA keys for CloudFront.
  <details>
  <summary><strong>GEN KEYS</strong></summary>

  ![GEN KEYS Demo](documentation/gifs/gen_keys.gif)

  </details>
- **`gen_dummy_signed_url`**: Generates a signed URL for CloudFront using the generated keys.

</details>

<br></br>

# Application Showcase

<details>
<summary><strong>Singup / Profile</strong></summary>

![Singup / Profile Demo](documentation/gifs/singup.gif)

</details>

<details>

<summary><strong>Media upload</strong></summary>

![Media Upload Demo](documentation/gifs/uploadmedia.gif)

</details>

<details>

<summary><strong>Video Feed</strong></summary>

![Video Feed Demo](documentation/gifs/videos.gif)

</details>