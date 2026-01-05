/**
 * Success messages.
 */
export const ResponseMessage = {} as const;

export type ResponseMessageKey = keyof typeof ResponseMessage;
export type ResponseMessageValue = (typeof ResponseMessage)[ResponseMessageKey];
