# FrameVision: An AI-Powered Video Sentiment and Emotion Analysis SaaS

This repository features a Next.js application that integrates with an AI model hosted on an AWS SageMaker endpoint. The separate model repo can be found here: [FrameVision-Model](https://github.com/ParthSoni-CS/FrameVision-Model). Below is an overview of the entire codebase and instructions on how to get started.

---

## Table of Contents
1. [Key Features](#key-features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Local Setup](#local-setup)  
5. [Environment Variables](#environment-variables)  
6. [Database (Prisma)](#database-prisma)  
7. [AWS Setup (S3 & SageMaker)](#aws-setup-s3--sagemaker)  
8. [How It Works](#how-it-works)  
9. [API Usage](#api-usage)  
10. [Deployment](#deployment)  
11. [Contributing](#contributing)  
12. [License](#license)

---

## Key Features
- User registration and login using **NextAuth** (credentials provider).  
- Video file upload via AWS S3 presigned URLs.  
- Sentiment and emotion inference using AWS SageMaker.  
- Simple monthly quota system using **Prisma** to track request usage per user.  
- Interactive UI built with **React** and **Tailwind CSS**.

---

## Tech Stack
- **Next.js** (React-based framework for SSR and API routes)  
- **Prisma** (ORM for database operations)  
- **AWS S3** (File storage)  
- **AWS SageMaker** (Inference endpoint hosting the ML model)  
- **Tailwind CSS** (Utility-first CSS)  
- **NextAuth** (Authentication)  
- **TypeScript** throughout

---

## Prerequisites
1. **Node.js** (v18+ recommended)  
2. **npm** or **yarn**  
3. An **AWS** account, with access to an S3 bucket and a configured SageMaker endpoint.  
4. **SQLite** (default) or another database of your choice (update the `DATABASE_URL` accordingly).

---

## Local Setup
1. **Clone this Repo**  
   ```bash
   git clone https://github.com/YourUser/framevision-saas.git
   cd framevision-saas
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Create & Configure `.env`**  
   Copy `.env.example` to `.env`, then set your secrets and AWS configs.

4. **Generate Prisma Client & Migrate**  
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start Development Server**  
   ```bash
   npm run dev
   ```
   The application will start at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables
In `.env`, you will need to provide the following minimum values:
```
AUTH_SECRET=""
DATABASE_URL="file:./db.sqlite"
NODE_ENV="development"
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_INFERENCE_BUCKET=""
AWS_ENDPOINT_NAME=""
```
> Ensure that your SageMaker endpoint, AWS credentials, and S3 bucket name are valid.

---

## Database (Prisma)
By default, Prisma uses SQLite (see `prisma/schema.prisma`).  
- Update the `DATABASE_URL` if you prefer MySQL/PostgreSQL/etc.  
- Run `npx prisma db:generate` and `npx prisma migrate dev` to keep the schema up to date.

---

## AWS Setup (S3 & SageMaker)
1. **S3 Bucket**  
   - Create or reuse an S3 bucket for file uploads.  
   - Provide the bucket name in `AWS_INFERENCE_BUCKET`.  
2. **SageMaker**  
   - Deploy your model in AWS SageMaker (or reference the existing one from [FrameVision-Model](https://github.com/ParthSoni-CS/FrameVision-Model)).  
   - Copy the SageMaker endpoint name into `AWS_ENDPOINT_NAME`.

---

## How It Works
1. **User Authentication**  
   - Uses **NextAuth** (credentials provider). Users sign up/in to retrieve their secret key.  
2. **Video Upload**  
   - The `src/app/api/upload-url/route.ts` endpoint generates a presigned URL from S3.  
   - Clients PUT the file directly to S3, storing file info in the database.  
3. **Inference**  
   - The `src/app/api/sentiment-inference/route.ts` endpoint calls AWS SageMaker with the S3 file path, returning sentiment/emotion analysis.  
4. **Quota Monitoring**  
   - Each user has a monthly request quota. Requests are counted in `src/lib/quota.ts`. If the quota is exceeded, the call is blocked.

---

## API Usage
See `src/components/client/code-examples.tsx` for practical code samples (TypeScript or cURL).  
1. **Obtain Upload URL**  
   - `POST /api/upload-url` with `Authorization: Bearer <secretKey>`  
2. **PUT file to S3**  
3. **Analyze**  
   - `POST /api/sentiment-inference` with the `key` from step 1.  

**Example** (cURL):
```bash
# 1. Get upload URL
curl -X POST \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"fileType": ".mp4"}' \
  http://localhost:3000/api/upload-url

# 2. Upload file to S3
curl -X PUT \
  -H "Content-Type: video/mp4" \
  --data-binary @yourvideo.mp4 \
  "https://...presigned-url..."

# 3. Analyze video
curl -X POST \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"key": "inference/some-random-id.mp4"}' \
  http://localhost:3000/api/sentiment-inference
```

---

## Deployment
1. **Vercel**  
   - Connect your repo with Vercel, set ENV variables in your Vercel project settings, and deploy.  
2. **Docker**  
   - Build a Docker image using the official Node base image.  
   - Run `npm run build` then `npm run start`.  
3. **Other**  
   - Ensure your environment variables are set.  
   - Run migrations and start the server with `npm run preview` or `npm run start`.

---

## Contributing
1. **Fork** this repository.
2. **Create a feature branch**, commit your changes, and open a Pull Request.  
3. **Open an issue** for bug reports or requests.

---

## License
No specific license text is provided in the codebase. Check with the repository owner for licensing details or open an issue if you have questions.
