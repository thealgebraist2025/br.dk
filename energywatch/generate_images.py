"""
Tiny SD Image Generator for EnergyWatch Stories
Generates images for all 32 absurd energy news articles
Optimized for Apple Silicon (MPS) and PyTorch
"""

import torch
from diffusers import StableDiffusionPipeline
from pathlib import Path
import json
from datetime import datetime

# Detailed prompts for each energy story
STORY_PROMPTS = [
    {
        "id": 1,
        "title": "Wind Turbine Existential Crisis",
        "prompt": "photorealistic news photograph, large offshore wind turbine with human-like expression painted on nacelle looking depressed, monday calendar visible, dramatic stormy sky, professional energy journalism, 8k, reuters quality, industrial photography",
        "negative_prompt": "cartoon, anime, painting, illustration, low quality"
    },
    {
        "id": 2,
        "title": "Oil Barrel Demands Respect",
        "prompt": "professional industrial photograph, oil barrel with protest sign reading 'call me petroleum container', serious corporate setting, oil refinery background, photojournalism style, 8k ultra detailed, bloomberg news quality",
        "negative_prompt": "cartoon, painting, illustration, unrealistic, blurry"
    },
    {
        "id": 3,
        "title": "Electricity Prices Loop Error",
        "prompt": "financial news photography, stock market trading floor screens showing impossible negative infinity price symbols, confused traders, dramatic lighting, professional business journalism, 8k sharp, wall street journal quality",
        "negative_prompt": "cartoon, anime, painting, fake, low quality"
    },
    {
        "id": 4,
        "title": "Nuclear Reactor Confession",
        "prompt": "industrial photography, nuclear power plant cooling towers with giant kettle overlay, steam rising, engineers looking embarrassed, professional energy sector documentation, 8k ultra detailed, scientific american quality",
        "negative_prompt": "cartoon, illustration, painting, unrealistic, amateur"
    },
    {
        "id": 5,
        "title": "Solar Panels Unionize",
        "prompt": "rooftop photography, solar panels with tiny union flags and picket signs, suburban house, sunny day, photorealistic news image, 8k resolution, associated press quality, dramatic composition",
        "negative_prompt": "cartoon, anime, painting, illustration, blurry"
    },
    {
        "id": 6,
        "title": "Coal Plant Burns PowerPoints",
        "prompt": "industrial facility photograph, coal power plant smokestack with powerpoint slides visible being fed in, ironic clean emissions, professional environmental journalism, 8k sharp focus, guardian news quality",
        "negative_prompt": "cartoon, painting, illustration, fake, low resolution"
    },
    {
        "id": 7,
        "title": "Green Hydrogen Truth",
        "prompt": "scientific laboratory photograph, hydrogen molecule with green eco label sticker, microscope view, skeptical scientists in background, professional science journalism, 8k macro photography, nature magazine quality",
        "negative_prompt": "cartoon, anime, illustration, painting, unrealistic"
    },
    {
        "id": 8,
        "title": "Anxious Battery",
        "prompt": "industrial energy storage photograph, large tesla megapack battery with worried expression indicator lights, therapist chair nearby, california desert, professional tech journalism, 8k detailed, wired magazine quality",
        "negative_prompt": "cartoon, painting, illustration, low quality, blurry"
    },
    {
        "id": 9,
        "title": "Sentient Gas Pipeline",
        "prompt": "industrial infrastructure photograph, massive natural gas pipeline across norwegian landscape with thought bubble hologram, dramatic nordic scenery, professional energy journalism, 8k ultra sharp, financial times quality",
        "negative_prompt": "cartoon, anime, painting, illustration, fake"
    },
    {
        "id": 10,
        "title": "Wind Farm Relocates",
        "prompt": "aerial drone photography, offshore wind farm floating impossibly far from coast, tiny distant shoreline, dramatic ocean expanse, professional renewable energy documentation, 8k aerial view, national geographic quality",
        "negative_prompt": "cartoon, painting, illustration, unrealistic, amateur"
    },
    {
        "id": 11,
        "title": "Carbon Capture Attachment",
        "prompt": "industrial facility photograph, carbon capture plant with giant containment tanks labeled 'my precious CO2', facility looking possessive, professional environmental journalism, 8k detailed, scientific documentation",
        "negative_prompt": "cartoon, anime, illustration, painting, low quality"
    },
    {
        "id": 12,
        "title": "Embarrassed Geothermal",
        "prompt": "industrial photography, geothermal power plant looking guilty with steam vents, dramatic volcanic landscape iceland, professional energy sector journalism, 8k ultra detailed, earth sciences quality",
        "negative_prompt": "cartoon, painting, illustration, unrealistic, blurry"
    },
    {
        "id": 13,
        "title": "Smart Grid Influencer",
        "prompt": "tech photography, smart grid control room with tiktok interface overlay, electrical displays showing follower counts, professional technology journalism, 8k sharp, techcrunch quality, modern aesthetic",
        "negative_prompt": "cartoon, anime, painting, illustration, fake"
    },
    {
        "id": 14,
        "title": "Biogas Podcast",
        "prompt": "industrial facility photograph, biogas plant with podcast recording studio setup, waste digesters, microphone in foreground, professional renewable energy journalism, 8k detailed, vice news quality",
        "negative_prompt": "cartoon, painting, illustration, low quality, amateur"
    },
    {
        "id": 15,
        "title": "Trader Buys Denmark",
        "prompt": "financial news photography, shocked stock trader at multiple screens showing map of denmark and purchase confirmation, trading floor chaos, professional business journalism, 8k sharp, bloomberg terminal quality",
        "negative_prompt": "cartoon, anime, illustration, painting, unrealistic"
    },
    {
        "id": 16,
        "title": "Heat Pump Identity Crisis",
        "prompt": "residential photography, modern heat pump unit with confused expression display, air conditioner unit nearby looking identical, norwegian home, professional hvac journalism, 8k detailed, consumer reports quality",
        "negative_prompt": "cartoon, painting, illustration, fake, blurry"
    },
    {
        "id": 17,
        "title": "LNG Tanker Nation",
        "prompt": "maritime photography, massive lng tanker ship with national flag flying, sovereign nation declaration banner, dramatic ocean sunset, professional shipping journalism, 8k ultra sharp, maritime executive quality",
        "negative_prompt": "cartoon, anime, painting, illustration, low quality"
    },
    {
        "id": 18,
        "title": "Wind Forecast Vibes",
        "prompt": "meteorological photography, weather forecasting center screens showing wind prediction with 'vibes only' note, meteorologists shrugging, professional weather journalism, 8k detailed, weather channel quality",
        "negative_prompt": "cartoon, painting, illustration, unrealistic, amateur"
    },
    {
        "id": 19,
        "title": "Jealous Charging Station",
        "prompt": "urban photography, ev charging station displaying heart symbol for tesla model 3, other cars rejected, copenhagen street, professional automotive journalism, 8k sharp focus, car and driver quality",
        "negative_prompt": "cartoon, anime, illustration, painting, fake"
    },
    {
        "id": 20,
        "title": "Viking Link Renamed",
        "prompt": "underwater cable photography, massive subsea power cable with viking link nameplate being replaced by 'lightning serpent 3000' graffiti, north sea, professional energy journalism, 8k detailed, offshore technology quality",
        "negative_prompt": "cartoon, painting, illustration, low quality, blurry"
    },
    {
        "id": 21,
        "title": "Pumped Hydro Water Play",
        "prompt": "hydroelectric facility photograph, massive reservoir with water cascading down, engineer playing with water controls like playground, norwegian mountains, professional renewable energy journalism, 8k ultra sharp",
        "negative_prompt": "cartoon, anime, painting, illustration, unrealistic"
    },
    {
        "id": 22,
        "title": "Demand Response Too Good",
        "prompt": "utility control room photography, power grid displays showing zero consumption, desperate operators with 'please use electricity' signs, professional energy management journalism, 8k detailed",
        "negative_prompt": "cartoon, painting, illustration, fake, amateur"
    },
    {
        "id": 23,
        "title": "Transmission Line Acrophobia",
        "prompt": "mountain photography, high voltage transmission towers in alps looking scared, dramatic height perspective, power lines trembling, professional infrastructure journalism, 8k ultra detailed, vertigo inducing angle",
        "negative_prompt": "cartoon, anime, illustration, painting, low quality"
    },
    {
        "id": 24,
        "title": "Methane Escape Manifesto",
        "prompt": "industrial gas facility photograph, pipeline with visible methane leak forming freedom manifesto in the air, north sea platform, professional environmental journalism, 8k sharp, investigative reporting quality",
        "negative_prompt": "cartoon, painting, illustration, unrealistic, blurry"
    },
    {
        "id": 25,
        "title": "Complaining District Heating",
        "prompt": "underground utility photography, district heating pipes in copenhagen street with complaint speech bubbles, exposed infrastructure, professional urban journalism, 8k detailed, engineering news quality",
        "negative_prompt": "cartoon, anime, painting, illustration, fake"
    },
    {
        "id": 26,
        "title": "Seasick Tidal Turbine",
        "prompt": "underwater photography, tidal turbine underwater looking nauseous with sick expression, ocean waves above, dramatic marine environment, professional renewable energy journalism, 8k ultra sharp",
        "negative_prompt": "cartoon, painting, illustration, low quality, amateur"
    },
    {
        "id": 27,
        "title": "Carbon Atom Protest",
        "prompt": "scientific visualization photograph, carbon atom molecules holding tiny protest signs, laboratory setting, molecular structure activism, professional science journalism, 8k macro detail, scientific american quality",
        "negative_prompt": "cartoon, anime, illustration, painting, unrealistic"
    },
    {
        "id": 28,
        "title": "Fusion Reactor Retires",
        "prompt": "nuclear fusion facility photograph, tokamak reactor with 'gone to bahamas' sign, beach vacation poster nearby, professional nuclear journalism, 8k ultra detailed, physics today quality",
        "negative_prompt": "cartoon, painting, illustration, fake, blurry"
    },
    {
        "id": 29,
        "title": "LED Unemployment Crisis",
        "prompt": "industrial photography, led bulbs glowing efficiently, closed power plant in background, unemployment line of generators, professional energy crisis journalism, 8k sharp, economist magazine quality",
        "negative_prompt": "cartoon, anime, painting, illustration, low quality"
    },
    {
        "id": 30,
        "title": "Spiteful Wind Curtailment",
        "prompt": "wind farm photography, scottish wind turbines spinning backwards in reverse, dramatic stormy highlands, professional renewable energy journalism, 8k ultra detailed, energy policy quality",
        "negative_prompt": "cartoon, painting, illustration, unrealistic, amateur"
    },
    {
        "id": 31,
        "title": "Power to X Indecision",
        "prompt": "industrial facility photograph, power-to-x plant with question mark outputs, confused engineers, danish renewable energy site, professional technology journalism, 8k detailed, clean energy quality",
        "negative_prompt": "cartoon, anime, illustration, painting, fake"
    },
    {
        "id": 32,
        "title": "Attention Seeking Crisis",
        "prompt": "news media photography, energy crisis headlines shrinking and disappearing, empty newsroom, professional media journalism, 8k sharp focus, press room quality, ironic documentation",
        "negative_prompt": "cartoon, painting, illustration, low quality, blurry"
    }
]

