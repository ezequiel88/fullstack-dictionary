import { ErrorResponseSchema } from "../schemas/error.js";
import { UserCreateSchema, UserLoginResponseSchema, UserLoginSchema } from "../schemas/user.js";

export const signupSchema = {
  summary: "Sign up a new user",
  tags: ["Auth"],
  body: UserCreateSchema,
  response: {
    201: UserLoginResponseSchema,
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};

export const signinSchema = {
  summary: "Sign in a user",
  tags: ["Auth"],
  body: UserLoginSchema,
  response: {
    201: UserLoginResponseSchema,
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};
