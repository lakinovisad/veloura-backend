# PowerShell skripta za automatski eksport Node.js backend projekta na GitHub

param(
    [Parameter(Mandatory=$false)]
    [switch]$Overwrite = $false
)

Write-Host "Pokrecem eksport Node.js projekta na GitHub..." -ForegroundColor Green

# Konfiguracija
$repoUrl = "https://github.com/lakinovisad/veloura-backend"
$branch = "main"

# Proveri da li se skripta izvršava iz root direktorijuma projekta
Write-Host "Proveravam da li sam u root direktorijumu projekta..." -ForegroundColor Cyan

$hasPackageJson = Test-Path "package.json"
$hasGitFolder = Test-Path ".git"

if (-not $hasPackageJson -and -not $hasGitFolder) {
    Write-Host "GREŠKA: Nisi u root direktorijumu projekta!" -ForegroundColor Red
    Write-Host "Skripta mora biti pokrenuta iz direktorijuma koji sadrži 'package.json' ili '.git' folder" -ForegroundColor Yellow
    Write-Host "Trenutni direktorijum: $(Get-Location)" -ForegroundColor Gray
    exit 1
}

Write-Host "Root direktorijum projekta potvrdjen" -ForegroundColor Green

# Git inicijalizacija (ako ne postoji)
if (-not $hasGitFolder) {
    Write-Host "Inicijalizujem Git repository..." -ForegroundColor Cyan
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Greška: Neuspešna Git inicijalizacija" -ForegroundColor Red
        exit 1
    }
    Write-Host "Git repository inicijalizovan" -ForegroundColor Green
} else {
    Write-Host "Git repository već postoji" -ForegroundColor Green
}

# Dodaj .gitignore ako postoji
if (Test-Path ".gitignore") {
    Write-Host "Dodajem .gitignore u staging..." -ForegroundColor Cyan
    git add .gitignore
    Write-Host ".gitignore dodat" -ForegroundColor Green
} else {
    Write-Host ".gitignore fajl nije pronađen" -ForegroundColor Yellow
}

# Dodaj sve fajlove
Write-Host "Dodajem sve fajlove u staging..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Greška: Neuspešno dodavanje fajlova u staging" -ForegroundColor Red
    exit 1
}
Write-Host "Svi fajlovi dodati u staging" -ForegroundColor Green

# Proveri da li postoje izmene za commit
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "Nema izmena za commit - repository je ažuran" -ForegroundColor Blue
} else {
    # Napravi commit
    Write-Host "Kreiram commit..." -ForegroundColor Cyan
    git commit -m "Initial commit from PowerShell script"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Greška: Neuspešno kreiranje commit-a" -ForegroundColor Red
        exit 1
    }
    Write-Host "Commit uspešno kreiran" -ForegroundColor Green
}

# suppress: PSPossibleIncorrectUsageOfRedirectionOperator
if (-not (git remote get-url origin 2>$null)) {
    Write-Host "Dodajem remote 'origin': $repoUrl" -ForegroundColor Cyan
    git remote add origin $repoUrl
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Greška: Neuspešno dodavanje remote origin" -ForegroundColor Red
        exit 1
    }
    Write-Host "Remote 'origin' dodat" -ForegroundColor Green
} else {
    Write-Host "Remote 'origin' već postoji" -ForegroundColor Green
}

# Postavi branch na main
Write-Host "Postavljam branch na 'main'..." -ForegroundColor Cyan
git branch -M $branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "Greška: Neuspešno postavljanje branch-a" -ForegroundColor Red
    exit 1
}
Write-Host "Branch postavljen na 'main'" -ForegroundColor Green

# Pokušaj rebase pull pre push-a
Write-Host "Povlačim izmene sa GitHub-a (rebase)..." -ForegroundColor Blue
try {
    git pull --rebase origin $branch
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Rebase uspešan" -ForegroundColor Green
    } else {
        Write-Host "Rebase nije uspeo, nastavljam sa push-om..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Greška tokom rebase-a: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Nastavljam sa push-om..." -ForegroundColor Cyan
}

# Push na GitHub
Write-Host "Šaljem projekat na GitHub..." -ForegroundColor Cyan
git push -u origin $branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "Greška: Neuspešan push na GitHub" -ForegroundColor Red
    Write-Host "Proveri da li repository postoji na GitHub-u i da li imaš pristup" -ForegroundColor Yellow
    Write-Host "Repository URL: $repoUrl" -ForegroundColor Gray
    exit 1
}

# Uspešan završetak
Write-Host ""
Write-Host "SVE JE USPEŠNO ZAVRŠENO!" -ForegroundColor Green
Write-Host "Projekat je uspešno eksportovan na GitHub!" -ForegroundColor Green
Write-Host "Repository URL: $repoUrl" -ForegroundColor Yellow
Write-Host "Branch: $branch" -ForegroundColor Yellow
Write-Host ""
Write-Host "Možeš sada pristupiti svom projektu na GitHub-u!" -ForegroundColor Green
