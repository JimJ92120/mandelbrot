import Shaders from "./Shader";
import Program from "./Program";
import Buffer from "./Buffer";

const OPTIONS = {
  pointSize: 2.0,
};

const U_POINT_SIZE = "u_pointSize";
const U_DIMENSION = "u_dimension";
const A_POSITION = "a_position";

const VERTEX_SHADER_SOURCE: string = `#version 300 es
  precision highp float;

  uniform float ${U_POINT_SIZE};
  uniform vec2 ${U_DIMENSION};

  in vec2 ${A_POSITION};

  void main() {
    // offset to keep set centered
    vec2 position = (${A_POSITION} + vec2(0.75, 0.0));
    float aspect = ${U_DIMENSION}[1] / ${U_DIMENSION}[0];
    vec2 scale = vec2(aspect, 1);

    // if height larger than width
    if (${U_DIMENSION}[0] < ${U_DIMENSION}[1]) {
      scale = scale * (${U_DIMENSION}[0] / ${U_DIMENSION}[1]);
      position = position * vec2(0.75, 0.75);
    }

    gl_Position = vec4(position * scale, 0.0, 1.0);
    gl_PointSize = ${U_POINT_SIZE};
  }
`;
const FRAGMENT_SHADER_SOURCE: string = `#version 300 es
  precision mediump float;

  out vec4 FragColor;

  void main() {
    FragColor = vec4(1, 0, 0, 1);
  }
`;

export default class Engine {
  canvas: HTMLCanvasElement;
  context: WebGL2RenderingContext | null = null;
  resolution: [number, number] = [0, 0];
  dimension: [number, number] = [0, 0];
  shaders: [
    WebGLShader | null,
    WebGLShader | null
  ] = [null, null];
  program: WebGLProgram | null = null;
  vertexSize: number = 2;

  constructor(canvasId: string) {
    this.setCanvas(canvasId);
    this.setContext();

    if (this.context) {
      this.setResolution();
      this.setDimension();

      this.resize();

      this.setShaders();
      this.setProgram();
      this.setUniforms();
    }
  }

  setCanvas(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  }

  setContext() {
    this.context = this.canvas.getContext("webgl2");
  }

  setResolution() {
    const canvasClientRect: DOMRect = this.canvas.getBoundingClientRect();
    const { height, width } = canvasClientRect;

    this.resolution = [
      Math.ceil(width / OPTIONS.pointSize),
      Math.ceil(height / OPTIONS.pointSize),
    ];
  }

  setDimension() {
    this.dimension = [
      this.resolution[0] * OPTIONS.pointSize,
      this.resolution[1] * OPTIONS.pointSize,
    ]
  }

  resize() {
    this.canvas.width = this.dimension[0];
    this.canvas.height = this.dimension[1];
    this.context?.viewport(0, 0, this.dimension[0], this.dimension[1]);
  }

  clearColor() {
    if (this.context) {
      this.context.clearColor(0, 0, 0, 1);
      this.context.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT);
    }
  }

  setShaders() {
    if (this.context) {
      const { vertexShader, fragmentShader } = Shaders.getShaders(
        this.context,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE
      );

      this.shaders = [vertexShader, fragmentShader];
    }
  }

  setProgram() {
    if (this.context
      && this.shaders[0]
      && this.shaders[1]
    ) {
      this.program = Program.getProgram(
        this.context,
        this.shaders[0],
        this.shaders[1]  
      );
    }
  }

  setUniforms() {
    if (this.context
      && this.program
    ) {
      const u_pointSizeLocation: WebGLUniformLocation | null =
        this.context.getUniformLocation(this.program, U_POINT_SIZE);
      const u_dimensionLocation: WebGLUniformLocation | null =
        this.context.getUniformLocation(this.program, U_DIMENSION);

      this.context.useProgram(this.program);

      this.context.uniform1f(u_pointSizeLocation, OPTIONS.pointSize);
      this.context.uniform2fv(u_dimensionLocation, this.dimension);
    }
  }

  draw(bufferData: Float32Array) {
    if (this.context
      && this.program
    ) {
      this.clearColor();

      const buffer: WebGLBuffer | null = Buffer.initBuffer(
        this.context,
        bufferData
      );

      this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
      this.context.enableVertexAttribArray(
        this.context.getAttribLocation(this.program, A_POSITION)
      );
      this.context.vertexAttribPointer(
        0,
        this.vertexSize,
        WebGL2RenderingContext.FLOAT,
        false,
        0,
        0
      );

      this.context.drawArrays(
        this.context.POINTS,
        0,
        bufferData.length / this.vertexSize
      );
    }
  }
}
