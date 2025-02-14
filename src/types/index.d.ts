declare module "src/assets/asset-keys" {
    export const CARD_ASSETS_KEYS: Readonly<{
        TEMPLATE: "TEMPLATE";
        CARD_BACK: "CARD_BACK";
        ALEXSTRAZA: "ALEXSTRAZA";
    }>;
    export type CardAssetKeys = keyof typeof CARD_ASSETS_KEYS;
    export const DATA_ASSET_KEYS: Readonly<{
        CARDS: "CARDS";
    }>;
    export const UI_ASSET_KEYS: Readonly<{
        BOARD: "BOARD";
        MANA_CRYSTAL: "MANA_CRYSTAL";
        HEALTH: "HEALTH";
        ATTACK: "ATTACK";
        CANCEL: "CANCEL";
    }>;
    export const EFFECT_ASSET_KEYS: Readonly<{
        SPARK: "SPARK";
        Z: "Z";
    }>;
}
declare module "src/assets/font-keys" {
    export const FONT_KEYS: Readonly<{
        HEARTHSTONE: "HearthstoneFont";
    }>;
}
declare module "src/utils/visual-configs" {
    export const BASIC_CARD_FONT_STYLE: Readonly<{
        fontFamily: "HearthstoneFont";
        stroke: "#000000";
        strokeThickness: 4;
        color: "#FFFFFF";
    }>;
    export const CARD_CONFIG: Readonly<{
        FONT_STYLE: {
            NUMBER: {
                fontSize: string;
                fontFamily: "HearthstoneFont";
                stroke: "#000000";
                strokeThickness: 4;
                color: "#FFFFFF";
            };
            NAME: {
                BIG: {
                    fontSize: string;
                    fontFamily: "HearthstoneFont";
                    stroke: "#000000";
                    strokeThickness: 4;
                    color: "#FFFFFF";
                };
                SMALL: {
                    fontSize: string;
                    fontFamily: "HearthstoneFont";
                    stroke: "#000000";
                    strokeThickness: 4;
                    color: "#FFFFFF";
                };
            };
            BODY: {
                fontFamily: "HearthstoneFont";
                fontSize: string;
                color: string;
                wordWrap: {
                    width: number;
                };
                align: string;
            };
        };
        COLOR: {
            RED: string;
            GREEN: string;
            WHITE: string;
        };
        POSITION: {
            COST: {
                X: number;
                Y: number;
            };
            ATTACK: {
                X: number;
                Y: number;
            };
            HEALTH: {
                X: number;
                Y: number;
            };
            NAME: {
                Y: number;
            };
            BODY: {
                X: number;
                Y: number;
            };
        };
        SIZE: {
            SCALE: number;
            PORTRAIT_SCALE: number;
            HEIGHT: number;
            WIDTH: number;
        };
    }>;
    export const PREVIEW_CONFIG: Readonly<{
        PADDING: 20;
        ENEMY: {
            SHOW: number;
            HIDE: number;
        };
    }>;
    export const MANA_CONFIG: Readonly<{
        TEXT_POSITION: {
            PLAYER: {
                X: number;
                Y: number;
            };
            ENEMY: {
                X: number;
                Y: number;
            };
        };
        CRYSTAL: {
            POSITION: {
                X: number;
                Y: number;
            };
            TINT: {
                TINT_FULL: number;
                TINT_EMPTY: number;
            };
        };
    }>;
    export const BOARD_CONFIG: Readonly<{
        BOUNDS: {
            START_X: number;
            END_X: number;
            START_Y: number;
            END_Y: number;
        };
        POSITION_Y: {
            PLAYER: number;
            ENEMY: number;
        };
    }>;
    export const HERO_CONFIG: {
        WIDTH: number;
        HEIGHT: number;
        COLOR: number;
        Y: {
            PLAYER: number;
            ENEMY: number;
        };
    };
    export const DECK_CONFIG: Readonly<{
        POSITION: {
            X: number;
            Y: {
                PLAYER: number;
                ENEMY: number;
            };
            SPACING: number;
        };
        MAX_VISIBLE: 5;
    }>;
    export const OUTLINE_CONFIG: Readonly<{
        THICKNESS: 3;
        OUTLINE_COLOR: 65280;
        QUALITY: 0.1;
        NAME: "outline";
    }>;
    export const RESIZE_CONFIG: Readonly<{
        DURATION: 500;
        EASE: "Cubic.easeOut";
    }>;
    export const BUTTON_CONFIG: Readonly<{
        X: 1650;
        Y: 470;
        WIDTH: 200;
        HEIGHT: 100;
    }>;
    export const ANIMATION_CONFIG: Readonly<{
        SICK: {
            POSITION: {
                X: number;
                Y: number;
            };
            SCALE: {
                START: number;
                END: number;
            };
            SPEED: number;
            LIFESPAN: number;
            FREQUENCY: number;
            ANGLE: {
                MIN: number;
                MAX: number;
            };
            GRAVITY_Y: number;
            ACCELERATION_X: number;
            ACCELERATION_Y: number;
        };
        DEATH: {
            TINT: number;
            DELAY: number;
            SCALE: number;
            ALPHA: number;
            DURATION: number;
            EASE: string;
        };
        ATTACK: {
            STEP_BACK: {
                DURATION: number;
                Y: {
                    PLAYER: number;
                    ENEMY: number;
                };
                EASE: string;
            };
            ATTACK: {
                DURATION: number;
                EASE: string;
            };
            RETURN: {
                DURATION: number;
                EASE: string;
            };
        };
        DAMAGE: {
            FLASH: {
                ALPHA: number;
                DURATION: number;
                YOYO: boolean;
                REPEAT: number;
            };
            SPARK: {
                SCALE: number;
                SPEED: number;
                LIFESPAN: number;
                GRAVITY_Y: number;
                DURATION: number;
            };
            CAMERA: {
                DURATION: number;
                INTENSITY: number;
            };
        };
        BOARD: {
            HAND_TO_BOARD: {
                DURATION: number;
                EASE: string;
            };
        };
        RESIZE: {
            DURATION: number;
            EASE: string;
        };
        DECK: {
            FLIP: {
                SCALE_X: number;
                DURATION: number;
                EASE: string;
            };
            DECK_TO_HAND: {
                SCALE_X: number;
                DURATION: number;
                EASE: string;
            };
        };
        HAND: {
            DECK_TO_HAND: {
                DURATION: number;
                EASE: string;
            };
            HAND_TO_BOARD: {
                DURATION: number;
                EASE: string;
            };
        };
    }>;
    export const LOADING_SCREEN: Readonly<{
        TITLE: {
            fontSize: string;
            fontFamily: "HearthstoneFont";
            stroke: "#000000";
            strokeThickness: 4;
            color: "#FFFFFF";
        };
        SUBTITLE: {
            fontSize: string;
            fontFamily: "HearthstoneFont";
            stroke: "#000000";
            strokeThickness: 4;
            color: "#FFFFFF";
        };
        BAR: {
            WIDTH: number;
            HEIGHT: number;
            BACKGROUND_FILL: number;
            FILL: number;
        };
        ANIMATION: {
            ORIGIN_ALPHA: number;
            ALPHA: number;
            YOYO: boolean;
            REPEAT: number;
            DURATION: number;
        };
    }>;
}
declare module "src/common/resize-container" {
    /**
     * Iterate through children of container and animate the card positioning
     *
     * @param container Container to resize
     * @param callback Usually {@link repositionContainer()}
     */
    export function resizeContainer(container: Phaser.GameObjects.Container, callback?: () => void): void;
    /**
     * Reposition container
     *
     * @param container Container to reposition
     * @param x New x for container
     * @param y New y for container
     */
    export function repositionContainer(container: Phaser.GameObjects.Container, x: number, y: number): void;
}
declare module "src/common/outline" {
    /**
     * Add or remove outline
     *
     * @param scene Current scene
     * @param can If add outline or not
     * @param image The object to place the outline around
     */
    export function setOutline(scene: Phaser.Scene, can: boolean, image: Phaser.GameObjects.Image): void;
}
declare module "src/common/stats-change" {
    /**
     * Set stat color to white(equal), green(greater) or red(lower)
     *
     * @param current Current stat
     * @param original Original stat
     * @param textObject Text object to color
     */
    export function colorStat(current: number, original: number, textObject: Phaser.GameObjects.Text): void;
}
declare module "src/utils/keys" {
    export const TARGET_KEYS: Readonly<{
        PLAYER: "PLAYER";
        ENEMY: "ENEMY";
    }>;
    export type TargetKeys = keyof typeof TARGET_KEYS;
    export const STATES: Readonly<{
        TURN_BUTTON: "TURN_BUTTON";
        PLAYER_TURN_START: "PLAYER_TURN_START";
        ENEMY_TURN_START: "ENEMY_TURN_START";
        PLAYER_TURN: "PLAYER_TURN";
        ENEMY_TURN: "ENEMY_TURN";
        PLAYER_DRAW_CARD: "PLAYER_DRAW_CARD";
        ENEMY_DRAW_CARD: "ENEMY_DRAW_CARD";
        PLAYER_PLAY_CARD: "PLAYER_PLAY_CARD";
        ENEMY_PLAY_CARD: "ENEMY_PLAY_CARD";
        PLAYER_TURN_END: "PLAYER_TURN_END";
        ENEMY_TURN_END: "ENEMY_TURN_END";
        PLAYER_BATTLECRY: "PLAYER_BATTLECRY";
        PLAYER_BATTLECRY_CHOOSE_TARGET: "PLAYER_BATTLECRY_CHOOSE_TARGET";
        PLAYER_BATTLECRY_TARGET_CHOSEN: "PLAYER_BATTLECRY_TARGET_CHOSEN";
        PLAYER_BATTLE_CHOOSE_TARGET: "PLAYER_BATTLE_CHOOSE_TARGET";
        PLAYER_BATTLE_TARGET_CHOSEN: "PLAYER_BATTLE_TARGET_CHOSEN";
        ENEMY_BATTLE_CHOOSE_TARGET: "ENEMY_BATTLE_CHOOSE_TARGET";
        ENEMY_BATTLE_TARGET_CHOSEN: "ENEMY_BATTLE_TARGET_CHOSEN";
        CHECK_BOARD: "CHECK_BOARD";
        GAME_END: "GAME_END";
    }>;
    export type States = keyof typeof STATES;
    export const WARNING_KEYS: Readonly<{
        CANT_PLAY: "YOU CAN'T PLAY THIS RIGHT NOW";
        NOT_VALID_TARGET: "THIS IS NOT A VALID TARGET";
        CANT_BE_SELECTED: "THIS CAN'T BE SELECTED RIGHT NOW";
    }>;
    export type WarningKeys = (typeof WARNING_KEYS)[keyof typeof WARNING_KEYS];
}
declare module "src/common/warning" {
    import { WarningKeys } from "src/utils/keys";
    /**
     * Creates warning message and animates it, then remove it
     *
     * @param scene Current scene
     * @param key {@link WarningKeys}
     */
    export function warningMessage(scene: Phaser.Scene, key: WarningKeys): void;
}
declare module "src/utils/card-keys" {
    export const BATTLECRY_TARGET: Readonly<{
        ANY: "ANY";
        ENEMY: "ENEMY";
        FRIENDLY: "FRIENDLY";
        RANDOM_ENEMY: "RANDOM_ENEMY";
        RANDOM_FRIENDLY: "RANDOM_FRIENDLY";
        RANDOM_ENEMY_MINION: "RANDOM_ENEMY_MINION";
        RANDOM_FRIENDLY_MINION: "RANDOM_FRIENDLY_MINION";
        ENEMY_HERO: "ENEMY_HERO";
        FRIENDLY_HERO: "FRIENDLY_HERO";
    }>;
    export type BattlecryTarget = keyof typeof BATTLECRY_TARGET;
    export const BATTLECRY_TYPE: Readonly<{
        HEAL: "HEAL";
        DAMAGE: "DAMAGE";
    }>;
    export type BattlecryType = keyof typeof BATTLECRY_TYPE;
    export type Battlecry = {
        target: BattlecryTarget;
        type: BattlecryType;
        amount: number;
    };
    export type CardData = {
        id: number;
        trackId: string;
        name: string;
        text: string;
        cost: number;
        attack: number;
        health: number;
        assetKey: string;
        battlecry?: Battlecry;
    };
}
declare module "src/utils/state-machine" {
    import { States } from "src/utils/keys";
    type State = {
        name: States;
        onEnter?: (data?: any) => void;
    };
    /**
     * The StateMachine class is the state engine
     */
    export class StateMachine {
        private $states;
        private $currentState;
        private readonly $id;
        private readonly $context;
        private $isChangingState;
        private $changingStateQueue;
        constructor(id: string, context: Object | undefined);
        /**
         * Returns {@link currentState}
         */
        get currentStateName(): States | undefined;
        /**
         * If states in {@link $changingStateQueue} then {@link setState}
         */
        update(): void;
        /**
         * Set new state
         *
         * @param name {@link States}
         * @param data Data to pass to the state
         */
        setState(name: States, data?: any): void;
        /**
         * Add a new state
         *
         * @param state A state with a name and an onEnter
         */
        addState(state: State): void;
        /**
         * Check if state is equal to {@link $currentState}
         *
         * @param name {@link States}
         * @return If state is being executed
         */
        private isCurrentState;
    }
}
declare module "src/objects/base-card" {
    import BBCodeText from 'phaser3-rex-plugins/plugins/gameobjects/tagtext/bbcodetext/BBCodeText';
    import { CardData } from "src/utils/card-keys";
    /**
     * Base class for Cards, which includes the card's visual objects
     */
    export class BaseCard {
        protected _scene: Phaser.Scene;
        protected _cardData: CardData;
        protected _cardContainer: Phaser.GameObjects.Container;
        protected _cardAttackText: Phaser.GameObjects.Text;
        protected _cardHealthText: Phaser.GameObjects.Text;
        protected _cardTemplateImage: Phaser.GameObjects.Image;
        protected _cardPortraitImage: Phaser.GameObjects.Image;
        protected _cardNameText: Phaser.GameObjects.Text;
        protected _cardCostText: Phaser.GameObjects.Text;
        protected _cardBodyText: Phaser.GameObjects.Text | BBCodeText;
        protected _previewContainer: Phaser.GameObjects.Container;
        protected _originalData: CardData;
        constructor(scene: Phaser.Scene, cardData: CardData);
        /**
         * Return {@link _cardContainer}
         */
        get container(): Phaser.GameObjects.Container;
        /**
         * Return {@link _cardPortraitImage}
         */
        get portrait(): Phaser.GameObjects.Image;
        /**
         * Return {@link _cardTemplateImage}
         */
        get template(): Phaser.GameObjects.Image;
        /**
         * Return the card's modifiable {@link _cardData}
         */
        get card(): CardData;
        /**
         * Set card's shown side, to remove/add {@link $createHover()}, etc.
         *
         * @param side Front or backside
         */
        setSide(side: 'FRONT' | 'BACK'): void;
        /**
         * Create {@link _cardTemplateImage}, {@link _cardPortraitImage}, {@link _cardCostText}, {@link _cardAttackText},
         * {@link _cardHealthText}, {@link _cardNameText}, {@link _cardNameText} then place them into {@link _cardContainer}
         */
        private $createCard;
        /**
         * Create template image, portrait image, cost object, attack object, attack object, health object, name object, body text object
         * and places them into the container to make it bigger and place it at the right top as preview
         */
        private $createPreview;
        /**
         * Size card size to deck/hand/board size
         *
         * @param container The card container
         */
        private $resizeCard;
        /**
         * Add hover, which does {@link $createPreview()}
         */
        private $createHover;
    }
}
declare module "src/objects/card" {
    import { CardData } from "src/utils/card-keys";
    import { TargetKeys } from "src/utils/keys";
    import { StateMachine } from "src/utils/state-machine";
    import { BaseCard } from "src/objects/base-card";
    /**
     * Card class for BattleScene, which is used in Deck, Hand and Board
     */
    export class Card extends BaseCard {
        private $stateMachine;
        private $owner;
        private $cancelButton;
        private $sickParticles;
        private $playable;
        private $attacked;
        private $sick;
        constructor(scene: Phaser.Scene, stateMachine: StateMachine, cardData: CardData, owner: TargetKeys, id: string);
        /**
         * Return {@link _originalData}
         */
        get original(): CardData;
        /**
         * Return {@link $owner}
         */
        get player(): TargetKeys;
        /**
         * Return if card is {@link $playable}
         */
        get isPlayable(): boolean;
        /**
         * Return if card can attack (hasn't attacked & is not sick)
         */
        get canAttack(): boolean;
        /**
         * Set attacked and then outline
         *
         * @param attacked If card has attacked this turn or not
         */
        setAttacked(attacked: boolean): void;
        /**
         * Set sick, outline and {@link $sickAnimation()}
         */
        setSick(sick: boolean): void;
        /**
         * Set playable and outline
         *
         * @param activatable If card can be played
         */
        setPlayable(activatable: boolean): void;
        /**
         * Set health and {@link colorStat()}
         *
         * @param newHealth New health of card
         */
        setHealth(newHealth: number): void;
        /**
         * Set attack and {@link colorStat()}
         *
         * @param newAttack New attack of card
         */
        setAttack(newAttack: number): void;
        /**
         * Sets {@link setOutline()} around the template image
         *
         * @param value If set or destroy outline
         */
        setOutline(value: boolean): void;
        /**
         * Remove click then call {@link $addClickHand()}/{@link $addClickBoard()} and {@link $handCard()}/{@link $boardCard()}
         *
         * @param context If card is in hand or board
         */
        setContext(context: 'HAND' | 'BOARD'): void;
        /**
         * Set tint of card to normal or red
         *
         * @param targeted If card is targeted or not
         */
        setTarget(targeted: boolean): void;
        /**
         * Destroy the preview container to avoid it being stuck since there was no manual pointer out
         */
        die(): void;
        /**
         * If player's turn and card is playable, drag card and remember original position
         *
         * If player's turn and card is being dragged play it if on board
         *
         * If battlecry then choose battlecry target, then battlecry manager and add cancel button, if valid target cancel if not play
         */
        private $addClickHand;
        /**
         * Set playable to false
         */
        private $handCard;
        /**
         * If battlecry choose target then set target chosen
         *
         * If battle choose target and cancel exists then remove cancel and set player turn, if no cancel then set target chosen
         *
         * If player turn and can attack then set player choose target
         */
        private $addClickBoard;
        /**
         * {@link setAttacked()} to false and {@link setSick} to true as default
         */
        private $boardCard;
        /**
         * Add {@link $cancelButton}
         */
        private $addCancel;
        /**
         * Remove {@link $cancelButton}
         */
        private $removeCancel;
        /**
         * Create and return sickness zzz animation
         */
        private $sickAnimation;
    }
}
declare module "src/utils/configs" {
    export const MAX_HEALTH = 30;
    export const MAX_MANA = 10;
    export const MAX_BOARD = 7;
    export const HERO_ATTACK = 1;
}
declare module "src/objects/hero" {
    import { TargetKeys } from "src/utils/keys";
    import { StateMachine } from "src/utils/state-machine";
    /**
     * The Hero class is used in BattleScene. There's only one hero per player.
     */
    export class Hero {
        private $scene;
        private $owner;
        private $maxHealth;
        private $currentHealth;
        private $currentAttack;
        private $attacked;
        private $heroImage;
        private $healthText;
        private $attackText;
        private $attackContainer;
        private $heroContainer;
        private $cancelButton;
        private $stateMachine;
        constructor(scene: Phaser.Scene, stateMachine: StateMachine, owner: TargetKeys);
        /**
         * Return {@link $owner} of hero
         */
        get player(): TargetKeys;
        /**
         * Return {@link $heroContainer} of hero
         */
        get container(): Phaser.GameObjects.Container;
        /**
         * Return portrait {@link $heroImage} of hero
         */
        get portrait(): Phaser.GameObjects.Image;
        /**
         * Return {@link $currentHealth} of hero
         */
        get health(): number;
        /**
         * Return {@link $maxHealth} of hero
         */
        get maxHealth(): number;
        /**
         * Return {@link $currentAttack} of hero
         */
        get attack(): number;
        /**
         * Return if hero can attack (hasn't attacked & currentAttack > 0)
         */
        get canAttack(): boolean;
        /**
         * Set {@link $currentHealth} to new health then {@link colorStat()}
         *
         * @param newHealth New health
         */
        setHealth(newHealth: number): void;
        /**
         * Set {@link $currentAttack} to new attack then {@link colorStat()}
         *
         * @param newAttack New attack
         */
        setAttack(newAttack: number): void;
        /**
         * Set {@link $attacked} then set outline
         *
         * @param attacked If hero attacked
         */
        setAttacked(attacked: boolean): void;
        /**
         * {@link setOutline()} of {@link $heroImage}
         *
         * @param value If outline or not
         */
        setOutline(value: boolean): void;
        /**
         * Set tint of hero to normal or red
         *
         * @param targeted If hero is targeted or not
         */
        setTarget(targeted: boolean): void;
        /**
         * Create {@link $heroImage}, {@link $healthText}, {@link $attackText} and {@link $attackContainer}
         */
        private $createHero;
        /**
         * If battlecry choose target then set target chosen
         *
         * If battle choose target and cancel exists then remove cancel and set player turn, if no cancel then set target chosen
         *
         * If player turn and can attack then set player choose target
         */
        private $addClick;
        /**
         * Add {@link $cancelButton}
         */
        private $addCancel;
        /**
         * Remove {@link $cancelButton}
         */
        private $removeCancel;
    }
}
declare module "src/scenes/scene-keys" {
    export const SCENE_KEYS: Readonly<{
        BASE_SCENE: "BASE_SCENE";
        PRELOAD_SCENE: "PRELOAD_SCENE";
        BATTLE_SCENE: "BATTLE_SCENE";
        LIBRARY_SCENE: "LIBRARY_SCENE";
    }>;
    /**
     * Scene key used when instancing a {@link Phaser.Scene}
     */
    export type SceneKeys = keyof typeof SCENE_KEYS;
}
declare module "src/managers/animation-manager" {
    import { Card } from "src/objects/card";
    import { Hero } from "src/objects/hero";
    /**
     * The AnimationManager handles all animations
     */
    export class AnimationManager {
        private $scene;
        constructor(scene: Phaser.Scene);
        /**
         * Set scaleX to 0 then set side to 'FRONT' then scaleX to default, then callback
         *
         * @param card {@link Card} to be flipped
         * @param callback Usually hands drawCard()
         */
        flipCard(card: Card, callback?: () => void): void;
        /**
         * Move card to container then resize
         *
         * @param card {@link Card} to add to container
         * @param container Container to add card to
         * @param resizer The container resize function
         */
        addToContainer(card: Card, container: Phaser.GameObjects.Container, resizer: () => void): void;
        /**
         * Set tint of card then shrink it
         *
         * @param card {@link Card} or {@link Hero} that dies
         * @param callback Usually boards cardDies()
         */
        death(card: Card | Hero, callback?: () => void): void;
        /**
         * Set side to 'FRONT' to gain hovers then move it board
         *
         * @param card {@link Card} to move to board
         * @param callback Usually removeFromHand() within hands playCard()
         */
        animateCardFromHandToBoard(card: Card, callback?: () => void): void;
        /**
         * Create and move projectile effect then impact, {@link $flashEffect()}, {@link $particleEffect()} and callback
         *
         * @param source {@link Card} with the battlecry
         * @param target {@link Card} or {@link Hero} that is targeted
         * @param impact What happens on impact, usually set health
         * @param callback Usually play card to execute after animations
         */
        battlecryDamage(source: Card, target: Card | Hero, impact?: () => void, callback?: () => void): void;
        /**
         * Create and move projectile effect then impact and callback
         *
         * @param source {@link Card} with the battlecry
         * @param target {@link Card} or {@link Hero} that is targeted
         * @param impact What happens on impact, usually set health
         * @param callback Usually play card to execute after animations
         */
        battlecryHeal(source: Card, target: Card | Hero, impact?: () => void, callback?: () => void): void;
        /**
         * {@link $stepBack()}, then {@link $crash()},
         * then damageHandler(), {@link $flashEffect()}, {@link $particleEffect()}, {@link $shake()} and {@link $attackReturn()}
         *
         * @param attacker {@link Card} or {@link Hero} that attacks
         * @param defender {@link Card} or {@link Hero} that is being attacked
         * @param damageHandler The damage handler defined in battle managers $battle()
         * @param callback Usually check board state
         */
        attack(attacker: Card | Hero, defender: Card | Hero, damageHandler: () => void, callback?: () => void): void;
        /**
         * Create end game message and animate it, then give end game button to return to library
         *
         * @param message Game end message
         * @param callback Set game end state
         */
        gameEnd(message: string, callback?: () => void): void;
        /**
         * Flash effect for damage taken
         *
         * @param container Container to fash
         */
        private $flashEffect;
        /**
         * Spark particles for damage taken
         *
         * @param container Container to add particles to
         */
        private $particleEffect;
        /**
         * Shake effect for crashes in battle
         */
        private $shake;
        /**
         * Take step back to then crash into target
         *
         * @param attacker {@link Card} or {@link Hero} that attacks
         * @param start Starting coordinates
         * @param callback Usually {@link $crash()}
         */
        private $stepBack;
        /**
         * Crash into the target
         *
         * @param container {@link Card} or {@link Hero} that attacks
         * @param target {@link Card} or {@link Hero} that is being attacked
         * @param callback Damage taken animations and return
         */
        private $crash;
        /**
         * Return to original position after attack
         *
         * @param container {@link Card} or {@link Hero} that attacked
         * @param position Original position
         * @param callback Usually check board state
         */
        private $attackReturn;
    }
}
declare module "src/objects/board" {
    import { AnimationManager } from "src/managers/animation-manager";
    import { TargetKeys } from "src/utils/keys";
    import { Card } from "src/objects/card";
    /**
     * The Board class handles board related actions
     */
    export class Board {
        private $scene;
        private $owner;
        private $animationManager;
        private $board;
        private $boardContainer;
        constructor(scene: Phaser.Scene, owner: TargetKeys, animationManager: AnimationManager);
        /**
         * Return all board cards
         */
        get cards(): Card[];
        /**
         * Set depth to avoid having the attacking card be under the defending card
         *
         * @param value Depth, usually 1 or 0
         */
        setDepth(value: number): void;
        /**
         * Set card context to 'BOARD' then animate add to container with {@link $resizeContainer()} as callback
         * @param card Card played
         */
        playCard(card: Card): void;
        /**
         * Remove card and from board then do die() from card then {@link $resizeContainer()}
         *
         * @param card Card that died
         */
        cardDies(card: Card): void;
        /**
         * Create board container
         */
        private $createContainer;
        /**
         * {@link resizeContainer()} with {@link repositionContainer()} as callback
         */
        private $resizeContainer;
    }
}
declare module "src/objects/hand" {
    import { AnimationManager } from "src/managers/animation-manager";
    import { TargetKeys } from "src/utils/keys";
    import { Card } from "src/objects/card";
    /**
     * The Hand class handles all hand related actions
     */
    export class Hand {
        private $scene;
        private $owner;
        private $animationManager;
        private $hand;
        private $handContainer;
        constructor(scene: Phaser.Scene, owner: TargetKeys, animationManager: AnimationManager);
        /**
         * Return {@link $hand}
         */
        get cards(): Card[];
        /**
         * If card then add to hand and set cards context then {@link $resizeContainer()} with callback as callback
         *
         * @param card Card drawn
         * @param callback Usually setting state to player or enemy turn
         */
        drawCard(card: Card | undefined, callback?: () => void): void;
        /**
         * Remove card from hand then animate it to board
         *
         * @param card Card played
         * @param callback This is afterPlayCallback() in battle scene that also has a callback as param
         * @returns
         */
        playCard(card: Card, callback?: (callback: () => void) => void): void;
        /**
         * Create {@link $handContainer}
         */
        private $createContainer;
        /**
         * {@link resizeContainer()} with {@link repositionContainer()} as callback
         */
        private $resizeContainer;
    }
}
declare module "src/common/enemy-ai" {
    import { Board } from "src/objects/board";
    import { Hand } from "src/objects/hand";
    import { Hero } from "src/objects/hero";
    import { StateMachine } from "src/utils/state-machine";
    /**
     * The EnemyAI class handles the enemy actions during its turn
     */
    export class EnemyAI {
        private $stateMachine;
        private $hand;
        private $board;
        private $hero;
        constructor(stateMachine: StateMachine, hand: Hand, board: {
            PLAYER: Board;
            ENEMY: Board;
        }, hero: {
            PLAYER: Hero;
            ENEMY: Hero;
        });
        /**
         * Call {@link $playHand}
         */
        opponentTurn(): void;
        /**
         * Check for playable cards and play them, if none then {@link $playBoard}
         */
        private $playHand;
        /**
         * Check for cards and heroes that can attack, if none then change turn
         */
        private $playBoard;
    }
}
declare module "src/utils/id-counter" {
    /**
     * The IdCounter class keeps track and gives the id of each card that appears to differentiate them
     */
    export class IdCounter {
        private $currentId;
        private $prefix;
        constructor(prefix: string);
        /**
         * Return next id
         */
        get id(): string;
    }
}
declare module "src/objects/deck" {
    import { AnimationManager } from "src/managers/animation-manager";
    import { CardData } from "src/utils/card-keys";
    import { TargetKeys } from "src/utils/keys";
    import { StateMachine } from "src/utils/state-machine";
    import { Card } from "src/objects/card";
    /**
     * The Deck class handles deck related actions
     */
    export class Deck {
        private $scene;
        private $stateMachine;
        private $owner;
        private $animationManager;
        private $deck;
        private $deckContainer;
        private $idCounter;
        private $allCards;
        constructor(scene: Phaser.Scene, stateMachine: StateMachine, owner: TargetKeys, animationManager: AnimationManager, allCards: CardData[]);
        /**
         * Return top card from deck, if card then flip animation and callback
         *
         * @param callback Usually draw card method in hand
         */
        drawCard(callback?: (card: Card | undefined) => void): Card | undefined;
        /**
         * Create random deck with {@link $allCards}
         */
        private $createDeck;
        /**
         * Shuffle {@link $deck}
         */
        private $shuffle;
        /**
         * Create deck container and place cards with back side on it
         */
        private $createContainer;
    }
}
declare module "src/objects/mana" {
    import { TargetKeys } from "src/utils/keys";
    export class Mana {
        private $scene;
        private $owner;
        private $manaText;
        private $currentMana;
        private $maxMana;
        private $manaLimit;
        private $manaContainer;
        constructor(scene: Phaser.Scene, owner: TargetKeys);
        /**
         * Return {@link $currentMana}
         */
        get mana(): number;
        /**
         * Add mana and check limit, if player then add mana crystal to {@link $manaContainer}
         */
        addMana(): void;
        /**
         * Reduce {@link $currentMana} and and set tint for crystals in {@link $manaContainer}
         *
         * @param usedMana Amount of mana used
         */
        useMana(usedMana: number): void;
        /**
         * Set {@link $currentMana} to {@link $maxMana}
         */
        refreshMana(): void;
        /**
         * Create {@link $manaText} and {@link $manaContainer}
         */
        private $createMana;
    }
}
declare module "src/ui/background" {
    import Phaser from 'phaser';
    /**
     * The Background class handles the background of BattleScene
     */
    export class Background {
        private $scene;
        private $background;
        constructor(scene: Phaser.Scene);
    }
}
declare module "src/ui/turn-button" {
    import { StateMachine } from "src/utils/state-machine";
    /**
     * The TurnButton class handles all turn related actions
     */
    export class TurnButton {
        private $scene;
        private $stateMachine;
        private $button;
        private $turnMessage;
        private $currentTurn;
        constructor(scene: Phaser.Scene, stateMachine: StateMachine);
        /**
         * Change turn depending on current turn and {@link $createTurnMessage()} (default is player's turn)
         */
        changeTurn(): void;
        /**
         * Create turn button and set it interactive to set turn states
         */
        private $createTurnButton;
        /**
         * Create turn message but hide it
         */
        private $createTurnMessage;
        /**
         * Show turn message and animate it to then hide it
         */
        private $showTurnMessage;
    }
}
declare module "src/managers/battle-manager" {
    import { Board } from "src/objects/board";
    import { Card } from "src/objects/card";
    import { Hero } from "src/objects/hero";
    import { AnimationManager } from "src/managers/animation-manager";
    import { StateMachine } from "src/utils/state-machine";
    /**
     * The BattleManager class handles battles
     */
    export class BattleManager {
        private $scene;
        private $stateMachine;
        private $animationManager;
        private $board;
        private $hero;
        private $attacker;
        private $defender;
        private $callback?;
        constructor(scene: Phaser.Scene, stateMachine: StateMachine, animationManager: AnimationManager, board: {
            PLAYER: Board;
            ENEMY: Board;
        }, hero: {
            PLAYER: Hero;
            ENEMY: Hero;
        });
        /**
         * Check dead cards and heroes then animate death
         *
         * @param callback State after board is checked
         */
        checkDead(callback?: () => void): void;
        /**
         * Set {@link attacker} and remove cancel button
         *
         * @param attacker {@link Card} or {@link Hero} that attacks
         * @param cancelButton The cancel button to handle
         */
        handleBattle(attacker: Card | Hero, cancelButton?: Phaser.GameObjects.Image): void;
        /**
         * Set {@link $defender} and check if target is valid {@link $battle()} if not the callback and set player turn
         *
         * @param target {@link Card} or {@link Hero} is being attacked
         */
        targetChosen(target: Card | Hero): void;
        /**
         * Show end game message and set game end state
         *
         * @param loserPlayer {@link TargetKeys} of player that lost
         */
        private $gameEnd;
        /**
         * Check if target is valid, if not show warning message
         *
         * @param target Targeted {@link Card} or {@link Hero}
         * @returns If target is valid
         */
        private $checkValidTarget;
        /**
         * Call animation managers attack() by passing an damage handler and pass check board state into player/enemy turn state as callback
         */
        private $battle;
    }
}
declare module "src/managers/battlecry-manager" {
    import { Board } from "src/objects/board";
    import { Card } from "src/objects/card";
    import { Hero } from "src/objects/hero";
    import { AnimationManager } from "src/managers/animation-manager";
    import { StateMachine } from "src/utils/state-machine";
    /**
     * The BattlecryManager class handles battlecries
     */
    export class BattlecryManager {
        private $scene;
        private $stateMachine;
        private $animationManager;
        private $board;
        private $hero;
        private $source;
        private $effect;
        private $targetType;
        private $callback?;
        private $fallback?;
        constructor(scene: Phaser.Scene, stateMachine: StateMachine, animationManager: AnimationManager, board: {
            PLAYER: Board;
            ENEMY: Board;
        }, hero: {
            PLAYER: Hero;
            ENEMY: Hero;
        });
        /**
         * Set battlecry choose target or target chosen depending on battlecry target value
         *
         * @param card {@link Card} with battlecry
         * @param callback Usually playCard()
         * @param fallback Usually remove cancel button and return card to hand
         */
        handleBattlecry(card: Card, callback?: () => void, fallback?: () => void): void;
        /**
         * Check target validity and then do {@link $dealDamage} or {@link $healHealth} depending on {@link $effect}s type
         *
         * @param target Targeted {@link Card} or {@link Hero}
         */
        targetChosen(target: Card | Hero): void;
        /**
         * Check if target is valid, if not show warning message
         *
         * @param target Targeted {@link Card} or {@link Hero}
         * @returns If target is valid
         */
        private $checkValidTarget;
        /**
         * Deal damage to the target by using animation managers battlecryDamage()
         *
         * @param target Targeted {@link Card} or {@link Hero}
         */
        private $dealDamage;
        /**
         * Heal health to the target by using animation managers battlecryHeal()
         *
         * @param target Targeted {@link Card} or {@link Hero}
         */
        private $healHealth;
    }
}
declare module "src/scenes/base-scene" {
    import Phaser from 'phaser';
    import { SceneKeys } from "src/scenes/scene-keys";
    /**
     * BaseScene extends {@link Phaser.Scene}.
     *
     * Extend this scene to log when scenes are invoked and to handle Scene Resume and Cleanup
     */
    export class BaseScene extends Phaser.Scene {
        /**
         *
         * @param {SceneKeys} config Select a key from {@link SceneKeys}
         */
        constructor(config: {
            key: SceneKeys;
        });
        /**
         *
         * @param data Pass any data to this scene
         */
        init(data?: any): void;
        preload(): void;
        create(): void;
        update(): void;
        handleSceneResume(data?: any | undefined): void;
        handleSceneCleanup(): void;
        /**
         *
         * @param message Message in form of `[${this.constructor.name}:MethodName] invoked`
         */
        protected log(message: string): void;
    }
}
declare module "src/scenes/battle-scene" {
    import { CardData } from "src/utils/card-keys";
    import { BaseScene } from "src/scenes/base-scene";
    /**
     * BattleScene extends {@link BaseScene}
     *
     * This scene handles the all actions in a battle.
     */
    export class BattleScene extends BaseScene {
        private $animationManager;
        private $battlecryManager;
        private $battleManager;
        private $stateMachine;
        private $enemyAI;
        private $turnButton;
        private $selectedCards;
        private $deck;
        private $hand;
        private $mana;
        private $board;
        private $hero;
        constructor();
        /**
         * Scene initialization with data.
         *
         * @param data An array of {@link CardData} that will become the players deck.
         */
        init(data: {
            deck: CardData[];
        }): void;
        update(): void;
        create(): void;
        /**
         * Player draws a card from deck with {@link Deck.drawCard()} followed by placing it into the hand with {@link Hand.drawCard()} followed by the callback.
         *
         * @param player Player to draw card
         * @param callback Sets state to either {@link STATES.PLAYER_TURN} or {@link STATES.ENEMY_TURN}
         */
        private $drawCard;
        /**
         * Play card from hand with {@link Hand.playCard()}
         *
         * @param target Player that plays the card
         * @param card The {@link Card} played
         * @param callback Sets state to {@link STATES.CHECK_BOARD} then to either {@link STATES.PLAYER_TURN} or {@link STATES.ENEMY_TURN}
         */
        private $playCard;
        /**
         * Add a new mana crystal or refresh the mana for selected player.
         *
         * @param player Players' {@link Mana} affected
         * @param context ADD: {@link Mana.addMana()}, REFRESH: {@link Mana.refreshMana()}
         */
        private $handleMana;
        /**
         * If a card is playable add an outline and if not, remove it, for reset, remove all outlines.
         *
         * @param player Players' {@link Hand} affected
         * @param context PLAYABLE: Check if {@link Card} playable, RESET: Make all {@link Card} unplayable
         */
        private $handleHand;
        /**
         * If a card can attack add an outline and if not, remove it, for reset, remove all outlines.
         *
         * @param player Players' {@link Board} affected
         * @param context ATTACKABLE: Check what {@link Card} and {@link Hero} can attack, RESET: Make all {@link Card} and {@link Hero} not being able to attack
         */
        private $handleBoard;
        /**
         * Set red tint for targets.
         *
         * @param target The targetable characters
         */
        private $setTargets;
        /**
         * Create the big ass state machine
         */
        private $createStateMachine;
    }
}
declare module "src/objects/library-card" {
    import { CardData } from "src/utils/card-keys";
    import { BaseCard } from "src/objects/base-card";
    export class LibraryCard extends BaseCard {
        constructor(scene: Phaser.Scene, cardData: CardData);
        /**
         * Remove hover effect because useless for library scene
         */
        removeHover(): void;
    }
}
declare module "src/scenes/library-scene" {
    import { BaseScene } from "src/scenes/base-scene";
    /**
     * LibraryScene extends {@link BaseScene}
     *
     * This scene shows all cards available and lets the user choose cards to use in the players deck.
     */
    export class LibraryScene extends BaseScene {
        private $allLoadedCards;
        private $shownCards;
        private $selectedCards;
        private $currentPage;
        private $maxPage;
        private $libraryPage;
        private $libraryList;
        private $cardCounter;
        private $startButton;
        constructor();
        create(): void;
        /**
         * When page changes, delete all {@link LibraryCard}s and place new ones.
         *
         * @param page 1 for next and -1 for previous page
         * @returns
         */
        private $changePage;
        /**
         * OnClick: Add to invoke {@link $addSelectedCard()} and {@link $cardSelected()}
         *
         * @param card {@link LibraryCard} to add the click to
         */
        private $cardClick;
        /**
         * Tint the card portrait and disable interactivity.
         *
         * @param card Selected {@link LibraryCard}
         */
        private $cardSelected;
        /**
         * Reset card portrait tint and enable interactivity.
         *
         * @param card Unselected {@link LibraryCard}
         */
        private $cardUnselected;
        /**
         * Create the whole library interface with all its objects.
         */
        private $createLibrary;
        /**
         * Create a rectangle with name and insert into the deck list that removes itself when clicked
         *
         * @param card Card to add into deck
         */
        private $addSelectedCard;
        /**
         * Reorder deck list.
         */
        private $resizeList;
        /**
         * Update the counter of selected cards and check if 30 cards are selected or not.
         */
        private $updateCardCounter;
    }
}
declare module "src/scenes/preload-scene" {
    import { BaseScene } from "src/scenes/base-scene";
    /**
     * PreloadScene extends {@link BaseScene}
     *
     * This scene preloads all assets, including the cards data from the database, during a loading screen.
     */
    export class PreloadScene extends BaseScene {
        constructor();
        preload(): void;
        /**
         * Creates a Text and a Loading Bar that loads during the preload.
         */
        private $createLoading;
    }
}
declare module "src/utils/webfontloader" {
    /**
     * Load custom fonts
     *
     * @param callback Launch game usually
     */
    export function loadFonts(callback: () => void): void;
}
declare module "src/main" { }
declare module "src/database/database.config" {
    import { Pool } from 'pg';
    const pool: Pool;
    export default pool;
}
declare module "src/api/cards-api" {
    import { Router } from 'express';
    const router: Router;
    export default router;
}
declare module "src/database/insertion/insertion" { }
declare module "src/database/migration/migration" { }
declare module "src/database/reset/reset" { }
declare module "server" { }
