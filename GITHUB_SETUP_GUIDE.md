# GitHub Integration Setup Guide

## Overview
Your services page now automatically fetches and displays your GitHub projects in organized categories:
- **Web Development** - JavaScript, TypeScript, HTML, CSS, Python, Ruby, PHP, Go projects
- **UI/UX Design** - Figma, prototype, UI, UX, design, wireframe projects
- **Copywriting** - Blog, content, newsletter, article projects
- **Graphic Design** - Logo, branding, illustration, graphics projects

## How It Works

### 1. **Set Your GitHub Username**
On the Services page:
1. Find the "GitHub username config" input field
2. Enter your GitHub username (e.g., `blinkwilly`)
3. Click "Save"

The system will:
- Automatically fetch your public GitHub repositories
- Categorize them based on project content, language, and description
- Display them with repository information including:
  - Project thumbnail (mapped by category)
  - Repository name and link
  - Description
  - Programming language
  - Star count
  - Last updated date

### 2. **Project Categorization**
Projects are automatically categorized by:
- **Repository name** - Keywords in the name (e.g., "figma-design" → UI/UX)
- **Description** - Keywords in the description
- **Programming language** - What language was used:
  - Web: JavaScript, TypeScript, HTML, CSS, PHP, Ruby, Python, Go
  - UI/UX: Projects mentioning design/prototype
  - Other: Fallback categories

### 3. **Search Functionality**
The search bar filters across all loaded repositories:
- Searches by project name
- Searches by description
- Searches by programming language
- Results update in real-time

### 4. **Auto-Counting**
Badge counters automatically update to show:
- Number of Web Development projects
- Number of UI/UX projects
- Number of Copywriting projects
- Number of Graphic Design projects

These counts update when:
- Page loads
- Tab is switched
- Search filter is applied

## Features

### Smart Caching
- Projects are cached in browser's localStorage
- 5-minute cache duration for faster loading
- Automatic refresh after cache expires

### Responsive Design
- Desktop: 3-column grid layout
- Tablet: 2-column layout
- Mobile: Single column layout
- Smooth animations using AOS (Animate On Scroll)

### Visual Enhancements
- Hover effects with transform animations
- Dynamic gradient lighting effect on hover
- Category-specific thumbnail images
- Repository metadata with icons
- Fork indicators
- Star counts

## Customizing Project Thumbnails

Each category uses default images from `/assets/img/portfolio/`:
- **Web**: app-1.jpg, app-2.jpg, app-3.jpg
- **UI/UX**: product-1.jpg, product-2.jpg, product-3.jpg
- **Graphics**: branding-1.jpg, branding-2.jpg, branding-3.jpg
- **Copywriting**: books-1.jpg, books-2.jpg, books-3.jpg

To customize:
1. The system attempts to extract README images from each repository
2. If not available, it cycles through category images deterministically
3. Projects with the same category always get consistent thumbnails

## Tips for Best Results

### For Web Development Projects
- Include keywords in repo name: "website", "app", "api", "framework"
- Include language: JavaScript, TypeScript, Python, etc.
- Example: `MyWebApp-React` or `Blog-Platform-Node.js`

### For UI/UX Projects
- Include keywords: "design", "ui", "ux", "prototype", "figma"
- Example: `Mobile-App-UI-Prototype` or `Design-System-Figma`

### For Copywriting Projects
- Include keywords: "blog", "content", "newsletter", "article"
- Example: `Blog-Posts` or `Content-Repository`

### For Graphic Design Projects
- Include keywords: "logo", "brand", "illustration", "graphics"
- Example: `Logo-Designs` or `Brand-Guidelines`

## Local Data Storage

Your GitHub username is stored in browser's localStorage as `githubUsername`. 
This means:
- Your preference persists across page reloads
- You can clear it anytime by clicking "Clear" button
- Each browser/device maintains its own setting

## Troubleshooting

### Projects not showing?
1. Verify GitHub username is correct
2. Check that repositories are public
3. Ensure repositories have descriptions (for better categorization)
4. Clear browser cache (localStorage) and reload

### Wrong category assignment?
- Add clearer keywords to repository name or description
- Use language tags in repository topics
- Rename repositories to include category hints

### Rate limiting?
- GitHub API has rate limits (60 requests/hour for anonymous)
- Wait a few minutes and try again
- Consider using a personal access token in the future

## Manual Entries

Besides GitHub projects, you also have:
- **Graphic Designs**: 28 local images from your `/imagez` folder
- **Copywriting**: Sample planned projects (customizable)

These sections don't require GitHub setup and work independently.

---

**Ready to showcase your work? Just enter your GitHub username on the Services page!**
