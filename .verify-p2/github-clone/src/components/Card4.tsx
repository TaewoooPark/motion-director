import type { Card4Data } from '../content'
export default function Card4(d: Card4Data) {
  return (
    <div className="flex col-span-4 pt-16 pl-12 font-sans leading-[24px] text-base text-white bg-transparent border-r border-y-white border-r-[#21262d] border-l-white w-[426px] box-border" style={{ "transition": "none" }}>
    <div className="flex flex-col gap-8 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[377px] box-border" style={{ "transition": "none" }}>
    <div className="flex flex-col items-start pr-6 font-sans leading-[24px] text-left text-base text-white bg-transparent border-white w-[377px] box-border" style={{ "transition": "none" }}>
    <p className="mb-6 font-sans leading-[24px] tracking-[0.24px] text-left text-base text-[#a4aea6] bg-transparent border-[#a4aea6] w-[353px] box-border" style={{ "transition": "none" }}>
    <span className="inline font-sans leading-[27px] tracking-[0.18px] text-left text-lg text-[#a4aea6] bg-transparent border-[#a4aea6] w-[352px] box-border" style={{ "transition": "none" }}>
    <span className="inline font-sans leading-[27px] tracking-[0.18px] text-left text-lg text-white bg-transparent border-white w-[183px] box-border" style={{ "transition": "none" }}>{d.t0}</span>
    {d.t1}
    </span>
    </p>
    </div>
    </div>
    </div>
  )
}
