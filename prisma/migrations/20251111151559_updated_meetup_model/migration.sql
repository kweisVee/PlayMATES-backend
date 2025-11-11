/*
  Warnings:

  - You are about to drop the column `name` on the `Meetup` table. All the data in the column will be lost.
  - Added the required column `title` to the `Meetup` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "Meetup" DROP COLUMN "name",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "skillLevel" "SkillLevel" NOT NULL DEFAULT 'ALL',
ADD COLUMN     "sportColor" TEXT,
ADD COLUMN     "sportIcon" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
