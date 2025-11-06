# Quick Deployment Script for Arabic Code Explainer

Write-Host "🚀 Arabic Code Explainer - Quick Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized!" -ForegroundColor Green
}

# Add all files
Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
$commitMsg = Read-Host "Enter commit message (or press Enter for 'Initial commit')"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Initial commit - Arabic Code Explainer"
}
git commit -m "$commitMsg"
Write-Host "✅ Commit created!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📤 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Create GitHub repository:" -ForegroundColor Yellow
Write-Host "   Go to: https://github.com/new" -ForegroundColor White
Write-Host "   Repository name: arabic-explainer" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Push your code:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/wailsba22/arabic-explainer.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  Deploy to Vercel (1-Click!):" -ForegroundColor Yellow
Write-Host "   Go to: https://vercel.com/new" -ForegroundColor White
Write-Host "   Click 'Import Git Repository'" -ForegroundColor White
Write-Host "   Select: arabic-explainer" -ForegroundColor White
Write-Host "   Click 'Deploy' - Done! 🎉" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✨ Your site will be live in ~2 minutes!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
