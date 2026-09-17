const math = Math;

function generate_gear(num_teeth, r_outer, r_inner) {
    let path = [];
    const angle_step = 2 * math.PI / num_teeth;
    for (let i = 0; i < num_teeth; i++) {
        const angle1 = i * angle_step;
        
        // Let's refine tooth shape for perfect meshing
        // a: tooth start at r_outer
        // b: tooth end at r_outer
        // c: gap start at r_inner
        // d: gap end at r_inner
        
        const a = angle1 - angle_step * 0.15;
        const b = angle1 + angle_step * 0.15;
        const c = angle1 + angle_step * 0.35;
        const d = angle1 + angle_step * 0.65;
        
        const x1 = r_outer * math.cos(a);
        const y1 = r_outer * math.sin(a);
        
        const x2 = r_outer * math.cos(b);
        const y2 = r_outer * math.sin(b);
        
        const x3 = r_inner * math.cos(c);
        const y3 = r_inner * math.sin(c);
        
        const x4 = r_inner * math.cos(d);
        const y4 = r_inner * math.sin(d);
        
        if (i === 0) {
            path.push(`M${x1.toFixed(2)},${y1.toFixed(2)}`);
        } else {
            path.push(`L${x1.toFixed(2)},${y1.toFixed(2)}`);
        }
        path.push(`L${x2.toFixed(2)},${y2.toFixed(2)}`);
        path.push(`L${x3.toFixed(2)},${y3.toFixed(2)}`);
        path.push(`L${x4.toFixed(2)},${y4.toFixed(2)}`);
    }
    path.push("Z");
    return path.join(" ");
}

console.log("Dial Gear (20 teeth, size ~108):");
console.log(generate_gear(20, 108, 95));

console.log("\nRight Gear (14 teeth, size ~76):");
console.log(generate_gear(14, 75.6, 62.6));

console.log("\nTop Gear (10 teeth, size ~54):");
console.log(generate_gear(10, 54, 41));

