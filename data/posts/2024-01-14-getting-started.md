---
title: Getting Started with Node.js
date: 2024-01-14 09:00:00
categories:
  - Tutorial
tags:
  - nodejs
  - javascript
  - getting-started
cover: /img/cover.jpg
excerpt: Learn the basics of setting up and running this Diaspora blog.
galleries:
  - /img/default.jpg
---

# Getting Started with Node.js Diaspora

This post covers the basics of getting your Diaspora blog up and running.

## Installation

```bash
npm install
```

## Configuration

Edit `config/config.yml` to customize your site:

```yaml
title: My Blog
subtitle: A beautiful blog
author: Your Name
```

## Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Creating Posts

Add markdown files to `data/posts/` with the following format:

```
2024-01-15-my-post.md
```

Each post should have YAML frontmatter at the top with metadata.

## Publishing

Deploy to your Node.js hosting provider and let others discover your thoughts!
