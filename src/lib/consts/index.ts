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
