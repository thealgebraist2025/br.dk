# Updating BR.dk from DR.dk

## Overview
BR (Bizarre Rapporter) is a parody news site that creates bizarre takes on real news from DR.dk.

## Quick Update

To update BR.dk with the latest stories from DR.dk, run:

```bash
source venv/bin/activate
python update_from_dr.py
```

## What happens:
1. **Fetches** the latest news headlines from DR.dk
2. **Transforms** them into bizarre/absurd versions
3. **Updates** `script.js` with the new stories
4. The website automatically displays the updated content

## Example Transformation

**Original DR.dk story:**
> "DMI varsler snestorm i store dele af landet"

**Becomes BR.dk story:**
> "DMI varsler snestorm i store dele af landet - og ingen kan forklare hvorfor"
> 
> _Ingen så det komme, men nu er det en realitet. Befolkningen reagerer med forvirring og fascination._

## Last Updated
The script adds a timestamp comment at the top of `script.js` showing when it was last run.

## Files Modified
- `script.js` - Contains all the story data and display logic

## Dependencies
- Python 3.x
- beautifulsoup4
- requests

(Already installed in the venv)
