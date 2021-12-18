import { vec3 } from "gl-matrix";

export class Rect2D {
  constructor(x1, z1, x2, z2) {
    this.origin = vec3.fromValues(x1, 0, z1);
    this.destination = vec3.fromValues(x2, 0, z2);
    this.difference = vec3.sub([], this.destination, this.origin);

    this.tangent = vec3.normalize(vec3.create(), this.difference);
    this.binormal = vec3.fromValues(0, 1, 0);
    this.normal = vec3.cross([], this.tangent, this.binormal);
  }

  getPosition(u) {
    const step = vec3.scale([], this.difference, u);
    const out = vec3.create();
    return vec3.add(out, this.origin, step);
  }

  getTangent(u) {
    return vec3.clone(this.tangent);
  }

  getBinormal(u) {
    return vec3.clone(this.binormal);
  }

  getNormal(u) {
    return vec3.clone(this.normal);
  }
}

export class RectXY {
  constructor(x1, y1, x2, y2) {
    this.origin = vec3.fromValues(x1, y1, 0);
    this.destination = vec3.fromValues(x2, y2, 0);
    this.difference = vec3.sub([], this.destination, this.origin);

    this.tangent = vec3.normalize(vec3.create(), this.difference);
    this.binormal = vec3.fromValues(0, 0, 1);
    this.normal = vec3.cross([], this.tangent, this.binormal);
  }

  getPosition(u) {
    const step = vec3.scale([], this.difference, u);
    const out = vec3.create();
    return vec3.add(out, this.origin, step);
  }

  getTangent(u) {
    return vec3.clone(this.tangent);
  }

  getBinormal(u) {
    return vec3.clone(this.binormal);
  }

  getNormal(u) {
    return vec3.clone(this.normal);
  }
}
