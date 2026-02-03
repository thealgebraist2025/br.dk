import torch
from diffusers import StableDiffusionPipeline
import os
from datetime import datetime
import json

# Four storylines - all ending in sinking
storylines = [
    # Storyline 1: Iceberg Collision
    ("sim_01_departure_calm", "RMS Titanic ocean liner departing from Southampton harbor, calm waters, clear sky, majestic ship at dusk, realistic"),
    ("sim_02_iceberg_spotted", "Large iceberg ahead in dark ocean waters at night, ship searchlight illuminating ice, ominous atmosphere, dramatic"),
    ("sim_03_collision_impact", "Ship colliding with massive iceberg, impact moment, ice breaking, metal scraping, dramatic nighttime scene"),
    ("sim_04_flooding_starts", "Water flooding into ship compartments, sailors alarmed, interior flooding, emergency lights, chaos"),
    ("sim_05_tilting_sinking", "Large ocean liner tilting severely in dark ocean, stern rising, people on deck, tragic scene at night"),
    ("sim_06_final_plunge", "Ship vertical in ocean, stern pointing skyward before final plunge, lifeboats nearby, tragic maritime disaster"),
    
    # Storyline 2: Coal Depletion Crisis
    ("sim_07_furnace_room_active", "Ship boiler room with coal furnaces burning bright, workers shoveling coal, hot orange glow, industrial"),
    ("sim_08_coal_running_low", "Nearly empty coal storage, worried crew, dim furnaces, dwindling supplies, tense atmosphere"),
    ("sim_09_engines_failing", "Ship engine room failing, steam dying, gauges dropping, crew panic, machinery grinding to halt"),
    ("sim_10_adrift_helpless", "Ocean liner dead in water, no lights, dark ocean, helpless vessel adrift at night, ominous"),
    ("sim_11_hull_stress", "Ship hull showing stress cracks from ocean pressure, structural failure beginning, close-up of metal fatigue"),
    ("sim_12_structural_collapse", "Ship breaking apart from structural failure, hull splitting, catastrophic collapse in rough seas"),
    
    # Storyline 3: Storm and Wave Damage
    ("sim_13_storm_brewing", "Dark storm clouds gathering over ocean, ship on horizon, massive waves building, ominous weather"),
    ("sim_14_massive_waves", "Enormous ocean waves crashing over ship deck, violent storm, water everywhere, dramatic"),
    ("sim_15_deck_damage", "Ship deck damaged by waves, equipment torn loose, railings bent, destruction visible"),
    ("sim_16_water_ingress", "Water pouring into ship through damaged hatches, flooding corridors, emergency situation"),
    ("sim_17_listing_severely", "Ship listing heavily to one side in rough seas, unstable, crew struggling, dangerous angle"),
    ("sim_18_capsizing", "Ocean liner capsizing in storm, rolling over, final moments before going under, dramatic"),
    
    # Storyline 4: Multiple System Failures
    ("sim_19_routine_voyage", "Ship cruising normally across calm Atlantic ocean, beautiful sunset, peaceful voyage"),
    ("sim_20_minor_leak", "Small leak discovered in hull, crew examining damage, water trickling in, concern growing"),
    ("sim_21_leak_spreading", "Leak worsening, water spreading through lower decks, pumps working, crew worried"),
    ("sim_22_pump_failure", "Water pumps failing, flooding accelerating, machinery breaking down, emergency escalating"),
    ("sim_23_evacuation_chaos", "Crew launching lifeboats, passengers evacuating, organized chaos on tilting deck at night"),
    ("sim_24_inevitable_end", "Ship bow underwater, stern high in air, final moments, lifeboats rowing away, tragic conclusion")
]

def clean_filename(name):
    """Clean filename by removing special characters"""
    cleaned = name.replace("'", "").replace('"', "")
    cleaned = cleaned.replace('ö', 'o').replace('ä', 'a').replace('å', 'a')
    return cleaned

# Device setup
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {device}")

# Load model
print("Loading Tiny SD model...")
model_id = "segmind/tiny-sd"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float32,
    safety_checker=None
)
pipe = pipe.to(device)

# Memory optimizations
if device == "mps":
    pipe.enable_attention_slicing()
    if hasattr(pipe, 'enable_vae_slicing'):
        pipe.enable_vae_slicing()

# Create output directory
output_dir = "sim_images"
os.makedirs(output_dir, exist_ok=True)

# Generation metadata
metadata = {
    "model": model_id,
    "device": device,
    "generated_at": datetime.now().isoformat(),
    "storylines": 4,
    "images": []
}

print(f"\nGenerating {len(storylines)} storyline images...")
start_time = datetime.now()

for idx, (filename, prompt) in enumerate(storylines, 1):
    print(f"\n[{idx}/{len(storylines)}] Generating: {filename}")
    print(f"Prompt: {prompt}")
    
    img_start = datetime.now()
    
    clean_name = clean_filename(filename)
    output_path = os.path.join(output_dir, f"{clean_name}.png")
    
    # Generate image
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
    
    image.save(output_path)
    
    img_duration = (datetime.now() - img_start).total_seconds()
    print(f"✓ Saved: {output_path} (took {img_duration:.1f}s)")
    
    metadata["images"].append({
        "filename": f"{clean_name}.png",
        "prompt": prompt,
        "duration_seconds": img_duration,
        "storyline": (idx - 1) // 6 + 1,
        "sequence": (idx - 1) % 6 + 1
    })

# Save metadata
total_duration = (datetime.now() - start_time).total_seconds()
metadata["total_duration_seconds"] = total_duration

with open(os.path.join(output_dir, "generation_metadata.json"), "w") as f:
    json.dump(metadata, f, indent=2)

print(f"\n{'='*60}")
print(f"✓ All {len(storylines)} images generated!")
print(f"Total time: {total_duration/60:.1f} minutes ({total_duration:.1f} seconds)")
print(f"Average: {total_duration/len(storylines):.1f} seconds per image")
print(f"\nStorylines generated:")
print(f"  1. Iceberg Collision (images 1-6)")
print(f"  2. Coal Depletion Crisis (images 7-12)")
print(f"  3. Storm and Wave Damage (images 13-18)")
print(f"  4. Multiple System Failures (images 19-24)")
print(f"Output directory: {output_dir}/")
print(f"{'='*60}")
