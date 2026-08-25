-- Create inventory catalogue master tables.
PRAGMA foreign_keys=OFF;

CREATE TABLE "Vendor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "ItemHierarchy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ItemHierarchy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ItemHierarchy" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "InventoryItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "vendorId" INTEGER NOT NULL,
    "hierarchyId" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InventoryItem_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryItem_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "ItemHierarchy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ItemRate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "rate" REAL NOT NULL,
    "effectiveFrom" DATETIME NOT NULL,
    "effectiveTo" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ItemRate_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "InventoryItem_vendorId_idx" ON "InventoryItem"("vendorId");
CREATE INDEX "InventoryItem_hierarchyId_idx" ON "InventoryItem"("hierarchyId");
CREATE INDEX "ItemRate_itemId_effectiveFrom_idx" ON "ItemRate"("itemId", "effectiveFrom");

PRAGMA foreign_keys=ON;
