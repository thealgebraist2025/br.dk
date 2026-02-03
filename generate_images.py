"""
Tiny Stable Diffusion Image Generator for Bizarre News Stories
Generates images for all 32 absurd news articles using local tiny-sd model
Optimized for Apple Silicon (MPS) and PyTorch
"""

import torch
from diffusers import StableDiffusionPipeline
from pathlib import Path
import json
from datetime import datetime

# High-quality detailed prompts for each bizarre story
STORY_PROMPTS = [
    {
        "id": 1,
        "title": "Man with Delayed Shadow",
        "prompt": "photorealistic news photograph, middle-aged danish man in business casual standing on a sunny copenhagen street, his shadow bizarrely appears 3 meters behind him instead of at his feet, physics-defying phenomenon, professional photojournalism, dramatic lighting, ultra detailed, 8k, award winning photography, cinematic composition, shallow depth of field, golden hour lighting, Danish architecture in background",
        "negative_prompt": "cartoon, anime, painting, illustration, low quality, blurry"
    },
    {
        "id": 2,
        "title": "Independent Dutch Cheese",
        "prompt": "hyper-realistic editorial photograph, massive 200kg gouda cheese wheel on ornate pedestal with tiny flag planted on top, miniature declaration of independence document, solemn official ceremony setting, Dutch officials looking bewildered in background, professional news photography, dramatic rim lighting, ultra sharp focus, photorealistic texture of cheese, 8k resolution, pulitzer prize winning composition",
        "negative_prompt": "cartoon, painting, low quality, amateur, sketchy"
    },
    {
        "id": 3,
        "title": "Tuesday Abolished",
        "prompt": "dramatic photojournalistic image, Danish parliament chamber christiansborg, large official calendar on wall with tuesday crossed out in red marker, politicians debating passionately, monday extended to 48 hours shown on digital clock, serious governmental atmosphere, professional news photo, crisp details, cinematic lighting, ultra high resolution 8k, reuters style documentation",
        "negative_prompt": "illustration, cartoon, painting, unrealistic, blurry"
    },
    {
        "id": 4,
        "title": "Cats See WiFi",
        "prompt": "stunning scientific visualization, professional photograph of tabby cat with eyes glowing subtly, overlaid with visible wifi signal waves rendered as blue ethereal light streams in the air, laboratory setting, researchers in background taking notes, photoreal cat, scientific documentary style, national geographic quality, ultra detailed fur texture, 8k, dramatic scientific lighting, bokeh background",
        "negative_prompt": "cartoon, anime, low quality, painting, fake looking"
    },
    {
        "id": 5,
        "title": "Invisible Painting",
        "prompt": "sophisticated art gallery photograph, wealthy art collector in expensive suit gesturing enthusiastically at completely blank white canvas in ornate gold frame, other confused gallery visitors, dramatic gallery lighting, crystal clear 8k photography, architectural digest quality, photorealistic, cinematic composition, shallow depth of field, contemporary art museum interior",
        "negative_prompt": "cartoon, illustration, painting style, low resolution, blurry"
    },
    {
        "id": 6,
        "title": "Heated Ice Curling",
        "prompt": "sports photography masterpiece, olympic curling arena with ice rink steaming slightly, thermometer showing 1°C, danish athletes sweeping, officials inspecting ice with infrared camera, professional sports journalism, action shot, ultra sharp 8k, dramatic sports lighting, nike advertisement quality, photorealistic ice texture with condensation",
        "negative_prompt": "cartoon, illustration, painting, amateur, low quality"
    },
    {
        "id": 7,
        "title": "Man Becomes Pigeon",
        "prompt": "surreal photorealistic news image, confused looking grey pigeon wearing tiny business glasses and miniature tie sitting on dinner table, shocked family members in background, aarhus apartment interior, ultra detailed feather texture, professional photojournalism, absurdist documentary style, 8k resolution, perfect focus on pigeon, cinematic lighting, AP news quality",
        "negative_prompt": "cartoon, anime, painting, illustration, unrealistic rendering"
    },
    {
        "id": 8,
        "title": "Moving Mountain",
        "prompt": "epic landscape photography, matterhorn mountain with obvious gap in landscape showing it has shifted 40 meters east, geological survey team with equipment in foreground, dramatic alpine scenery, golden hour lighting, professional nature photography, national geographic cover quality, ultra sharp 8k, aerial perspective drone shot, cinematic composition",
        "negative_prompt": "painting, illustration, cartoon, low quality, fake"
    },
    {
        "id": 9,
        "title": "Monday Planet",
        "prompt": "space photography masterpiece, distant exoplanet with depressing grey-blue atmosphere, NASA hubble telescope style, planet radiating visible waves of mundane exhaustion energy, space station in foreground with scientists observing, photorealistic space scene, 8k ultra detailed, cinematic space lighting, cosmic horror aesthetic, professional astronomy photograph",
        "negative_prompt": "cartoon, painting, illustration, fantasy art, low quality"
    },
    {
        "id": 10,
        "title": "Bornholm for Pizza",
        "prompt": "diplomatic press conference photograph, massive 12-meter pizza on negotiation table with map of Bornholm island next to it, Danish and Italian officials shaking hands, professional political photojournalism, EU flags in background, ultra realistic food photography, 8k resolution, reuters news quality, dramatic conference room lighting, photorealistic pizza texture",
        "negative_prompt": "cartoon, illustration, painting, unrealistic, amateur"
    },
    {
        "id": 11,
        "title": "Backwards Opera Singer",
        "prompt": "dramatic performance photograph, elegant soprano in full opera costume on grand stage, musical notes visually flowing backwards from her mouth, Copenhagen opera house, audience applauding, professional theater photography, 8k ultra detailed, cinematic stage lighting, playbill magazine quality, photorealistic fabric textures, shallow depth of field",
        "negative_prompt": "cartoon, anime, painting, illustration, low resolution"
    },
    {
        "id": 12,
        "title": "Team vs Itself",
        "prompt": "sports photography chaos, football field with AGF players in same uniform playing against themselves, scoreboard showing 5-3, two goalkeepers in identical jerseys looking confused, professional sports journalism, action packed composition, 8k ultra sharp, dramatic stadium lighting, ESPN quality, photorealistic grass texture, motion blur on ball",
        "negative_prompt": "cartoon, illustration, painting, fake, low quality"
    },
    {
        "id": 13,
        "title": "Bridge Becomes Roundabout",
        "prompt": "aerial drone photography, langebro bridge in copenhagen impossibly curved into circular roundabout shape, cars driving in confused circles, boats passing underneath, professional urban photography, 8k ultra detailed, dramatic cityscape, architectural photography excellence, photorealistic water reflections, golden hour lighting",
        "negative_prompt": "cartoon, painting, illustration, 3d render, unrealistic"
    },
    {
        "id": 14,
        "title": "Sentient Croissant",
        "prompt": "editorial photography masterpiece, golden french croissant on parisian cafe table with tiny picket sign reading 'Je Suis Conscient', lawyer with briefcase consulting with pastry, bewildered cafe patrons, professional photojournalism, 8k macro photography, perfect croissant texture, cinematic cafe lighting, magnum photos quality",
        "negative_prompt": "cartoon, illustration, painting, fake, low quality"
    },
    {
        "id": 15,
        "title": "Thursday Math",
        "prompt": "scientific documentary photograph, university mathematics classroom, chalkboard showing '2+2=5' with complex proof, professor pointing at equations, calendar showing Thursday 2:30 PM, confused students, professional educational photography, 8k resolution, dramatic classroom lighting, academic journal quality, photorealistic chalk texture",
        "negative_prompt": "cartoon, illustration, painting, unrealistic, amateur"
    },
    {
        "id": 16,
        "title": "Compliment Currency",
        "prompt": "political press conference image, danish prime minister presenting oversized ceremonial 'nice words' note instead of money, economic charts showing compliment exchange rates, serious governmental setting, professional political photography, 8k ultra detailed, reuters quality, cinematic lighting, photorealistic documents and charts",
        "negative_prompt": "cartoon, painting, illustration, fake, low resolution"
    },
    {
        "id": 17,
        "title": "Painting Gone Missing",
        "prompt": "museum documentary photograph, ornate empty gold frame on wall with small 'back in 5 minutes' note, security guards with flashlights searching, renaissance museum interior, professional cultural photography, 8k ultra sharp, dramatic museum lighting, smithsonian magazine quality, photorealistic baroque architecture",
        "negative_prompt": "cartoon, illustration, painting, unrealistic, blurry"
    },
    {
        "id": 18,
        "title": "Chess Cheating",
        "prompt": "championship chess photography, grandmaster moving opponent's pieces while judges watch and nod approvingly, world championship setting, professional sports photography, ultra detailed chess board, 8k resolution, dramatic competition lighting, sports illustrated quality, photorealistic chess pieces, shallow depth of field",
        "negative_prompt": "cartoon, illustration, painting, fake, amateur"
    },
    {
        "id": 19,
        "title": "Milk Rain",
        "prompt": "weather phenomenon photograph, danish street with white milky rain falling, scientist in raincoat holding beaker collecting samples, people with umbrellas, wet pavement with milk puddles, professional meteorological photography, 8k ultra detailed, dramatic stormy lighting, national geographic quality, photorealistic liquid textures",
        "negative_prompt": "cartoon, painting, illustration, unrealistic, low quality"
    },
    {
        "id": 20,
        "title": "Buddhist Robot",
        "prompt": "spiritual documentary photograph, sleek humanoid robot in traditional orange buddhist monk robes meditating in kyoto temple, incense smoke, amazed human monks observing, professional photojournalism, 8k ultra sharp, cinematic temple lighting, national geographic quality, photorealistic robot details, zen atmosphere",
        "negative_prompt": "cartoon, anime, illustration, painting, fake, sci-fi render"
    },
    {
        "id": 21,
        "title": "Early Monday",
        "prompt": "scientific study photograph, chronobiology lab with large clock showing 3:00 AM Sunday/Monday, researchers with clipboards, sleep-deprived participants, graph showing monday starting earlier, professional scientific photography, 8k resolution, fluorescent lab lighting, science journal quality, photorealistic laboratory equipment",
        "negative_prompt": "cartoon, illustration, painting, unrealistic, amateur"
    },
    {
        "id": 22,
        "title": "City Renamed BZZZZZT",
        "prompt": "town hall press conference, mayor unveiling new city sign reading 'BZZZZZT' in bold letters, confused citizens, old 'Næstved' sign being removed, professional political photography, 8k ultra detailed, dramatic announcement lighting, reuters quality, photorealistic signage, documentary style",
        "negative_prompt": "cartoon, illustration, painting, fake, low resolution"
    },
    {
        "id": 23,
        "title": "Semicolon Novel",
        "prompt": "literary photography, thick 500-page book open showing pages filled entirely with semicolons, author in turtleneck holding book proudly, copenhagen bookstore, professional publishing photography, 8k macro detail, dramatic bookshop lighting, new yorker magazine quality, photorealistic paper texture, artistic composition",
        "negative_prompt": "cartoon, illustration, painting, unrealistic, blurry"
    },
    {
        "id": 24,
        "title": "Dolphin Swimmer",
        "prompt": "olympic pool photography, swimmer emerging from water with suspicious dolphin-like features, officials with clipboards looking concerned, underwater cameras, DNA test kit visible, professional sports journalism, 8k ultra sharp, dramatic pool lighting, sports illustrated cover quality, photorealistic water splashes",
        "negative_prompt": "cartoon, anime, illustration, painting, fake"
    },
    {
        "id": 25,
        "title": "Professor Parrot",
        "prompt": "academic photography, beautiful scarlet macaw parrot wearing tiny professor glasses at university lectern, chalkboard with perfect danish grammar, students taking notes, aalborg university classroom, professional educational photography, 8k ultra detailed, classroom lighting, academic journal quality, photorealistic feather detail",
        "negative_prompt": "cartoon, illustration, painting, unrealistic, low quality"
    },
    {
        "id": 26,
        "title": "Selfie-Fighting Fjord",
        "prompt": "action photography, norwegian geirangerfjord with tourists being gently pushed by invisible force, selfie sticks flying, 'No Selfies' signs on rocks, dramatic fjord landscape, professional travel photography, 8k ultra sharp, dramatic nordic lighting, national geographic quality, photorealistic mountain and water",
        "negative_prompt": "cartoon, painting, illustration, fake, amateur"
    },
    {
        "id": 27,
        "title": "Schrödinger's Coffee",
        "prompt": "quantum physics visualization, coffee mug with steam swirling in impossible patterns, overlaid quantum equations, physics laboratory, confused researcher holding thermometer, professional scientific photography, 8k macro detail, dramatic lab lighting, scientific american quality, photorealistic coffee and steam",
        "negative_prompt": "cartoon, illustration, painting, unrealistic, blurry"
    },
    {
        "id": 28,
        "title": "Mandatory Laughter Law",
        "prompt": "parliamentary photography, danish politicians with forced smiles at podium, 'Mandatory Laughter Act' document visible, serious security enforcing smiling, professional political photojournalism, 8k ultra detailed, formal government lighting, reuters quality, photorealistic official documents",
        "negative_prompt": "cartoon, illustration, painting, fake, low resolution"
    },
    {
        "id": 29,
        "title": "Statue Goes Home",
        "prompt": "street photography, bronze statue climbing down from empty pedestal on copenhagen strøget, carrying small suitcase, shocked tourists watching, professional urban photography, 8k ultra sharp, dramatic city lighting, magnum photos quality, photorealistic bronze texture, candid documentary style",
        "negative_prompt": "cartoon, illustration, painting, 3d render, unrealistic"
    },
    {
        "id": 30,
        "title": "Backwards Golf",
        "prompt": "golf tournament photography, golfer hitting ball in completely wrong direction but scoring hole-in-one, confused spectators, scoreboard showing perfect score, professional sports photography, 8k ultra detailed, sunny golf course lighting, PGA tour quality, photorealistic grass and equipment, action shot",
        "negative_prompt": "cartoon, illustration, painting, fake, low quality"
    },
    {
        "id": 31,
        "title": "Sun Won't Set",
        "prompt": "time-lapse documentary photograph, danish jylland landscape with sun stuck in same position across 72 hours, confused people checking watches, astronomers with telescopes, professional scientific photography, 8k ultra detailed, perpetual golden hour lighting, BBC earth quality, photorealistic sky phenomenon",
        "negative_prompt": "cartoon, painting, illustration, unrealistic, amateur"
    },
    {
        "id": 32,
        "title": "Chocolate Asylum",
        "prompt": "diplomatic photography, pallet of belgian chocolate with tiny asylum application papers, swiss border crossing, serious immigration officials inspecting chocolate, professional news photography, 8k ultra sharp, dramatic border lighting, AP news quality, photorealistic chocolate packaging, documentary journalism style",
        "negative_prompt": "cartoon, illustration, painting, fake, low resolution"
    }
]


