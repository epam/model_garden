export const id = (x: any): any => x;

type Compose = <A, B = A, C = A | B>(x: (b: B) => C) => (y: (a: A) => B) => (a: A) => C;
export const compose: Compose = (x) => (y) => (z) => x(y(z));

export const isProd = () => process.env.NODE_ENV === 'production';

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1).toLowerCase();

export const includesIgnoreCase = (s1: string, s2: string) => s1.toLowerCase().includes(s2.toLowerCase());

export const addSlashIfAbsent = (path: any) => `${path[0] === '/' ? '' : '/'}${path}`;

export const addSlashIfAbsentInField = <T>(fieldName: keyof T) => (obj: T): T => ({
  ...obj,
  [fieldName]: addSlashIfAbsent(obj[fieldName])
});

export const stringifyField = <T>(fieldName: keyof T) => (obj: T): T => ({ ...obj, [fieldName]: `${obj[fieldName]}` });
