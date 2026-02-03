import torch
from diffusers import StableDiffusionPipeline
import os
from datetime import datetime
import json

# Story prompts for image generation
story_prompts = [
    ("titanic_01_sinks_47th_time", "dramatic sinking of RMS Titanic ocean liner ship going down into dark blue ocean waters, sailors on deck looking frustrated and annoyed, cinematic lighting"),
    ("titanic_02_unsinkable_stays_down", "luxury ocean liner Titanic resting stubbornly on ocean floor surrounded by fish and coral, ship with defiant expression, underwater scene, dramatic lighting"),
    ("titanic_03_raises_sinks_spite", "salvage team on boats with cranes lifting Titanic ship from ocean, ship looking mischievous as it prepares to sink again, dramatic ocean scene, sunset lighting"),
    ("titanic_04_iceberg_apology", "sad apologetic iceberg with sorry expression facing damaged Titanic ship, emotional scene in arctic waters, dramatic moody lighting"),
    ("titanic_05_spontaneous_unsinking", "Titanic ship rising dramatically from ocean depths on its own, BBC camera crew filming in amazement from boat, magical surreal atmosphere, cinematic"),
    ("titanic_06_button_doesnt_work", "engineers on Titanic deck installing large red emergency button while ship is sinking, absurd comedic scene, dramatic ocean waters"),
    ("titanic_07_sinking_competition", "two Titanic ships racing each other downward into ocean, Olympic medal podium underwater, competitive sports atmosphere, dramatic lighting"),
    ("titanic_08_crew_union_strike", "Titanic crew members holding protest signs about sinking conditions, union strike on ship deck, dramatic ocean background, photorealistic"),
    ("titanic_09_quantum_superposition", "Titanic ship existing in multiple positions simultaneously, both on surface and underwater at same time, quantum physics visualization, surreal artistic style"),
    ("titanic_10_triple_reversal", "Titanic ship caught in circular motion pattern between ocean surface and seabed, motion blur showing constant movement, dramatic blue ocean, chaotic energy"),
    ("titanic_11_sentient_name_change", "futuristic AI-controlled Titanic ship with glowing circuits and displays, ship having identity crisis, sci-fi atmosphere, neon lighting"),
    ("titanic_12_seventeen_copies", "ocean floor covered with identical Titanic ships multiplying like cells dividing, underwater scene showing many copies, surreal atmosphere"),
    ("titanic_13_retires_becomes_reef", "peaceful Titanic ship settled on ocean floor covered in colorful coral and surrounded by tropical fish, serene underwater ecosystem, beautiful lighting"),
    ("titanic_14_restraining_order", "iceberg holding legal documents facing away from approaching Titanic ship, courtroom drama atmosphere in arctic ocean, serious legal scene"),
    ("titanic_15_ai_predicts_847_more", "futuristic computer screens showing predictions of Titanic sinking events, graphs and timelines, sci-fi command center atmosphere"),
    ("titanic_16_achieves_orbit", "Titanic ship floating in space orbit above Earth, NASA space station nearby, surreal space scene with stars and planet, dramatic cosmic lighting"),
    ("titanic_17_aggressively_sinkable", "Titanic ship with aggressive marketing slogans painted on hull, ship diving powerfully into ocean, dramatic action shot, bold typography"),
    ("titanic_18_synchronized_sinking", "two Titanic ships performing synchronized sinking routine like synchronized swimmers, Olympic judges watching, artistic underwater choreography"),
    ("titanic_19_future_still_sinking", "futuristic cityscape built around constantly sinking and rising Titanic ship, time travelers observing, sci-fi atmosphere, neon lights"),
    ("titanic_20_splits_identity_crisis", "Titanic ship split in half with two separate consciousnesses arguing, each half with different expression, dramatic splitting moment in ocean"),
    ("titanic_21_captain_clueless", "confused captain on Titanic bridge shrugging shoulders surrounded by chaos, ship sinking in background, comedic dramatic scene"),
    ("titanic_22_iceberg_youtube", "iceberg with camera setup and ring light creating YouTube content, professional streaming setup in arctic waters, modern influencer aesthetic"),
    ("titanic_23_giant_cork_fails", "enormous comical cork stuck in Titanic hull as ship sinks anyway, absurd Looney Tunes style physics, ocean scene, dramatic failure"),
    ("titanic_24_influencer_lifestyle", "glamorous Titanic ship taking underwater selfies with ring light, influencer aesthetic with sponsored products, social media marketing vibe"),
    ("titanic_25_grabs_ocean_floor", "Titanic ship with arms/tentacles gripping ocean floor refusing to be raised, salvage team pulling with chains, dramatic tug-of-war scene"),
    ("titanic_26_quadruple_unsinking", "Titanic ship performing complex acrobatic maneuver with multiple motion trails, confused expression, complex physics diagram overlay, dramatic action"),
    ("titanic_27_new_species", "scientific classification diagram of Titanic as biological species, marine biology textbook illustration style, taxonomic details, academic atmosphere"),
    ("titanic_28_titanic_iii_presunk", "futuristic submarine factory building new Titanic ship underwater, already on ocean floor before launch, sci-fi industrial scene"),
    ("titanic_29_lifeboats_sinking", "Titanic lifeboats each with their own tiny lifeboats in infinite recursive pattern, Inception-style nested reality, surreal mathematical concept"),
    ("titanic_30_iceberg_melts_guilt", "melted iceberg as puddle with Titanic ship placing flower wreath respectfully, memorial service atmosphere, emotional dramatic lighting"),
    ("titanic_31_stuck_vertical", "Titanic ship standing perfectly vertical pointing straight up from ocean like monument, dramatic silhouette against sunset sky, tourist boats nearby"),
    ("titanic_32_titanic_squared", "two Titanic ships merged into one massive super-ship with mathematical equation overlay, descending rapidly into ocean, epic dramatic scale")
]

