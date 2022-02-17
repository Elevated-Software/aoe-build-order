export * from './errors';

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

export const civToColor = {
  [Civilization.RUS]: '#d65046',
  [Civilization.HOLY_ROMAN_EMPIRE]: '#dcc34d',
  [Civilization.CHINESE]: '#b94730',
  [Civilization.ENGLISH]: '#d6dcdf',
  [Civilization.DELHI_SULTANATE]: '#269058',
  [Civilization.MONGOLS]: '#1b8ac8',
  [Civilization.ABBASID_DYNASTY]: '#343539',
  [Civilization.FRENCH]: '#2fa1f3'
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

export const tagToColor = {
  [Tag.BOOM]: 'teal',
  [Tag.CHEESE]: 'yellow',
  [Tag.FAST_FEUDAL]: 'orange',
  [Tag.FAST_CASTLE]: 'gray',
  [Tag.LAND]: 'green',
  [Tag.RUSH]: 'red',
  [Tag.WATER]: 'blue',
};
