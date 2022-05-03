/*
  Warnings:

  - Made the column `views` on table `tests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tests" ALTER COLUMN "views" SET NOT NULL;
