import Short from 'short-unique-id';

export const GenerateUUID: (length?: number) => string = (length?: number) => {
  const uid = new Short();
  if (!length) return uid(20);
  else return uid(length);
};
