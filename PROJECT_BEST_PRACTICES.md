
- ALWAYS reference files using absolute (full) paths!
- NEVER truncate file or folder names—be explicit.
- Print the full directory tree using `show_tree` before any file operation.
- Always add new files to version control explicitly (`git add path/to/file`).
- Increase all socket, API, and process timeouts to at least 120s.
- Log all errors, warnings, and tracebacks in `logs/` with timestamps.

Before starting any coding, always run:
source devin-init.sh
