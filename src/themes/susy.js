export default {
  name: 'susy',
  head: {
    meta: [
      { name: 'msapplication-TileColor', content: '#000000' },
      {
        name: 'msapplication-config',
        content: '/favicon/susy/browserconfig.xml',
      },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/susy/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Cormorant:wght@400;600;700&display=swap',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com/',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/susy/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/susy/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/susy/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/favicon/susy/site.webmanifest' },
      {
        rel: 'mask-icon',
        href: '/favicon/susy/safari-pinned-tab.svg',
        color: '#ff0097',
      },
      { rel: 'shortcut icon', href: '/favicon/susy/favicon.ico' },
    ],
  },
}
