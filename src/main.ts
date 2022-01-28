import '@app/style.css';

import Shaders from '@app/engine/Shaders';
import Program from '@app/engine/Program';
import Buffer from '@app/engine/Buffer';

// import Mandelbrot from '@app/Mandelbrot';

import init, {
  get_mandelbrot,
} from '../wasm';

function resizeCanvas(
  canvas: HTMLCanvasElement,
  context: WebGL2RenderingContext
): void {
  const clientRect: DOMRect = document.documentElement.getBoundingClientRect();
  const { height, width } = clientRect;

  canvas.height = height;
  canvas.width = width;
  context.viewport(
    0,
    0,
    canvas.width,
    canvas.height
  );
}

window.addEventListener('load', () => {
  init()
    .then(() => {
      const canvas: HTMLCanvasElement = document.querySelector('#scene');
      if (!canvas) return;

      const context: WebGL2RenderingContext = canvas.getContext('webgl2');
      if (!context) return;

      resizeCanvas(canvas, context);
      context.clearColor(0, 0, 0, 1);
      context.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT);

      const { vertexShader, fragmentShader } = Shaders.getShaders(context);
      if (!vertexShader || !fragmentShader) return;

      const program: WebGLProgram | null = Program.getProgram(
        context,
        vertexShader,
        fragmentShader
      );
      if (!program) return;

      context.useProgram(program);

      const maxIteration: number = 10000;

      // console.time('typescript');
      // const verticesTypescript: number[] = Mandelbrot.getSet(
      //   canvas.height,
      //   canvas.width,
      //   maxIteration
      // );
      // console.timeEnd('typescript');

      // eslint-disable-next-line
      console.time('rust');
      const vertices: number[] = get_mandelbrot(
        canvas.height,
        canvas.width,
        maxIteration
      );
      // eslint-disable-next-line
      console.timeEnd('rust');

      // eslint-disable-next-line
      // console.log(vertices);

      const buffer: WebGLBuffer | null = Buffer.initBuffer(
        context,
        new Float32Array(vertices)
      );

      const draw: any = (): void => {
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.enableVertexAttribArray(
          context
            .getAttribLocation(program, 'position')
        );

        context.vertexAttribPointer(
          0,
          2,
          WebGL2RenderingContext.FLOAT,
          false,
          0,
          0
        );

        context.drawArrays(context.POINTS, 0, vertices.length / 2);
      };

      draw();
    });
});
