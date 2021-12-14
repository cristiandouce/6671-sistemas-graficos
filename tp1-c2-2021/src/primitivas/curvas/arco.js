import { vec3 } from "gl-matrix";

export class Arco {
  constructor(radio = 2, angulo = Math.PI, inicio = 0) {
    this.radio = radio;
    this.angulo = angulo;
  }

  getPosition(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);

    return vec3.fromValues(this.radio * cos, this.radio * sen, 0);
  }

  getTangent(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);

    const tan = vec3.fromValues(-this.radio * sen, this.radio * cos, 0);
    vec3.normalize(tan, tan);
    return tan;
  }

  getNormal(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);

    const nrm = vec3.fromValues(-this.radio * cos, -this.radio * sen, 0);
    vec3.normalize(nrm, nrm);
    return nrm;
  }

  getBinormal(u) {
    return vec3.fromValues(0, 0, 1);
  }
}

export class ArcoXZ {
  constructor(radio = 2, angulo = Math.PI) {
    this.radio = radio;
    this.angulo = angulo;
  }

  getPosition(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);

    return vec3.fromValues(this.radio * cos, 0, this.radio * sen);
  }

  getTangent(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);

    const tan = vec3.fromValues(-this.radio * sen, 0, this.radio * cos);
    vec3.normalize(tan, tan);
    return tan;
  }

  getNormal(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);
    const nrm = vec3.fromValues(-this.radio * cos, 0, -this.radio * sen);
    vec3.normalize(nrm, nrm);
    return nrm;
  }

  getBinormal(u) {
    return vec3.fromValues(0, 1, 0);
  }
}

export class ArcoYZ {
  constructor(radio = 2, angulo = Math.PI) {
    this.radio = radio;
    this.angulo = angulo;
  }

  getPosition(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);

    return vec3.fromValues(0, this.radio * cos, this.radio * sen);
  }

  getTangent(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);
    const tan = vec3.fromValues(0, -this.radio * sen, this.radio * cos);
    vec3.normalize(tan, tan);
    return tan;
  }

  getNormal(u) {
    const cos = Math.cos(u * this.angulo);
    const sen = Math.sin(u * this.angulo);

    const nrm = vec3.fromValues(0, -this.radio * cos, -this.radio * sen);
    vec3.normalize(nrm, nrm);
    return nrm;
  }

  getBinormal(u) {
    return vec3.fromValues(1, 0, 0);
  }
}
