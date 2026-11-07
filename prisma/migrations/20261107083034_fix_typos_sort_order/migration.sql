-- Rename enum (keeps existing values)
ALTER TYPE "PropertStatus" RENAME TO "PropertyStatus";

-- Rename column (keeps existing data)
ALTER TABLE "Property" RENAME COLUMN "addres" TO "address";

-- Convert sortOrder from TEXT to INTEGER
ALTER TABLE "PropertyImage"
  ALTER COLUMN "sortOrder" TYPE INTEGER USING NULLIF("sortOrder", '')::INTEGER,
  ALTER COLUMN "sortOrder" SET DEFAULT 0;
UPDATE "PropertyImage" SET "sortOrder" = 0 WHERE "sortOrder" IS NULL;
