import WebFont from 'webfontloader'

export function loadFonts(callback: () => void) {
  WebFont.load({
    custom: {
      families: ['HearthstoneFont'],
      urls: ['/assets/fonts/fonts.css'],
    },
    active: callback,
    inactive: () => {
      console.error('Failed to load font')
      callback()
    },
  })
}
