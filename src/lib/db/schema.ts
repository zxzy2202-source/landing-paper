import { relations } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import type { SiteSettings } from "@/lib/siteSettingsTypes";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .notNull(),
};

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("editor"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastLoginAt: integer("last_login_at", { mode: "timestamp_ms" }),
  ...timestamps,
}, (table) => ({
  emailIdx: uniqueIndex("admin_users_email_idx").on(table.email),
}));

export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  siteKey: text("site_key").notNull().default("global"),
  settings: text("settings", { mode: "json" }).$type<SiteSettings>().notNull(),
  seoScore: integer("seo_score").notNull().default(0),
  updatedBy: text("updated_by").references(() => adminUsers.id, {
    onDelete: "set null",
  }),
  ...timestamps,
}, (table) => ({
  siteKeyIdx: uniqueIndex("site_settings_site_key_idx").on(table.siteKey),
}));

export const contactInquiries = sqliteTable("contact_inquiries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  companyName: text("company_name"),
  whatsappNumber: text("whatsapp_number"),
  productInterest: text("product_interest"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  sourcePath: text("source_path").notNull().default("/"),
  geoCode: text("geo_code").notNull().default("global"),
  ...timestamps,
}, (table) => ({
  statusIdx: index("contact_inquiries_status_idx").on(table.status),
  createdAtIdx: index("contact_inquiries_created_at_idx").on(table.createdAt),
}));

export const quoteRequests = sqliteTable("quote_requests", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  companyName: text("company_name"),
  whatsappNumber: text("whatsapp_number"),
  productName: text("product_name").notNull(),
  quantity: integer("quantity"),
  targetPrice: real("target_price"),
  estimatedAmount: real("estimated_amount"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  sourcePath: text("source_path").notNull().default("/"),
  geoCode: text("geo_code").notNull().default("global"),
  ...timestamps,
}, (table) => ({
  statusIdx: index("quote_requests_status_idx").on(table.status),
  createdAtIdx: index("quote_requests_created_at_idx").on(table.createdAt),
}));

export const sampleRequests = sqliteTable("sample_requests", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  companyName: text("company_name"),
  whatsappNumber: text("whatsapp_number"),
  sampleProduct: text("sample_product").notNull(),
  shippingAddress: text("shipping_address"),
  trackingNumber: text("tracking_number"),
  logisticsStatus: text("logistics_status").notNull().default("pending"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  sourcePath: text("source_path").notNull().default("/"),
  geoCode: text("geo_code").notNull().default("global"),
  ...timestamps,
}, (table) => ({
  statusIdx: index("sample_requests_status_idx").on(table.status),
  createdAtIdx: index("sample_requests_created_at_idx").on(table.createdAt),
}));

export const productOverrides = sqliteTable("product_overrides", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  productData: text("product_data", { mode: "json" })
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
}, (table) => ({
  slugIdx: uniqueIndex("product_overrides_slug_idx").on(table.slug),
}));

export const mediaCategories = sqliteTable("media_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps,
}, (table) => ({
  slugIdx: uniqueIndex("media_categories_slug_idx").on(table.slug),
}));

export const mediaFiles = sqliteTable("media_files", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  categoryId: text("category_id").references(() => mediaCategories.id, {
    onDelete: "set null",
  }),
  fileKey: text("file_key").notNull(),
  url: text("url").notNull(),
  webpThumbUrl: text("webp_thumb_url").notNull(),
  mimeType: text("mime_type").notNull(),
  alt: text("alt").notNull().default(""),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  size: integer("size").notNull(),
  ...timestamps,
}, (table) => ({
  fileKeyIdx: uniqueIndex("media_files_file_key_idx").on(table.fileKey),
  categoryIdx: index("media_files_category_idx").on(table.categoryId),
}));

export const imageSlots = sqliteTable("image_slots", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slotKey: text("slot_key").notNull(),
  label: text("label").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  fallbackUrl: text("fallback_url").notNull(),
  mediaFileId: text("media_file_id").references(() => mediaFiles.id, {
    onDelete: "set null",
  }),
  ...timestamps,
}, (table) => ({
  slotKeyIdx: uniqueIndex("image_slots_slot_key_idx").on(table.slotKey),
}));

export const activityLog = sqliteTable("activity_log", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  adminUserId: text("admin_user_id").references(() => adminUsers.id, {
    onDelete: "set null",
  }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  payload: text("payload", { mode: "json" }).$type<Record<string, unknown>>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  ...timestamps,
}, (table) => ({
  adminIdx: index("activity_log_admin_idx").on(table.adminUserId),
  entityIdx: index("activity_log_entity_idx").on(table.entityType, table.entityId),
}));

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  activity: many(activityLog),
}));

export const mediaCategoriesRelations = relations(mediaCategories, ({ many }) => ({
  files: many(mediaFiles),
}));

export const mediaFilesRelations = relations(mediaFiles, ({ one, many }) => ({
  category: one(mediaCategories, {
    fields: [mediaFiles.categoryId],
    references: [mediaCategories.id],
  }),
  slots: many(imageSlots),
}));

export const imageSlotsRelations = relations(imageSlots, ({ one }) => ({
  mediaFile: one(mediaFiles, {
    fields: [imageSlots.mediaFileId],
    references: [mediaFiles.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  adminUser: one(adminUsers, {
    fields: [activityLog.adminUserId],
    references: [adminUsers.id],
  }),
}));

export type AdminUser = typeof adminUsers.$inferSelect;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type SampleRequest = typeof sampleRequests.$inferSelect;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type ImageSlot = typeof imageSlots.$inferSelect;
