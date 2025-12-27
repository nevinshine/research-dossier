#!/usr/bin/env bash

DAY_NUM="$1"
DESC="$2"

if [ -z "$DAY_NUM" ]; then
  echo "❌ Usage: ./scripts/new_day.sh <day-number> [description]"
  exit 1
fi

BASE_DIR="src/content/docs/100-days"
DAY_FILE="$BASE_DIR/day-$DAY_NUM.md"
INDEX_FILE="$BASE_DIR/index.md"

TITLE="Day $DAY_NUM"
DESCRIPTION=${DESC:-"Daily DevSecOps progress log."}

mkdir -p "$BASE_DIR"

# -------------------------
# Create day file
# -------------------------
if [ -f "$DAY_FILE" ]; then
  echo "❌ day-$DAY_NUM.md already exists"
  exit 1
fi

cat <<EOF > "$DAY_FILE"
---
title: "$TITLE"
description: "$DESCRIPTION"
---

### Overview

Work conducted on **Day $DAY_NUM** of the **100 Days of DevSecOps** challenge.

### Tasks
- TBD

### Notes
- TBD

### Status
**Completed**
EOF

echo "✅ Created $DAY_FILE"

# -------------------------
# Update index.md
# -------------------------
if [ ! -f "$INDEX_FILE" ]; then
  echo "⚠️ index.md not found — skipping index update"
  exit 0
fi

LINE="| **Day $DAY_NUM** | $DESCRIPTION | <span style=\"color:#39FF14; font-weight:bold;\">Completed</span> |"

# Insert before the separator line (---)
awk -v newline="$LINE" '
  /^\| :---/ { print; print newline; next }
  { print }
' "$INDEX_FILE" > "$INDEX_FILE.tmp" && mv "$INDEX_FILE.tmp" "$INDEX_FILE"

echo "✅ Updated index.md"

