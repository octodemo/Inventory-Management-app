-- CreateTable
CREATE TABLE "ItemHierarchy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ItemHierarchy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ItemHierarchy" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