def setup_tiny_sd_pipeline(model_id="segmind/tiny-sd", device=None):
    """Initialize Tiny SD pipeline optimized for MPS/CPU"""
    if device is None:
        if torch.backends.mps.is_available():
            device = "mps"
        elif torch.cuda.is_available():
            device = "cuda"
        else:
            device = "cpu"
    
    print(f"Loading Tiny SD model: {model_id}")
    print(f"Using device: {device}")
    
    if device == "mps":
        dtype = torch.float32
        print("⚠️  Using float32 for MPS compatibility (prevents black images)")
    elif device == "cuda":
        dtype = torch.float16
    else:
        dtype = torch.float32
    
    print(f"Loading pipeline with dtype: {dtype}")
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id,
        torch_dtype=dtype,
        safety_checker=None,
    )
    
    pipe = pipe.to(device)
    pipe.enable_attention_slicing()
    if device == "mps":
        pipe.vae.enable_slicing()
    
    print(f"✓ Tiny SD pipeline loaded successfully on {device}")
    return pipe

def generate_image(pipe, prompt_data, output_dir, device, width=512, height=512, num_inference_steps=25, guidance_scale=7.5):
    """Generate a single image using Tiny SD"""
    story_id = prompt_data['id']
    title = prompt_data['title']
    prompt = prompt_data['prompt']
    negative_prompt = prompt_data.get('negative_prompt', '')
    
    print(f"\n{'='*80}")
    print(f"Generating Image {story_id}/32: {title}")
    print(f"{'='*80}")
    print(f"Prompt: {prompt[:100]}...")
    
    if device == "cuda":
        torch.cuda.empty_cache()
    elif device == "mps":
        torch.mps.empty_cache()
    
    generator = torch.Generator(device="cpu").manual_seed(42 + story_id)
    
    image = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        height=height,
        width=width,
        num_inference_steps=num_inference_steps,
        guidance_scale=guidance_scale,
        generator=generator
    ).images[0]
    
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)
    
    clean_title = title.lower().replace(' ', '_')
    clean_title = clean_title.replace("'", "").replace('"', "").replace('ö', 'o').replace('ä', 'a').replace('å', 'a')
    filename = f"energy_{story_id:02d}_{clean_title}.png"
    filepath = output_dir / filename
    
    image.save(filepath)
    print(f"✓ Saved: {filepath}")
    
    if device == "cuda":
        torch.cuda.empty_cache()
    elif device == "mps":
        torch.mps.empty_cache()
    
    return filepath

