param([switch]$Install, [switch]$Auto)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$configFile = Join-Path $PSScriptRoot 'launcher-settings.json'
$startupLink = Join-Path ([Environment]::GetFolderPath('Startup')) 'Tactical Platform Lab.lnk'
function New-LabShortcut($path, $arguments) {
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($path)
    $shortcut.TargetPath = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
    $shortcut.Arguments = '-NoProfile -ExecutionPolicy Bypass -NoExit -File "' + (Join-Path $PSScriptRoot 'Launch-Lab.ps1') + '" ' + $arguments
    $shortcut.WorkingDirectory = $root
    $shortcut.Description = 'Start your local Tactical Platform training lab'
    $shortcut.Save()
}
try {
    if ($Install -or !(Test-Path $configFile)) {
        Write-Host 'Installed WSL distributions:'
        & wsl.exe --list --verbose
        $distro = Read-Host 'Enter the exact Ubuntu distribution name shown above'
        if ([string]::IsNullOrWhiteSpace($distro)) { throw 'A distribution name is required.' }
        & wsl.exe --distribution $distro --exec true
        if ($LASTEXITCODE -ne 0) { throw 'Cannot open that distribution.' }
        Write-Host 'Sign-in choices: uds, redpanda (UDS + Redpanda), operations (Loki), wazuh, learning'
        $profile = Read-Host 'Default sign-in profile [uds]'
        if (!$profile) { $profile = 'uds' }
        if ($profile -notin @('uds','redpanda','operations','wazuh','learning')) { throw 'Unknown profile.' }
        @{distro=$distro; profile=$profile} | ConvertTo-Json | Set-Content -Encoding UTF8 $configFile
        New-LabShortcut (Join-Path ([Environment]::GetFolderPath('Desktop')) 'Tactical Platform Lab.lnk') ''
        if ((Read-Host 'Also start this profile at Windows sign-in? Type YES to enable') -ceq 'YES') {
            New-LabShortcut $startupLink '-Auto'
        } elseif (Test-Path $startupLink) { Remove-Item $startupLink }
        Write-Host 'Desktop shortcut installed. Keep this extracted folder in its current location.'
        if ($Install) { return }
    }
    $settings = Get-Content -Raw $configFile | ConvertFrom-Json
    $profile = $settings.profile
    $redeploy = $false
    if (!$Auto) {
        Write-Host "`n1 UDS + Grafana/Prometheus`n2 UDS + monitoring + Redpanda`n3 Operations / Loki`n4 Wazuh`n5 Learning only / mock Active Directory`n6 Stop known lab stacks (preserves data)`n7 Redeploy training app + UDS monitoring"
        switch (Read-Host 'Choose [1]') {
            '2' { $profile='redpanda' }
            '3' { $profile='operations' }
            '4' { $profile='wazuh' }
            '5' { $profile='learning' }
            '6' { $profile='stop' }
            '7' { $profile='uds'; $redeploy=$true }
            default { $profile='uds' }
        }
    }
    if ($profile -ne 'learning') {
        $docker = Join-Path $env:ProgramFiles 'Docker\Docker\Docker Desktop.exe'
        if (!(Get-Process 'Docker Desktop' -ErrorAction SilentlyContinue)) {
            if (!(Test-Path $docker)) { throw 'Install/open Docker Desktop and enable integration for your Ubuntu distribution, then retry.' }
            Start-Process -FilePath $docker
        }
    }
    $linuxRoot = (& wsl.exe --distribution $settings.distro --exec wslpath -a -u $root | Out-String).Trim()
    if ($LASTEXITCODE -ne 0 -or !$linuxRoot) { throw 'Could not translate the extracted folder path into WSL.' }
    $argsForWsl = @('--distribution', $settings.distro, '--cd', $linuxRoot, '--exec', 'bash', 'local/desktop-entry.sh', $profile)
    if ($redeploy) { $argsForWsl += '--redeploy' }
    & wsl.exe @argsForWsl | ForEach-Object {
        if ($_ -eq 'TPOL_READY') { Start-Process 'http://localhost:8765' }
        else { Write-Host $_ }
    }
    if ($LASTEXITCODE -ne 0) { throw 'Lab startup stopped. Read the error above and DESKTOP-LAUNCHER.md.' }
} catch { Write-Host $_ -ForegroundColor Red }
