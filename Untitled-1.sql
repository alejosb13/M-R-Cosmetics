-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         5.7.33 - MySQL Community Server (GPL)
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla api_maquillaje.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tipo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.categorias: ~3 rows (aproximadamente)
DELETE FROM `categorias`;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` (`id`, `tipo`, `descripcion`, `estado`, `created_at`, `updated_at`) VALUES
	(1, 'A', '60 dias', 1, '2022-03-04 20:38:04', '2022-03-04 20:38:05'),
	(2, 'B', '45 dias', 1, '2022-03-04 20:38:04', '2022-03-04 20:38:05'),
	(3, 'C', '30 dias', 1, '2022-03-04 20:38:04', '2022-03-04 20:38:05');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `categoria_id` bigint(20) unsigned NOT NULL,
  `frecuencia_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `nombreCompleto` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombreEmpresa` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `celular` bigint(20) unsigned NOT NULL,
  `telefono` bigint(20) unsigned DEFAULT NULL,
  `direccion_casa` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion_negocio` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cedula` varchar(22) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dias_cobro` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clientes_categoria_id_foreign` (`categoria_id`),
  KEY `clientes_frecuencia_id_foreign` (`frecuencia_id`),
  KEY `clientes_user_id_foreign` (`user_id`),
  CONSTRAINT `clientes_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `clientes_frecuencia_id_foreign` FOREIGN KEY (`frecuencia_id`) REFERENCES `frecuencias` (`id`),
  CONSTRAINT `clientes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.clientes: ~0 rows (aproximadamente)
DELETE FROM `clientes`;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.facturas
CREATE TABLE IF NOT EXISTS `facturas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `monto` double(7,2) NOT NULL,
  `fecha_vencimiento` datetime NOT NULL,
  `iva` double(7,2) NOT NULL,
  `tipo_venta` int(11) NOT NULL,
  `status_pagado` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `facturas_user_id_foreign` (`user_id`),
  KEY `facturas_cliente_id_foreign` (`cliente_id`),
  CONSTRAINT `facturas_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `facturas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.facturas: ~0 rows (aproximadamente)
DELETE FROM `facturas`;
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.factura_detalles
CREATE TABLE IF NOT EXISTS `factura_detalles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` bigint(20) unsigned NOT NULL,
  `factura_id` bigint(20) unsigned NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` double(7,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factura_detalles_producto_id_foreign` (`producto_id`),
  KEY `factura_detalles_factura_id_foreign` (`factura_id`),
  CONSTRAINT `factura_detalles_factura_id_foreign` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`),
  CONSTRAINT `factura_detalles_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.factura_detalles: ~0 rows (aproximadamente)
DELETE FROM `factura_detalles`;
/*!40000 ALTER TABLE `factura_detalles` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura_detalles` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.factura_historials
CREATE TABLE IF NOT EXISTS `factura_historials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `factura_id` bigint(20) unsigned NOT NULL,
  `precio` double(7,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factura_historials_factura_id_foreign` (`factura_id`),
  CONSTRAINT `factura_historials_factura_id_foreign` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.factura_historials: ~0 rows (aproximadamente)
DELETE FROM `factura_historials`;
/*!40000 ALTER TABLE `factura_historials` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura_historials` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.failed_jobs: ~0 rows (aproximadamente)
DELETE FROM `failed_jobs`;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.frecuencias
CREATE TABLE IF NOT EXISTS `frecuencias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dias` int(11) NOT NULL,
  `estado` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.frecuencias: ~2 rows (aproximadamente)
DELETE FROM `frecuencias`;
/*!40000 ALTER TABLE `frecuencias` DISABLE KEYS */;
INSERT INTO `frecuencias` (`id`, `descripcion`, `dias`, `estado`, `created_at`, `updated_at`) VALUES
	(1, 'quincenal', 15, 1, '2022-01-25 01:38:13', '2022-01-27 05:36:20'),
	(2, 'mensual', 30, 1, '2022-01-27 05:28:49', '2022-02-08 22:35:49');
