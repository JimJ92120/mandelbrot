use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
pub struct ComplexNumber {
    position: [f32; 2],
    height: f32,
    width: f32,
}

impl ComplexNumber {
    const REAL_SET_LIMIT: [f32; 2] = [-2.0, 1.0];
    const IMAGINARY_SET_LIMIT: [f32; 2] = [-1.0, 1.0];

    pub fn new(position: [f32; 2], height: f32, width: f32) -> Self {
        Self {
            position,
            height,
            width
        }
    }

    fn get_real_set_position(&self) -> f32 {
        (
            ComplexNumber::REAL_SET_LIMIT[0]
            + (self.position[0] / self.width)
            * (ComplexNumber::REAL_SET_LIMIT[1] - ComplexNumber::REAL_SET_LIMIT[0])
        ) as f32
    }

    fn get_imaginary_set_position(&self) -> f32 {
        (
            ComplexNumber::IMAGINARY_SET_LIMIT[0]
            + (self.position[1] / self.height)
            * (ComplexNumber::IMAGINARY_SET_LIMIT[1] - ComplexNumber::IMAGINARY_SET_LIMIT[0])
        ) as f32
    }

    pub fn get_value(&self) -> [f32; 2] {     
        [
            self.get_real_set_position(),
            self.get_imaginary_set_position()
        ]
    }
}


#[wasm_bindgen]
#[derive(Debug)]
pub struct Mandelbrot {
    height: usize,
    width: usize,
    max_iteration_count: usize,
    data: Vec<f32>
}

#[wasm_bindgen]
impl Mandelbrot {
    #[wasm_bindgen(constructor)]
    pub fn new(height: usize, width: usize, max_iteration_count: usize) -> Self {
        let mut mandelbrot = Self {
            height,
            width,
            max_iteration_count,
            data: vec![]
        };

        mandelbrot.generate_set();

        mandelbrot
    }

    #[wasm_bindgen(getter)]
    pub fn data(&self) -> js_sys::Float32Array {
        let arr: Vec<f32> = self.data.iter().map(|i| *i).collect();

        js_sys::Float32Array::from(&arr[..])
    }

    fn is_in_mandelbrot(&self, complex: [f32; 2]) -> bool {
        let mut z: [f32; 2] = [0.0, 0.0];
        let mut iteration: i32 = 0;
    
        return loop {
            let p: [f32; 2] = [
                z[0].powi(2) - z[1].powi(2),
                2.0 * z[0] * z[1]
            ];
            z = [
                p[0] + complex[0],
                p[1] + complex[1]
            ];
            let res: f32 = (z[0].powi(2) + z[1].powi(2)).sqrt();
    
            if res <= 2.0 && iteration < self.max_iteration_count as i32 {
                iteration = iteration + 1;
            } else {
                break (res <= 2.0);
            }
        };
    }

    pub fn generate_set(&mut self) {
        let mut new_set: Vec<f32> = Vec::from([]);
    
        for column in 0..self.width {
            for row in 0..self.height {
                let complex_number: ComplexNumber = ComplexNumber::new(
                    [column as f32, row as f32],
                    self.height as f32,
                    self.width as f32
                );
                let complex_number_value: [f32; 2] = complex_number.get_value();
    
                if self.is_in_mandelbrot(complex_number_value) {
                    new_set.push(complex_number_value[0]);
                    new_set.push(complex_number_value[1]);
                }
            }
        }

        self.data = new_set;
    }
}
