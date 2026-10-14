import os
import math
import numpy as np
from PIL import Image, ImageDraw

base_img_path = "/data/godevops_flat_grid_page_1791941025480.jpg"
out_gif_path = "/output/godevops_architecture_animated.gif"
out_opt_gif_path = "/output/godevops_architecture_animated_optimized.gif"
out_mp4_path = "/output/godevops_architecture_animated.mp4"

base_img = Image.open(base_img_path).convert("RGBA")
W, H = base_img.size
print(f"Loaded base image: {W}x{H}")

def lerp_point(p0, p1, t):
    return (p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t)

def create_smooth_path(waypoints, num_pts=80):
    total_segs = len(waypoints) - 1
    pts = []
    pts_per_seg = max(1, num_pts // total_segs)
    for i in range(total_segs):
        p_start = waypoints[i]
        p_end = waypoints[i+1]
        for step in range(pts_per_seg):
            t = step / float(pts_per_seg)
            pts.append(lerp_point(p_start, p_end, t))
    pts.append(waypoints[-1])
    return pts

# 1. Dev Workstation -> GitHub (Git Push)
path_dev_to_github = create_smooth_path([(225, 192), (320, 192), (405, 192)], num_pts=60)

# 2. GitHub -> CI/CD Pipeline Ingress
path_github_to_pipeline = create_smooth_path([(485, 275), (420, 350), (330, 420), (260, 485)], num_pts=70)

# 3. Shift-Left CI/CD Pipeline (Code -> Lint -> Tests -> Security -> Docker)
path_pipeline_flow = create_smooth_path([
    (142, 480), # Code
    (235, 545), # Lint
    (330, 615), # Unit Tests
    (425, 680), # Security Scans (Trivy, Snyk)
    (520, 740)  # Docker Build
], num_pts=100)

# 4. Docker Build -> Amazon ECR (Push to ECR arrow)
path_docker_to_ecr = create_smooth_path([
    (520, 740),
    (545, 785),
    (570, 830),
    (650, 830),
    (730, 830)
], num_pts=70)

# 5. Amazon ECR -> AWS EKS Cluster
path_ecr_to_eks = create_smooth_path([(730, 820), (790, 765), (860, 705)], num_pts=60)

# 6. ArgoCD GitOps -> AWS EKS Sync
path_argocd_sync = create_smooth_path([(575, 460), (640, 460), (710, 460)], num_pts=50)

# 7. User / Internet -> AWS Elastic Load Balancer (ELB)
path_user_to_elb = create_smooth_path([
    (1185, 140),
    (1150, 190),
    (1110, 250),
    (1065, 305)
], num_pts=60)

# 8. AWS ELB -> Frontend Pod (React UI)
path_elb_to_frontend = create_smooth_path([
    (1045, 335),
    (990, 365),
    (930, 395),
    (875, 415)
], num_pts=60)

# 9. Frontend Pod -> Backend Pod (Go / Node API)
path_frontend_to_backend = create_smooth_path([
    (890, 445),
    (930, 470),
    (970, 490),
    (990, 500)
], num_pts=50)

# 10. Backend Pod -> MongoDB Database Pod
path_backend_to_mongodb = create_smooth_path([
    (1010, 525),
    (1050, 555),
    (1090, 585),
    (1115, 605)
], num_pts=50)

def draw_glow_packet(draw, points, progress, color_core, color_halo, size=6, trail_len=14):
    n = len(points)
    head_idx = int(progress * (n - 1))
    
    # Motion trail
    for i in range(1, trail_len + 1):
        idx = max(0, head_idx - i)
        px, py = points[idx]
        alpha = int(220 * (1.0 - i / trail_len))
        r_trail = max(2, size - int(i * 0.35))
        halo_c = (*color_halo[:3], alpha // 3)
        core_c = (*color_core[:3], alpha // 2)
        draw.ellipse([px - r_trail, py - r_trail, px + r_trail, py + r_trail], fill=halo_c)
        draw.ellipse([px - r_trail//2, py - r_trail//2, px + r_trail//2, py + r_trail//2], fill=core_c)
        
    # Main glowing particle
    hx, hy = points[head_idx]
    # Wide halo
    draw.ellipse([hx - size*2.3, hy - size*2.3, hx + size*2.3, hy + size*2.3], fill=(*color_halo[:3], 80))
    # Mid glow
    draw.ellipse([hx - size*1.3, hy - size*1.3, hx + size*1.3, hy + size*1.3], fill=(*color_halo[:3], 170))
    # Core color
    draw.ellipse([hx - size*0.7, hy - size*0.7, hx + size*0.7, hy + size*0.7], fill=color_core)
    # White-hot energy pinpoint
    draw.ellipse([hx - size*0.3, hy - size*0.3, hx + size*0.3, hy + size*0.3], fill=(255, 255, 255, 255))

# Palette:
CYAN_CORE = (180, 245, 255, 255)
CYAN_HALO = (0, 180, 255, 200)

GREEN_CORE = (210, 255, 215, 255)
GREEN_HALO = (30, 240, 120, 200)

ORANGE_CORE = (255, 230, 180, 255)
ORANGE_HALO = (255, 140, 0, 200)

PURPLE_CORE = (240, 210, 255, 255)
PURPLE_HALO = (180, 70, 255, 200)

BLUE_CORE = (200, 230, 255, 255)
BLUE_HALO = (40, 130, 255, 200)

NUM_FRAMES = 40
frames = []

print(f"Rendering {NUM_FRAMES} high-precision frames...")

for f in range(NUM_FRAMES):
    t_global = f / float(NUM_FRAMES)
    
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 1. Dev -> GitHub pulses (Git Push)
    for offset in [0.0, 0.5]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_dev_to_github, p, CYAN_CORE, CYAN_HALO, size=6, trail_len=12)
        
    # 2. GitHub -> CI/CD Pipeline
    for offset in [0.25, 0.75]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_github_to_pipeline, p, CYAN_CORE, CYAN_HALO, size=6, trail_len=12)
        
    # 3. Shift-Left CI/CD Pipeline flow (Code -> Lint -> Test -> Scan -> Docker)
    for offset in [0.0, 0.33, 0.66]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_pipeline_flow, p, GREEN_CORE, GREEN_HALO, size=7, trail_len=16)
        
    # 4. Docker -> ECR
    for offset in [0.15, 0.65]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_docker_to_ecr, p, ORANGE_CORE, ORANGE_HALO, size=6, trail_len=14)
        
    # 5. ECR -> EKS Cluster
    for offset in [0.35, 0.85]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_ecr_to_eks, p, ORANGE_CORE, ORANGE_HALO, size=6, trail_len=12)
        
    # 6. ArgoCD GitOps Sync to EKS
    for offset in [0.1, 0.6]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_argocd_sync, p, BLUE_CORE, BLUE_HALO, size=6, trail_len=14)
        
    # 7. User -> AWS ELB (Incoming Web Traffic)
    for offset in [0.05, 0.55]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_user_to_elb, p, ORANGE_CORE, ORANGE_HALO, size=7, trail_len=14)
        
    # 8. AWS ELB -> Frontend Pod
    for offset in [0.2, 0.7]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_elb_to_frontend, p, CYAN_CORE, CYAN_HALO, size=7, trail_len=15)
        
    # 9. Frontend Pod -> Backend Pod
    for offset in [0.3, 0.8]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_frontend_to_backend, p, BLUE_CORE, BLUE_HALO, size=6, trail_len=12)
        
    # 10. Backend Pod -> MongoDB Database Pod
    for offset in [0.15, 0.65]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_backend_to_mongodb, p, PURPLE_CORE, PURPLE_HALO, size=6, trail_len=14)
        
    # Pulsing rings on major architectural nodes
    # A. Security Scan Shield Pulse (DevSecOps green)
    scan_pulse = int(18 * max(0, math.sin(t_global * 2 * math.pi)))
    if scan_pulse > 0:
        draw.ellipse([425 - 20 - scan_pulse, 680 - 20 - scan_pulse, 425 + 20 + scan_pulse, 680 + 20 + scan_pulse],
                     outline=(30, 240, 120, 110), width=2)
                     
    # B. AWS ELB Ingress Pulse (AWS Orange)
    elb_pulse = int(22 * max(0, math.sin((t_global + 0.25) * 2 * math.pi)))
    if elb_pulse > 0:
        draw.ellipse([1055 - 24 - elb_pulse, 305 - 24 - elb_pulse, 1055 + 24 + elb_pulse, 305 + 24 + elb_pulse],
                     outline=(255, 140, 0, 120), width=2)
                     
    # C. ArgoCD Sync Pulse (Cyan/Blue)
    argo_pulse = int(20 * max(0, math.sin((t_global + 0.5) * 2 * math.pi)))
    if argo_pulse > 0:
        draw.ellipse([575 - 22 - argo_pulse, 460 - 22 - argo_pulse, 575 + 22 + argo_pulse, 460 + 22 + argo_pulse],
                     outline=(0, 180, 255, 110), width=2)
                     
    # D. MongoDB Storage Heartbeat (Purple)
    mongo_pulse = int(18 * max(0, math.sin((t_global + 0.75) * 2 * math.pi)))
    if mongo_pulse > 0:
        draw.ellipse([1115 - 20 - mongo_pulse, 605 - 20 - mongo_pulse, 1115 + 20 + mongo_pulse, 605 + 20 + mongo_pulse],
                     outline=(180, 70, 255, 100), width=2)

    # Composite overlay on top of base image
    frame = Image.alpha_composite(base_img, overlay).convert("RGB")
    frames.append(frame)

