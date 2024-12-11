import { FONT_KEYS } from '../assets/font-keys'

// FONTS
export const BASIC_CARD_FONT_STYLE = Object.freeze({
  fontFamily: FONT_KEYS.HEARTHSTONE,
  fontStyle: 'bold',
  stroke: '#00000',
  strokeThickness: 4,
})

// CARD
export const CARD_NUMBER_FONT_STYLE = Object.freeze({
  ...BASIC_CARD_FONT_STYLE,
  fontSize: '48px',
})

export const CARD_NAME_FONT_STYLE_BIG = Object.freeze({
  ...BASIC_CARD_FONT_STYLE,
  fontSize: '26px',
})

export const CARD_NAME_FONT_STYLE_SMALL = Object.freeze({
  ...BASIC_CARD_FONT_STYLE,
  fontSize: '18px',
})

export const CARD_TEXT_COLOR = Object.freeze({
  RED: '#FF0000',
  GREEN: '#00FF00',
  WHITE: '#FFFFFF',
})

export const CARD_COST_POSITION = {
  x: 23,
  y: 30,
}
export const CARD_ATTACK_POSITION = {
  x: 27,
  y: 322,
}
export const CARD_HEALTH_POSITION = {
  x: 218,
  y: 325,
}
export const CARD_NAME_POSITION = {
  y: 215,
}

export const HAND_CARD_SIZE = Object.freeze({
  height: 147.88,
  width: 97.2,
})

export const CARD_SCALE = 0.36

// PREVIEW
export const PREVIEW_CARD_PADDING = 20

// MANA
export const MANA_TEXT_POSITION = Object.freeze({
  PLAYER: {
    x: 1300,
    y: 910,
  },
  OPPONENT: {
    x: 1265,
    y: 80,
  },
})

export const MANA_CRYSTAL_POSITION = Object.freeze({
  x: 1370,
  y: 910,
})

// BOARD
export const PLAYER_BOARD_BOUNDS = Object.freeze({
  startX: 449,
  endX: 1599,
  startY: 487,
  endY: 637,
})

export const BOARD_POSITION_Y = {
  PLAYER: 500,
  OPPONENT: 330,
}

// HERO
export const HERO_CONFIGS = {
  width: 150,
  height: 150,
  color: 0x0000ff,
  y: {
    PLAYER: 770,
    OPPONENT: 210,
  },
}

// DECK
export const DECK_POSITION = Object.freeze({
  x: 1635,
  y: {
    PLAYER: 535,
    OPPONENT: 275,
  },
})

export const DECK_MAX_VISIBLE = 5

// OUTLINE
export const OUTLINE_CONFIG = Object.freeze({
  thickness: 3,
  outlineColor: 0x00ff00,
  quality: 0.1,
  name: 'outline',
})

// ANIMATION
export const ZZZ_ANIMATION_POSITION = Object.freeze({
  x: 220,
  y: 90,
})

export const DEATH_CONFIGS = Object.freeze({
  TINT: 0xff0000,
  DELAY: 200,
  SCALE: 0,
  ALPHA: 0,
  DURATION: 500,
  EASE: 'Cubic.easeOut',
})

export const ATTACK_CONFIGS = Object.freeze({
  STEP_BACK: {
    DURATION: 150,
    Y: {
      PLAYER: 10,
      OPPONENT: -10,
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
})

export const DAMAGE_CONFIGS = Object.freeze({
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
})

export const MANA_CONFIGS = Object.freeze({
  TINT_FULL: 0xffffff,
  TINT_EMPTY: 0x555555,
})

export const SUMMONING_SICK_CONFIGS = Object.freeze({
  SCALE: { START: 0.2, END: 0 },
  SPEED: 50,
  LIFESPAN: 2000,
  FREQUENCY: 1000,
  ANGLE: { MIN: -90, MAX: -90 },
  GRAVITY_Y: 10,
  ACCELERATION_X: 50,
  ACCELERATION_Y: -50,
})

export const BOARD_CONFIGS = Object.freeze({
  HAND_TO_BOARD: {
    DURATION: 250,
    EASE: 'Sine.easeOut',
  },
})

export const RESIZE_CONFIGS = Object.freeze({
  DURATION: 500,
  EASE: 'Cubic.easeOut',
})

export const DECK_CONFIGS = Object.freeze({
  FLIP: {
    SCALE_X: 0,
    DURATION: 200,
    EASE: 'Cubic.easeBackOut',
  },
  DECK_TO_HAND: {
    SCALE_X: CARD_SCALE,
    DURATION: 300,
    EASE: 'Cubic.easeOut',
  },
})

export const HAND_CONFIGS = Object.freeze({
  DECK_TO_HAND: {
    DURATION: 500,
    EASE: 'Sine.easeOut',
  },
  HAND_TO_BOARD: {
    DURATION: 500,
    EASE: 'Sine.easeOut',
  },
})
