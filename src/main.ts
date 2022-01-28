import '@app/style.css';

import Shaders from '@app/engine/Shaders';
import Program from '@app/engine/Program';
import Buffer from '@app/engine/Buffer';

function resizeCanvas(
  canvas: HTMLCanvasElement
): void {
  const clientRect: DOMRect = document.documentElement.getBoundingClientRect();
  const { height, width } = clientRect;

  canvas.height = height;
  canvas.width = width;
}

window.addEventListener('load', () => {
  const canvas: HTMLCanvasElement = document.querySelector('#scene');
  if (!canvas) return;

  const context: WebGL2RenderingContext = canvas.getContext('webgl2');
  if (!context) return;

  resizeCanvas(canvas);
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

  /* eslint-disable */
  const vertices: Float32Array = new Float32Array([
    0.0, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 1.0,
    0.5, -0.5, 0.0, 1.0,
  ]);
  /* eslint-enable */

  const buffer: WebGLBuffer | null = Buffer.initBuffer(
    context,
    vertices
  );

  const draw: any = (): void => {
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.enableVertexAttribArray(
      context
        .getAttribLocation(program, 'position')
    );

    context.vertexAttribPointer(
      0,
      4,
      WebGL2RenderingContext.FLOAT,
      false,
      0,
      0
    );

    context.drawArrays(context.POINTS, 0, 3);
  };

  draw();
});
