export * from './errors';
export * from './database';
export * from './stripe';

export const PAGINATION_SIZE_LIMIT = 8;

export enum Civilization {
  RUS = 'Rus',
  HOLY_ROMAN_EMPIRE = 'Holy Roman Empire',
  CHINESE = 'Chinese',
  ENGLISH = 'English',
  DELHI_SULTANATE = 'Delhi Sultanate',
  MONGOLS = 'Mongols',
  ABBASID_DYNASTY = 'Abbasid Dynasty',
  FRENCH = 'French',
};

export const civToCode = {
  [Civilization.RUS]: 'rus',
  [Civilization.HOLY_ROMAN_EMPIRE]: 'hre',
  [Civilization.CHINESE]: 'chinese',
  [Civilization.ENGLISH]: 'english',
  [Civilization.DELHI_SULTANATE]: 'delhi',
  [Civilization.MONGOLS]: 'mongol',
  [Civilization.ABBASID_DYNASTY]: 'abbasid',
  [Civilization.FRENCH]: 'french'
};

export const codeToCiv: { [key: string]: Civilization; } = {
  rus: Civilization.RUS,
  hre: Civilization.HOLY_ROMAN_EMPIRE,
  chinese: Civilization.CHINESE,
  english: Civilization.ENGLISH,
  delhi: Civilization.DELHI_SULTANATE,
  mongol: Civilization.MONGOLS,
  abbasid: Civilization.ABBASID_DYNASTY,
  french: Civilization.FRENCH,
};

export const civToColor = {
  [Civilization.RUS]: '#d65046',
  [Civilization.HOLY_ROMAN_EMPIRE]: '#dcc34d',
  [Civilization.CHINESE]: '#b94730',
  [Civilization.ENGLISH]: '#d6dcdf',
  [Civilization.DELHI_SULTANATE]: '#269058',
  [Civilization.MONGOLS]: '#1b8ac8',
  [Civilization.ABBASID_DYNASTY]: '#343539',
  [Civilization.FRENCH]: '#2fa1f3',
};

export enum Tag {
  BOOM = 'Boom',
  CHEESE = 'Cheese',
  FAST_FEUDAL = 'Fast Feudal',
  FAST_CASTLE = 'Fast Castle',
  LAND = 'Land',
  RUSH = 'Rush',
  WATER = 'Water',
}

export const tagToCode = {
  [Tag.BOOM]: 'boom',
  [Tag.CHEESE]: 'cheese',
  [Tag.FAST_FEUDAL]: 'fastFeudal',
  [Tag.FAST_CASTLE]: 'fastCastle',
  [Tag.LAND]: 'land',
  [Tag.RUSH]: 'rush',
  [Tag.WATER]: 'water',
};

export const codeToTag: { [key: string]: Tag; } = {
  boom: Tag.BOOM,
  cheese: Tag.CHEESE,
  fastFeudal: Tag.FAST_FEUDAL,
  fastCastle: Tag.FAST_CASTLE,
  land: Tag.LAND,
  rush: Tag.RUSH,
  water: Tag.WATER,
};

export const tagToColor = {
  [Tag.BOOM]: 'teal',
  [Tag.CHEESE]: 'yellow',
  [Tag.FAST_FEUDAL]: 'orange',
  [Tag.FAST_CASTLE]: 'gray',
  [Tag.LAND]: 'green',
  [Tag.RUSH]: 'red',
  [Tag.WATER]: 'blue',
};

export const tagToHexWithAlpha = {
  [Tag.BOOM]: '#319795CC',
  [Tag.CHEESE]: '#d69e2eCC',
  [Tag.FAST_FEUDAL]: '#dd6b20CC',
  [Tag.FAST_CASTLE]: '#718096CC',
  [Tag.LAND]: '#38a169CC',
  [Tag.RUSH]: '#e53e3eCC',
  [Tag.WATER]: '#3182ceCC',
};

export const Patch = Object.freeze(<const>['11963', '11009', '10257']);
export type Patch = typeof Patch[number];

export const youtubeRegex = new RegExp(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
