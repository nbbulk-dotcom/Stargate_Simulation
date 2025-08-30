#!/bin/bash


echo "=== Devin AI Project Initialization ==="

export DEVIN_FORCE_ABSOLUTE_PATHS=1
export DEVIN_VERBOSE_LOGGING=1
export DEVIN_DISABLE_PATH_TRUNCATION=1
export DEVIN_SOCKET_TIMEOUT=120   # Increase default socket timeout to 120s

cat <<EOF > .env
DEVIN_FORCE_ABSOLUTE_PATHS=1
DEVIN_VERBOSE_LOGGING=1
DEVIN_DISABLE_PATH_TRUNCATION=1
DEVIN_SOCKET_TIMEOUT=120
EOF

alias devin_cat='find \$PWD -type f -name "*" | xargs -I{} echo Reading: {}; cat'

function show_tree() {
    echo "Full project folder tree:"
    tree -L 5 || ls -R | less
}
export -f show_tree

cat <<EOF > PROJECT_BEST_PRACTICES.md

- ALWAYS reference files using absolute (full) paths!
- NEVER truncate file or folder names—be explicit.
- Print the full directory tree using \`show_tree\` before any file operation.
- Always add new files to version control explicitly (\`git add path/to/file\`).
- Increase all socket, API, and process timeouts to at least 120s.
- Log all errors, warnings, and tracebacks in \`logs/\` with timestamps.

Before starting any coding, always run:
source devin-init.sh
EOF

mkdir -p logs

echo "Devin AI project configured for safe, full-path, verbose operation."
echo "Remember to run 'source ./devin-init.sh' at the start of every new session."