def generate_all_images(output_dir="images", batch_size=1, start_from=1, end_at=32, 
                       width=512, height=512, steps=25):
    """Generate all 32 energy story images"""
    print("\n" + "="*80)
    print("ENERGYWATCH TINY SD IMAGE GENERATOR")
    print("="*80)
    print(f"Total stories to generate: {end_at - start_from + 1}")
    print(f"Output directory: {output_dir}")
    print(f"Image size: {width}x{height}")
    print(f"Inference steps: {steps}")
    print("="*80 + "\n")
    
    if torch.backends.mps.is_available():
        device = "mps"
        print(f"✓ Using Apple Silicon GPU (MPS)")
    elif torch.cuda.is_available():
        device = "cuda"
        print(f"✓ Using NVIDIA GPU: {torch.cuda.get_device_name(0)}")
    else:
        device = "cpu"
        print("⚠️  Using CPU (will be slow)")
    
    pipe = setup_tiny_sd_pipeline(device=device)
    
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    generated_files = []
    start_time = datetime.now()
    
    for i, prompt_data in enumerate(STORY_PROMPTS):
        if prompt_data['id'] < start_from or prompt_data['id'] > end_at:
            continue
            
        try:
            filepath = generate_image(
                pipe,
                prompt_data,
                output_dir,
                device=device,
                width=width,
                height=height,
                num_inference_steps=steps,
                guidance_scale=7.5
            )
            generated_files.append(str(filepath))
            
            if (i + 1) % batch_size == 0:
                if device == "cuda":
                    torch.cuda.empty_cache()
                elif device == "mps":
                    torch.mps.empty_cache()
                print("\n✓ Cache cleared")
                
        except Exception as e:
            print(f"✗ Error generating image {prompt_data['id']}: {e}")
            import traceback
            traceback.print_exc()
            continue
    
    metadata = {
        "generation_date": datetime.now().isoformat(),
        "model": "segmind/tiny-sd",
        "device": device,
        "image_size": f"{width}x{height}",
        "inference_steps": steps,
        "total_images": len(generated_files),
        "files": generated_files,
        "prompts": STORY_PROMPTS[start_from-1:end_at]
    }
    
    metadata_path = output_path / "generation_metadata.json"
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    elapsed = datetime.now() - start_time
    print("\n" + "="*80)
    print("GENERATION COMPLETE")
    print("="*80)
    print(f"Total images generated: {len(generated_files)}")
    print(f"Time elapsed: {elapsed}")
    print(f"Average time per image: {elapsed / len(generated_files) if generated_files else 'N/A'}")
    print(f"Output directory: {output_path.absolute()}")
    print(f"Metadata saved: {metadata_path}")
    print("="*80)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate EnergyWatch images with Tiny SD")
    parser.add_argument("--output-dir", type=str, default="images", 
                       help="Directory to save generated images")
    parser.add_argument("--start-from", type=int, default=1,
                       help="Start from story ID (1-32)")
    parser.add_argument("--end-at", type=int, default=32,
                       help="End at story ID (1-32)")
    parser.add_argument("--batch-size", type=int, default=1,
                       help="Clear cache every N images")
    parser.add_argument("--single", type=int, default=None,
                       help="Generate only a single story by ID")
    parser.add_argument("--width", type=int, default=512,
                       help="Image width (default: 512)")
    parser.add_argument("--height", type=int, default=512,
                       help="Image height (default: 512)")
    parser.add_argument("--steps", type=int, default=25,
                       help="Inference steps (default: 25)")
    
    args = parser.parse_args()
    
    if args.single:
        args.start_from = args.single
        args.end_at = args.single
    
    generate_all_images(
        output_dir=args.output_dir,
        batch_size=args.batch_size,
        start_from=args.start_from,
        end_at=args.end_at,
        width=args.width,
        height=args.height,
        steps=args.steps
    )
