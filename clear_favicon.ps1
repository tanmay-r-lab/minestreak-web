Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("favicon.png")
$bg = $img.GetPixel(0,0)
$img.MakeTransparent($bg)
$img.Save("favicon_clear.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
