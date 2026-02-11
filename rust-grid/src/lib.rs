use wasm_bindgen::prelude::*;
use std::f32::consts::PI;

// ==========================================
// Fast Math Helpers (SIMD-Friendly)
// ==========================================

#[inline(always)]
fn fast_sin(x: f32) -> f32 {
    const TWO_PI: f32 = 2.0 * PI;
    const INV_TWO_PI: f32 = 0.159154943;
    const B: f32 = 1.27323954;
    const C: f32 = -0.405284735;
    
    let q = x * INV_TWO_PI;
    let q = q - (q + 0.5).floor(); 
    let x = q * TWO_PI;
    
    B * x + C * x * x.abs()
}

#[inline(always)]
fn fast_cos(x: f32) -> f32 {
    fast_sin(x + (PI / 2.0))
}

// ==========================================
// Grid Engine (SoA Refactored)
// ==========================================
#[wasm_bindgen]
pub struct GridEngine {
    pos_x: Vec<f32>,
    pos_y: Vec<f32>,
    origin_x: Vec<f32>,
    origin_y: Vec<f32>,
    vel_x: Vec<f32>,
    vel_y: Vec<f32>,
    count: usize,
    radius_sq: f32,
    last_dpr: f32,
}

#[wasm_bindgen]
impl GridEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(count: usize) -> GridEngine {
        GridEngine {
            pos_x: vec![0.0; count],
            pos_y: vec![0.0; count],
            origin_x: vec![0.0; count],
            origin_y: vec![0.0; count],
            vel_x: vec![0.0; count],
            vel_y: vec![0.0; count],
            count,
            radius_sq: 0.0,
            last_dpr: 0.0,
        }
    }

    pub fn init(&mut self, width: f32, height: f32, spacing: f32, dpr: f32) {
        let cols = (width / spacing).ceil() as usize + 2;
        let rows = (height / spacing).ceil() as usize + 2;
        self.count = cols * rows;

        self.pos_x.resize(self.count, 0.0);
        self.pos_y.resize(self.count, 0.0);
        self.origin_x.resize(self.count, 0.0);
        self.origin_y.resize(self.count, 0.0);
        self.vel_x.resize(self.count, 0.0);
        self.vel_y.resize(self.count, 0.0);

        let mut index = 0;
        for i in 0..cols {
            for j in 0..rows {
                let x = (i as f32 - 1.0) * spacing * dpr;
                let y = (j as f32 - 1.0) * spacing * dpr;
                
                self.pos_x[index] = x;
                self.pos_y[index] = y;
                self.origin_x[index] = x;
                self.origin_y[index] = y;
                self.vel_x[index] = 0.0;
                self.vel_y[index] = 0.0;
                
                index += 1;
            }
        }
        
        self.last_dpr = dpr;
        self.radius_sq = (250.0 * dpr) * (250.0 * dpr);
    }

    pub fn update(&mut self, mouse_x: f32, mouse_y: f32, dpr: f32, stiffness: f32, friction: f32) {
        if dpr != self.last_dpr {
            self.radius_sq = (250.0 * dpr) * (250.0 * dpr);
            self.last_dpr = dpr;
        }

        let radius_sq = self.radius_sq;
        let radius = 250.0 * dpr;
        let push_strength = 0.7 * dpr; 

        // Auto-vectorizable loop (Single Threaded SIMD)
        for ((((px, py), ox), oy), (vx, vy)) in self.pos_x.iter_mut()
            .zip(self.pos_y.iter_mut())
            .zip(self.origin_x.iter())
            .zip(self.origin_y.iter())
            .zip(self.vel_x.iter_mut().zip(self.vel_y.iter_mut())) 
        {
            let dx = *ox - *px;
            let dy = *oy - *py;
            
            // Spring force (Hooke's Law)
            let spring_x = dx * stiffness;
            let spring_y = dy * stiffness;

            let m_dx = *px - mouse_x; // Vector from mouse to point
            let m_dy = *py - mouse_y;
            let dist_sq = m_dx * m_dx + m_dy * m_dy;

            let mut force_x = 0.0;
            let mut force_y = 0.0;

            if dist_sq < radius_sq && dist_sq > 0.001 {
                let dist = dist_sq.sqrt();
                // Normalized repulsion force: (1 - dist/radius)
                let force_factor = (radius - dist) / radius; 
                let push = force_factor * push_strength;
                
                // Apply in direction of m_dx (normalized)
                // force = (m_dx / dist) * push
                let scale = push / dist;
                force_x = m_dx * scale;
                force_y = m_dy * scale;
            }

            *vx = (*vx + spring_x + force_x) * friction;
            *vy = (*vy + spring_y + force_y) * friction;

            *px += *vx;
            *py += *vy;
        }
    }

    pub fn pos_x_ptr(&self) -> *const f32 { self.pos_x.as_ptr() }
    pub fn pos_y_ptr(&self) -> *const f32 { self.pos_y.as_ptr() }
    pub fn count(&self) -> usize { self.count }
}

