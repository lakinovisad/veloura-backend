# PowerShell script to create ZIP archive of the Veloura backend project
# Excludes unnecessary files and folders

$projectName = "veloura-backend"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$zipFileName = "${projectName}_${timestamp}.zip"
$projectPath = Get-Location

Write-Host "Creating ZIP archive of Veloura backend project..." -ForegroundColor Green
Write-Host "Project path: $projectPath" -ForegroundColor Yellow
Write-Host "ZIP file name: $zipFileName" -ForegroundColor Yellow

# Remove existing ZIP file if it exists
if (Test-Path $zipFileName) {
    Remove-Item $zipFileName -Force
    Write-Host "Removed existing ZIP file: $zipFileName" -ForegroundColor Yellow
}

# Create temporary directory for files to be zipped
$tempDir = "temp_zip_$(Get-Random)"
New-Item -ItemType Directory -Name $tempDir -Force | Out-Null
Write-Host "Created temporary directory: $tempDir" -ForegroundColor Cyan

try {
    # Define patterns to exclude
    $excludePatterns = @(
        "node_modules",
        ".git",
        "*.db",
        "temp_*",
        "*.zip",
        "temp_stdout.txt",
        "temp_stderr.txt",
        "backups"
    )
    
    # Get all items in current directory
    $items = Get-ChildItem -Path $projectPath -Force
    
    $copiedCount = 0
    $excludedCount = 0
    
    foreach ($item in $items) {
        $shouldExclude = $false
        
        # Check if item should be excluded
        foreach ($pattern in $excludePatterns) {
            if ($item.Name -like $pattern) {
                $shouldExclude = $true
                break
            }
        }
        
        if (-not $shouldExclude) {
            if ($item.PSIsContainer) {
                # Copy directory
                Copy-Item -Path $item.FullName -Destination "$tempDir\$($item.Name)" -Recurse -Force
                Write-Host "Copied directory: $($item.Name)" -ForegroundColor Cyan
                $copiedCount++
            } else {
                # Copy file
                Copy-Item -Path $item.FullName -Destination "$tempDir\$($item.Name)" -Force
                Write-Host "Copied file: $($item.Name)" -ForegroundColor Cyan
                $copiedCount++
            }
        } else {
            Write-Host "Excluded: $($item.Name)" -ForegroundColor Gray
            $excludedCount++
        }
    }
    
    Write-Host "`nCopying completed: $copiedCount items copied, $excludedCount items excluded" -ForegroundColor Green
    
    # Create ZIP archive using Get-ChildItem for reliable compression
    Write-Host "Creating ZIP archive..." -ForegroundColor Green
    
    # Get all items from temp directory
    $itemsToZip = Get-ChildItem -Path $tempDir -Recurse
    
    if ($itemsToZip.Count -eq 0) {
        throw "No files found to compress!"
    }
    
    # Create ZIP using Compress-Archive with specific paths
    Compress-Archive -Path $tempDir -DestinationPath $zipFileName -Force
    
    # Verify ZIP was created
    if (-not (Test-Path $zipFileName)) {
        throw "ZIP file was not created successfully!"
    }
    
    # Get file size
    $zipFile = Get-Item $zipFileName
    $fileSize = [math]::Round($zipFile.Length / 1MB, 2)
    
    Write-Host "`nZIP archive created successfully!" -ForegroundColor Green
    Write-Host "File: $zipFileName" -ForegroundColor Yellow
    Write-Host "Size: $fileSize MB" -ForegroundColor Yellow
    Write-Host "Location: $($zipFile.FullName)" -ForegroundColor Yellow
    Write-Host "Items compressed: $($itemsToZip.Count)" -ForegroundColor Yellow
    
} catch {
    Write-Host "`nError creating ZIP archive: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor Red
} finally {
    # Clean up temporary directory
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force
        Write-Host "Cleaned up temporary directory: $tempDir" -ForegroundColor Gray
    }
}

Write-Host "`nZIP creation process completed!" -ForegroundColor Green 