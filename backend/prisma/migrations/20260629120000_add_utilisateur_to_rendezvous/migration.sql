-- AlterTable
ALTER TABLE "rendez_vous" ADD COLUMN "utilisateur_id" INTEGER;

-- AddForeignKey
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_utilisateur_id_fkey"
  FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
