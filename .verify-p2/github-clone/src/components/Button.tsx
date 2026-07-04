import type { ButtonData } from '../content'
export default function Button(d: ButtonData) {
  return (
    <button className="relative inset-0 inline-block py-2 px-4 mr-1 font-sans leading-[24px] text-center whitespace-nowrap text-base text-white bg-transparent border border-transparent rounded-[60px] w-[130px] box-border uif-697" style={{ "transition": "none" }}>
    <span className="inline font-sans font-medium leading-[24px] tracking-[0.24px] text-center whitespace-nowrap text-base text-white bg-transparent border-white w-[42px] box-border" style={{ "transition": "none" }}>{d.t0}</span>
    </button>
  )
}
