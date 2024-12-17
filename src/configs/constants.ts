import { z } from 'zod';

export const SORT_KEY = {
   ASC: 1,
   DESC: -1,
} as const;

export const sortKeySchema = z.nativeEnum(SORT_KEY);

export type SortKeySchema = z.infer<typeof sortKeySchema>;

// giới tính
export const GENDER = {
   MALE: 'Nam',
   FEMALE: 'Nữ',
} as const;

const gender_type = z.nativeEnum(GENDER);

export type Gender = z.infer<typeof gender_type>;

export const regexs = {
   email: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
};
