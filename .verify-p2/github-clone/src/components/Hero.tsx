import Button from './Button'
import Card2 from './Card2'
import { BUTTON_DATA, CARD2_DATA } from '../content'

export default function Hero() {
  return (
    <section className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "backgroundImage": "linear-gradient(rgb(0, 2, 64), rgba(0, 0, 0, 0))", "transition": "none" }}>
    <div className="relative inset-0 font-sans leading-[24px] text-base text-white bg-transparent border-white overflow-hidden w-[1440px] box-border" style={{ "backgroundImage": "linear-gradient(rgb(0, 2, 64), rgb(0, 0, 0) 117%)", "transition": "none" }}>
    <div className="absolute inset-0 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "backgroundImage": "linear-gradient(rgba(255, 255, 255, 0) -8.14%, rgba(255, 255, 255, 0.1) 62.09%)", "transition": "none" }}></div>
    <div className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "transition": "none" }}></div>
    <div className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "transition": "none" }}></div>
    <div className="fixed inset-x-0 top-41 bottom-214 mt-[-120px] font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "transition": "none" }}>
    <div className="absolute inset-x-0 top-0 bottom-[-950px] flex justify-center font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "transition": "none" }}>
    <canvas className="font-sans leading-[24px] text-base text-white bg-transparent border-white overflow-clip w-[1000px] box-border" style={{ "transition": "none" }}></canvas>
    </div>
    <div className="absolute top-0 right-[1439px] bottom-[-1px] left-0 font-sans leading-[24px] text-base text-white bg-transparent border-white overflow-hidden w-[1px] box-border" style={{ "transition": "none" }}>Mona the Octocat, Copilot, and Ducky float jubilantly upward from behind the GitHub product demo accompanied by a purple glow and a scattering of stars.</div>
    </div>
    <div className="absolute inset-x-0 top-41 bottom-[1063.64px] z-0 flex flex-col justify-center items-center px-6 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "transition": "none" }}>
    <section className="flex flex-col items-center px-6 font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[972px] box-border" style={{ "transition": "none" }}>
    <div className="grid grid-cols-12 grid-rows-1 gap-y-20 gap-x-12 font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[924px] box-border" style={{ "transition": "none" }}>
    <div className="col-span-12 font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[924px] box-border" style={{ "transition": "none" }}>
    <div className="flex flex-col justify-center items-center gap-0 font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[924px] box-border" style={{ "transition": "none" }}>
    <h1 className="font-sans font-[425] leading-[69.12px] tracking-[-2.24px] text-center text-[64px] text-white bg-transparent border-white w-[924px] box-border" style={{ "transition": "none" }}>The future of building happens together</h1>
    <p className="mt-5 font-sans leading-[27px] tracking-[0.18px] text-center text-lg text-white bg-transparent border-white w-[600px] box-border" style={{ "transition": "none" }}>Tools and trends evolve, but collaboration endures. With GitHub, developers, agents, and code come together on one platform.</p>
    </div>
    </div>
    </div>
    </section>
    <div className="flex flex-wrap justify-center items-end gap-4 mt-8 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[660px] box-border" style={{ "transition": "none" }}>
    <form className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[459px] box-border" style={{ "transition": "none" }}>
    <section className="flex flex-col gap-2 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[459px] box-border" style={{ "transition": "none" }}>
    <div className="relative inset-0 flex items-center gap-1 p-[3px] font-sans leading-[24px] text-base text-fg bg-transparent border border-white rounded-lg w-[459px] box-border" style={{ "backgroundImage": "linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.57) 300%)", "transition": "none" }}>
    <div className="relative inset-0 flex font-sans leading-[24px] text-base text-fg bg-transparent border-border w-[262px] box-border" style={{ "transition": "none" }}>
    <label className="absolute top-3 right-[120.312px] bottom-[7px] left-[18px] font-sans leading-[24px] tracking-[0.21px] text-base text-[rgba(36,41,47,0.9)] bg-transparent border-[rgba(36,41,47,0.9)] w-[124px] box-border" style={{ "transition": "none" }}>Enter your email</label>
    <span className="relative inset-0 flex grow basis-[0%] font-sans leading-[24px] text-base text-fg bg-transparent border border-transparent rounded-md w-[262px] box-border" style={{ "transition": "none" }}>
    <input className="flex pt-[18px] pr-3 pl-[18px] font-sans leading-[24px] text-base text-black bg-transparent border-black rounded-lg overflow-clip w-[260px] box-border uif-662" style={{ "transition": "none" }} />
    </span>
    </div>
    <button className="flex justify-center items-center gap-3 shrink-0 py-[6px] px-5 font-sans leading-[24px] text-center text-base text-white bg-[#08872b] border border-transparent rounded-md w-[185px] box-border uif-663" style={{ "backgroundPosition": "0px 0px", "transition": "none" }}>
    <span className="relative inset-0 font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[143px] box-border" style={{ "transition": "none" }}>
    <span className="inline font-sans font-medium leading-[24px] tracking-[0.16px] text-center text-base text-white bg-transparent border-white w-[143px] box-border" style={{ "transition": "none" }}>Sign up for GitHub</span>
    </span>
    </button>
    </div>
    </section>
    </form>
    <a className="flex justify-center items-center gap-3 py-[6px] px-5 font-sans leading-[24px] text-center text-base text-accent bg-[rgba(31,35,40,0.4)] border border-white rounded-md w-[186px] box-border uif-666" style={{ "backgroundPosition": "0px 0px", "backdropFilter": "blur(20px)", "transition": "none" }} href="/github-copilot/pro">
    <span className="relative inset-0 font-sans leading-[24px] text-center text-base text-accent bg-transparent border-accent w-[144px] box-border" style={{ "transition": "none" }}>
    <span className="inline font-sans font-medium leading-[24px] tracking-[0.16px] text-center text-base text-white bg-transparent border-white w-[144px] box-border" style={{ "transition": "none" }}>Try GitHub Copilot</span>
    </span>
    </a>
    </div>
    </div>
    <div className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "transition": "none" }}></div>
    <div className="relative inset-0 mx-[97px] font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1246px] box-border" style={{ "transition": "none" }}>
    <h2 className="absolute top-0 right-[1245px] bottom-[702.859px] left-0 font-sans font-semibold leading-[36px] text-2xl text-white bg-transparent border-white overflow-hidden w-[1px] box-border" style={{ "transition": "none" }}>GitHub features</h2>
    <div className="absolute top-[-105.578px] right-[-194px] bottom-0 left-[-720px] font-sans leading-[24px] text-base text-white bg-transparent border-white w-[2160px] box-border" style={{ "transition": "none" }}>
    <div className="absolute inset-0 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[2160px] box-border" style={{ "backgroundImage": "linear-gradient(rgba(39, 50, 231, 0) 57.46%, rgba(95, 237, 131, 0.5) 112.96%)", "transition": "none" }}></div>
    <div className="absolute inset-0 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[2160px] box-border" style={{ "backgroundImage": "linear-gradient(rgba(0, 0, 0, 0) 47.42%, rgba(14, 10, 162, 0.5) 104.56%)", "transition": "none", "mixBlendMode": "plus-lighter" }}></div>
    </div>
    <div className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1246px] box-border" style={{ "transition": "none" }}>
    <div className="px-5 pt-5 font-sans leading-[24px] text-base text-white bg-white/15 border-x border-t border-x-[#8c93fb] border-t-[#8c93fb] border-b-white rounded-t-3xl w-[1246px] box-border" style={{ "transition": "none" }}>
    <div className="relative inset-0 flex font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1204px] box-border" style={{ "transition": "none" }}>
    <div className="font-sans leading-[24px] text-base text-white bg-transparent border-white box-border" style={{ "transition": "none" }}>
    <div className="absolute top-0 right-[1203px] bottom-[681.859px] left-0 font-sans leading-[24px] text-base text-white bg-transparent border-white overflow-hidden w-[1px] box-border" style={{ "transition": "none" }}>A demonstration animation of a code editor using GitHub Copilot Chat, where the user requests GitHub Copilot to refactor duplicated logic and extract it into a reusable function for a given code snippet.</div>
    <video className="absolute inset-0 font-sans leading-[24px] text-base text-white bg-bg border-white rounded-t-xl overflow-clip w-[1204px] box-border" style={{ "transition": "none" }}></video>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="relative inset-0 px-6 pt-8 font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "transition": "none" }}>
    <div className="flex flex-col items-center font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1392px] box-border" style={{ "transition": "none" }}>
    <div className="relative inset-0 flex mx-[354px] font-sans leading-[24px] whitespace-nowrap text-base text-white bg-transparent border border-[#484f58] rounded-[60px] overflow-hidden w-[684px] box-border" style={{ "transition": "none" }}>
    <div className="relative inset-0 p-2 font-sans leading-[24px] whitespace-nowrap text-base text-white bg-transparent border-white rounded-[60px] overflow-hidden w-[682px] box-border" style={{ "transition": "none" }}>
    <div className="absolute inset-0 font-sans leading-[24px] whitespace-nowrap text-base text-white bg-transparent border-white overflow-hidden w-[682px] box-border" style={{ "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg width=\"100%\" height=\"100%\" role=\"presentation\" class=\"Toggle-selection\"><defs><linearGradient id=\"gradient\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" style=\"stop-color:#fff;stop-opacity:1\"></stop><stop offset=\"100%\" style=\"stop-color:#bbb;stop-opacity:1\"></stop></linearGradient></defs><rect x=\"1\" y=\"1\" width=\"calc(100% - 2px)\" height=\"calc(100% - 2px)\" rx=\"20\" ry=\"20\" stroke=\"url(#gradient)\" stroke-width=\"1\" fill=\"transparent\" style=\"width: 128px; height: 38px; transform: translate(8px, 8px);\"></rect></svg>" }} />
    {BUTTON_DATA.map((d, i) => <Button key={i} {...d} />)}
    </div>
    </div>
    </div>
    <p className="relative inset-0 mx-87 mt-6 font-sans leading-[24px] tracking-[0.24px] text-center text-base text-[#a4aea6] bg-transparent border-[#a4aea6] w-[696px] box-border" style={{ "transition": "none" }}>Write, test, and fix code quickly with GitHub Copilot, from simple boilerplate to complex features.</p>
    </div>
    <div className="font-sans leading-[24px] text-base text-white bg-transparent border-white w-[1440px] box-border" style={{ "transition": "none" }}>
    <div className="px-6 pb-12 font-sans leading-[24px] text-center text-base text-white bg-transparent border-b border-x-white border-t-white border-b-[#191f1b] w-[1440px] box-border" style={{ "transition": "none" }}>
    <h2 className="absolute top-[1785.86px] right-[1415px] bottom-[-886.859px] left-6 font-mono leading-[21px] tracking-[0.21px] text-center uppercase text-sm text-[#a4aea6] bg-transparent border-[#a4aea6] overflow-hidden w-[1px] box-border" style={{ "transition": "none" }}>GitHub customers</h2>
    <div className="relative inset-0 flex flex-wrap justify-center items-center gap-6 pt-8 font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[1392px] box-border" style={{ "transition": "none" }}>
    <div className="flex gap-24 grow basis-[0%] py-1 font-sans leading-[24px] text-center text-base text-white bg-transparent border-white overflow-x-hidden overflow-y-auto w-[1336px] box-border" style={{ "transition": "none" }}>
    {CARD2_DATA.map((d, i) => <Card2 key={i} {...d} />)}
    </div>
    <button className="flex justify-center items-center shrink-0 font-sans leading-[24px] text-center text-base text-white bg-surface border border-[#191f1b] rounded-[48px] w-[32px] box-border uif-964" style={{ "transition": "none" }}>
    <div className="font-sans leading-[24px] text-center text-base text-white bg-transparent border-white w-[16px] box-border" style={{ "transition": "none" }} dangerouslySetInnerHTML={{ __html: "<svg aria-hidden=\"true\" focusable=\"false\" class=\"octicon octicon-pause\" viewBox=\"0 0 16 16\" width=\"16\" height=\"16\" fill=\"currentColor\" display=\"inline-block\" overflow=\"visible\" style=\"vertical-align:text-bottom\"><path d=\"M5 2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm5 0h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z\"></path></svg>" }} />
    </button>
    </div>
    </div>
    </div>
    </section>
  )
}
