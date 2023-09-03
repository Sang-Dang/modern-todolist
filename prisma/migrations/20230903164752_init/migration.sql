/*
  Warnings:

  - The `reminders` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "reminders",
ADD COLUMN     "reminders" TIMESTAMP(3);
