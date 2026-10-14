import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

base_img_path = "/data/godevops_arch_notebook_1791940409038.jpg"
out_gif_path = "/output/godevops_architecture_animated.gif"
out_mp4_path = "/output/godevops_architecture_animated.mp4"

base_img = Image.open(base_img_path).convert("RGBA")
W, H = base_img.size
print(f"Base image loaded: {W}x{H}")

def lerp_point(p0, p1, t):
    return (p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t)

def bezier_point(p0, p1, p2, p3, t):
    x = (1-t)**3 * p0[0] + 3*(1-t)**2 * t * p1[0] + 3*(1-t) * t**2 * p2[0] + t**3 * p3[0]
    y = (1-t)**3 * p0[1] + 3*(1-t)**2 * t * p1[1] + 3*(1-t) * t**2 * p2[1] + t**3 * p3[1]
    return (x, y)

def create_smooth_path(waypoint_list, num_pts=100):
    total_segments = len(waypoint_list) - 1
    pts = []
    pts_per_seg = num_pts // total_segments
    for i in range(total_segments):
        p_start = waypoint_list[i]
        p_end = waypoint_list[i+1]
        for step in range(pts_per_seg):
            t = step / float(pts_per_seg)
            pts.append(lerp_point(p_start, p_end, t))
    pts.append(waypoint_list[-1])
    return pts

# Precise path coordinates calibrated to the 1376 x 768 isometric diagram:
# 1. Dev Workstation -> GitHub
path_dev_to_github = [
    bezier_point((115, 465), (170, 485), (200, 520), (250, 545), t)
    for t in np.linspace(0, 1, 100)
]

# 2. GitHub -> Shift-Left CI/CD Pipeline (Commit -> Build -> Test -> Security Scan -> ECR)
ci_waypoints = [
    (270, 530),  # GitHub
    (280, 375),  # Code Commit
    (380, 290),  # Build (Docker)
    (435, 250),  # Test
    (515, 190),  # Security Scan (Trivy, Snyk)
    (630, 150),  # Pipeline Output arrow
    (690, 85)    # Amazon ECR
]
path_ci_pipeline = create_smooth_path(ci_waypoints, num_pts=120)

# 3. ArgoCD GitOps sync to EKS cluster
path_argocd_to_eks = [
    bezier_point((590, 360), (640, 390), (680, 430), (745, 470), t)
    for t in np.linspace(0, 1, 100)
]

# 4. External User Traffic -> AWS Elastic Load Balancer (ELB)
path_user_to_elb = [
    bezier_point((1190, 205), (1170, 240), (1150, 265), (1135, 295), t)
    for t in np.linspace(0, 1, 100)
]

# 5. ELB -> Frontend Pod (React UI)
path_elb_to_frontend = [
    bezier_point((1110, 320), (1050, 350), (990, 370), (935, 405), t)
    for t in np.linspace(0, 1, 100)
]

# 6. Frontend Pod -> Backend Pod (Go / Node API Server)
path_frontend_to_backend = [
    bezier_point((920, 470), (900, 510), (875, 540), (865, 575), t)
    for t in np.linspace(0, 1, 100)
]

# 7. Backend Pod -> MongoDB Database Pod
path_backend_to_mongodb = [
    bezier_point((950, 620), (1020, 610), (1080, 580), (1140, 560), t)
    for t in np.linspace(0, 1, 100)
]

# 8. MongoDB -> Persistent Volume Storage
path_mongodb_to_storage = [
    bezier_point((1160, 595), (1140, 630), (1100, 655), (1080, 675), t)
    for t in np.linspace(0, 1, 100)
]

