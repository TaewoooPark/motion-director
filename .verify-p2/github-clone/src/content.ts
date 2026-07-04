// Editable content for the repeated components. Each array item is one instance.

export type CardData = { t0: string; t1: string; href0: string; t2: string }
export const CARD_DATA: CardData[] = [
  {
    "t0": "Automate your path to production",
    "t1": "Ship faster with secure, reliable CI/CD.",
    "href0": "/features/actions",
    "t2": "Explore GitHub Actions"
  },
  {
    "t0": "Code instantly from anywhere",
    "t1": "Launch a full, cloud-based development environment in seconds.",
    "href0": "/features/codespaces",
    "t2": "Explore GitHub Codespaces"
  },
  {
    "t0": "Keep momentum on the go",
    "t1": "Manage projects and assign tasks to Copilot, all from your mobile device.",
    "href0": "/mobile",
    "t2": "Explore GitHub Mobile"
  }
]

export type ItemData = { svg0: string; t0: string }
export const ITEM_DATA: ItemData[] = [
  {
    "svg0": "<svg aria-hidden=\"true\" data-component=\"Octicon\" height=\"16\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" data-view-component=\"true\" class=\"octicon octicon-organization\">\n    <path d=\"M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z\"></path>\n</svg>",
    "t0": "Enterprise"
  },
  {
    "svg0": "<svg aria-hidden=\"true\" data-component=\"Octicon\" height=\"16\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" data-view-component=\"true\" class=\"octicon octicon-shield-check\">\n    <path d=\"m8.533.133 5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.697 1.697 0 0 1-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667l5.25-1.68a1.748 1.748 0 0 1 1.066 0Zm-.61 1.429.001.001-5.25 1.68a.251.251 0 0 0-.174.237V7c0 1.36.275 2.666 1.057 3.859.784 1.194 2.121 2.342 4.366 3.298a.196.196 0 0 0 .154 0c2.245-.957 3.582-2.103 4.366-3.297C13.225 9.666 13.5 8.358 13.5 7V3.48a.25.25 0 0 0-.174-.238l-5.25-1.68a.25.25 0 0 0-.153 0ZM11.28 6.28l-3.5 3.5a.75.75 0 0 1-1.06 0l-1.5-1.5a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l.97.97 2.97-2.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z\"></path>\n</svg>",
    "t0": "Security"
  },
  {
    "svg0": "<svg aria-hidden=\"true\" data-component=\"Octicon\" height=\"16\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" data-view-component=\"true\" class=\"octicon octicon-copilot\">\n    <path d=\"M7.998 15.035c-4.562 0-7.873-2.914-7.998-3.749V9.338c.085-.628.677-1.686 1.588-2.065.013-.07.024-.143.036-.218.029-.183.06-.384.126-.612-.201-.508-.254-1.084-.254-1.656 0-.87.128-1.769.693-2.484.579-.733 1.494-1.124 2.724-1.261 1.206-.134 2.262.034 2.944.765.05.053.096.108.139.165.044-.057.094-.112.143-.165.682-.731 1.738-.899 2.944-.765 1.23.137 2.145.528 2.724 1.261.566.715.693 1.614.693 2.484 0 .572-.053 1.148-.254 1.656.066.228.098.429.126.612.012.076.024.148.037.218.924.385 1.522 1.471 1.591 2.095v1.872c0 .766-3.351 3.795-8.002 3.795Zm0-1.485c2.28 0 4.584-1.11 5.002-1.433V7.862l-.023-.116c-.49.21-1.075.291-1.727.291-1.146 0-2.059-.327-2.71-.991A3.222 3.222 0 0 1 8 6.303a3.24 3.24 0 0 1-.544.743c-.65.664-1.563.991-2.71.991-.652 0-1.236-.081-1.727-.291l-.023.116v4.255c.419.323 2.722 1.433 5.002 1.433ZM6.762 2.83c-.193-.206-.637-.413-1.682-.297-1.019.113-1.479.404-1.713.7-.247.312-.369.789-.369 1.554 0 .793.129 1.171.308 1.371.162.181.519.379 1.442.379.853 0 1.339-.235 1.638-.54.315-.322.527-.827.617-1.553.117-.935-.037-1.395-.241-1.614Zm4.155-.297c-1.044-.116-1.488.091-1.681.297-.204.219-.359.679-.242 1.614.091.726.303 1.231.618 1.553.299.305.784.54 1.638.54.922 0 1.28-.198 1.442-.379.179-.2.308-.578.308-1.371 0-.765-.123-1.242-.37-1.554-.233-.296-.693-.587-1.713-.7Z\"></path><path d=\"M6.25 9.037a.75.75 0 0 1 .75.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 .75-.75Zm4.25.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 1.5 0Z\"></path>\n</svg>",
    "t0": "Copilot"
  },
  {
    "svg0": "<svg aria-hidden=\"true\" data-component=\"Octicon\" height=\"16\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" data-view-component=\"true\" class=\"octicon octicon-credit-card\">\n    <path d=\"M10.75 9a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z\"></path><path d=\"M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25ZM14.5 6.5h-13v5.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Zm0-2.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25V5h13Z\"></path>\n</svg>",
    "t0": "Pricing"
  }
]

export type Card2Data = {  }
export const CARD2_DATA: Card2Data[] = [
  {},
  {}
]

export type Item2Data = { t0: string }
export const ITEM2_DATA: Item2Data[] = [
  {
    "t0": "Platform"
  },
  {
    "t0": "Solutions"
  },
  {
    "t0": "Resources"
  },
  {
    "t0": "Open Source"
  },
  {
    "t0": "Enterprise"
  }
]

export type Card3Data = { src0: string; alt0: string; t0: string; href0: string; t1: string }
export const CARD3_DATA: Card3Data[] = [
  {
    "src0": "https://images.ctfassets.net/8aevphvgewt8/g1XhuDG7foMyNWIEIpGJj/b40a790b854d0803704deb7905b1bd82/logo-duolingo-14477f9e54a6.svg",
    "alt0": "Duolingo",
    "t0": "Duolingo boosts developer speed by 25% with GitHub Copilot",
    "href0": "/customer-stories/duolingo",
    "t1": "Read customer story"
  },
  {
    "src0": "https://images.ctfassets.net/8aevphvgewt8/6Qr8Snm4JceoMFRJhapgFa/802ded1d2c486a9d0a4c073d9f8f38f4/logo-gartner-aa8c2e452b64.svg",
    "alt0": "Gartner",
    "t0": "2025 Gartner® Magic Quadrant™ for AI Code Assistants",
    "href0": "https://www.gartner.com/reprints/?id=1-2LVTG7RP&ct=250915&st=sb",
    "t1": "Read industry report"
  }
]

export type Card4Data = { t0: string; t1: string }
export const CARD4_DATA: Card4Data[] = [
  {
    "t0": "Security debt, solved.",
    "t1": " Leverage security campaigns and Copilot Autofix to reduce application vulnerabilities."
  },
  {
    "t0": "Dependencies you can depend on.",
    "t1": " Update vulnerable dependencies with supported fixes for breaking changes."
  },
  {
    "t0": "Your secrets, your business.",
    "t1": " Detect, prevent, and remediate leaked secrets across your organization."
  }
]

export type ButtonData = { t0: string }
export const BUTTON_DATA: ButtonData[] = [
  {
    "t0": "Code"
  },
  {
    "t0": "Plan"
  },
  {
    "t0": "Collaborate"
  },
  {
    "t0": "Automate"
  },
  {
    "t0": "Secure"
  }
]

