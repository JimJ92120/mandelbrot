use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

// 
pub fn get_complex(
    position: [f32; 2],
    height: f32,
    width: f32
) -> [f32; 2] {
    const REAL_SET: [f32; 2] = [-2.0, 1.0];
    const IMAGINARY_SET: [f32; 2] = [-1.0, 1.0];

    let x: f32 = (
        REAL_SET[0]
        + (position[0] / width)
        * (REAL_SET[1] - REAL_SET[0])
    ) as f32;
    let y: f32 = (
        IMAGINARY_SET[0]
        + (position[1] / height)
        * (IMAGINARY_SET[1] - IMAGINARY_SET[0])
    ) as f32;

    [x, y]
}

#[warn(unused_assignments)]
fn is_mandelbrot(
    complex: [f32; 2],
    max_iteration: i32
) -> bool {
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

        if res <= 2.0 && iteration < max_iteration {
            iteration = iteration + 1;
        } else {
            break (res <= 2.0);
        }
    };
}

#[wasm_bindgen]
pub fn get_mandelbrot(
    height: i32,
    width: i32,
    max_iteration: i32
) -> js_sys::Array {
    let mut set: Vec<f32> = Vec::from([]);

    for column in 0..width {
        for row in 0..height {
            let complex: [f32; 2] = get_complex(
                [column as f32, row as f32],
                height as f32,
                width as f32
            );

            if is_mandelbrot(complex, max_iteration) {
                set.push(complex[0] + 0.5);
                set.push(complex[1]);
            }
        }
    }

    set.into_iter().map(JsValue::from).collect()
}
