export default {
  name: 'gravity',
  head: {
    meta: [
      { name: 'msapplication-TileColor', content: '#da532c' },
      {
        name: 'msapplication-config',
        content: '/favicon/gravity/browserconfig.xml',
      },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon/gravity/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Orbitron&display=swap',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com/',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/gravity/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/gravity/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/gravity/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/favicon/gravity/site.webmanifest' },
      {
        rel: 'mask-icon',
        href: '/favicon/gravity/safari-pinned-tab.svg',
        color: '#181a29',
      },
      { rel: 'shortcut icon', href: '/favicon/gravity/favicon.ico' },
    ],
  },
}
