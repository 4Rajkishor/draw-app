/*
  Warnings:

  - You are about to drop the column `type` on the `Shapes` table. All the data in the column will be lost.
  - Added the required column `ShapeType` to the `Shapes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shapes" DROP COLUMN "type",
ADD COLUMN     "ShapeType" TEXT NOT NULL;
