#!/usr/bin/env python3
"""
Titanic Simulator - Comprehensive Image Generator
Generates all game assets using Tiny-SD on Apple Silicon MPS
- Logo image
- Captain portraits
- End screen images (victory/defeat)
- Expanded storyline progression (16 storylines x 8 stages each)
- Weather condition images
- Ship damage states
"""

import torch
from diffusers import StableDiffusionPipeline
import os
from datetime import datetime
import json

# Check for MPS availability
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {device}")

# Load Tiny-SD model
print("Loading Tiny-SD model...")
pipe = StableDiffusionPipeline.from_pretrained(
    "segmind/tiny-sd",
    torch_dtype=torch.float32  # MPS requires float32
)
pipe = pipe.to(device)

# Enable optimizations
pipe.enable_attention_slicing()
if hasattr(pipe, 'enable_vae_slicing'):
    pipe.enable_vae_slicing()

# Output directory
output_dir = "game_images"
os.makedirs(output_dir, exist_ok=True)

# Image generation helper
def generate_image(prompt, filename, negative_prompt="blurry, low quality, distorted"):
    print(f"\nGenerating: {filename}")
    print(f"Prompt: {prompt}")
    
    # Generator must be on CPU for MPS compatibility
    generator = torch.Generator(device="cpu").manual_seed(42)
    
    image = pipe(
        prompt,
        negative_prompt=negative_prompt,
        num_inference_steps=25,
        guidance_scale=7.5,
        generator=generator
    ).images[0]
    
    filepath = os.path.join(output_dir, filename)
    image.save(filepath)
    print(f"✓ Saved to {filepath}")
    return filepath

# Metadata tracking
metadata = {
    "generated_at": datetime.now().isoformat(),
    "model": "segmind/tiny-sd",
    "device": device,
    "images": []
}

def add_metadata(filename, prompt, category):
    metadata["images"].append({
        "filename": filename,
        "prompt": prompt,
        "category": category
    })

print("\n" + "="*70)
print("GENERATING GAME ASSETS")
print("="*70)

# 1. LOGO IMAGE
print("\n[1/5] LOGO IMAGE")
logo_prompt = "vintage nautical logo, RMS Titanic ship silhouette, art deco style, gold and navy blue, ornate border, maritime emblem, professional design, clean background"
generate_image(logo_prompt, "logo.png")
add_metadata("logo.png", logo_prompt, "logo")

# 2. CAPTAIN PORTRAITS (multiple morale states)
print("\n[2/5] CAPTAIN PORTRAITS")
captain_prompts = [
    ("captain_confident.png", "confident ship captain portrait, naval uniform, dignified, determined expression, 1912 era, oil painting style, heroic"),
    ("captain_worried.png", "worried ship captain portrait, naval uniform, concerned expression, 1912 era, oil painting style, anxious"),
    ("captain_desperate.png", "desperate ship captain portrait, naval uniform, panic expression, 1912 era, oil painting style, fear"),
    ("captain_victorious.png", "triumphant ship captain portrait, naval uniform, proud smile, 1912 era, oil painting style, celebrating")
]

for filename, prompt in captain_prompts:
    generate_image(prompt, filename)
    add_metadata(filename, prompt, "captain")

# 3. END SCREEN IMAGES
print("\n[3/5] END SCREEN IMAGES")

# Victory images
victory_prompts = [
    ("victory_01_harbor.png", "New York harbor 1912, Statue of Liberty, triumphant ocean liner arriving, celebration, vintage photograph, sepia tone"),
    ("victory_02_celebration.png", "ship crew celebrating on deck, confetti, cheering people, 1912 era, vintage photograph, joyful"),
    ("victory_03_newspaper.png", "vintage newspaper headline TITANIC ARRIVES SAFELY, 1912 typography, historic front page"),
]

for filename, prompt in victory_prompts:
    generate_image(prompt, filename)
    add_metadata(filename, prompt, "victory")

# Defeat images  
defeat_prompts = [
    ("defeat_01_sinking.png", "ocean liner sinking stern first, dramatic angle, night scene, moonlight, tragic, cinematic, 1912"),
    ("defeat_02_lifeboats.png", "lifeboats in dark ocean, survivors, distant sinking ship, somber mood, dramatic lighting, tragic scene"),
    ("defeat_03_memorial.png", "maritime memorial monument, names engraved, flowers, solemn, respectful, historic"),
    ("defeat_04_underwater.png", "sunken ship wreckage on ocean floor, deep sea, ethereal lighting, peaceful yet tragic"),
]

