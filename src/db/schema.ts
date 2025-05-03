import { pgTable, text, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";

import { timestamps } from "./columns.helpers";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type User = InferSelectModel<typeof user>;

export const usersRelations = relations(user, ({ many }) => ({
  classes: many(classes),
  enrolledClasses: many(enrollments),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const classes = pgTable("classes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  subjectName: text("subject_name").notNull(),
  code: text("code").notNull(),
  classTeacherId: text("class_teacher_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Classes = InferSelectModel<typeof classes>;

export const classesRelations = relations(classes, ({ one, many }) => ({
  classTeacher: one(user, {
    fields: [classes.classTeacherId],
    references: [user.id],
  }),
  enrollments: many(enrollments),
  materials: many(material),
}));

export const createClassSchema = createInsertSchema(classes).pick({
  subjectName: true,
  code: true,
  classTeacherId: true,
});

export type ClassesWithTeacher = InferSelectModel<typeof classes> & {
  classTeacher: InferSelectModel<typeof user>;
};

export const material = pgTable("material", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: text("title").notNull(),
  content: text("content"),
  classId: text("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Material = InferSelectModel<typeof material>;

export const CreateMaterialSchema = createInsertSchema(material).pick({
  title: true,
  content: true,
  classId: true,
});

export const EditMaterialSchema = createUpdateSchema(material).pick({
  title: true,
  content: true,
});

export const materialRelations = relations(material, ({ one }) => ({
  classes: one(classes, {
    fields: [material.classId],
    references: [classes.id],
  }),
}));

export const enrollments = pgTable(
  "enrollments",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    isPending: boolean("is_pending").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.classId] })]
);

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  classes: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
  user: one(user, {
    fields: [enrollments.userId],
    references: [user.id],
  }),
}));

export const joinClassSchema = createInsertSchema(enrollments);

export type EnrolledClasses = InferSelectModel<typeof enrollments> & {
  classes: InferSelectModel<typeof classes>;
};
