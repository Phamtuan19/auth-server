import { z } from 'zod';

const HTTPSTATUSCODES = {
   SUCCESS: 200,
   CONTINUE: 100,
   GATEWAY_TIMEOUT: 504,
   REQUEST_TIMEOUT: 408,
   UNAUTHORIZED: 401,
   UNPROCESSABLE_ENTITY: 422,
   UNSUPPORTED_MEDIA_TYPE: 415,
   TOO_MANY_REQUESTS: 429,
   INTERNAL_SERVER_ERROR: 500,
   BAD_GATEWAY: 502,
   BAD_REQUEST: 400,
   INVALID_FORMAT: 403,
   NOT_FOUND: 404,
   NOT_ACCEPTABLE: 406,
} as const;

export const HttpStatusCodeSchema = z.nativeEnum(HTTPSTATUSCODES);

export type HttpStatusCodeType = z.infer<typeof HttpStatusCodeSchema>;

export default HTTPSTATUSCODES;
