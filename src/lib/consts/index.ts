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
  Rus: 'rus',
  ['Holy Roman Empire']: 'hre',
  Chinese: 'chinese',
  English: 'english',
  ['Delhi Sultanate']: 'delhi',
  Mongols: 'mongol',
  ['Abbasid Dynasty']: 'abbasid',
  French: 'french'

};
