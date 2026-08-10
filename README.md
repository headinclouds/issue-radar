# Issue Radar

Issue Radar is a frontend application for exploring open-source repositories and tracking issue health through a clean, data-focused interface.

## Live Website

https://headinclouds.github.io/issue-radar/

## Project Overview

This project was built to demonstrate practical product thinking and frontend engineering skills: search experience design, asynchronous data handling, information architecture, and readable analytics presentation.

## Features

- Search GitHub repositories by keyword
- View repository issues with pagination and status filters
- See lightweight repository analytics (contributors and issue activity)
- Bookmark repositories for quick access
- Responsive UI with loading skeletons

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- HeroUI
- Recharts
- Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Create a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint

## Project Structure

```text
src/
  components/      Reusable UI components
  hooks/           Data-fetching and app state hooks
  services/        GitHub API and bookmark services
  util/            Utility helpers
  assets/          Images and static assets
  App.jsx          Main app shell
  index.css        Global styles
  index.jsx        App entry point
```

## Notes

- The app currently uses unauthenticated GitHub API requests, which are subject to lower rate limits.
- If you hit API limits, retries may fail until the rate window resets.
