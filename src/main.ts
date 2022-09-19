import init, {
  Mandelbrot,
} from "../dist/lib";
import Engine from "./engine";

window.addEventListener('load', () => {
  init()
    .then(() => {
      const engine: Engine = new Engine("scene");
      const maxIterationCount: number = 1000;
      const mandelbrotSet = new Mandelbrot(
        engine.dimension[0],
        engine.dimension[1],
        maxIterationCount
      );

      engine.draw(mandelbrotSet.data);
    });
});