-- CreateEnum
CREATE TYPE "MotifAbsence" AS ENUM ('MALADIE', 'CONGES', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutRdv" AS ENUM ('CONFIRME', 'ANNULE');

-- CreateTable
CREATE TABLE "centres" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "centres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialites" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "specialites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medecins" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "specialite_id" INTEGER NOT NULL,
    "centre_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medecins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absences" (
    "id" SERIAL NOT NULL,
    "medecin_id" INTEGER NOT NULL,
    "date_debut" TIMESTAMPTZ NOT NULL,
    "date_fin" TIMESTAMPTZ NOT NULL,
    "motif" "MotifAbsence" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creneaux" (
    "id" SERIAL NOT NULL,
    "medecin_id" INTEGER NOT NULL,
    "date_heure" TIMESTAMPTZ NOT NULL,
    "duree_minutes" INTEGER NOT NULL DEFAULT 30,
    "est_disponible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creneaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rendez_vous" (
    "id" SERIAL NOT NULL,
    "creneau_id" INTEGER NOT NULL,
    "patient_nom" TEXT NOT NULL,
    "patient_contact" TEXT NOT NULL,
    "statut" "StatutRdv" NOT NULL DEFAULT 'CONFIRME',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rendez_vous_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialites_nom_key" ON "specialites"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "rendez_vous_creneau_id_key" ON "rendez_vous"("creneau_id");

-- AddForeignKey
ALTER TABLE "medecins" ADD CONSTRAINT "medecins_specialite_id_fkey" FOREIGN KEY ("specialite_id") REFERENCES "specialites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medecins" ADD CONSTRAINT "medecins_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "centres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absences" ADD CONSTRAINT "absences_medecin_id_fkey" FOREIGN KEY ("medecin_id") REFERENCES "medecins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creneaux" ADD CONSTRAINT "creneaux_medecin_id_fkey" FOREIGN KEY ("medecin_id") REFERENCES "medecins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_creneau_id_fkey" FOREIGN KEY ("creneau_id") REFERENCES "creneaux"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
