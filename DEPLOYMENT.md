# Deployment Guide

This guide covers deploying the AI-Powered Zero Trust Data Protection & Threat Intelligence System.

## 1. ML Service -> Railway
The ML Service is built with FastAPI and Scikit-learn.
1. Create a GitHub repo and push this codebase.
2. Go to [Railway](https://railway.app/).
3. Create a New Project -> Deploy from GitHub Repo.
4. Select the `ml-service` directory as the Root Directory in Railway settings.
5. Railway will automatically detect the `Dockerfile` and build it.
6. Once deployed, note the Public URL (e.g., `https://ml-service-production.up.railway.app`).

## 2. Database -> Supabase / Neon
1. Go to [Neon](https://neon.tech/) or [Supabase](https://supabase.com/).
2. Create a new PostgreSQL database.
3. Copy the Connection String (URI).

## 3. Redis -> Upstash
1. Go to [Upstash](https://upstash.com/).
2. Create a new Redis database.
3. Copy the Redis endpoint and port.

## 4. Backend -> Render
The Backend is built with Spring Boot.
1. Go to [Render](https://render.com/).
2. Create a New Web Service connected to your GitHub repo.
3. Select the `backend` directory as the Root Directory.
4. Use `Docker` as the runtime environment.
5. Add the following Environment Variables:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` (from Supabase/Neon)
   - `REDIS_HOST`, `REDIS_PORT` (from Upstash)
   - `JWT_SECRET` (A strong random string)
   - `ML_SERVICE_URL` (The Railway URL you got in step 1, plus `/predict-risk` or base url)
6. Deploy. Note the Render Public URL (e.g., `https://zerotrust-backend.onrender.com`).

## 5. Frontend -> Vercel
The Frontend is built with React + Vite.
1. Go to [Vercel](https://vercel.com/).
2. Import your GitHub repository.
3. Edit the Root Directory to `frontend`.
4. Add the Environment Variable:
   - `VITE_API_URL` (The Render backend URL)
5. Deploy.
