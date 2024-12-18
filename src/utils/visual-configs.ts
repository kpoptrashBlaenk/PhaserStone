import { FONT_KEYS } from '../assets/font-keys'

// FONTS
export const BASIC_CARD_FONT_STYLE = Object.freeze({
  fontFamily: FONT_KEYS.HEARTHSTONE,
  fontStyle: 'bold',
  stroke: '#00000',
  strokeThickness: 4,
})

// CARD
export const CARD_CONFIG = Object.freeze({
  FONT_STYLE: {
    NUMBER: {
      ...BASIC_CARD_FONT_STYLE,
      fontSize: '48px',
    },
    NAME: {
      BIG: {
        ...BASIC_CARD_FONT_STYLE,
        fontSize: '26px',
      },
      SMALL: {
        ...BASIC_CARD_FONT_STYLE,
        fontSize: '18px',
      },
    },
  },
  COLOR: {
    RED: '#FF0000',
    GREEN: '#00FF00',
    WHITE: '#FFFFFF',
  },
  POSITION: {
    COST: {
      X: 23,
      Y: 30,
    },
    ATTACK: {
      X: 27,
      Y: 322,
    },
    HEALTH: {
      X: 218,
      Y: 325,
    },
    NAME: {
      Y: 215,
    },
  },
  SIZE: {
    SCALE: 0.36,
    PORTRAIT_SCALE: 0.13,
    HEIGHT: 147.88,
    WIDTH: 97.2,
  },
})

// PREVIEW
export const PREVIEW_CONFIG = Object.freeze({
  PADDING: 20,
  ENEMY: {
    SHOW: 250,
    HIDE: 1500,
  },
})

// MANA
export const MANA_CONFIG = Object.freeze({
  TEXT_POSITION: {
    PLAYER: {
      X: 1300,
      Y: 910,
    },
    ENEMY: {
      X: 1265,
      Y: 80,
    },
  },
  CRYSTAL: {
    POSITION: {
      X: 1370,
      Y: 910,
    },
    TINT: {
      TINT_FULL: 0xffffff,
      TINT_EMPTY: 0x555555,
    },
  },
})

// BOARD
export const BOARD_CONFIG = Object.freeze({
  BOUNDS: {
    START_X: 449,
    END_X: 1599,
    START_Y: 487,
    END_Y: 637,
  },
  POSITION_Y: {
    PLAYER: 500,
    ENEMY: 330,
  },
})

// HERO
export const HERO_CONFIG = {
  WIDTH: 150,
  HEIGHT: 150,
  COLOR: 0x0000ff,
  Y: {
    PLAYER: 770,
    ENEMY: 210,
  },
}

// DECK
export const DECK_CONFIG = Object.freeze({
  POSITION: {
    X: 1635,
    Y: {
      PLAYER: 555,
      ENEMY: 285,
    },
    SPACING: 2,
  },
  MAX_VISIBLE: 5,
})

// OUTLINE
export const OUTLINE_CONFIG = Object.freeze({
  THICKNESS: 3,
  OUTLINE_COLOR: 0x00ff00,
  QUALITY: 0.1,
  NAME: 'outline',
})

// RESIZE CONFIG
export const RESIZE_CONFIG = Object.freeze({
  DURATION: 500,
  EASE: 'Cubic.easeOut',
})

// ANIMATION
export const ANIMATION_CONFIG = Object.freeze({
  SUMMONING_SICKNESS: {
    POSITION: {
      X: 220,
      Y: 90,
    },
    SCALE: { START: 0.2, END: 0 },
    SPEED: 50,
    LIFESPAN: 2000,
    FREQUENCY: 1000,
    ANGLE: { MIN: -90, MAX: -90 },
    GRAVITY_Y: 10,
    ACCELERATION_X: 50,
    ACCELERATION_Y: -50,
  },
  DEATH: {
    TINT: 0xff0000,
    DELAY: 200,
    SCALE: 0,
    ALPHA: 0,
    DURATION: 500,
    EASE: 'Cubic.easeOut',
  },
  ATTACK: {
    STEP_BACK: {
      DURATION: 150,
      Y: {
        PLAYER: 10,
        ENEMY: -10,
      },
      EASE: 'Sine.easeOut',
    },
    ATTACK: {
      DURATION: 200,
      EASE: 'Quad.easeOut',
    },
    RETURN: {
      DURATION: 200,
      EASE: 'Quad.easeIn',
    },
  },
  DAMAGE: {
    FLASH: {
      ALPHA: 0,
      DURATION: 50,
      YOYO: true,
      REPEAT: 2,
    },
    SPARK: {
      SCALE: 0.075,
      SPEED: 100,
      LIFESPAN: 500,
      GRAVITY_Y: 100,
      DURATION: 50,
    },
    CAMERA: {
      DURATION: 100,
      INTENSITY: 0.01,
    },
  },
  BOARD: {
    HAND_TO_BOARD: {
      DURATION: 250,
      EASE: 'Sine.easeOut',
    },
  },
  RESIZE: {
    DURATION: 500,
    EASE: 'Cubic.easeOut',
  },
  DECK: {
    FLIP: {
      SCALE_X: 0,
      DURATION: 200,
      EASE: 'Cubic.easeBackOut',
    },
    DECK_TO_HAND: {
      SCALE_X: CARD_CONFIG.SIZE.SCALE,
      DURATION: 300,
      EASE: 'Cubic.easeOut',
    },
  },
  HAND: {
    DECK_TO_HAND: {
      DURATION: 500,
      EASE: 'Sine.easeOut',
    },
    HAND_TO_BOARD: {
      DURATION: 500,
      EASE: 'Sine.easeOut',
    },
  },
})

// Loading Screen
export const LOADING_SCREEN = Object.freeze({
  TITLE: {
    ...BASIC_CARD_FONT_STYLE,
    fontSize: '52px',
  },
  SUBTITLE: {
    ...BASIC_CARD_FONT_STYLE,
    fontSize: '32px',
  },
  BAR: {
    WIDTH: 320,
    HEIGHT: 40,
    BACKGROUND_FILL: 0x222222,
    FILL: 0xffffff,
  },
  ANIMATION: {
    ORIGIN_ALPHA: 0.9,
    ALPHA: 0.2,
    YOYO: true,
    REPEAT: -1,
    DURATION: 500,
  },
})
