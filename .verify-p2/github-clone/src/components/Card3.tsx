import type { Card3Data } from '../content'
export default function Card3(d: Card3Data) {
  return (
    <div className="flex flex-col items-start gap-4 py-16 px-12 font-sans leading-[24px] text-base text-white bg-transparent border-b border-x-white border-t-white border-b-[#21262d] w-[533px] box-border" style={{ "transition": "none" }}>
    <div className="flex flex-col items-start font-sans leading-[24px] text-left text-base text-white bg-transparent border-white w-[437px] box-border" style={{ "backgroundPosition": "0px 0px", "transition": "none" }}>
    <div className="p-3 mb-4 font-sans leading-[24px] text-left text-base text-[#5fed83] bg-[#0d3024] border-[#5fed83] rounded-xl w-[56px] box-border" style={{ "transition": "none" }}>
    <div className="inline-block font-sans leading-[24px] text-left text-base text-[#5fed83] bg-transparent border-[#5fed83] overflow-clip w-[32px] box-border" style={{ "transition": "none" }}></div>
    </div>
    <p className="mb-6 font-sans leading-[24px] tracking-[0.24px] text-left text-base text-[#a4aea6] bg-transparent border-[#a4aea6] w-[437px] box-border" style={{ "transition": "none" }}>
    <span className="inline font-sans leading-[27px] tracking-[0.18px] text-left text-lg text-[#a4aea6] bg-transparent border-[#a4aea6] w-[391px] box-border" style={{ "transition": "none" }}>{d.t0}</span>
    </p>
    <a className="relative inset-x-0 top-[0.8px] bottom-[-0.8px] flex justify-center items-center gap-y-[normal] gap-x-1 pb-[2.4px] font-sans leading-[24px] text-left text-base text-accent bg-transparent border-accent w-[199px] box-border uif-1021" style={{ "transition": "none" }} href={d.href0}>
    <span className="font-sans font-medium leading-[24px] tracking-[0.24px] text-left text-base text-accent bg-transparent border-accent w-[179px] box-border" style={{ "transition": "none" }}>
    <span className="inline font-sans leading-[27px] tracking-[0.18px] text-left text-lg text-accent bg-transparent border-accent w-[179px] box-border" style={{ "transition": "none" }}>{d.t1}</span>
    </span>
    <div className="font-sans leading-[24px] text-left text-base text-accent bg-transparent border-accent overflow-hidden w-[16px] box-border" style={{ "transform": "matrix(1, 0, 0, 1, 0, 0)", "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg class=\"Primer_Brand__ExpandableArrow-module__ExpandableArrow___rkfek Primer_Brand__Link-module__Link-arrow___HBMJ9\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\" focusable=\"false\"><path fill=\"currentColor\" d=\"M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z\"></path><path class=\"Primer_Brand__ExpandableArrow-module__ExpandableArrow-stem___g4mdy\" stroke=\"currentColor\" d=\"M1.75 8H11\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path></svg>" }} />
    </a>
    </div>
    </div>
  )
}