def setup_tiny_sd_pipeline(model_id="segmind/tiny-sd", device=None):
    """
    Initialize Tiny Stable Diffusion pipeline optimized for MPS/CPU
    
    Args:
        model_id: HuggingFace model identifier (default: segmind/tiny-sd)
        device: Device to run on ('mps', 'cuda', 'cpu', or None for auto-detect)
    
    Returns:
        Configured StableDiffusionPipeline
    """
    # Auto-detect best device
    if device is None:
        if torch.backends.mps.is_available():
            device = "mps"
        elif torch.cuda.is_available():
            device = "cuda"
        else:
            device = "cpu"
    
    print(f"Loading Tiny SD model: {model_id}")
    print(f"Using device: {device}")
    
    # MPS requires float32 to avoid black images (known bug)
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
        safety_checker=None,  # Disable safety checker for speed
    )
    
    pipe = pipe.to(device)
    
    # Enable memory optimizations
    pipe.enable_attention_slicing()
    if device == "mps":
        # Additional MPS optimizations
        pipe.vae.enable_slicing()
    
    print(f"✓ Tiny SD pipeline loaded successfully on {device}")
    return pipe


def generate_image(pipe, prompt_data, output_dir, device, width=512, height=512, num_inference_steps=25, guidance_scale=7.5):
    """
    Generate a single image using Tiny Stable Diffusion
    
    Args:
        pipe: StableDiffusionPipeline instance
        prompt_data: Dictionary containing prompt information
        output_dir: Directory to save generated images
        device: Device being used ('mps', 'cuda', or 'cpu')
        width: Image width (512 recommended for tiny-sd)
        height: Image height (512 recommended for tiny-sd)
        num_inference_steps: Number of denoising steps (25-50 recommended)
        guidance_scale: Guidance scale (7.5 is standard)
    
    Returns:
        Path to saved image
    """
    story_id = prompt_data['id']
    title = prompt_data['title']
    prompt = prompt_data['prompt']
    negative_prompt = prompt_data.get('negative_prompt', '')
    
    print(f"\n{'='*80}")
    print(f"Generating Image {story_id}/32: {title}")
    print(f"{'='*80}")
    print(f"Prompt: {prompt[:100]}...")
    
    # Clear cache before generation
    if device == "cuda":
        torch.cuda.empty_cache()
    elif device == "mps":
        torch.mps.empty_cache()
    
    # Generator must be on CPU for MPS (known MPS bug workaround)
    generator = torch.Generator(device="cpu").manual_seed(42 + story_id)
    
    # Generate image
    image = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        height=height,
        width=width,
        num_inference_steps=num_inference_steps,
        guidance_scale=guidance_scale,
        generator=generator
    ).images[0]
    
    # Save image
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)
    
    # Clean filename - remove special characters
    clean_title = title.lower().replace(' ', '_')
    clean_title = clean_title.replace("'", "").replace('"', "").replace('ö', 'o').replace('ä', 'a').replace('å', 'a')
    filename = f"story_{story_id:02d}_{clean_title}.png"
    filepath = output_dir / filename
    
    image.save(filepath)
    print(f"✓ Saved: {filepath}")
    
    # Clear cache after generation
    if device == "cuda":
        torch.cuda.empty_cache()
    elif device == "mps":
        torch.mps.empty_cache()
    
    return filepath


