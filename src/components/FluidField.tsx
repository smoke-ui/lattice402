import { useEffect, useRef } from 'react'

const vertex = `attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`
const fragment = `precision highp float;
uniform vec2 r,m; uniform float t;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
void main(){vec2 uv=(gl_FragCoord.xy-.5*r)/min(r.x,r.y);vec2 mouse=(m-.5*r)/min(r.x,r.y);float d=length(uv-mouse);vec2 q=vec2(fbm(uv*1.15+t*.035),fbm(uv*1.15+vec2(4.2,1.7)-t*.028));vec2 w=uv+.52*(q-.5);float f=fbm(w*2.2+vec2(t*.025,-t*.018));float ribbon=smoothstep(.24,.0,abs(uv.y+.18*sin(uv.x*2.5+t*.12)+.26*(f-.5)));float pointer=exp(-d*3.8);vec3 ink=vec3(.005,.008,.009);vec3 algo=vec3(.34,.31,.62);vec3 ice=vec3(.39,.84,.82);vec3 col=ink+algo*(.055*f+.11*ribbon)+ice*(.045*q.x);col+=algo*pointer*.045;float grain=(hash(gl_FragCoord.xy+floor(t*10.))-.5)*.018;gl_FragColor=vec4(col+grain,1.);}`

export function FluidField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof WebGLRenderingContext === 'undefined') return
    const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' })
    if (!gl) return
    const compile = (type: number, source: string) => { const shader=gl.createShader(type)!; gl.shaderSource(shader,source); gl.compileShader(shader); return shader }
    const program=gl.createProgram()!; gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex)); gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment)); gl.linkProgram(program); gl.useProgram(program)
    const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW)
    const position=gl.getAttribLocation(program,'p'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0)
    const resolution=gl.getUniformLocation(program,'r'), mouseUniform=gl.getUniformLocation(program,'m'), time=gl.getUniformLocation(program,'t')
    let mx=innerWidth*.7,my=innerHeight*.35,frame=0
    const pointer=(event: PointerEvent)=>{mx=event.clientX;my=innerHeight-event.clientY}
    const resize=()=>{const d=Math.min(devicePixelRatio,1.5);canvas.width=innerWidth*d;canvas.height=innerHeight*d;gl.viewport(0,0,canvas.width,canvas.height)}
    const render=(now:number)=>{gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform2f(mouseUniform,mx*Math.min(devicePixelRatio,1.5),my*Math.min(devicePixelRatio,1.5));gl.uniform1f(time,now*.001);gl.drawArrays(gl.TRIANGLES,0,3);frame=requestAnimationFrame(render)}
    addEventListener('pointermove',pointer,{passive:true});addEventListener('resize',resize);resize()
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) frame=requestAnimationFrame(render); else render(0)
    return()=>{cancelAnimationFrame(frame);removeEventListener('pointermove',pointer);removeEventListener('resize',resize)}
  },[])
  return <canvas ref={canvasRef} className="fluid-field" aria-hidden="true" />
}
