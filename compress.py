import os
import subprocess
import shutil

static_dir = r"D:\Professional Work\2026 Website\arneman.me\static"
out_dir = r"D:\Professional Work\2026 Website\arneman.me\static_compressed"
os.makedirs(out_dir, exist_ok=True)

large_files = [
    "Alchemortis trailer 1.1.mp4",
    "ASCII SATURN.mov",
    "PRJCT ESCP_CON_1.mp4",
    "PRJCT ESCP_CON_1 (1).mp4",
    "Loonie_Hour_clip_1_5-29-26.mp4",
    "Loonie_Hour_clip_1.mp4"
]

for filename in large_files:
    in_path = os.path.join(static_dir, filename)
    if not os.path.exists(in_path):
        continue
    
    out_path = os.path.join(out_dir, filename)
    orig_mb = os.path.getsize(in_path) / (1024 * 1024)
    print(f"Starting compression: {filename} ({orig_mb:.2f} MB)")
    
    # Use ffmpeg with CRF 23, H.264, AAC audio, and faststart
    cmd = [
        "ffmpeg", "-y",
        "-i", in_path,
        "-c:v", "libx264",
        "-crf", "23",
        "-preset", "faster",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "160k",
        "-movflags", "+faststart",
        out_path
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(out_path):
        new_mb = os.path.getsize(out_path) / (1024 * 1024)
        print(f"Success! {filename}: {orig_mb:.2f} MB -> {new_mb:.2f} MB")
        # Replace original file
        shutil.copy2(out_path, in_path)
    else:
        print(f"Error compressing {filename}: {res.stderr[:200]}")

print("All large files processed!")
