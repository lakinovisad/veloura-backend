# Backup skripta - kreira ZIP backup projekta
# Kreira backup sa trenutnim datumom i vremenom

function Invoke-ProjectBackup {
    Write-Host "Pokretanje backup-a..." -ForegroundColor Cyan

    # Trenutno vreme za ime fajla
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $backupName = "project-backup_$timestamp.zip"
    $backupPath = ".\backups\$backupName"

    # Kreiraj backups folder ako ne postoji
    if (!(Test-Path ".\backups")) {
        New-Item -ItemType Directory -Path ".\backups" | Out-Null
        Write-Host "Kreiran backups folder" -ForegroundColor Green
    }

    # Proširena lista fajlova i foldera za izuzimanje
    $excludeDirs = @("node_modules", ".git", "backups", "temp", "tmp")
    $excludeFiles = @("*.log", "*.tmp", "*.db", "*.sqlite", "*.sqlite3", ".env", "*.pid")

    try {
        Write-Host "Pretraga fajlova za backup..." -ForegroundColor Yellow
        
        $allItems = Get-ChildItem -Path . -Recurse -File
        $items = @()
        $excludedItems = @()
        
        foreach ($item in $allItems) {
            $fullPath = $item.FullName
            $exclude = $false
            $reason = ""
            
            # Proveri da li je u izuzetim folderima
            foreach ($dir in $excludeDirs) {
                if ($fullPath -like "*\$dir\*") { 
                    $exclude = $true
                    $reason = "folder: $dir"
                    break 
                }
            }
            
            # Proveri da li je izuzet tip fajla
            if (-not $exclude) {
                foreach ($pattern in $excludeFiles) {
                    if ($item.Name -like $pattern) { 
                        $exclude = $true
                        $reason = "tip: $pattern"
                        break 
                    }
                }
            }
            
            if ($exclude) {
                $excludedItems += [PSCustomObject]@{
                    Name = $item.Name
                    Path = $item.FullName
                    Reason = $reason
                }
            } else {
                $items += $item
            }
        }
        
        Write-Host "Pronadjeno $($items.Count) fajlova za backup" -ForegroundColor Cyan
        Write-Host "Izuzeto $($excludedItems.Count) fajlova" -ForegroundColor Yellow
        
        if ($items.Count -eq 0) {
            Write-Host "Nema fajlova za backup!" -ForegroundColor Yellow
            Write-Host "Proverite da li postoje fajlovi u trenutnom direktorijumu" -ForegroundColor Gray
            return
        }
        
        # Prikaži prvih 10 fajlova koji će biti u backup-u
        Write-Host "Fajlovi koji će biti u backup-u:" -ForegroundColor Yellow
        $items | Select-Object -First 10 | ForEach-Object {
            Write-Host "  - $($_.Name)" -ForegroundColor Gray
        }
        if ($items.Count -gt 10) {
            Write-Host "  ... i još $($items.Count - 10) fajlova" -ForegroundColor Gray
        }
        
        # Prikaži izuzete fajlove
        if ($excludedItems.Count -gt 0) {
            Write-Host ""
            Write-Host "Izuzeti fajlovi:" -ForegroundColor Yellow
            $excludedItems | Group-Object Reason | ForEach-Object {
                Write-Host "  $($_.Name): $($_.Count) fajlova" -ForegroundColor Gray
            }
        }
        
        Write-Host ""
        Write-Host "Kreiranje ZIP backup-a: $backupName" -ForegroundColor Yellow
        
        # Kreiraj ZIP backup sa rukovanjem greškama
        $successfulItems = @()
        $failedItems = @()
        
        foreach ($item in $items) {
            try {
                # Proveri da li je fajl dostupan za čitanje
                $stream = [System.IO.File]::OpenRead($item.FullName)
                $stream.Close()
                $successfulItems += $item
            } catch {
                $failedItems += [PSCustomObject]@{
                    Name = $item.Name
                    Path = $item.FullName
                    Error = $_.Exception.Message
                }
            }
        }
        
        if ($successfulItems.Count -eq 0) {
            Write-Host "Nema dostupnih fajlova za backup!" -ForegroundColor Red
            return
        }
        
        # Kreiraj ZIP sa dostupnim fajlovima
        Compress-Archive -Path $successfulItems.FullName -DestinationPath $backupPath -Force

        # Proveri da li je backup uspešno kreiran
        if (!(Test-Path $backupPath)) {
            Write-Host "Backup nije kreiran!" -ForegroundColor Red
            return
        }

        # Proveri veličinu backup-a
        $backupSize = (Get-Item $backupPath).Length
        $backupSizeMB = [math]::Round($backupSize / 1MB, 2)
        
        Write-Host "Backup uspesno kreiran!" -ForegroundColor Green
        Write-Host "Lokacija: $backupPath" -ForegroundColor Cyan
        Write-Host "Velicina: $backupSizeMB MB" -ForegroundColor Magenta
        Write-Host "Broj fajlova: $($successfulItems.Count)" -ForegroundColor Blue
        
        # Prikaži informacije o neuspešnim fajlovima
        if ($failedItems.Count -gt 0) {
            Write-Host ""
            Write-Host "Fajlovi koji nisu backup-ovani ($($failedItems.Count)):" -ForegroundColor Yellow
            $failedItems | ForEach-Object {
                Write-Host "  - $($_.Name) (greska: $($_.Error))" -ForegroundColor Red
            }
        }
        
        # Prikaži listu poslednjih 5 backup-ova
        Write-Host ""
        Write-Host "Poslednjih 5 backup-ova:" -ForegroundColor Yellow
        $existingBackups = Get-ChildItem -Path ".\backups" -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
        if ($existingBackups.Count -gt 0) {
            $existingBackups | ForEach-Object {
                $size = [math]::Round($_.Length / 1MB, 2)
                $date = $_.LastWriteTime.ToString("dd.MM.yyyy HH:mm")
                Write-Host "  - $($_.Name) ($size MB, $date)" -ForegroundColor Gray
            }
        } else {
            Write-Host "  - Ovo je prvi backup" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "Greska pri kreiranju backup-a: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Detalji greske: $($_.Exception.GetType().Name)" -ForegroundColor Red
        return
    }

    Write-Host ""
    Write-Host "Backup zavrsen!" -ForegroundColor Green
}

Invoke-ProjectBackup 