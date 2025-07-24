# PowerShell skripta za popravku duplog foldera u Node.js projektu
# Prebacuje sadržaj iz veloura-backend-main/veloura-backend-main/ u veloura-backend-main/

param(
    [Parameter(Mandatory=$false)]
    [switch]$Overwrite = $false
)

Write-Host "🔧 Pokrećem popravku duplog foldera..." -ForegroundColor Green

# 1. Proveri da li se skripta izvršava iz spoljašnjeg veloura-backend-main foldera
Write-Host "📁 Proveravam strukturu direktorijuma..." -ForegroundColor Cyan

$currentDir = Get-Location
$currentDirName = Split-Path $currentDir -Leaf

if ($currentDirName -ne "veloura-backend-main") {
    Write-Host "❌ GREŠKA: Skripta mora biti pokrenuta iz spoljašnjeg 'veloura-backend-main' foldera!" -ForegroundColor Red
    Write-Host "📍 Trenutni direktorijum: $currentDir" -ForegroundColor Gray
    Write-Host "💡 Idite u spoljašnji 'veloura-backend-main' folder i pokrenite skriptu ponovo" -ForegroundColor Yellow
    exit 1
}

# 2. Proveri da li postoji unutrašnji veloura-backend-main folder
$innerFolder = Join-Path $currentDir "veloura-backend-main"
if (-not (Test-Path $innerFolder)) {
    Write-Host "❌ GREŠKA: Unutrašnji 'veloura-backend-main' folder nije pronađen!" -ForegroundColor Red
    Write-Host "💡 Struktura direktorijuma nije dupla ili se već popravila" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dupla struktura detektovana" -ForegroundColor Green
Write-Host "📂 Spoljašnji folder: $currentDir" -ForegroundColor Cyan
Write-Host "📂 Unutrašnji folder: $innerFolder" -ForegroundColor Cyan

# 3. Proveri da li unutrašnji folder sadrži Node.js projekat
$packageJsonInInner = Test-Path (Join-Path $innerFolder "package.json")
if (-not $packageJsonInInner) {
    Write-Host "❌ GREŠKA: Unutrašnji folder ne sadrži 'package.json'!" -ForegroundColor Red
    Write-Host "💡 Proverite da li je struktura ispravna" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js projekat pronađen u unutrašnjem folderu" -ForegroundColor Green

# 4. Prikaži sadržaj unutrašnjeg foldera
Write-Host "📋 Sadržaj unutrašnjeg foldera:" -ForegroundColor Cyan
$innerContents = Get-ChildItem $innerFolder
foreach ($item in $innerContents) {
    Write-Host "   - $($item.Name)" -ForegroundColor Gray
}

# 5. Proveri da li postoje konflikti (fajlovi koji već postoje u spoljašnjem folderu)
Write-Host "🔍 Proveravam konflikte..." -ForegroundColor Cyan
$conflicts = @()
foreach ($item in $innerContents) {
    $outerPath = Join-Path $currentDir $item.Name
    if (Test-Path $outerPath) {
        $conflicts += $item.Name
    }
}

if ($conflicts.Count -gt 0) {
    Write-Host "⚠️  Pronađeni konflikti:" -ForegroundColor Yellow
    foreach ($conflict in $conflicts) {
        Write-Host "   - $conflict" -ForegroundColor Yellow
    }
    
    if ($Overwrite) {
        Write-Host "🔄 Prepisujem postojeće fajlove..." -ForegroundColor Cyan
    } else {
        Write-Host "❌ GREŠKA: Postoje konflikti! Koristite -Overwrite za prepisivanje" -ForegroundColor Red
        Write-Host "💡 Pokrenite: .\fix-nested-folder.ps1 -Overwrite" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Nema konflikata" -ForegroundColor Green
}

# 6. Prebaci sve fajlove i foldere
Write-Host "📦 Prebacujem sadržaj..." -ForegroundColor Cyan
$movedCount = 0
$skippedCount = 0

foreach ($item in $innerContents) {
    $sourcePath = Join-Path $innerFolder $item.Name
    $destPath = Join-Path $currentDir $item.Name
    
    if (Test-Path $destPath -and -not $Overwrite) {
        Write-Host "⏭️  Preskačem: $($item.Name) (već postoji)" -ForegroundColor Yellow
        $skippedCount++
    } else {
        try {
            if ($item.PSIsContainer) {
                # Prebaci folder
                if (Test-Path $destPath) {
                    Remove-Item $destPath -Recurse -Force
                }
                Move-Item $sourcePath $destPath -Force
                Write-Host "📁 Prebačen folder: $($item.Name)" -ForegroundColor Green
            } else {
                # Prebaci fajl
                Move-Item $sourcePath $destPath -Force
                Write-Host "📄 Prebačen fajl: $($item.Name)" -ForegroundColor Green
            }
            $movedCount++
        } catch {
            Write-Host "❌ Greška prebacivanja $($item.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 7. Proveri da li je unutrašnji folder sada prazan
Write-Host "🔍 Proveravam da li je unutrašnji folder prazan..." -ForegroundColor Cyan
$remainingItems = Get-ChildItem $innerFolder -Force
if ($remainingItems.Count -eq 0) {
    # 8. Obriši prazan unutrašnji folder
    Write-Host "🗑️  Brišem prazan unutrašnji folder..." -ForegroundColor Cyan
    try {
        Remove-Item $innerFolder -Force
        Write-Host "✅ Unutrašnji folder obrisan" -ForegroundColor Green
    } catch {
        Write-Host "❌ Greška brisanja unutrašnjeg foldera: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Unutrašnji folder nije prazan, ostavljam ga" -ForegroundColor Yellow
    Write-Host "📂 Preostali sadržaj:" -ForegroundColor Gray
    foreach ($item in $remainingItems) {
        Write-Host "   - $($item.Name)" -ForegroundColor Gray
    }
}

# 9. Prikaži rezultat
Write-Host "`n🎉 POPRAVKA ZAVRŠENA!" -ForegroundColor Green
Write-Host "✅ Prebačeno: $movedCount stavki" -ForegroundColor Green
if ($skippedCount -gt 0) {
    Write-Host "⏭️  Preskočeno: $skippedCount stavki" -ForegroundColor Yellow
}

# 10. Proveri da li je struktura sada ispravna
Write-Host "`n📋 Nova struktura direktorijuma:" -ForegroundColor Cyan
$newContents = Get-ChildItem | Where-Object { $_.Name -ne "fix-nested-folder.ps1" }
foreach ($item in $newContents) {
    Write-Host "   - $($item.Name)" -ForegroundColor Gray
}

Write-Host "`n✅ Projekat je sada u ispravnoj strukturi!" -ForegroundColor Green
Write-Host "🚀 Možete nastaviti sa radom na projektu" -ForegroundColor Green
