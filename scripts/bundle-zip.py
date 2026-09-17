import os
import zipfile

EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.cache', '__pycache__', '.temp'}
EXCLUDE_EXTS = {'.log', '.pyc'}

targets = [
    'frontend/public/it-saathi-project.zip',
    'dist/it-saathi-project.zip',
    'it-saathi-project.zip'
]

# Ensure parent directories exist
for t in targets:
    os.makedirs(os.path.dirname(os.path.abspath(t)), exist_ok=True)

primary_target = targets[0]

with zipfile.ZipFile(primary_target, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for f in files:
            if f.endswith('.zip') or any(f.endswith(ext) for ext in EXCLUDE_EXTS):
                continue
            full_path = os.path.join(root, f)
            arc_name = os.path.relpath(full_path, '.')
            zf.write(full_path, arc_name)

import shutil
for t in targets[1:]:
    try:
        shutil.copyfile(primary_target, t)
    except Exception as e:
        pass

print(f"✅ ZIP archive created ({os.path.getsize(primary_target)} bytes) -> {[t for t in targets]}")
