import type { Item2Data } from '../content'
export default function Item2(d: Item2Data) {
  return (
    <li className="font-sans leading-[24px] text-base text-white list-item bg-transparent border-white w-[101px] box-border" style={{ "transition": "none" }}>
    <div className="relative inset-0 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[101px] box-border uif-47" style={{ "transition": "none" }}>
    <button className="flex justify-between items-center p-2 font-sans leading-[24px] text-center whitespace-nowrap text-base text-white bg-transparent border-white w-[101px] box-border uif-48" style={{ "backgroundPosition": "0px 0px", "transition": "none" }}>
    {d.t0}
    <div className="ml-1 font-sans leading-[24px] text-center whitespace-nowrap text-base text-white bg-transparent border-white opacity-50 w-[16px] box-border" style={{ "transform": "matrix(0, 1, -1, 0, 0, 0)", "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg data-component=\"Octicon\" aria-hidden=\"true\" focusable=\"false\" class=\"octicon octicon-chevron-right NavDropdown-module__buttonIcon__Tkl8_\" viewBox=\"0 0 16 16\" width=\"16\" height=\"16\" fill=\"currentColor\" display=\"inline-block\" overflow=\"visible\" style=\"vertical-align:text-bottom\"><path d=\"M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z\"></path></svg>" }} />
    </button>
    </div>
    </li>
  )
}
