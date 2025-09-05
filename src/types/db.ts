import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { user, session, account, verification } from "@/db/auth-schema";

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;

export type NewUser = InferInsertModel<typeof user>;
export type NewSession = InferInsertModel<typeof session>;
export type NewAccount = InferInsertModel<typeof account>;
export type NewVerification = InferInsertModel<typeof verification>;