# TODO - Hearthstone Game in Phaser 3 + TypeScript

## Project Setup
- [ X ] Set up project folder structure
- [ X ] Initialize TypeScript project
- [ X ] Install Phaser 3
- [ X ] Configure Webpack for module bundling
- [ X ] Set up a development server for live-reloading

## Core Game Structure
- [ ] Create main game scene
- [ ] Define player and enemy classes
- [ ] Implement basic turn system (player vs AI)
- [ ] Add card manager to handle deck and hand mechanics

## Card System
- [ ] Design card base class
- [ ] Create card subclasses for different types (e.g., minion, spell)
- [ ] Implement card effects and actions
  - [ ] Define effect types (e.g., damage, heal, buff)
  - [ ] Allow cards to interact with other cards and players
- [ ] Display cards visually with Phaser UI elements
- [ ] Create animation for card play and effects

## Game Phases
- [ ] Implement Start of Turn phase
  - [ ] Draw a card
  - [ ] Reset mana
- [ ] Main Phase
  - [ ] Allow player to play cards from hand
  - [ ] Implement card targeting system (drag and drop)
  - [ ] Check for mana availability before playing cards
- [ ] End of Turn
  - [ ] Check win/loss conditions
  - [ ] Pass turn to AI

## Player and AI Logic
- [ ] Set up player mana and health management
- [ ] Define simple AI behavior for opponent
  - [ ] AI plays a card based on hand and mana
  - [ ] AI targets player or minions based on card type
- [ ] Add difficulty scaling options for AI

## UI and Animations
- [ ] Design basic HUD (Health, Mana, Deck, Graveyard)
- [ ] Create hand and deck displays
- [ ] Show player and AI turns visually
- [ ] Add animations for drawing and playing cards
- [ ] Add victory and defeat screens

## Audio and Visual Effects
- [ ] Add card sound effects (draw, play, attack)
- [ ] Include background music for immersive gameplay
- [ ] Add visual effects for card abilities (e.g., fire, healing glow)

## Polish and Quality Assurance
- [ ] Playtest for balancing card effects and AI
- [ ] Optimize for performance
- [ ] Debug and fix visual glitches or UI inconsistencies
- [ ] Refactor code for maintainability and scalability

## Stretch Goals (Optional)
- [ ] Multiplayer Mode
  - [ ] Add turn-based online multiplayer mode
- [ ] More Card Types and Abilities
- [ ] Advanced AI behavior
- [ ] Create custom animations for unique card effects