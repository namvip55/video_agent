$ErrorActionPreference = "SilentlyContinue"
$folder = "temp_hoang_tu_ech"
if (!(Test-Path $folder)) { New-Item -ItemType Directory -Path $folder | Out-Null }
Set-Location $folder

$urls = @(
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-1.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-2.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-3.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-4.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-5.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-6.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-7.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-8.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-9.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-10.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-11.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-12.jpg",
    "https://truyenthieunhi.vn/wp-content/uploads/2025/12/Truyen-tranh-co-tich-Hoang-tu-ech-13.jpg"
)

$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }

for ($i = 0; $i -lt $urls.Length; $i++) {
    $pageNum = $i + 1
    $fileName = "page_$pageNum.jpg"
    Write-Host "Downloading: $fileName"
    $response = Invoke-WebRequest -Uri $urls[$i] -OutFile $fileName -Headers $headers -TimeoutSec 30
    if ((Test-Path $fileName) -and (Get-Item $fileName).Length -gt 1000) {
        Write-Host "  SUCCESS: $fileName"
    } else {
        Write-Host "  FAILED: $fileName"
    }
}

Write-Host "`nDownloaded files:"
Get-ChildItem *.jpg | Format-Table Name, Length