import { pgTable, text, serial, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const citiesTable = pgTable("cities", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  region: text("region").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const amenitiesTable = pgTable("amenities", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});

export const hotelsTable = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  cityId: integer("city_id").notNull(),
  address: text("address").notNull(),
  stars: integer("stars").notNull(),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  pricePerNight: real("price_per_night").notNull(),
  currency: text("currency").notNull().default("DZD"),
  imageUrl: text("image_url").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  description: text("description").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  checkInTime: text("check_in_time").notNull().default("14:00"),
  checkOutTime: text("check_out_time").notNull().default("12:00"),
  policies: text("policies"),
  nearbyAttractions: jsonb("nearby_attractions").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  pricePerNight: real("price_per_night").notNull(),
  capacity: integer("capacity").notNull(),
  bedType: text("bed_type").notNull(),
  size: real("size").notNull(),
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull(),
  guestName: text("guest_name").notNull(),
  guestCountry: text("guest_country").notNull(),
  rating: real("rating").notNull(),
  title: text("title"),
  comment: text("comment").notNull(),
  date: text("date").notNull(),
  categories: jsonb("categories").$type<{cleanliness?: number; location?: number; service?: number; value?: number}>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  hotelId: integer("hotel_id").notNull(),
  roomId: integer("room_id").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  adults: integer("adults").notNull(),
  children: integer("children").notNull().default(0),
  specialRequests: text("special_requests"),
  totalPrice: real("total_price").notNull(),
  currency: text("currency").notNull().default("DZD"),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCitySchema = createInsertSchema(citiesTable).omit({ id: true, createdAt: true });
export const insertHotelSchema = createInsertSchema(hotelsTable).omit({ id: true, createdAt: true });
export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export const insertAmenitySchema = createInsertSchema(amenitiesTable).omit({ id: true });

export type City = typeof citiesTable.$inferSelect;
export type Hotel = typeof hotelsTable.$inferSelect;
export type Room = typeof roomsTable.$inferSelect;
export type Review = typeof reviewsTable.$inferSelect;
export type Booking = typeof bookingsTable.$inferSelect;
export type Amenity = typeof amenitiesTable.$inferSelect;
