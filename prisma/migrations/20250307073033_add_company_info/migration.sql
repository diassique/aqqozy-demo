-- CreateTable
CREATE TABLE "CompanyInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "workingHours" JSONB NOT NULL,
    "socialMedia" JSONB,
    "coordinates" JSONB,
    "additionalPhones" JSONB,
    "deliveryInfo" TEXT,
    "paymentMethods" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
