-- CreateTable
CREATE TABLE "Decoration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" TEXT NOT NULL,
    "y" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "nickname" TEXT,
    "content" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
