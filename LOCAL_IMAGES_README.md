# Local Image Generation Setup

## ✅ Complete!

All 32 images have been successfully generated using **Tiny Stable Diffusion** running locally on your Mac with **Apple Silicon MPS** acceleration.

## What Was Done

### 1. Image Generation
- **Model**: segmind/tiny-sd (lightweight Stable Diffusion)
- **Device**: Apple Silicon GPU (MPS)
- **Quality**: float32 (required for MPS compatibility)
- **Resolution**: 512x512 pixels
- **Generation Time**: ~20 minutes for all 32 images (~38 seconds per image)
- **Location**: `generated_images/` directory

### 2. HTML Integration
All HTML pages now display the locally generated images:
- **index.html**: Main page with featured story, news grid, and more stories
- **article.html**: Individual article pages with hero images and related stories
- **script.js**: Updated to use local image paths
- **article.js**: Updated to display images on article pages

## Generated Images
```
generated_images/
├── story_01_man_with_delayed_shadow.png
├── story_02_independent_dutch_cheese.png
├── story_03_tuesday_abolished.png
├── ... (all 32 stories)
└── story_32_chocolate_asylum.png
```

## How to Use

### Generate Images Again
```bash
# Activate virtual environment
source venv/bin/activate

# Generate all images
python generate_images.py

# Generate specific range
python generate_images.py --start-from 1 --end-at 10

# Generate single image
python generate_images.py --single 5

# Custom settings
python generate_images.py --width 768 --height 768 --steps 50
```

### View the Website
Simply open `index.html` in a web browser. All images will load from the `generated_images/` folder.

## Technical Details

### MPS Optimization
- Used **float32** instead of float16 (fixes black image bug on MPS)
- Generator on CPU (MPS compatibility workaround)
- Memory optimizations enabled (attention slicing, VAE slicing)

### Files Modified
- `generate_images.py` - Updated to use tiny-sd with MPS support
- `requirements.txt` - Simplified dependencies
- `script.js` - Added image URLs and updated rendering
- `article.js` - Updated article page image rendering

## Performance
- **Average**: 38 seconds per image on Apple Silicon
- **Total**: 20 minutes for all 32 images
- **Memory**: ~4-6GB during generation

## Next Steps
To regenerate with different settings:
1. Adjust `--steps` (25-50 recommended, higher = better quality)
2. Adjust `--width` and `--height` (512-768 recommended for tiny-sd)
3. Edit prompts in `generate_images.py` STORY_PROMPTS array
