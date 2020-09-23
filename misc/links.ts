type Link = { icon?: string; label: string; link: string; target: string }
type SectionsDict = Record<
  string,
  {
    label: string
    links: Link[]
  }
>

export const sections: SectionsDict = {
  protocol: {
    label: 'Protocol',
    links: [
      {
        label: 'Whitepaper',
        link: 'https://gravity.tech/whitepaper',
        target: '_blank',
      },
      {
        // icon: 'medium',
        label: 'FAQ',
        link:
          'https://medium.com/@gravity_protocol/gravity-protocol-faq-9092bc9c5cf7',
        target: '_blank',
      },
      {
        // icon: 'github',
        label: 'GitHub',
        link: 'https://github.com/Gravity-Tech',
        target: '_blank',
      },
      {
        icon: 'github',
        label: 'Docs',
        link: 'https://docs.gravity.tech',
        target: '_blank',
      },
      {
        label: 'Demo',
        link: '/explorer',
        target: '_blank',
      },
    ],
  },
  community: {
    label: 'Community',
    links: [
      {
        icon: 'telegram',
        label: 'Telegram',
        link: 'https://t.me/gravity_protocol',
        target: '_blank',
      },
      {
        icon: 'discord',
        label: 'Discord',
        link: 'https://discord.gg/ANZKhTw',
        target: '_blank',
      },
      {
        icon: 'reddit',
        label: 'Reddit',
        link: 'https://www.reddit.com/r/Protocol_Gravity/',
        target: '_blank',
      },
    ],
  },
  news: {
    label: 'News',
    links: [
      {
        icon: 'medium',
        label: 'Blog',
        link: 'https://medium.com/gravity-protocol',
        target: '_blank',
      },
      {
        icon: 'twitter',
        label: 'Twitter',
        link: 'https://twitter.com/ProtocolGravity',
        target: '_blank',
      },
      {
        icon: 'linked-in',
        label: 'LinkedIn',
        link: 'https://linkedin.com/company/gravity-protocol',
        target: '_blank',
      },
    ],
  },
  resources: {
    label: 'Resources',
    links: [
      {
        label: 'Brand Assets',
        link:
          'https://drive.google.com/drive/folders/1D_RtcZ9-EkiUmM2uD7a2OTY430TqD-ue',
        target: '_blank',
      },
    ],
  },
}