// ==========================================
// Benchmark Engine (SoA Refactored)
// ==========================================
#[wasm_bindgen]
pub struct BenchmarkEngine {
    pos_x: Vec<f32>,
    pos_y: Vec<f32>,
    origin_angle: Vec<f32>, 
    origin_radius: Vec<f32>,
    display_buffer: Vec<u32>,
    width: usize,
    height: usize,
    count: usize,
}

#[wasm_bindgen]
impl BenchmarkEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(count: usize) -> BenchmarkEngine {
        BenchmarkEngine {
            pos_x: vec![0.0; count],
            pos_y: vec![0.0; count],
            origin_angle: vec![0.0; count],
            origin_radius: vec![0.0; count],
            display_buffer: Vec::new(),
            width: 0,
            height: 0,
            count,
        }
    }

    pub fn init(&mut self, width: f32, height: f32) {
        if self.pos_x.len() != self.count {
            self.pos_x.resize(self.count, 0.0);
            self.pos_y.resize(self.count, 0.0);
            self.origin_angle.resize(self.count, 0.0);
            self.origin_radius.resize(self.count, 0.0);
        }
        
        self.width = width as usize;
        self.height = height as usize;
        self.display_buffer.resize(self.width * self.height, 0);

        let min_dimension = width.min(height);
        let min_r = min_dimension * 0.15;
        let max_r = min_dimension * 0.40;

        for i in 0..self.count {
            let t = i as f32 / self.count as f32;
            let angle = t * PI * 100.0; // Simplified for range
            
            let r_t = (i as f32 % 100.0) * 0.01;
            let radius = min_r + (max_r - min_r) * r_t;

            self.origin_angle[i] = angle;
            self.origin_radius[i] = radius;
        }
    }

    pub fn update(&mut self, time: f32, width: f32, height: f32) {
        let center_x = width * 0.5;
        let center_y = height * 0.5;
        let speed = 0.0002;
        
        const FREQ: f32 = 5.0;
        const TWIST: f32 = 0.005;
        const AMP: f32 = 10.0;

        // Auto-vectorizable loop (Single Threaded SIMD)
        for (((px, py), base_angle), base_radius) in self.pos_x.iter_mut()
            .zip(self.pos_y.iter_mut())
            .zip(self.origin_angle.iter())
            .zip(self.origin_radius.iter()) 
        {
            let angle = *base_angle + time * speed * (1000.0 / *base_radius);
            
            let mut wave_offset = 0.0;
            
            // Using fast_sin for better performance in time-based waves
            wave_offset += fast_sin(*base_angle * (FREQ * 1.0) - time * (TWIST * 1.0)) * (AMP / 1.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 2.0) - time * (TWIST * 2.0)) * (AMP / 2.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 3.0) - time * (TWIST * 3.0)) * (AMP / 3.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 4.0) - time * (TWIST * 4.0)) * (AMP / 4.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 5.0) - time * (TWIST * 5.0)) * (AMP / 5.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 6.0) - time * (TWIST * 6.0)) * (AMP / 6.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 7.0) - time * (TWIST * 7.0)) * (AMP / 7.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 8.0) - time * (TWIST * 8.0)) * (AMP / 8.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 9.0) - time * (TWIST * 9.0)) * (AMP / 9.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 10.0) - time * (TWIST * 10.0)) * (AMP / 10.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 11.0) - time * (TWIST * 11.0)) * (AMP / 11.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 12.0) - time * (TWIST * 12.0)) * (AMP / 12.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 13.0) - time * (TWIST * 13.0)) * (AMP / 13.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 14.0) - time * (TWIST * 14.0)) * (AMP / 14.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 15.0) - time * (TWIST * 15.0)) * (AMP / 15.0);
            wave_offset += fast_sin(*base_angle * (FREQ * 16.0) - time * (TWIST * 16.0)) * (AMP / 16.0);

            let r = *base_radius + wave_offset;

            *px = center_x + r * fast_cos(angle);
            *py = center_y + r * fast_sin(angle);
        }
    }

    pub fn render(&mut self) -> *const u32 {
        self.display_buffer.fill(0); 

        let width = self.width;
        let width_u32 = width as u32;
        let height_u32 = self.height as u32;
        let color: u32 = 0xFF80DE4A; 
        
        let ptr = self.display_buffer.as_mut_ptr();
        
        for i in 0..self.count {
            let ix = self.pos_x[i] as i32;
            let iy = self.pos_y[i] as i32;

            if (ix as u32) < width_u32 && (iy as u32) < height_u32 {
                let idx = (iy as usize) * width + (ix as usize);
                unsafe { *ptr.add(idx) = color; }
            }
        }
        
        self.display_buffer.as_ptr()
    }

    pub fn pos_x_ptr(&self) -> *const f32 { self.pos_x.as_ptr() }
    pub fn pos_y_ptr(&self) -> *const f32 { self.pos_y.as_ptr() }
    pub fn count(&self) -> usize { self.count }
}