def draw_glow_packet(draw, points, progress, color_core, color_halo, size=7, trail_len=14):
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
    # Wide outer halo
    draw.ellipse([hx - size*2.4, hy - size*2.4, hx + size*2.4, hy + size*2.4], fill=(*color_halo[:3], 80))
    # Concentrated inner halo
    draw.ellipse([hx - size*1.4, hy - size*1.4, hx + size*1.4, hy + size*1.4], fill=(*color_halo[:3], 170))
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
    
    # 1. Dev -> GitHub pulses
    for offset in [0.0, 0.5]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_dev_to_github, p, CYAN_CORE, CYAN_HALO, size=6, trail_len=12)
        
    # 2. CI/CD Pipeline flow (Commit -> Docker -> Scan -> ECR)
    for offset in [0.0, 0.33, 0.66]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_ci_pipeline, p, GREEN_CORE, GREEN_HALO, size=7, trail_len=16)
        
    # 3. ArgoCD GitOps to EKS
    for offset in [0.15, 0.65]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_argocd_to_eks, p, BLUE_CORE, BLUE_HALO, size=6, trail_len=14)
        
    # 4. User to ELB (Traffic ingress)
    for offset in [0.1, 0.6]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_user_to_elb, p, ORANGE_CORE, ORANGE_HALO, size=6, trail_len=12)
        
    # 5. ELB to Frontend Pod
    for offset in [0.2, 0.7]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_elb_to_frontend, p, CYAN_CORE, CYAN_HALO, size=7, trail_len=15)
        
    # 6. Frontend to Backend Pod
    for offset in [0.3, 0.8]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_frontend_to_backend, p, BLUE_CORE, BLUE_HALO, size=6, trail_len=12)
        
    # 7. Backend to MongoDB Pod
    for offset in [0.05, 0.55]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_backend_to_mongodb, p, PURPLE_CORE, PURPLE_HALO, size=6, trail_len=14)
        
    # 8. MongoDB to Volume Storage
    for offset in [0.25, 0.75]:
        p = (t_global + offset) % 1.0
        draw_glow_packet(draw, path_mongodb_to_storage, p, GREEN_CORE, GREEN_HALO, size=5, trail_len=10)
        
    # Pulsing rings on major architectural anchors
    # A. Security Scan Shield Pulse (DevSecOps green)
    scan_pulse = int(18 * max(0, math.sin(t_global * 2 * math.pi)))
    if scan_pulse > 0:
        draw.ellipse([515 - 20 - scan_pulse, 190 - 20 - scan_pulse, 515 + 20 + scan_pulse, 190 + 20 + scan_pulse],
                     outline=(30, 240, 120, 110), width=2)
                     
    # B. AWS ELB Ingress Pulse (AWS Orange)
    elb_pulse = int(22 * max(0, math.sin((t_global + 0.25) * 2 * math.pi)))
    if elb_pulse > 0:
        draw.ellipse([1135 - 24 - elb_pulse, 295 - 24 - elb_pulse, 1135 + 24 + elb_pulse, 295 + 24 + elb_pulse],
                     outline=(255, 140, 0, 120), width=2)
                     
    # C. ArgoCD Sync Pulse (Cyan/Blue)
    argo_pulse = int(20 * max(0, math.sin((t_global + 0.5) * 2 * math.pi)))
    if argo_pulse > 0:
        draw.ellipse([590 - 22 - argo_pulse, 360 - 22 - argo_pulse, 590 + 22 + argo_pulse, 360 + 22 + argo_pulse],
                     outline=(0, 180, 255, 110), width=2)
                     
    # D. MongoDB Storage Heartbeat (Purple)
    mongo_pulse = int(18 * max(0, math.sin((t_global + 0.75) * 2 * math.pi)))
    if mongo_pulse > 0:
        draw.ellipse([1140 - 20 - mongo_pulse, 560 - 20 - mongo_pulse, 1140 + 20 + mongo_pulse, 560 + 20 + mongo_pulse],
                     outline=(180, 70, 255, 100), width=2)

    # Composite overlay on top of base image
    frame = Image.alpha_composite(base_img, overlay).convert("RGB")
    frames.append(frame)

print("Exporting animated GIF (20 FPS)...")
frames[0].save(
    out_gif_path,
    save_all=True,
    append_images=frames[1:],
    duration=50,  # 50ms = 20 fps
    loop=0,
    optimize=True
)
print(f"✅ GIF successfully created: {out_gif_path} (Size: {os.path.getsize(out_gif_path)} bytes)")

try:
    import imageio
    print("Exporting MP4 video...")
    writer = imageio.get_writer(out_mp4_path, fps=20, codec='libx264', quality=9)
    # Loop 3 times for a seamless 6-second video loop
    for _ in range(3):
        for f in frames:
            writer.append_data(np.array(f))
    writer.close()
    print(f"✅ MP4 successfully created: {out_mp4_path} (Size: {os.path.getsize(out_mp4_path)} bytes)")
except Exception as e:
    print(f"Note: MP4 creation skipped: {e}")
