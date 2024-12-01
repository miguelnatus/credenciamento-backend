-- CreateTable
CREATE TABLE `credenciais` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pessoa_id` INTEGER UNSIGNED NULL,
    `veiculo_id` INTEGER UNSIGNED NULL,
    `evento_id` INTEGER UNSIGNED NOT NULL,
    `empresa_id` INTEGER UNSIGNED NOT NULL,
    `setor_id` INTEGER UNSIGNED NOT NULL,
    `status_id` INTEGER UNSIGNED NULL,
    `impresso` TIMESTAMP(0) NULL,
    `retirado` TIMESTAMP(0) NULL,
    `checkin` TIMESTAMP(0) NULL,
    `checkout` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `credenciais_empresa_id_foreign`(`empresa_id`),
    INDEX `credenciais_evento_id_foreign`(`evento_id`),
    INDEX `credenciais_setor_id_foreign`(`setor_id`),
    INDEX `credenciais_status_id_foreign`(`status_id`),
    UNIQUE INDEX `credenciais_pessoa_id_evento_id_empresa_id_setor_id_unique`(`pessoa_id`, `evento_id`, `empresa_id`, `setor_id`),
    UNIQUE INDEX `credenciais_veiculo_id_evento_id_empresa_id_setor_id_unique`(`veiculo_id`, `evento_id`, `empresa_id`, `setor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credencial_codigo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(255) NOT NULL,
    `data_cancelamento` TIMESTAMP(0) NULL,
    `motivo_cancelamento` TEXT NULL,
    `credencial_id` INTEGER UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `credencial_codigo_credencial_id_foreign`(`credencial_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credencial_empresa_setor` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER UNSIGNED NOT NULL,
    `setor_id` INTEGER UNSIGNED NOT NULL,
    `evento_id` INTEGER UNSIGNED NOT NULL,
    `limite_pessoas` INTEGER NOT NULL,
    `limite_veiculos` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `credencial_empresa_setor_empresa_id_foreign`(`empresa_id`),
    INDEX `credencial_empresa_setor_evento_id_foreign`(`evento_id`),
    INDEX `credencial_empresa_setor_setor_id_foreign`(`setor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credencial_empresa_zona` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `ces_id` INTEGER UNSIGNED NOT NULL,
    `zona_id` INTEGER UNSIGNED NOT NULL,
    `limite` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `credencial_empresa_zona_zona_id_foreign`(`zona_id`),
    UNIQUE INDEX `credencial_empresa_zona_ces_id_zona_id_unique`(`ces_id`, `zona_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credencial_status` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credencial_zona` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `credencial_id` INTEGER UNSIGNED NOT NULL,
    `zona_id` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `credencial_zona_zona_id_foreign`(`zona_id`),
    UNIQUE INDEX `credencial_zona_credencial_id_zona_id_unique`(`credencial_id`, `zona_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa_pessoa` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER UNSIGNED NOT NULL,
    `pessoa_id` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `empresa_pessoa_empresa_id_foreign`(`empresa_id`),
    INDEX `empresa_pessoa_pessoa_id_foreign`(`pessoa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa_tipos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(255) NOT NULL,
    `endereco` VARCHAR(255) NULL,
    `telefone` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evento_grupo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `local` VARCHAR(255) NULL,
    `data_evento` DATE NULL,
    `inicio_credenciamento` DATETIME(0) NULL,
    `fim_credenciamento` DATETIME(0) NULL,
    `grupo` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knex_migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `batch` INTEGER NULL,
    `migration_time` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knex_migrations_lock` (
    `index` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `is_locked` INTEGER NULL,

    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pessoas` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `sobrenome` VARCHAR(100) NULL,
    `nome_credencial` VARCHAR(100) NULL,
    `cpf` VARCHAR(14) NULL,
    `passaporte` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `telefone` VARCHAR(20) NULL,
    `data_nascimento` DATE NULL,
    `assinatura` TEXT NULL,
    `foto` TEXT NULL,
    `tamanho` VARCHAR(10) NULL,
    `endereco` TEXT NULL,
    `observacao` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATE NULL,

    UNIQUE INDEX `pessoas_cpf_unique`(`cpf`),
    UNIQUE INDEX `pessoas_passaporte_unique`(`passaporte`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtoras` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `register` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `register_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setores` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `valor` DECIMAL(10, 2) NULL,
    `tipo` VARCHAR(255) NULL,
    `hora_entrada` TIME(0) NULL,
    `hora_saida` TIME(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `veiculos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `placa` VARCHAR(7) NOT NULL,
    `modelo` VARCHAR(100) NOT NULL,
    `cor` VARCHAR(50) NOT NULL,
    `ano` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `veiculos_placa_unique`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zonas` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `credenciais` ADD CONSTRAINT `credenciais_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credenciais` ADD CONSTRAINT `credenciais_evento_id_foreign` FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credenciais` ADD CONSTRAINT `credenciais_pessoa_id_foreign` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credenciais` ADD CONSTRAINT `credenciais_setor_id_foreign` FOREIGN KEY (`setor_id`) REFERENCES `setores`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credenciais` ADD CONSTRAINT `credenciais_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `credencial_status`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credenciais` ADD CONSTRAINT `credenciais_veiculo_id_foreign` FOREIGN KEY (`veiculo_id`) REFERENCES `veiculos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credencial_codigo` ADD CONSTRAINT `credencial_codigo_credencial_id_foreign` FOREIGN KEY (`credencial_id`) REFERENCES `credenciais`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credencial_empresa_setor` ADD CONSTRAINT `credencial_empresa_setor_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credencial_empresa_setor` ADD CONSTRAINT `credencial_empresa_setor_evento_id_foreign` FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credencial_empresa_setor` ADD CONSTRAINT `credencial_empresa_setor_setor_id_foreign` FOREIGN KEY (`setor_id`) REFERENCES `setores`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credencial_empresa_zona` ADD CONSTRAINT `credencial_empresa_zona_ces_id_foreign` FOREIGN KEY (`ces_id`) REFERENCES `credencial_empresa_setor`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credencial_empresa_zona` ADD CONSTRAINT `credencial_empresa_zona_zona_id_foreign` FOREIGN KEY (`zona_id`) REFERENCES `zonas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credencial_zona` ADD CONSTRAINT `credencial_zona_credencial_id_foreign` FOREIGN KEY (`credencial_id`) REFERENCES `credenciais`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credencial_zona` ADD CONSTRAINT `credencial_zona_zona_id_foreign` FOREIGN KEY (`zona_id`) REFERENCES `zonas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `empresa_pessoa` ADD CONSTRAINT `empresa_pessoa_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `empresa_pessoa` ADD CONSTRAINT `empresa_pessoa_pessoa_id_foreign` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
