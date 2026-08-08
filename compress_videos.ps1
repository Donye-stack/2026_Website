$staticDir = "D:\Professional Work\2026 Website\arneman.me\static"
$backupDir = "D:\Professional Work\2026 Website\arneman.me\static_backup"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$filesToCompress = @(
    "Alchemortis trailer 1.1.mp4",
    "ASCII SATURN.mov",
    "PRJCT ESCP_CON_1.mp4",
    "PRJCT ESCP_CON_1 (1).mp4",
    "Loonie_Hour_clip_1_5-29-26.mp4",
    "Loonie_Hour_clip_1.mp4"
)

foreach ($file in $filesToCompress) {
    $inputPath = Join-Path $staticDir $file
    if (-not (Test-Path $inputPath)) { continue }
    
    $origSizeMB = [math]::Round((Get-Item $inputPath).Length / 1MB, 2)
    Write-Host "Processing: $file (Original: $origSizeMB MB)" -ForegroundColor Cyan
    
    $backupPath = Join-Path $backupDir $file
    if (-not (Test-Path $backupPath)) {
        Copy-Item $inputPath $backupPath
    }
    
    $tempOut = Join-Path $staticDir ("temp_" + $file)
    if ($file.EndsWith(".mov")) {
        $tempOut = [System.IO.Path]::ChangeExtension($tempOut, ".mov")
    }

    # Encode with high quality CRF 21, H.264, AAC audio, and faststart for instant web playback
    if ($file.EndsWith(".mov")) {
        & ffmpeg -y -i $backupPath -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $tempOut
    } else {
        & ffmpeg -y -i $backupPath -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $tempOut
    }
    
    if (Test-Path $tempOut) {
        $newSizeMB = [math]::Round((Get-Item $tempOut).Length / 1MB, 2)
        Write-Host "Compressed $file -> $newSizeMB MB" -ForegroundColor Green
        Move-Item $tempOut $inputPath -Force
    }
}

Write-Host "All videos compressed successfully!" -ForegroundColor Green
