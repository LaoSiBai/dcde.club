/**
 * Kinetic Box - "DESIGNED FOR BETTER" (17 letters)
 * 4 columns with variable rows per column.
 * Black background, blue straight-line letters.
 */

const sketch = (p) => {
    let container;

    // Physics Constants
    const k = 0.12;
    const d = 0.88;

    // Colors from design spec
    let brandColor;  // #338BFF
    let mutedColor;  // #666666
    let strokeWeight;

    // Spring class
    class Spring {
        constructor(initial, minBound, maxBound) {
            this.pos = initial;
            this.target = initial;
            this.vel = 0;
            this.minBound = minBound;
            this.maxBound = maxBound;
            this.nextChange = p.random(500, 2000);
        }

        update() {
            let force = (this.target - this.pos) * k;
            this.vel += force;
            this.vel *= d;
            this.pos += this.vel;
        }

        constrain(min, max) {
            let effectiveMin = Math.max(this.minBound, min);
            let effectiveMax = Math.min(this.maxBound, max);
            if (this.pos < effectiveMin) { this.pos = effectiveMin; this.vel *= -0.3; }
            if (this.pos > effectiveMax) { this.pos = effectiveMax; this.vel *= -0.3; }
        }

        maybeChangeTarget(currentTime, min, max) {
            if (currentTime > this.nextChange) {
                let effectiveMin = Math.max(this.minBound, min) + 0.03;
                let effectiveMax = Math.min(this.maxBound, max) - 0.03;
                if (effectiveMax > effectiveMin) {
                    this.target = p.random(effectiveMin, effectiveMax);
                }
                this.nextChange = currentTime + p.random(1500, 4000);
            }
        }
    }

    // 17 letters: DESIGNEDFORBETTER
    // Layout: 4 columns
    // Col 0: D, E, S, I (4 rows)
    // Col 1: G, N, E, D (4 rows)
    // Col 2: F, O, R, B (4 rows)
    // Col 3: E, T, T, E, R (5 rows)
    const columns = [
        ['D', 'E', 'S', 'I'],
        ['G', 'N', 'E', 'D'],
        ['F', 'O', 'R', 'B'],
        ['E', 'T', 'T', 'E', 'R']
    ];

    // Vertical splits (3 lines between 4 columns)
    let vSplits = [];

    // Horizontal splits per column
    // Col 0: 3 splits for 4 rows
    // Col 1: 3 splits for 4 rows
    // Col 2: 3 splits for 4 rows
    // Col 3: 4 splits for 5 rows
    let hSplits = [];

    p.setup = function () {
        container = document.getElementById('kinetic-box');
        let w = container.offsetWidth;
        let h = container.offsetHeight;
        p.createCanvas(w, h).parent('kinetic-box');

        brandColor = p.color('#338BFF');
        mutedColor = p.color('#338BFF10');

        // Responsive stroke weight
        strokeWeight = p.width < 768 ? 5 : 10;

        // Initialize vertical splits (min 15% per column)
        vSplits = [
            new Spring(0.25, 0.15, 0.40),
            new Spring(0.5, 0.36, 0.64),
            new Spring(0.75, 0.60, 0.85)
        ];

        // Initialize horizontal splits for each column
        for (let col = 0; col < 4; col++) {
            let numRows = columns[col].length;
            let colSplits = [];
            // Minimum row height = ~18% of container height
            let minStep = 0.18;
            for (let i = 0; i < numRows - 1; i++) {
                let initialPos = (i + 1) / numRows;
                let minBound = (i + 1) * minStep;
                let maxBound = 1 - (numRows - 1 - i) * minStep;
                colSplits.push(new Spring(initialPos, minBound, maxBound));
            }
            hSplits.push(colSplits);
        }
    };

    p.draw = function () {
        p.background(0);

        let currentTime = p.millis();
        let W = p.width;
        let H = p.height;

        // Detect hovered cell
        let mx = p.mouseX / W;
        let my = p.mouseY / H;
        let hoveredCol = -1;
        let hoveredRow = -1;

        if (mx >= 0 && mx <= 1 && my >= 0 && my <= 1) {
            // Determine column
            if (mx < vSplits[0].pos) hoveredCol = 0;
            else if (mx < vSplits[1].pos) hoveredCol = 1;
            else if (mx < vSplits[2].pos) hoveredCol = 2;
            else hoveredCol = 3;

            // Determine row in that column
            let colHSplits = hSplits[hoveredCol];
            hoveredRow = 0;
            for (let i = 0; i < colHSplits.length; i++) {
                if (my >= colHSplits[i].pos) hoveredRow = i + 1;
            }
        }

        let pushForce = 0.004;

        // Update vertical splits with hover
        if (hoveredCol === 0) vSplits[0].vel += pushForce;
        else if (hoveredCol === 1) { vSplits[0].vel -= pushForce; vSplits[1].vel += pushForce; }
        else if (hoveredCol === 2) { vSplits[1].vel -= pushForce; vSplits[2].vel += pushForce; }
        else if (hoveredCol === 3) vSplits[2].vel -= pushForce;

        for (let i = 0; i < vSplits.length; i++) {
            let minC = i === 0 ? 0 : vSplits[i - 1].pos + 0.08;
            let maxC = i === vSplits.length - 1 ? 1 : vSplits[i + 1].pos - 0.08;
            vSplits[i].maybeChangeTarget(currentTime, minC, maxC);
            vSplits[i].update();
            vSplits[i].constrain(minC, maxC);
        }

        // Update horizontal splits per column with hover
        for (let col = 0; col < 4; col++) {
            let colSplits = hSplits[col];
            for (let i = 0; i < colSplits.length; i++) {
                if (hoveredCol === col) {
                    if (hoveredRow === i) colSplits[i].vel += pushForce;
                    else if (hoveredRow === i + 1) colSplits[i].vel -= pushForce;
                }

                let minR = i === 0 ? 0 : colSplits[i - 1].pos + 0.05;
                let maxR = i === colSplits.length - 1 ? 1 : colSplits[i + 1].pos - 0.05;
                colSplits[i].maybeChangeTarget(currentTime, minR, maxR);
                colSplits[i].update();
                colSplits[i].constrain(minR, maxR);
            }
        }

        // Responsive gap (smaller on mobile)
        let gap = W < 768 ? 1 : 2;

        // Column boundaries
        let xs = [0, vSplits[0].pos * W, vSplits[1].pos * W, vSplits[2].pos * W, W];

        // Draw cells
        for (let col = 0; col < 4; col++) {
            let letters = columns[col];
            let colSplits = hSplits[col];
            let ys = [0];
            for (let s of colSplits) ys.push(s.pos * H);
            ys.push(H);

            for (let row = 0; row < letters.length; row++) {
                let x = xs[col];
                let w = xs[col + 1] - x;
                let y = ys[row];
                let h = ys[row + 1] - y;

                drawBlock(x, y, w, h, gap, letters[row], W * H);
            }
        }
    };

    function drawBlock(x, y, w, h, gap, letter, totalArea) {
        p.push();
        p.translate(x + gap, y + gap);
        let bw = w - gap * 2;
        let bh = h - gap * 2;

        let pad = 12;
        let lx = pad;
        let ly = pad;
        let lw = bw - pad * 2;
        let lh = bh - pad * 2;

        // Calculate color based on cell size (larger = more blue, smaller = more gray)
        let cellArea = bw * bh;
        let areaRatio = cellArea / (totalArea / 17); // Compare to average cell size
        areaRatio = p.constrain(areaRatio, 0.3, 2.0); // Clamp range
        let t = p.map(areaRatio, 0.3, 2.0, 0, 1); // Normalize to 0-1
        let cellColor = p.lerpColor(mutedColor, brandColor, t);

        p.stroke(cellColor);
        p.strokeWeight(strokeWeight);
        p.strokeCap(p.SQUARE);
        p.noFill();

        if (lw > 10 && lh > 10) {
            drawLetter(letter, lx, ly, lw, lh);
        }

        p.pop();
    }

    function drawLetter(letter, x, y, w, h) {
        switch (letter) {
            case 'D':
                p.line(x, y, x, y + h);
                p.line(x, y, x + w * 0.7, y);
                p.line(x + w * 0.7, y, x + w, y + h * 0.2);
                p.line(x + w, y + h * 0.2, x + w, y + h * 0.8);
                p.line(x + w, y + h * 0.8, x + w * 0.7, y + h);
                p.line(x + w * 0.7, y + h, x, y + h);
                break;
            case 'E':
                p.line(x, y, x, y + h);
                p.line(x, y, x + w, y);
                p.line(x, y + h / 2, x + w * 0.75, y + h / 2);
                p.line(x, y + h, x + w, y + h);
                break;
            case 'S':
                p.line(x + w, y, x, y);
                p.line(x, y, x, y + h * 0.45);
                p.line(x, y + h * 0.45, x + w, y + h * 0.55);
                p.line(x + w, y + h * 0.55, x + w, y + h);
                p.line(x + w, y + h, x, y + h);
                break;
            case 'I':
                p.line(x + w / 2, y, x + w / 2, y + h);
                p.line(x, y, x + w, y);
                p.line(x, y + h, x + w, y + h);
                break;
            case 'G':
                p.line(x + w, y, x, y);
                p.line(x, y, x, y + h);
                p.line(x, y + h, x + w, y + h);
                p.line(x + w, y + h, x + w, y + h * 0.5);
                p.line(x + w, y + h * 0.5, x + w * 0.5, y + h * 0.5);
                break;
            case 'N':
                p.line(x, y + h, x, y);
                p.line(x, y, x + w, y + h);
                p.line(x + w, y + h, x + w, y);
                break;
            case 'F':
                p.line(x, y, x, y + h);
                p.line(x, y, x + w, y);
                p.line(x, y + h * 0.45, x + w * 0.7, y + h * 0.45);
                break;
            case 'O':
                p.line(x, y, x + w, y);
                p.line(x + w, y, x + w, y + h);
                p.line(x + w, y + h, x, y + h);
                p.line(x, y + h, x, y);
                break;
            case 'R':
                p.line(x, y, x, y + h);
                p.line(x, y, x + w, y);
                p.line(x + w, y, x + w, y + h * 0.4);
                p.line(x + w, y + h * 0.4, x, y + h * 0.45);
                p.line(x + w * 0.3, y + h * 0.45, x + w, y + h);
                break;
            case 'B':
                p.line(x, y, x, y + h);
                p.line(x, y, x + w * 0.8, y);
                p.line(x + w * 0.8, y, x + w, y + h * 0.15);
                p.line(x + w, y + h * 0.15, x + w, y + h * 0.35);
                p.line(x + w, y + h * 0.35, x, y + h * 0.5);
                p.line(x, y + h * 0.5, x + w, y + h * 0.65);
                p.line(x + w, y + h * 0.65, x + w, y + h * 0.85);
                p.line(x + w, y + h * 0.85, x + w * 0.8, y + h);
                p.line(x + w * 0.8, y + h, x, y + h);
                break;
            case 'T':
                p.line(x, y, x + w, y);
                p.line(x + w / 2, y, x + w / 2, y + h);
                break;
        }
    }

    p.windowResized = function () {
        let w = container.offsetWidth;
        let h = container.offsetHeight;
        p.resizeCanvas(w, h);
        // Update responsive values
        strokeWeight = w < 768 ? 5 : 10;
    };
};

if (document.getElementById('kinetic-box')) {
    new p5(sketch, 'kinetic-box');
}
