#!/usr/bin/env python3
"""
Generate images for Titanic Captain Simulator using Tiny Stable Diffusion
Uses the lightweight tiny-sd model which requires less disk space and RAM
"""
import torch
from diffusers import StableDiffusionPipeline
from pathlib import Path

# Image prompts for each scene with negative prompts
SCENE_PROMPTS = [
    {
        "name": "start",
        "prompt": "photorealistic RMS Titanic at night on calm ocean, moonlit waters, majestic passenger ship, 1912, cinematic lighting, dramatic night sky with stars, oil painting style, ultra detailed, 8k quality",
        "negative_prompt": "cartoon, anime, illustration, low quality, blurry, modern ship"
    },
    {
        "name": "fullSpeed",
        "prompt": "RMS Titanic speeding through dark ocean at night, dramatic ship wake, stars above, dramatic perspective from side, vintage photograph style, 1912, high speed motion, cinematic",
        "negative_prompt": "cartoon, daytime, colorful, low quality, modern"
    },
    {
        "name": "reducedSpeed",
        "prompt": "RMS Titanic moving slowly through dark waters at night, cautious navigation, moonlight reflecting on water, calm sea, historical painting style, careful movement, 1912",
        "negative_prompt": "cartoon, fast motion, bright, low quality, illustration"
    },
    {
        "name": "extraLookouts",
        "prompt": "ship lookouts in crow's nest at night scanning horizon with binoculars, dark ocean, vigilant watch, dramatic lighting from below, historical photograph, 1912 Titanic",
        "negative_prompt": "cartoon, daytime, colorful, modern equipment, low quality"
    },
    {
        "name": "hardTurn",
        "prompt": "RMS Titanic colliding with massive white iceberg at night, dramatic impact moment, disaster scene, spray of ice and water, cinematic lighting, historical tragedy, 1912",
        "negative_prompt": "cartoon, safe, peaceful, low quality, illustration, sunny"
    },
    {
        "name": "portTurn",
        "prompt": "ship stern hitting iceberg at night, collision from behind, damaged propellers visible, dramatic emergency scene, dark waters, ice debris, 1912 disaster",
        "negative_prompt": "cartoon, safe, daytime, low quality, modern ship"
    },
    {
        "name": "avoidedEarly",
        "prompt": "RMS Titanic safely passing large iceberg at night, narrow miss, dramatic near-miss moment, relief, moonlit iceberg glowing, safe navigation, 1912, photorealistic",
        "negative_prompt": "collision, disaster, cartoon, low quality, blurry, daytime"
    },
    {
        "name": "safePassing",
        "prompt": "RMS Titanic sailing safely past large iceberg in distance, peaceful night scene, successful navigation, calm waters, stars above, safe voyage, 1912, cinematic",
        "negative_prompt": "collision, emergency, cartoon, low quality, storm"
    },
    {
        "name": "betterWarning",
        "prompt": "RMS Titanic glancing off iceberg at night, minor collision with sparks, ice chunks falling, dramatic but survivable, hope amid crisis, 1912",
        "negative_prompt": "cartoon, total destruction, sinking, low quality, peaceful"
    },
    {
        "name": "stopAndTurn",
        "prompt": "RMS Titanic barely scraping iceberg while turning sharply, close call, narrow escape, night scene with tension, ice crystals in air, 1912, photorealistic",
        "negative_prompt": "cartoon, major damage, sinking, low quality, daytime"
    },
    {
        "name": "assessDamage",
        "prompt": "flooding compartments inside Titanic ship interior, water rushing in through hull breach, crew assessing damage with lanterns, emergency scene, dramatic interior lighting, 1912",
        "negative_prompt": "cartoon, exterior, dry, safe, low quality, modern"
    },
    {
        "name": "sternDamage",
        "prompt": "damaged stern of RMS Titanic at night, listing ship with damaged propellers visible, crew working frantically, emergency scene, moonlight, 1912 disaster",
        "negative_prompt": "cartoon, undamaged, safe, low quality, daytime"
    },
    {
        "name": "partialDamage",
        "prompt": "RMS Titanic damaged but still afloat, three compartments flooding, crew working on pumps, night scene with hope and determination, survival effort, 1912",
        "negative_prompt": "cartoon, sinking, destroyed, low quality, peaceful"
    },
    {
        "name": "survivalGood",
        "prompt": "RMS Titanic arriving safely in New York harbor, celebration scene, flags waving, daylight, triumph and joy, historical moment, crowds cheering, 1912, photorealistic",
        "negative_prompt": "night, disaster, damage, cartoon, low quality, empty"
    },
    {
        "name": "survivalGreat",
        "prompt": "RMS Titanic docked in New York with massive crowds celebrating on pier, successful maiden voyage, daylight, joy and relief, confetti, vintage photograph style, 1912",
        "negative_prompt": "disaster, night, damaged, cartoon, low quality, sad"
    },
    {
        "name": "survivalMinor",
        "prompt": "RMS Titanic limping into Halifax harbor for repairs, minor damage visible on hull, safe arrival, relief and gratitude, overcast day, 1912, photorealistic",
        "negative_prompt": "sinking, destroyed, cartoon, sunny, low quality, night"
    },
    {
        "name": "survivalPartial",
        "prompt": "damaged RMS Titanic reaching port safely, all passengers saved, repair crews ready on dock, dawn light with orange sky, survival and gratitude, 1912",
        "negative_prompt": "sinking, night, cartoon, destroyed, low quality"
    },
    {
        "name": "survivalDamaged",
        "prompt": "RMS Titanic in St Johns harbor with visible stern damage, survivors disembarking onto dock, safe but wounded ship, morning light, relief, 1912, photorealistic",
        "negative_prompt": "sinking, night, perfect condition, cartoon, low quality"
    },
    {
        "name": "historicalEnd",
        "prompt": "RMS Titanic sinking at night with stern rising from water, lifeboats rowing away, stars above, tragic historical moment, somber and respectful, 1912 disaster, cinematic",
        "negative_prompt": "cartoon, safe, happy, low quality, daytime, illustration"
    }
]


