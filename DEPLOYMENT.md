# 🚀 Deployment Guide - GitHub Pages

## Prerequisites
- GitHub account
- Node.js installed on your computer
- Git installed on your computer

## Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Youth on-demand platform MVP"
   ```

2. **Create a new repository on GitHub**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `barnearbeid`
   - Make it public
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/barnearbeid.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
- Build your React app
- Deploy it to GitHub Pages
- Make it available at `https://YOUR_USERNAME.github.io/barnearbeid`

## Step 4: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch
6. Click "Save"

## Step 5: Access Your Site

Your site will be available at:
`https://YOUR_USERNAME.github.io/barnearbeid`

## Troubleshooting

### If deployment fails:
1. Make sure you're logged into GitHub in your terminal
2. Check that the repository exists and is public
3. Try running `npm run deploy` again

### If the site doesn't load:
1. Wait a few minutes - GitHub Pages can take time to update
2. Check the "Actions" tab in your repository for deployment status
3. Make sure the gh-pages branch was created

## Custom Domain (Optional)

To use a custom domain:
1. Go to repository Settings → Pages
2. Add your custom domain in the "Custom domain" field
3. Add a CNAME file to your repository with your domain
4. Update your DNS settings

## Updating the Site

To update your deployed site:
```bash
git add .
git commit -m "Update description"
git push
npm run deploy
```

## Features Implemented

✅ **Norwegian Language** - All content translated to Norwegian  
✅ **Barnearbeid Branding** - Complete rebrand from YOD to Barnearbeid  
✅ **Responsive Design** - Works on all devices  
✅ **Modern UI** - Beautiful, professional interface  
✅ **GitHub Pages Ready** - Configured for easy deployment  
✅ **Automatic Deployment** - GitHub Actions workflow included  

Your Barnearbeid platform is now ready to go live! 🎉 