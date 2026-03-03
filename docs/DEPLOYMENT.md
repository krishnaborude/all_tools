# Deployment Guide

## Platform

This project deploys to **GitHub Pages** using:

- `.github/workflows/deploy-pages.yml`

## Trigger Events

- Push to `main` or `master`
- Manual `workflow_dispatch`

## Required GitHub Repo Settings

1. Open repository `Settings` -> `Pages`
2. Set source to `GitHub Actions`
3. Ensure Actions are enabled for the repo

## Deployment Flow

1. Install dependencies
2. Run `npm run build`
3. Upload `dist/` as Pages artifact
4. Deploy artifact to GitHub Pages

## Live URL Pattern

For this repository, the expected URL is:

- `https://krishnaborude.github.io/all_tools/`

