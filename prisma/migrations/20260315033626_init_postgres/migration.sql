-- CreateTable
CREATE TABLE "operational_hours" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "open" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operational_hours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "operational_hours_day_key" ON "operational_hours"("day");
