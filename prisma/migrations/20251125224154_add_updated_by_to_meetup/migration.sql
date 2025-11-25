-- Add updatedBy column to Meetup table
-- Since the table is empty, we can add it directly as NOT NULL

-- AlterTable
ALTER TABLE "Meetup" ADD COLUMN "updatedBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
