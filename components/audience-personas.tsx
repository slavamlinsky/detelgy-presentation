import type { SlideContent } from '@/lib/presentation';

const portraits = ['/assets/personas/emerging-3d.png', '/assets/personas/examiner-3d.png', '/assets/personas/expert-3d.png'];
function Professional({ variant }: { variant: number }) {
  return <img className="audience-character" src={portraits[variant]} alt="" aria-hidden="true" />;
}
export function AudiencePersonas({slide}:{slide:SlideContent}) {
  return <>
    <svg className="audience-growth" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M191 346C205 288 191 231 225 169"/>
        <path d="M204 259C146 266 93 220 94 159C154 160 208 199 204 259Z" fill="currentColor" fillOpacity=".16"/>
        <path d="M213 208C204 146 247 92 313 79C317 143 278 200 213 208Z" fill="currentColor" fillOpacity=".16"/>
        <path d="M204 259C165 224 139 201 116 181M213 208C242 162 273 122 293 101"/>
        <path d="M144 348Q191 335 241 348" strokeOpacity=".55"/>
      </g>
    </svg>
    <div className="audience-scene">
    <svg className="audience-connections" viewBox="0 0 1696 460" aria-hidden="true"><g fill="none" stroke="#86AEC9" strokeWidth="2"><path pathLength="1" d="M380 260Q570 180 715 260"/><path pathLength="1" d="M981 260Q1140 180 1316 260"/></g></svg>
    {slide.items.map((item,i)=><section key={item.title} className={`audience-person audience-person-${i}`} tabIndex={0} aria-label={`${item.title}. ${item.label}. ${item.body}`}>
      <div className="audience-portrait"><span className="audience-backdrop"/>{i===1&&<span className="audience-primary">Primary focus</span>}<Professional variant={i}/></div>
      <h3>{item.title}</h3><span className="audience-purpose">{item.label}</span>
      <p className="audience-jtbd">{item.body}</p>
    </section>)}
  </div></>;
}
