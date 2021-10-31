import Superficie from "./_superficie";

export default class Granada extends Superficie {
  getPosicion(alfa, beta) {
    const r = 2;
    const nx = Math.sin(beta) * Math.sin(alfa);
    const ny = Math.sin(beta) * Math.cos(alfa);
    const nz = Math.cos(beta);

    const g = beta % 0.5;
    const h = alfa % 1;
    let f = 1;

    if (g < 0.25) f = 0.95;
    if (h < 0.5) f = f * 0.95;

    const x = nx * r * f;
    const y = ny * r * f;
    const z = nz * r * f;

    return [x, y, z];
  }

  getNormal(alpha, beta) {
    const p = this.getPos(alfa, beta);
    const v = vec3.create();
    vec3.normalize(v, p);

    const delta = 0.05;
    const p1 = this.getPos(alfa, beta);
    const p2 = this.getPos(alfa, beta + delta);
    const p3 = this.getPos(alfa + delta, beta);

    const v1 = vec3.fromValues(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
    const v2 = vec3.fromValues(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);

    vec3.normalize(v1, v1);
    vec3.normalize(v2, v2);

    const n = vec3.create();
    vec3.cross(n, v1, v2);
    vec3.scale(n, n, -1);
    return n;
  }
}
