const VERTEX_SHADER_SOURCE: string = `
  attribute vec4 position;

  void main() {
    gl_Position = position;
  }
`;
const FRAGMENT_SHADER_SOURCE: string = `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`;

function isShaderCompiled(
  context: WebGL2RenderingContext,
  shader: WebGLShader
): boolean {
  return context.getShaderParameter(shader, WebGL2RenderingContext.COMPILE_STATUS);
}

function initShader(
  context: WebGL2RenderingContext,
  shaderType: number,
  shaderSource: string
): WebGLShader | null {
  const shader: WebGLShader = context.createShader(shaderType);

  context.shaderSource(shader, shaderSource);
  context.compileShader(shader);

  if (!isShaderCompiled(context, shader)) {
    // eslint-disable-next-line
    console.error(context.getShaderInfoLog(shader));

    return null;
  }

  return shader;
}

// add return struct definition: { vertexShader, fragmentShader }
function getShaders(
  context: WebGL2RenderingContext
): any {
  return {
    vertexShader: initShader(
      context,
      WebGL2RenderingContext.VERTEX_SHADER,
      VERTEX_SHADER_SOURCE
    ),
    fragmentShader: initShader(
      context,
      WebGL2RenderingContext.FRAGMENT_SHADER,
      FRAGMENT_SHADER_SOURCE
    )
  };
}

export default {
  getShaders,
};
