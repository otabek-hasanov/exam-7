-- Role: USER, ADMIN (SELLER -> USER)
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role"
  USING (CASE WHEN "role"::text = 'ADMIN' THEN 'ADMIN' ELSE 'USER' END)::"Role";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
DROP TYPE "UserType";

-- phone ixtiyoriy
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL;

-- PropertyStatus: PENDING, APPROVED, REJECTED (ACTIVE -> APPROVED)
CREATE TYPE "PropertyStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "Property" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Property" ALTER COLUMN "status" TYPE "PropertyStatus_new"
  USING (CASE WHEN "status"::text = 'ACTIVE' THEN 'APPROVED' ELSE "status"::text END)::"PropertyStatus_new";
DROP TYPE "PropertyStatus";
ALTER TYPE "PropertyStatus_new" RENAME TO "PropertyStatus";
ALTER TABLE "Property" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- area son (m²)
ALTER TABLE "Property" ALTER COLUMN "area" TYPE DOUBLE PRECISION USING "area"::DOUBLE PRECISION;

-- createdAt (sort=newest uchun)
ALTER TABLE "Property" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
