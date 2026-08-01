$source = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;

public class LogoFixer {
    public static void Run() {
        string inputPath = @"c:\Users\Ratnakar\Desktop\Divyatva\assets\divyatva-logo.png";
        string outputPath = @"c:\Users\Ratnakar\Desktop\Divyatva\assets\divyatva-logo-transparent.png";
        using (Bitmap bmp = new Bitmap(inputPath)) {
            for (int x = 0; x < bmp.Width; x++) {
                for (int y = 0; y < bmp.Height; y++) {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R > 210 && c.G > 200 && c.B > 180) {
                        bmp.SetPixel(x, y, Color.FromArgb(0, 255, 255, 255));
                    }
                }
            }
            bmp.Save(outputPath, ImageFormat.Png);
        }
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies "System.Drawing"
[LogoFixer]::Run()
Write-Host "Logo converted successfully"