for filename, prompt in defeat_prompts:
    generate_image(prompt, filename)
    add_metadata(filename, prompt, "defeat")

# 4. WEATHER CONDITIONS
print("\n[4/5] WEATHER CONDITION IMAGES")
weather_prompts = [
    ("weather_calm.png", "calm ocean surface, clear sky, peaceful waves, daylight, serene maritime scene"),
    ("weather_cloudy.png", "cloudy ocean sky, overcast, grey clouds, choppy waves, moody atmosphere"),
    ("weather_fog.png", "thick fog over ocean, mysterious atmosphere, limited visibility, eerie maritime scene"),
    ("weather_storm.png", "violent ocean storm, massive waves, dark clouds, lightning, dramatic weather, dangerous seas"),
]

for filename, prompt in weather_prompts:
    generate_image(prompt, filename)
    add_metadata(filename, prompt, "weather")

# 5. 16 EXPANDED STORYLINES (8 stages each)
print("\n[5/5] EXPANDED STORYLINES (16 storylines × 8 stages = 128 images)")
print("This will take approximately 2-3 hours. Generating...")

storylines = [
    # STORYLINE 1: Classic Iceberg Collision
    {
        "id": 1,
        "name": "Classic Iceberg Encounter",
        "stages": [
            "ocean liner departing Southampton harbor, 1912, vintage photograph style, crowds waving",
            "ship at sea, calm ocean, crew on deck working, routine voyage, daylight",
            "crew member spotting distant iceberg through binoculars, alert expression, dramatic moment",
            "massive iceberg ahead, ship turning, tense moment, danger imminent, cinematic angle",
            "ship scraping against iceberg, ice chunks falling, collision impact, dramatic lighting",
            "crew assessing damage below deck, water flooding compartments, emergency situation",
            "lifeboats being loaded, organized evacuation, night scene, urgent atmosphere",
            "ship sinking stern rising, final moments, tragic scene, moonlit ocean"
        ]
    },
    # STORYLINE 2: Coal Crisis
    {
        "id": 2,
        "name": "Coal Depletion Emergency",
        "stages": [
            "ship boiler room, furnaces glowing bright, coal piles abundant, workers shoveling",
            "coal supplies dwindling, workers concerned, monitoring remaining fuel",
            "furnace fires weakening, reduced steam pressure, worried engineers",
            "ship slowing down, crew rationing coal carefully, tense atmosphere",
            "nearly empty coal bunkers, desperate situation, critical fuel shortage",
            "ship dead in water, no power, drifting, emergency situation",
            "crew attempting to burn furniture and wood for fuel, desperation",
            "ship disabled and vulnerable, awaiting rescue, stranded at sea"
        ]
    },
    # STORYLINE 3: Storm Damage
    {
        "id": 3,
        "name": "North Atlantic Storm",
        "stages": [
            "dark storm clouds gathering on horizon, ominous sky, rough seas ahead",
            "ship entering storm system, waves increasing, wind picking up",
            "violent waves crashing over deck, crew struggling, extreme weather",
            "lightning striking near ship, torrential rain, dangerous conditions",
            "structural damage to superstructure, windows breaking, chaos on deck",
            "flooding in lower decks, pumps working overtime, water rising",
            "ship listing heavily, severe damage, critical situation",
            "ship breaking apart in storm, catastrophic failure, tragic end"
        ]
    },
    # STORYLINE 4: Fire in Engine Room
    {
        "id": 4,
        "name": "Engine Room Fire",
        "stages": [
            "engine room operating normally, machinery humming, routine operations",
            "small fire starting near coal bunker, smoke visible, workers noticing",
            "fire spreading to machinery, crew fighting flames, emergency response",
            "major blaze in engine room, thick smoke, crew evacuating",
            "fire out of control, explosions, critical danger, abandon engine room",
            "ship losing power as fire damages systems, smoke billowing from funnels",
            "fire spreading to other compartments, ship-wide emergency, evacuation",
            "ship consumed by fire and sinking, crew in lifeboats, total loss"
        ]
    },
    # STORYLINE 5: Fog Navigation Error
    {
        "id": 5,
        "name": "Lost in the Fog",
        "stages": [
            "ship navigating through light mist, reduced visibility, crew alert",
            "thick fog engulfing ship, visibility near zero, dangerous navigation",
            "crew using foghorn constantly, listening for other ships, tense atmosphere",
            "nearly colliding with another vessel in fog, close call, dramatic moment",
            "ship going off course, navigation errors, crew confused about position",
            "running aground on underwater rocks, grinding impact, hull breach",
            "ship stuck and taking on water, fog clearing to reveal rocky coast",
            "ship sinking near shore, evacuation to land, stranded vessel"
        ]
    },
    # STORYLINE 6: Structural Fatigue
    {
        "id": 6,
        "name": "Hull Integrity Failure",
        "stages": [
            "ship construction showing rivets and hull plates, quality inspection",
            "small crack appearing in hull plates, minor concern, being monitored",
            "crack widening under ocean pressure, structural stress visible",
            "rivets popping from hull seams, crew hearing pinging sounds, alarm",
            "major hull breach from structural failure, water rushing in",
            "multiple compartments flooding, bulkheads failing, cascading failure",
            "ship breaking in half from structural weakness, catastrophic failure",
            "both halves sinking separately, complete structural collapse"
        ]
    },
    # STORYLINE 7: Mutiny and Chaos
    {
        "id": 7,
        "name": "Crew Mutiny Crisis",
        "stages": [
            "crew looking disgruntled during morning inspection, tension building",
            "crew members arguing with officers, morale declining, conflict brewing",
            "work slowdown, crew refusing orders, officers losing control",
            "full mutiny, crew taking control of bridge, captain locked up",
            "ship veering off course, inexperienced crew at controls, chaos",
            "mutineers fighting among themselves, no one in charge, disorder",
            "ship neglected and drifting into danger, collision imminent",
            "ship sinking due to negligence and lack of control, tragic chaos"
        ]
    },
    # STORYLINE 8: Mysterious Disappearance
    {
        "id": 8,
        "name": "Vanishing in the Atlantic",
        "stages": [
            "ship sailing normally under clear skies, routine voyage",
            "strange atmospheric phenomena, unusual lights, crew confused",
            "navigation instruments malfunctioning, compass spinning wildly",
            "crew experiencing time distortions, clocks running backwards",
            "ship entering mysterious fog bank, supernatural atmosphere",
            "ship fading from view, becoming translucent, otherworldly scene",
            "last transmission received, garbled and strange, then silence",
            "empty ocean where ship was, no wreckage, complete mystery"
        ]
    },
    # STORYLINE 9: Plague Outbreak
    {
        "id": 9,
        "name": "Disease Outbreak at Sea",
        "stages": [
            "ship's hospital, clean and orderly, doctor examining healthy crew",
            "first patient showing symptoms, doctor concerned, quarantine starting",
            "multiple crew members falling ill, makeshift hospital ward",
            "epidemic spreading rapidly, overwhelmed medical staff, many sick",
            "crew too weak to operate ship, critical systems failing",
            "quarantine flags raised, ship becoming ghost ship, desperate situation",
            "ship drifting helplessly, crew dying, tragic plague ship",
            "ship found derelict, crew dead, maritime tragedy"
        ]
    },
    # STORYLINE 10: Submarine Attack
    {
        "id": 10,
        "name": "U-Boat Encounter",
        "stages": [
            "ship sailing peacefully, unaware of danger below",
            "periscope spotted in distance, crew raising alarm, military threat",
            "submarine surfacing, crew identifying threat, panic spreading",
            "submarine firing torpedo, crew watching trail approach, terror",
            "torpedo striking hull, massive explosion, direct hit",
            "huge hole in ship's side, flooding catastrophic, sinking rapidly",
            "crew abandoning ship in panic, submarine watching, warfare tragedy",
            "ship sinking quickly from torpedo damage, wartime casualty"
        ]
    },
    # STORYLINE 11: Rescue Mission Gone Wrong
    {
        "id": 11,
        "name": "Failed Rescue Attempt",
        "stages": [
            "crew spotting distress signals from another ship, deciding to help",
            "ship changing course to assist, crew preparing rescue equipment",
            "approaching damaged vessel, seeing survivors in lifeboats",
            "attempting to take survivors aboard in rough seas, difficult rescue",
            "rescue ship struck by debris from sinking vessel, damage sustained",
            "rescue ship now also damaged and taking on water, crisis worsening",
            "both ships in distress, combined crews in lifeboats, double tragedy",
            "both vessels lost, survivors awaiting rescue, humanitarian disaster"
        ]
    },
    # STORYLINE 12: Whirlpool Vortex
    {
        "id": 12,
        "name": "Maelstrom Encounter",
        "stages": [
            "ship sailing through calm waters, routine navigation",
            "ocean current changing, ship pulled slightly off course",
            "whirlpool forming ahead, crew noticing strange water movement",
            "ship caught in vortex edge, struggling against current, alarm",
            "ship spiraling into whirlpool, unable to escape, engines at full",
            "ship tilting as vortex pulls it down, water spinning violently",
            "ship descending into maelstrom center, crew holding on, terror",
            "ship disappearing into vortex depths, swallowed by ocean"
        ]
    },
    # STORYLINE 13: Lightning Strike
    {
        "id": 13,
        "name": "Electrical Storm Catastrophe",
        "stages": [
            "electrical storm approaching, lightning in distance, crew concerned",
            "storm intensifying, frequent lightning, ship in danger zone",
            "lightning striking radio mast, electrical surge, sparks flying",
            "electrical systems failing, fires starting from overload",
            "multiple lightning strikes hitting ship, catastrophic damage",
            "ship's bridge destroyed by lightning, command center lost",
            "fires spreading from electrical damage, crew overwhelmed",
            "ship burning and sinking from lightning catastrophe"
        ]
    },
    # STORYLLINE 14: Rogue Wave
    {
        "id": 14,
        "name": "Monster Wave Impact",
        "stages": [
            "ship in rough seas, large waves but manageable, crew vigilant",
            "crew spotting massive wave approaching, wall of water ahead",
            "rogue wave towering over ship, unprecedented size, terror",
            "wave striking ship broadside, massive impact, ship rolling",
            "ship nearly capsizing from wave impact, extreme list, chaos",
            "massive flooding from wave damage, multiple hull breaches",
            "ship unable to recover, capsized and sinking, crew in water",
            "upside-down hull sinking beneath waves, total loss"
        ]
    },
    # STORYLINE 15: Sabotage
    {
        "id": 15,
        "name": "Internal Sabotage Plot",
        "stages": [
            "suspicious crew member lurking in shadows, plotting sabotage",
            "saboteur tampering with critical ship systems at night",
            "explosives planted in strategic locations, timed devices",
            "first explosion in cargo hold, unexpected blast, confusion",
            "multiple explosions throughout ship, coordinated attack, panic",
            "ship's structure compromised by sabotage, critical damage",
            "crew discovering saboteur too late, ship doomed, manhunt",
            "ship sinking from sabotage damage, criminal tragedy"
        ]
    },
    # STORYLINE 16: The Perfect Storm
    {
        "id": 16,
        "name": "Multiple Cascading Failures",
        "stages": [
            "ship setting sail, ominous signs ignored, overconfident departure",
            "minor iceberg graze causing small leak, crew unconcerned",
            "coal running low due to detour around ice field, compounding problems",
            "storm hitting damaged ship, multiple stresses, situation worsening",
            "fire breaking out while ship fights storm, crisis multiplying",
            "crew morale collapsing, mutiny during emergency, total chaos",
            "all systems failing simultaneously, perfect storm of disasters",
            "ship succumbing to combined catastrophes, inevitable doom"
        ]
    }
]

# Generate storyline images
total_images = sum(len(s["stages"]) for s in storylines)
current_image = 0

for storyline in storylines:
    print(f"\n{'='*70}")
    print(f"STORYLINE {storyline['id']}: {storyline['name']}")
    print(f"{'='*70}")
    
    for stage_num, prompt in enumerate(storyline["stages"], 1):
        current_image += 1
        filename = f"story_{storyline['id']:02d}_stage_{stage_num}.png"
        
        # Enhanced prompt for consistency
        full_prompt = f"{prompt}, RMS Titanic era, 1912, dramatic maritime scene, cinematic lighting, detailed, high quality"
        
        print(f"\n[{current_image}/{total_images}] Storyline {storyline['id']}, Stage {stage_num}/8")
        generate_image(full_prompt, filename)
        add_metadata(filename, full_prompt, f"storyline_{storyline['id']}")

# Save metadata
metadata_file = os.path.join(output_dir, "metadata.json")
with open(metadata_file, 'w') as f:
    json.dump(metadata, f, indent=2)

print("\n" + "="*70)
print("GENERATION COMPLETE!")
print(f"Total images generated: {len(metadata['images'])}")
print(f"Output directory: {output_dir}/")
print(f"Metadata saved to: {metadata_file}")
print("="*70)
