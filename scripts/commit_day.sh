#!/usr/bin/env bash

DAY_NUM="$1"

if [ -z "$DAY_NUM" ]; then
  echo "❌ Usage: ./scripts/commit_day.sh <day-number>"
  exit 1
fi

git add src/content/docs/100-days/day-$DAY_NUM.md
git add src/content/docs/100-days/index.md

git commit -m "Day $DAY_NUM: DevSecOps progress log"

git push origin main

echo "✅ Day $DAY_NUM committed and pushed"
