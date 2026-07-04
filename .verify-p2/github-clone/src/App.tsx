import { useEffect } from 'react'
import Hero from './components/Hero'
import Item from './components/Item'
import Item2 from './components/Item2'
import Section2 from './components/Section2'
import Section3 from './components/Section3'
import { ITEM2_DATA, ITEM_DATA } from './content'

export default function App() {
  useEffect(() => {
    const M = {"501":{"display":"block","pos":"static","opacity":"1","visibility":"visible","height":"190.5px","maxHeight":"540px","transform":"none","z":"auto","bc":"rgba(0, 0, 0, 0)","bi":"none","sh":"none","pointerEvents":"auto","ov":"hidden auto","x":81,"y":55,"w":1278,"ht":191},"1057":{"display":"grid","pos":"static","opacity":"1","visibility":"visible","height":"76.3906px","maxHeight":"none","transform":"none","z":"auto","bc":"rgba(0, 0, 0, 0)","bi":"none","sh":"none","pointerEvents":"auto","ov":"visible","x":128,"y":469,"w":544,"ht":76},"1076":{"display":"grid","pos":"static","opacity":"1","visibility":"visible","height":"103.391px","maxHeight":"none","transform":"none","z":"auto","bc":"rgba(0, 0, 0, 0)","bi":"none","sh":"none","pointerEvents":"auto","ov":"visible","x":128,"y":535,"w":544,"ht":103},"1095":{"display":"grid","pos":"static","opacity":"1","visibility":"visible","height":"103.391px","maxHeight":"none","transform":"none","z":"auto","bc":"rgba(0, 0, 0, 0)","bi":"none","sh":"none","pointerEvents":"auto","ov":"visible","x":128,"y":615,"w":544,"ht":103},"1114":{"display":"grid","pos":"static","opacity":"1","visibility":"visible","height":"76.3906px","maxHeight":"none","transform":"none","z":"auto","bc":"rgba(0, 0, 0, 0)","bi":"none","sh":"none","pointerEvents":"auto","ov":"visible","x":128,"y":708,"w":544,"ht":76}}
    const h = e => { const t = e.target.closest('[data-uif-tog]'); if (!t) return; e.preventDefault()
      const id = t.getAttribute('data-uif-tog'), p = document.getElementById('uif-t-' + id); if (!p) return
      const on = p.dataset.uifOn === '1'; p.dataset.uifOn = on ? '0' : '1'; t.setAttribute('aria-expanded', String(!on))
      const s = M[id] || {}; for (const k in s) p.style[k] = on ? '' : s[k] }
    document.addEventListener('click', h); return () => document.removeEventListener('click', h)
  }, [])
  return (
    <div className="min-h-screen bg-white">
      <div className="leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="absolute inset-x-0 top-0 bottom-225 z-[1000] leading-[21px] text-sm text-[#1f2328] bg-white border-[#1f2328] w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      {" "}{" "}
      <div className="leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      <div className="leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      <div className="fixed inset-x-0 top-0 bottom-225 z-[99] leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <a className="absolute top-0 right-[1439px] bottom-[-1px] left-0 leading-[21px] text-sm text-white bg-[#1f6feb] border-white overflow-hidden w-[1px] box-border uif-5" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} href="#start-of-content">Skip to content</a>
      {" "}{" "}
      <span className="top-0 left-0 leading-[21px] text-sm text-fg bg-[#1f6feb] border-border box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></span>
      {" "}{" "}
      <div className="leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      {" "}{" "}
      </div>
      {" "}{" "}
      <div className="leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      {" "}{" "}
      <header className="absolute inset-x-0 top-0 bottom-[-72px] z-[32] py-4 leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <h2 className="absolute top-4 right-[1439px] bottom-[55px] left-0 font-semibold leading-[36px] text-2xl text-white bg-transparent border-white overflow-hidden w-[1px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>Navigation Menu</h2>
      {" "}{" "}
      <div className="relative inset-0 z-[1] flex items-center px-8 leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="flex justify-between items-center leading-[24px] text-base text-white bg-transparent border-white w-[48px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <a className="mr-4 leading-[24px] text-base text-white bg-transparent border-white w-[32px] box-border uif-32" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} href="/">
      {" "}{" "}
      <div className="inline-block leading-[24px] text-base text-white bg-transparent border-white w-[32px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg height=\"32\" aria-hidden=\"true\" data-component=\"Octicon\" viewBox=\"0 0 24 24\" version=\"1.1\" width=\"32\" data-view-component=\"true\" class=\"octicon octicon-mark-github\">\n    <path d=\"M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943\"></path>\n</svg>" }} />
      {" "}{" "}
      </a>
      {" "}{" "}
      </div>
      {" "}{" "}
      <div className="relative inset-0 z-[100] flex flex-col grow leading-[24px] text-base text-white bg-transparent border-white w-[1328px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="flex grow leading-[24px] text-base text-white bg-transparent border-white w-[1328px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="leading-[24px] text-base text-white bg-transparent border-white w-[635px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="leading-[24px] text-base text-white bg-transparent border-white w-[635px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      <nav className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[635px] box-border" style={{ "transition": "none" }}>
      <ul className="flex font-sans leading-[24px] text-base text-white bg-transparent border-white w-[635px] box-border" style={{ "transition": "none" }}>
      {ITEM2_DATA.map((d, i) => <Item2 key={i} {...d} />)}
      <li className="font-sans leading-[24px] text-base text-white list-item bg-transparent border-white w-[68px] box-border" style={{ "transition": "none" }}>
      <a className="flex items-center gap-1 p-2 font-sans leading-[24px] whitespace-nowrap text-base text-white bg-transparent border-white w-[68px] box-border uif-425" style={{ "transition": "none" }} href="https://github.com/pricing">
      <span className="font-sans leading-[24px] whitespace-nowrap text-base text-white bg-transparent border-white w-[52px] box-border" style={{ "gridColumn": "2", "gridRow": "1", "transition": "none" }}>Pricing</span>
      </a>
      </li>
      </ul>
      </nav>
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      <div className="flex justify-end items-center ml-4 leading-[24px] text-left text-base text-white bg-transparent border-white w-[677px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="grow basis-[0%] leading-[24px] text-left text-base text-white bg-transparent border-white w-[320px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="flex items-center leading-[24px] text-left text-base text-white bg-[rgba(46,55,74,0.82)] border border-[#818b98] rounded-md w-[320px] box-border uif-429" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <button className="flex items-center grow basis-[0%] pl-2 leading-[20px] text-left whitespace-nowrap text-sm text-white/75 bg-transparent border-white/75 rounded-md overflow-hidden w-[318px] box-border uif-430" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "backgroundPosition": "0px 0px", "transition": "none" }} data-uif-tog="501">
      {" "}{" "}
      <div className="mr-2 leading-[20px] text-left whitespace-nowrap text-sm text-[#59636e] bg-transparent border-[#59636e] w-[16px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="leading-[20px] text-left whitespace-nowrap text-sm text-[#59636e] bg-transparent border-[#59636e] w-[16px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg aria-hidden=\"true\" data-component=\"Octicon\" height=\"16\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" data-view-component=\"true\" class=\"octicon octicon-search\">\n    <path d=\"M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z\"></path>\n</svg>" }} />
      {" "}{" "}
      </div>
      {" "}{" "}
      <span className="grow basis-[0%] pt-[2px] leading-[20px] text-left whitespace-nowrap text-sm text-white/75 bg-transparent border-white/75 overflow-hidden w-[252px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>Search or jump to...</span>
      {" "}{" "}
      <div className="flex ml-2 leading-[20px] text-left whitespace-nowrap text-sm text-white/75 bg-transparent border-white/75 w-[26px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="mr-1 leading-[20px] text-left whitespace-nowrap text-sm text-white/75 bg-transparent border-white/75 overflow-hidden w-[22px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"20\" aria-hidden=\"true\" class=\"mr-1\"><path fill=\"none\" stroke=\"#979A9C\" opacity=\".4\" d=\"M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z\"></path><path fill=\"#979A9C\" d=\"M11.8 6L8 15.1h-.9L10.8 6h1z\"></path></svg>" }} />
      {" "}{" "}
      </div>
      {" "}{" "}
      </button>
      <span className="absolute top-5 right-[168.281px] bottom-[21px] left-[1160.72px] m-[-1px] leading-[24px] text-left whitespace-nowrap text-base text-[#1f2328] bg-transparent border-[#1f2328] overflow-hidden w-[1px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></span>
      {" "}{" "}
      <h1 className="absolute top-5 right-[166.281px] bottom-[19px] left-[1160.72px] font-semibold leading-[48px] text-left text-[32px] text-[#1f2328] bg-transparent border-[#1f2328] overflow-hidden w-[1px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>Search code, repositories, users, issues, pull requests...</h1>
      {" "}{" "}
      <div className="absolute top-[-10px] right-12 bottom-[-233.5px] left-0 z-[35] flex flex-col pt-3 leading-[21px] text-left text-sm text-[#1f2328] bg-white border border-[#d1d9e0] rounded-xl overflow-hidden shadow-e1 w-[1280px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      <form className="leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] w-[1278px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] w-[1278px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="flex flex-col gap-1 leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] w-[1278px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <label className="absolute top-3 right-[1277px] bottom-[268.5px] left-0 font-semibold leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] overflow-hidden w-[1px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>Search</label>
      {" "}{" "}
      <div className="flex items-center gap-1 mx-3 leading-[21px] text-left text-sm text-[#1f2328] bg-white border border-[#d1d9e0] rounded-md w-[1254px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <span className="my-1 mr-1 ml-2 leading-[21px] text-left text-sm text-[#59636e] bg-transparent border-[#59636e] w-[16px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="inline-block leading-[21px] text-left text-sm text-[#59636e] bg-transparent border-[#59636e] w-[16px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg aria-hidden=\"true\" data-component=\"Octicon\" height=\"16\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" data-view-component=\"true\" class=\"octicon octicon-search FormControl-input-leadingVisual\">\n    <path d=\"M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z\"></path>\n</svg>" }} />
      {" "}{" "}
      </span>
      {" "}{" "}
      <div className="relative inset-0 flex items-center grow basis-[0%] leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] overflow-x-auto overflow-y-hidden w-[1220px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] w-[1220px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <input className="relative inset-0 flex leading-[21px] text-sm text-transparent bg-transparent border-transparent rounded-md overflow-clip shadow-e2 w-[1220px] box-border uif-460" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "backgroundPosition": "0px 0px", "transition": "none" }} />
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      <div className="relative inset-0 leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] w-[1278px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <ul className="py-2 leading-[21px] text-left text-sm text-[#1f2328] bg-transparent border-[#1f2328] overflow-x-hidden overflow-y-auto w-[1278px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} id="uif-t-501">
      <li className="flex flex-col font-semibold leading-[19.5px] text-left text-xs text-[#59636e] bg-transparent border-[#59636e] w-[1278px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <h3 className="p-2 ml-2 font-semibold leading-[19.5px] text-left text-xs text-[#59636e] bg-transparent border-[#59636e] w-[60px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>Explore</h3>
      {" "}{" "}
      <ul className="font-semibold leading-[19.5px] text-left text-xs text-[#59636e] bg-transparent border-[#59636e] w-[1278px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {ITEM_DATA.map((d, i) => <Item key={i} {...d} />)}
      {" "}{" "}
      </ul>
      {" "}{" "}
      </li>
      </ul>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      </form>
      {" "}{" "}
      <div className="flex py-3 px-4 leading-[18px] text-left text-xs text-[#59636e] bg-white border-t border-x-[#59636e] border-t-[rgba(209,217,224,0.7)] border-b-[#59636e] w-[1278px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <a className="ml-2 leading-[18px] text-left text-xs text-[#0969da] bg-transparent border-[#0969da] w-[104px] box-border uif-550" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }} href="https://docs.github.com/search-github/github-code-search/understanding-github-code-search-syntax">Search syntax tips</a>
      {" "}{" "}
      <div className="flex grow basis-[0%] leading-[18px] text-left text-xs text-[#59636e] bg-transparent border-[#59636e] w-[1134px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      <span className="absolute top-5 right-[168.281px] bottom-[21px] left-[1160.72px] m-[-1px] leading-[24px] text-left whitespace-nowrap text-base text-[#1f2328] bg-transparent border-[#1f2328] overflow-hidden w-[1px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></span>
      {" "}{" "}
      </div>
      {" "}{" "}
      <div className="leading-[24px] text-left text-base text-[#1f2328] bg-transparent border-[#1f2328] w-[320px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <div className="leading-[24px] text-left text-base text-[#1f2328] bg-transparent border-[#1f2328] w-[320px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      <div className="relative inset-0 mr-3 leading-[24px] text-left text-base text-white bg-transparent border-white w-[80px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <a className="inline-flex justify-center items-center shrink-0 py-1 px-3 ml-3 leading-[14px] text-left whitespace-nowrap text-sm text-white bg-transparent border-white rounded-md w-[68px] box-border uif-612" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "backgroundPosition": "0px 0px", "transition": "none" }} href="/login">Sign in</a>
      {" "}{" "}
      </div>
      {" "}{" "}
      <a className="flex justify-center items-center shrink-0 py-1 px-3 leading-[14px] text-left whitespace-nowrap text-sm text-white bg-transparent border border-[#d1d9e0] rounded-md w-[75px] box-border uif-613" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "backgroundPosition": "0px 0px", "transition": "none" }} href="/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home">Sign up</a>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      </header>
      {" "}{" "}
      </div>
      {" "}{" "}
      <div className="absolute top-0 right-[1439px] bottom-[899px] left-0 leading-[21px] text-sm text-fg bg-transparent border-border overflow-hidden w-[1px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      {" "}{" "}
      <div className="leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}></div>
      {" "}{" "}
      <div className="leading-[21px] text-sm text-fg bg-transparent border-border w-[1440px] box-border" style={{ "fontFamily": "\"Mona Sans VF\", -apple-system, \"system-ui\", \"Segoe UI\", \"Noto Sans\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"", "transition": "none" }}>
      {" "}{" "}
      <main className="font-sans leading-[21px] text-sm text-fg bg-bg border-border w-[1440px] box-border" style={{ "transition": "none" }}>
      {" "}{" "}
      <div className="font-sans leading-[24px] text-base text-fg bg-transparent border-border w-[1440px] box-border" style={{ "transition": "none" }}>
      {" "}{" "}
      <div className="font-sans leading-[24px] text-base text-fg bg-transparent border-border w-[1440px] box-border" style={{ "transition": "none" }}>
      <div className="font-sans leading-[24px] text-base text-fg bg-bg border-border w-[1440px] box-border" style={{ "transition": "none" }}>
      <div className="pb-12 font-sans leading-[24px] text-base text-white bg-black border-white w-[1440px] box-border" style={{ "transition": "none" }}>
      <Hero />
      <Section2 />
      <Section3 />
      </div>
      </div>
      </div>
      {" "}{" "}
      </div>
      {" "}{" "}
      </main>
      {" "}{" "}
      </div>
      {" "}{" "}
      </div>
    </div>
  )
}
