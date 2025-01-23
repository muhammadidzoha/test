-- CreateTable
CREATE TABLE `health_educations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `health_education_plan` BOOLEAN NOT NULL DEFAULT false,
    `health_education` BOOLEAN NOT NULL DEFAULT false,
    `physical_education` BOOLEAN NOT NULL DEFAULT false,
    `extracurricular_health_activities` BOOLEAN NOT NULL DEFAULT false,
    `literacy_health_program` BOOLEAN NOT NULL DEFAULT false,
    `cader_coaching` BOOLEAN NOT NULL DEFAULT false,
    `healthy_breakfast_program` BOOLEAN NOT NULL DEFAULT false,
    `physical_class_activities` BOOLEAN NOT NULL DEFAULT false,
    `fitness_test` BOOLEAN NOT NULL DEFAULT false,
    `nutrition_education` BOOLEAN NOT NULL DEFAULT false,
    `healthy_living_implementation` BOOLEAN NOT NULL DEFAULT false,
    `parent_involvement` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `health_educations_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `health_educations` ADD CONSTRAINT `health_educations_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `institutions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