def generate_all_images(output_dir="generated_images", batch_size=1, start_from=1, end_at=32, 
                       width=512, height=512, steps=25):
    """
    Generate all 32 bizarre news story images using Tiny SD
    
    Args:
        output_dir: Directory to save images
        batch_size: Number of images to generate before clearing cache
        start_from: First story ID to generate
        end_at: Last story ID to generate
        width: Image width (default 512)
        height: Image height (default 512)
        steps: Inference steps (default 25)
    """
    print("\n" + "="*80)
    print("TINY STABLE DIFFUSION BIZARRE NEWS IMAGE GENERATOR")
    print("="*80)
    print(f"Total stories to generate: {end_at - start_from + 1}")
    print(f"Output directory: {output_dir}")
    print(f"Image size: {width}x{height}")
    print(f"Inference steps: {steps}")
    print("="*80 + "\n")
    
    # Auto-detect best device
    if torch.backends.mps.is_available():
        device = "mps"
        print(f"✓ Using Apple Silicon GPU (MPS)")
    elif torch.cuda.is_available():
        device = "cuda"
        print(f"✓ Using NVIDIA GPU: {torch.cuda.get_device_name(0)}")
    else:
        device = "cpu"
        print("⚠️  Using CPU (will be slow)")
    
    # Setup pipeline
    pipe = setup_tiny_sd_pipeline(device=device)
    
    # Generate images
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
            
            # Clear cache periodically
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
    
    # Save metadata
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
    
    # Summary
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
    
    parser = argparse.ArgumentParser(description="Generate bizarre news images with Tiny Stable Diffusion")
    parser.add_argument("--output-dir", type=str, default="generated_images", 
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
                       help="Inference steps (default: 25, higher=better quality)")
    
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
