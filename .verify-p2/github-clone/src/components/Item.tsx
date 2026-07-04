import type { ItemData } from '../content'
export default function Item(d: ItemData) {
  return (
    <li className="relative inset-0 mx-2 font-semibold leading-[19.5px] text-left text-xs text-[#59636e] list-item bg-transparent border-[#59636e] rounded-md w-[1262px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
    {" "}{" "}
    <span className="relative inset-0 grid grid-rows-1 items-start py-[6px] px-2 font-semibold leading-[19.5px] text-left text-xs text-[#59636e] bg-transparent border-[#59636e] rounded-md w-[1262px] box-border uif-506" style={{ "gridTemplateColumns": "24px 1148.95px 73.0469px", "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
    {" "}{" "}
    <span className="flex items-center mr-2 font-semibold leading-[19.5px] text-left text-xs text-[#59636e] bg-transparent border-[#59636e] w-[16px] box-border" style={{ "gridColumn": "leadingVisual", "gridRow": "leadingVisual", "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
    {" "}{" "}
    <div className="font-semibold leading-[19.5px] text-left text-xs text-[#59636e] bg-transparent border-[#59636e] w-[16px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} dangerouslySetInnerHTML={{ __html: d.svg0 }} />
    {" "}{" "}
    </span>
    {" "}{" "}
    <span className="flex flex-col gap-1 mr-2 font-semibold leading-[19.5px] text-left text-xs text-[#59636e] bg-transparent border-[#59636e] w-[1141px] box-border" style={{ "gridColumn": "label", "gridRow": "label", "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
    {" "}{" "}
    <span className="relative inset-0 leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] w-[1141px] box-border" style={{ "gridColumn": "label", "gridRow": "label", "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
    {" "}{" "}
    <span className="inline leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] w-[66px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>{d.t0}</span>
    {" "}{" "}
    </span>
    {" "}{" "}
    </span>
    {" "}{" "}
    <span className="leading-[22.75px] text-left text-sm text-[#59636e] bg-transparent border-[#59636e] w-[73px] box-border" style={{ "gridColumn": "trailingLabel", "gridRow": "trailingLabel", "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>Learn More</span>
    {" "}{" "}
    </span>
    {" "}{" "}
    </li>
  )
}
