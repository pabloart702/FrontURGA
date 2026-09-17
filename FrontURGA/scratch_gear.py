import math

def generate_gear(num_teeth, r_outer, r_inner):
    path = []
    angle_step = 2 * math.pi / num_teeth
    for i in range(num_teeth):
        angle1 = i * angle_step
        angle2 = angle1 + angle_step * 0.25 # Top of tooth
        angle3 = angle1 + angle_step * 0.50 # Bottom of tooth
        angle4 = angle1 + angle_step * 0.75 # Bottom gap
        
        # We want the tooth to be somewhat trapezoidal or rectangular.
        # Standard SVG gear:
        # A tooth goes from angle1 to angle2 at r_outer.
        # Then slopes to angle3 at r_inner.
        # Then flat gap to angle4 at r_inner.
        # Then slopes up to next tooth angle1.
        
        # Actually, let's make it simpler:
        # P1: (r_inner, angle1 - small)
        # P2: (r_outer, angle1 + small)
        # P3: (r_outer, angle2 - small)
        # P4: (r_inner, angle2 + small)
        
        # Let's use 4 points per tooth:
        # a: start of tooth at R_outer
        # b: end of tooth at R_outer
        # c: start of gap at R_inner
        # d: end of gap at R_inner
        
        a = angle1
        b = angle1 + angle_step * 0.4
        c = angle1 + angle_step * 0.5
        d = angle1 + angle_step * 0.9
        
        x1 = r_outer * math.cos(a)
        y1 = r_outer * math.sin(a)
        
        x2 = r_outer * math.cos(b)
        y2 = r_outer * math.sin(b)
        
        x3 = r_inner * math.cos(c)
        y3 = r_inner * math.sin(c)
        
        x4 = r_inner * math.cos(d)
        y4 = r_inner * math.sin(d)
        
        if i == 0:
            path.append(f"M{x1:.2f},{y1:.2f}")
        else:
            path.append(f"L{x1:.2f},{y1:.2f}")
            
        path.append(f"L{x2:.2f},{y2:.2f}")
        path.append(f"L{x3:.2f},{y3:.2f}")
        path.append(f"L{x4:.2f},{y4:.2f}")
        
    path.append("Z")
    return " ".join(path)

print("Dial Gear (20 teeth):")
print(generate_gear(20, 92, 80))
print("\nRight Gear (14 teeth):")
print(generate_gear(14, 65, 53))
print("\nTop Gear (10 teeth):")
print(generate_gear(10, 46.5, 34.5))