print("Exporting Full-Res Animated GIF (20 FPS)...")
frames[0].save(
    out_gif_path,
    save_all=True,
    append_images=frames[1:],
    duration=50,
    loop=0,
    optimize=True
)
print(f"✅ Full-Res GIF created: {out_gif_path} ({os.path.getsize(out_gif_path)} bytes)")

print("Exporting Optimized LinkedIn GIF (960px, adaptive palette)...")
opt_frames = []
for f in frames:
    f_res = f.resize((960, 536), Image.Resampling.LANCZOS)
    f_quant = f_res.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)
    opt_frames.append(f_quant)

opt_frames[0].save(
    out_opt_gif_path,
    save_all=True,
    append_images=opt_frames[1:],
    duration=50,
    loop=0,
    optimize=True
)
print(f"✅ Optimized GIF created: {out_opt_gif_path} ({os.path.getsize(out_opt_gif_path)} bytes)")

try:
    import imageio
    print("Exporting MP4 video...")
    writer = imageio.get_writer(out_mp4_path, fps=20, codec='libx264', quality=9)
    for _ in range(3):
        for f in frames:
            writer.append_data(np.array(f))
    writer.close()
    print(f"✅ MP4 created: {out_mp4_path} ({os.path.getsize(out_mp4_path)} bytes)")
except Exception as e:
    print(f"MP4 skipped: {e}")
