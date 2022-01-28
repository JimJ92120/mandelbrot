import '@app/style.css';

import Shaders from '@app/engine/Shaders';
import Program from '@app/engine/Program';

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

  const { vertexShader, fragmentShader } = Shaders.getShaders(context);
  if (!vertexShader || !fragmentShader) return;

  const program: WebGLProgram | null = Program.getProgram(
    context,
    vertexShader,
    fragmentShader
  );
  if (!program) return;

  // eslint-disable-next-line
  console.log(program);
});
