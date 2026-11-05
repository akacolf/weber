"use client";

import React, { useEffect, useRef } from "react";

export default function ShaderGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertSrc = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 vUv;

      // Simplex-style noise helper
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float t = u_time * 0.15;

        // Multi-frequency fluid distortion
        float n1 = snoise(st * 2.2 + vec2(t * 0.5, -t * 0.3));
        float n2 = snoise(st * 3.8 + vec2(-t * 0.4, t * 0.6) + vec2(n1 * 0.4));
        float n3 = snoise(st * 1.5 + vec2(n2 * 0.3, t * 0.2));

        // Deep obsidian, electric cobalt, soft violet, and teal highlights
        vec3 c_base = vec3(0.03, 0.04, 0.07);
        vec3 c_blue = vec3(0.12, 0.25, 0.55);
        vec3 c_violet = vec3(0.38, 0.18, 0.52);
        vec3 c_cyan = vec3(0.15, 0.65, 0.72);

        float blend1 = smoothstep(-0.4, 0.7, n1 + st.y * 0.5);
        float blend2 = smoothstep(-0.3, 0.8, n2 - st.x * 0.3);
        float blend3 = smoothstep(0.1, 0.9, n3);

        vec3 col = mix(c_base, c_blue, blend1 * 0.45);
        col = mix(col, c_violet, blend2 * 0.35);
        col = mix(col, c_cyan, blend3 * 0.22);

        // Add subtle vignette
        float vignette = 1.0 - length((st - 0.5) * 1.2);
        col *= clamp(vignette, 0.3, 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    let animId: number;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = (time: number) => {
      gl.uniform1f(uTime, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full opacity-90 transition-opacity" />
      <div className="absolute inset-0 bg-radial from-transparent via-background/40 to-background/95" />
    </div>
  );
}
