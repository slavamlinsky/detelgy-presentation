import { UserRound } from 'lucide-react';
import type { SlideContent } from '@/lib/presentation';
export function OrbitDiagram({slide,loop=false}:{slide:SlideContent;loop?:boolean}) {
 const points=[[500,90],[810,215],[810,465],[500,590],[190,465],[190,215]];
 return <div className={`orbit-diagram ${loop?'loop':''}`}><svg viewBox="0 0 1000 680" role="img" aria-label={`${slide.center}: ${slide.items.map(i=>i.title).join(', ')}`}>
  <defs><marker id={`arrow-${slide.id}`} markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#5ca9e6" strokeWidth="1.2"/></marker></defs>
  {loop?<>{points.map((p,i)=>{const q=points[(i+1)%6];const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy);return <path key={i} d={`M ${p[0]+dx/l*65} ${p[1]+dy/l*65} Q ${(p[0]+q[0])/2+(p[0]+q[0]-1000)*.08} ${(p[1]+q[1])/2+(p[1]+q[1]-680)*.08} ${q[0]-dx/l*75} ${q[1]-dy/l*75}`} fill="none" stroke="#5ca9e6" strokeWidth="2" markerEnd={`url(#arrow-${slide.id})`}/>})}</>:points.map((p,i)=><line key={i} x1={500+(p[0]-500)*.25} y1={340+(p[1]-340)*.25} x2={500+(p[0]-500)*.62} y2={340+(p[1]-340)*.62} stroke="#52728f" strokeWidth="2" strokeDasharray="5 10"/>)}
  <circle cx="500" cy="340" r="112" fill="#112e4e" stroke="#547b9e" strokeWidth="1.5"/>
  {!loop&&<g transform="translate(472 280)"><UserRound width={56} height={56} color="#a6d4f6" strokeWidth={1.2}/></g>}
  {(slide.center||'').split('\n').map((line,i)=><text key={i} x="500" y={(loop?328:375)+i*35} textAnchor="middle" fill="#d8ecfa" fontSize={loop?31:26}>{line}</text>)}
  {points.map((p,i)=><g key={i}><circle cx={p[0]} cy={p[1]} r="33" fill="#08182e" stroke="#527a9c" strokeWidth="1.5"/><text x={p[0]} y={p[1]+8} textAnchor="middle" fill="#8bc4ee" fontSize="23">{String(i+1).padStart(2,'0')}</text><text className="orbit-label" x={p[0]} y={p[1]+66} textAnchor="middle" fill="#e4eef7" fontSize="28">{slide.items[i].title}</text></g>)}
 </svg></div>;
}
export function NetworkDiagram({labels}:{labels:string[]}) {
 const points=[[130,80],[350,160],[610,70],[800,245],[590,410],[300,440],[90,290],[460,300]];
 return <svg className="network-diagram" viewBox="0 0 900 550" role="img" aria-label={labels.join(', ')}>
  {points.flatMap((p,i)=>points.slice(i+1).filter((q,j)=>(i+j)%3===0).map((q,j)=><line key={`${i}-${j}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#4d7fa6" strokeWidth="1.2" opacity=".55"/>))}
  {points.map((p,i)=><g key={i}><circle cx={p[0]} cy={p[1]} r={i===7?59:32} fill={i===7?'#235784':'#102c48'} stroke="#78b5e2" strokeWidth="1.5"/><g transform={`translate(${p[0]-15} ${p[1]-15})`}><UserRound size={30} color="#c5e5fc" strokeWidth={1.3}/></g></g>)}
  {labels.map((label,i)=><text key={label} x={[130,610,800,300][i]} y={[145,135,310,505][i]} fontSize="28" textAnchor="middle" fill="#bbdaf0">{label}</text>)}
 </svg>;
}