def clean_filename(title):
    """Clean filename by removing special characters"""
    # Remove or replace special characters
    cleaned = title.replace("'", "").replace('"', "")
    cleaned = cleaned.replace('ö', 'o').replace('ä', 'a').replace('å', 'a')
    cleaned = cleaned.replace('Ö', 'O').replace('Ä', 'A').replace('Å', 'A')
    return cleaned

# Device setup - MPS for Apple Silicon
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {device}")

# Load model
print("Loading Tiny SD model...")
model_id = "segmind/tiny-sd"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float32,  # MPS requires float32
    safety_checker=None
)
pipe = pipe.to(device)

# Enable memory optimizations for MPS
if device == "mps":
    pipe.enable_attention_slicing()
    # VAE slicing for memory efficiency
    if hasattr(pipe, 'enable_vae_slicing'):
        pipe.enable_vae_slicing()

# Create output directory
output_dir = "images"
os.makedirs(output_dir, exist_ok=True)

# Generation metadata
metadata = {
    "model": model_id,
    "device": device,
    "generated_at": datetime.now().isoformat(),
    "images": []
}

# Generate images
print(f"\nGenerating {len(story_prompts)} images...")
start_time = datetime.now()

for idx, (filename, prompt) in enumerate(story_prompts, 1):
    print(f"\n[{idx}/{len(story_prompts)}] Generating: {filename}")
    print(f"Prompt: {prompt}")
    
    img_start = datetime.now()
    
    # Clean the filename
    clean_name = clean_filename(filename)
    output_path = os.path.join(output_dir, f"{clean_name}.png")
    
    # Generate image
    # Generator must be on CPU for MPS compatibility
    generator = torch.Generator(device="cpu").manual_seed(42 + idx)
    
    with torch.no_grad():
        image = pipe(
            prompt,
            num_inference_steps=25,
            guidance_scale=7.5,
            height=512,
            width=512,
            generator=generator
        ).images[0]
    
    # Save image
    image.save(output_path)
    
    img_duration = (datetime.now() - img_start).total_seconds()
    print(f"✓ Saved: {output_path} (took {img_duration:.1f}s)")
    
    # Add to metadata
    metadata["images"].append({
        "filename": f"{clean_name}.png",
        "prompt": prompt,
        "duration_seconds": img_duration
    })

# Save metadata
total_duration = (datetime.now() - start_time).total_seconds()
metadata["total_duration_seconds"] = total_duration

with open(os.path.join(output_dir, "generation_metadata.json"), "w") as f:
    json.dump(metadata, f, indent=2)

print(f"\n{'='*60}")
print(f"✓ All {len(story_prompts)} images generated!")
print(f"Total time: {total_duration/60:.1f} minutes ({total_duration:.1f} seconds)")
print(f"Average: {total_duration/len(story_prompts):.1f} seconds per image")
print(f"Output directory: {output_dir}/")
print(f"{'='*60}")
