import WebFont from 'webfontloader'

/**
 * Load custom fonts
 * 
 * @param callback Launch game usually
 */
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
