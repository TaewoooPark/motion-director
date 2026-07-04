import type { CardData } from '../content'
export default function Card(d: CardData) {
  return (
    <div className="grid grid-cols-1 gap-1 pb-5 font-sans leading-[24px] text-base text-white bg-transparent border-b border-x-white border-t-white border-b-[#353d37] w-[544px] box-border" style={{ "gridTemplateRows": "30.7969px 0px", "transition": "none" }}>
    <dt className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[544px] box-border" style={{ "transition": "none" }}>
    <button className="inline-block font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[544px] box-border uif-1051" style={{ "backgroundPosition": "0px 0px", "transition": "none" }}>
    <div className="flex justify-between items-center font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[544px] box-border" style={{ "transition": "none" }}>
    <h3 className="font-sans font-[480] leading-[30.8px] text-left text-[22px] text-[#a4aea6] bg-transparent border-[#a4aea6] w-[352px] box-border" style={{ "transition": "none" }}>{d.t0}</h3>
    <div className="font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[16px] box-border" style={{ "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg data-component=\"Octicon\" aria-hidden=\"true\" focusable=\"false\" class=\"octicon octicon-plus\" viewBox=\"0 0 16 16\" width=\"16\" height=\"16\" fill=\"currentColor\" display=\"inline-block\" overflow=\"visible\" style=\"vertical-align:text-bottom\"><path d=\"M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z\"></path></svg>" }} />
    </div>
    </button>
    </dt>
    <dd className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[544px] box-border" style={{ "transition": "none" }}>
    <div className="grid grid-cols-1 grid-rows-1 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[544px] box-border" style={{ "transition": "none" }}>
    <div className="flex flex-col items-start gap-4 font-sans leading-[24px] text-base text-white bg-transparent border-white overflow-hidden w-[544px] box-border" style={{ "transition": "none" }}>
    <p className="font-sans leading-[27px] tracking-[0.18px] text-lg text-[#a4aea6] bg-transparent border-[#a4aea6] w-[326px] box-border" style={{ "transition": "none" }}>
    <span className="inline font-sans leading-[27px] tracking-[0.18px] text-lg text-[#a4aea6] bg-transparent border-[#a4aea6] w-[326px] box-border" style={{ "transition": "none" }}>{d.t1}</span>
    </p>
    <span className="absolute top-[34.797px] right-[543px] bottom-[335.781px] left-0 font-sans leading-[24px] text-base text-white bg-transparent border-white overflow-hidden w-[1px] box-border" style={{ "transition": "none" }}></span>
    <a className="relative inset-x-0 top-[0.8px] bottom-[-0.8px] flex justify-center items-center gap-y-[normal] gap-x-1 pb-[2.4px] mb-1 font-sans leading-[24px] text-base text-accent bg-transparent border-accent w-[220px] box-border uif-1062" style={{ "transition": "none" }} href={d.href0}>
    <span className="font-sans font-medium leading-[24px] tracking-[0.24px] text-base text-accent bg-transparent border-accent w-[200px] box-border" style={{ "transition": "none" }}>
    <span className="inline font-sans leading-[27px] tracking-[0.18px] text-lg text-accent bg-transparent border-accent w-[200px] box-border" style={{ "transition": "none" }}>{d.t2}</span>
    </span>
    <div className="font-sans leading-[24px] text-base text-accent bg-transparent border-accent overflow-hidden w-[16px] box-border" style={{ "transform": "matrix(1, 0, 0, 1, 0, 0)", "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg class=\"Primer_Brand__ExpandableArrow-module__ExpandableArrow___rkfek Primer_Brand__Link-module__Link-arrow___HBMJ9\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\" focusable=\"false\"><path fill=\"currentColor\" d=\"M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z\"></path><path class=\"Primer_Brand__ExpandableArrow-module__ExpandableArrow-stem___g4mdy\" stroke=\"currentColor\" d=\"M1.75 8H11\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path></svg>" }} />
    </a>
    </div>
    </div>
    </dd>
    </div>
  )
}