/*!40000 ALTER TABLE `frecuencias` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=218 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.migrations: ~0 rows (aproximadamente)
DELETE FROM `migrations`;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.model_has_permissions
CREATE TABLE IF NOT EXISTS `model_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.model_has_permissions: ~0 rows (aproximadamente)
DELETE FROM `model_has_permissions`;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.model_has_roles
CREATE TABLE IF NOT EXISTS `model_has_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.model_has_roles: ~2 rows (aproximadamente)
DELETE FROM `model_has_roles`;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
	(2, 'App\\Models\\User', 20),
	(2, 'App\\Models\\User', 21);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.password_resets
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.password_resets: ~0 rows (aproximadamente)
DELETE FROM `password_resets`;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.permissions: ~0 rows (aproximadamente)
DELETE FROM `permissions`;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.personal_access_tokens: ~8 rows (aproximadamente)
DELETE FROM `personal_access_tokens`;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', 18, 'tokens', '542377f36a759959b225a9d1050fc73b3f9b1d628a188c58c4cb96d7954eb1ba', '["*"]', NULL, '2022-02-20 05:08:49', '2022-02-20 05:08:49'),
	(2, 'App\\Models\\User', 19, 'tokens', '1037f773e18d1b49ec0d2fda200bbe36f28b79da86acf2160b17a217133a5c0d', '["*"]', NULL, '2022-02-20 07:19:44', '2022-02-20 07:19:44'),
	(3, 'App\\Models\\User', 6, 'tokens', '4134f8ceefc11ce5e0a614ce04e9cf5a0d28fde6e307e5854a065babdaad27b7', '["*"]', NULL, '2022-02-20 22:14:26', '2022-02-20 22:14:26'),
	(4, 'App\\Models\\User', 6, 'tokens', '473566e86d963d674a483491ad44cf351f256f7b9ae0c2f90745d0b9a2a0bfd9', '["*"]', NULL, '2022-02-20 23:40:33', '2022-02-20 23:40:33'),
	(5, 'App\\Models\\User', 6, 'tokens', '6e1746b5b2feea1136271f569431f087669828b9a4fc0dc5bc82ac48a1dd71fd', '["*"]', NULL, '2022-02-20 23:41:52', '2022-02-20 23:41:52'),
	(6, 'App\\Models\\User', 20, 'tokens', '15615d97e8c6da2cac9f739c92ed14e15cf96bb9bf45cb8502835d78d1a91d44', '["*"]', NULL, '2022-03-04 19:27:40', '2022-03-04 19:27:40'),
	(7, 'App\\Models\\User', 20, 'tokens', 'b13fa9edcf5b6e9885a84fb9245bb64e2bc9b82567293c7243909a9477d58388', '["*"]', NULL, '2022-03-04 19:31:39', '2022-03-04 19:31:39'),
	(8, 'App\\Models\\User', 21, 'tokens', '7052753e7b40852447ec8046f8aaea48631513d974409fad7b94715df59d457a', '["*"]', NULL, '2022-03-04 19:34:04', '2022-03-04 19:34:04');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `marca` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo` varchar(43) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` int(11) NOT NULL,
  `precio` double(7,2) NOT NULL,
  `linea` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.productos: ~2 rows (aproximadamente)
DELETE FROM `productos`;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` (`id`, `marca`, `modelo`, `stock`, `precio`, `linea`, `descripcion`, `estado`, `created_at`, `updated_at`) VALUES
	(5, 'Lizz Professional', '0000001', 10, 155.00, 'Planchas', 'Plancha Ultra 500', 1, '2022-03-03 19:54:15', '2022-03-03 19:54:15'),
	(6, 'test', 'test', 12, 3000.00, 'blanca', 'test nada mas', 0, '2022-03-04 03:06:00', '2022-03-04 03:06:09');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.roles: ~3 rows (aproximadamente)
DELETE FROM `roles`;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(2, 'administrador', 'web', '2022-01-25 04:27:11', '2022-01-25 04:27:11'),
	(3, 'vendedor', 'web', '2022-02-14 03:31:21', '2022-02-14 03:31:21'),
	(4, 'supervisor', 'web', '2022-03-02 13:23:04', '2022-03-02 13:23:06');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.role_has_permissions
CREATE TABLE IF NOT EXISTS `role_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.role_has_permissions: ~0 rows (aproximadamente)
DELETE FROM `role_has_permissions`;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;

-- Volcando estructura para tabla api_maquillaje.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cargo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla api_maquillaje.users: ~2 rows (aproximadamente)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `apellido`, `cargo`, `email`, `email_verified_at`, `password`, `remember_token`, `estado`, `created_at`, `updated_at`) VALUES
	(20, 'Alejandro', 'sanchez', 'Programador', 'alejosb13@gmail.com', NULL, '$2y$10$ycLD6AVSbqAZmd/qgpuy0OfiHeL7d8vDmsO.xo2OR6o8gV8xlqwZ.', NULL, 1, '2022-03-04 19:27:40', '2022-03-04 19:27:40'),
	(21, 'Rigoberto', 'Gallo', 'Programador', 'rigoberto.gallo@regxi.com', NULL, '$2y$10$pCduaZHii83COKb/Etlrxu0u4VAyxWzCLMIqqTMMo.FAEHHl69.Qe', NULL, 1, '2022-03-04 19:34:04', '2022-03-04 19:34:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
