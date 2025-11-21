# Neurofiber Loom: Quantum Chaos Controller

**Open `index.html` in your browser** to pilot a 3-body chaotic system via Bloch sphere.

*Frontend: 200 lines of vanilla JS (Three.js/Tone.js via CDN)  
Backend: Optional GPU engine for scaling to 1000+ bodies*

![bloch-sphere-demo](https://user-images.githubusercontent.com/.../demo.gif)

### Quick Start
```bash
# No build required
open index.html

# Or connect to GPU engine (optional)
docker-compose -f engine/docker-compose.yml up