def setup_pipeline():
    """Setup Tiny SD pipeline optimized for MPS/CPU"""
    
    # Auto-detect best device
    if torch.backends.mps.is_available():
        device = "mps"
        dtype = torch.float32  # MPS requires float32
        print("✓ Using Apple Silicon GPU (MPS)")
    elif torch.cuda.is_available():
        device = "cuda"
        dtype = torch.float16
        print("✓ Using NVIDIA GPU")
    else:
        device = "cpu"
        dtype = torch.float32
        print("⚠️  Using CPU (will be slow)")
    
    print("Loading Tiny Stable Diffusion model...")
    pipe = StableDiffusionPipeline.from_pretrained(
        "segmind/tiny-sd",  # Much smaller model
        torch_dtype=dtype,
        safety_checker=None
    )
    
    pipe = pipe.to(device)
    pipe.enable_attention_slicing()
    
    if device == "mps":
        pipe.vae.enable_slicing()
    
    print(f"✓ Model loaded successfully on {device}")
    return pipe, device


def generate_images():
    """Generate all scene images"""
    
    output_dir = Path("titanic_images")
    output_dir.mkdir(exist_ok=True)
    
    pipe, device = setup_pipeline()
    
    total = len(SCENE_PROMPTS)
    for idx, scene_data in enumerate(SCENE_PROMPTS, 1):
        scene_name = scene_data["name"]
        prompt = scene_data["prompt"]
        negative_prompt = scene_data["negative_prompt"]
        
        print(f"\n[{idx}/{total}] Generating: {scene_name}")
        print(f"Prompt: {prompt[:80]}...")
        
        try:
            # Generator on CPU for MPS compatibility
            generator = torch.Generator(device="cpu").manual_seed(42 + idx)
            
            image = pipe(
                prompt=prompt,
                negative_prompt=negative_prompt,
                num_inference_steps=64,
                guidance_scale=7.5,
                height=512,
                width=768,
                generator=generator
            ).images[0]
            
            output_path = output_dir / f"{scene_name}.png"
            image.save(output_path)
            print(f"✓ Saved: {output_path}")
            
            # Clear cache
            if device == "mps":
                torch.mps.empty_cache()
            elif device == "cuda":
                torch.cuda.empty_cache()
                
        except Exception as e:
            print(f"✗ Error: {e}")
    
    print(f"\n✓ Complete! Generated {total} images in '{output_dir}/'")


if __name__ == "__main__":
    generate_images()
