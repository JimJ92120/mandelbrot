function isInMandelbrot(
  complex: [number, number],
  iterationCount: number
): boolean {
  let z: [number, number] = [0, 0];
  let iteration: number = 0;
  let res: number;

  do {
    const p: [number, number] = [
      Math.pow(z[0], 2) - Math.pow(z[1], 2),
      2 * z[0] * z[1]
    ];
    z = [
      p[0] + complex[0],
      p[1] + complex[1]
    ];
    res = Math.sqrt(Math.pow(z[0], 2) + Math.pow(z[1], 2));

    iteration++;
  } while (res <= 2 && iteration < iterationCount);

  return res <= 2;
}

function getComplexNumber(
  position: [number, number],
  height: number,
  width: number
): [number, number] {
  const REAL_SET: [number, number] = [-2, 1];
  const IMAGINARY_SET: [number, number] = [-1, 1];

  return [
    REAL_SET[0] + (position[0] / width) * (REAL_SET[1] - REAL_SET[0]),
    IMAGINARY_SET[0] + (position[1] / height) * (IMAGINARY_SET[1] - IMAGINARY_SET[0])
  ];
}

function getSet(
  height: number,
  width: number,
  iterationCount: number
): number[] {
  const set: number[] = [];

  for (let i: number = 0; i < width; i++) {
    for (let j: number = 0; j < height; j++) {
      const complex: [number, number] = getComplexNumber([i, j], height, width);

      if (isInMandelbrot(complex, iterationCount)) {
        set.push(complex[0]);
        set.push(complex[1]);
      }
    }
  }

  return set;
}

export default {
  getSet,
};
