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

-- Volcando datos para la tabla api_maquillaje.categorias: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` (`id`, `tipo`, `descripcion`, `estado`, `created_at`, `updated_at`) VALUES
	(1, 'B', 'esta es descripcion', 1, NULL, '2022-01-27 01:01:26'),
	(7, 'A', 'esta es descripcion', 1, '2022-01-27 00:38:41', '2022-01-27 00:38:41');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.clientes: ~8 rows (aproximadamente)
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` (`id`, `categoria_id`, `frecuencia_id`, `nombre`, `apellido`, `celular`, `telefono`, `direccion_casa`, `direccion_negocio`, `cedula`, `dias_cobro`, `estado`, `created_at`, `updated_at`) VALUES
	(2, 1, 1, 'yuleina22', '', 123456789, 123456789, 'Beiro', 'villa crespo', '123456', 'lunes', 0, '2022-01-25 01:30:28', '2022-01-26 00:49:39'),
	(3, 7, 1, 'yuleina22', 'asfasfasf', 1234567892, 123456789, 'Beiro', 'villa crespo', '123456', 'lunes,viernes,jueves', 1, '2022-01-25 01:32:25', '2022-02-09 18:09:42'),
	(4, 7, 2, 'Alejandro', 'asfasf', 1131905210, 12345678, 'Av.francisco beiro 3360', 'Av.francisco beiro 3360', '220179363', 'lunes,sábado', 1, '2022-01-25 01:32:30', '2022-02-09 01:41:21'),
	(5, 1, 1, 'yuleina', '', 12345678, 12345678, 'Beiro', 'villa crespo', '123456', 'lunes', 1, '2022-01-25 01:32:54', '2022-01-25 01:32:54'),
	(6, 1, 1, 'yuleina', 'asdasdas', 12345678, 12345678, 'Beiro', 'villa crespo', '123456', 'lunes,martes,miércoles,domingo,sábado,viernes,jueves', 1, '2022-01-25 01:37:58', '2022-02-09 16:17:45'),
	(7, 1, 1, 'alejandro', '', 123456789, 123456789, 'Beiro', 'villa crespo', '123456', 'Lunes,Sábado', 1, '2022-01-25 23:29:59', '2022-01-25 23:29:59'),
	(8, 7, 1, 'Pepe', 'sarando', 1131905432, 0, 'Av.Barrio Bolivar', 'Av.Barrio Bolivar', '22345675', 'viernes,jueves', 1, '2022-02-09 01:55:29', '2022-02-09 01:55:29'),
	(9, 7, 1, 'Pere', 'Pepo', 12123, 0, 'barrio velez', NULL, '324546534', 'lunes', 1, '2022-02-09 18:44:19', '2022-02-09 18:44:19'),
	(10, 7, 1, 'Alejandro', 'Sanchez', 1131905214, 0, 'Av.francisco beiro 3360', 'Av.francisco beiro 3360', '12345633', 'viernes,sábado', 1, '2022-02-09 19:22:14', '2022-02-09 19:22:14');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.facturas: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
INSERT INTO `facturas` (`id`, `user_id`, `cliente_id`, `monto`, `nruc`, `fecha_vencimiento`, `iva`, `tcambio`, `estado`, `created_at`, `updated_at`) VALUES
	(1, 5, 2, 200.00, '1234', '2022-01-24 21:43:50', 2.50, 10, 0, '2022-01-28 10:57:34', '2022-01-29 17:26:58'),
	(2, 4, 2, 200.00, '1234', '2022-01-24 21:43:50', 2.50, 10, 1, '2022-01-29 17:14:36', '2022-01-29 17:14:36');
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.factura_detalles: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `factura_detalles` DISABLE KEYS */;
INSERT INTO `factura_detalles` (`id`, `producto_id`, `factura_id`, `cantidad`, `precio`, `porcentaje`, `created_at`, `updated_at`) VALUES
	(1, 2, 1, 6, 200.00, 5, '2022-01-28 10:57:54', '2022-01-28 14:26:48'),
	(2, 2, 2, 6, 200.00, 3, '2022-01-28 14:11:03', '2022-01-28 14:11:03');
/*!40000 ALTER TABLE `factura_detalles` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.failed_jobs: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.frecuencias: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `frecuencias` DISABLE KEYS */;
INSERT INTO `frecuencias` (`id`, `descripcion`, `dias`, `estado`, `created_at`, `updated_at`) VALUES
	(1, 'quincenal', 15, 1, '2022-01-24 21:38:13', '2022-01-27 01:36:20'),
	(2, 'mensual', 30, 1, '2022-01-27 01:28:49', '2022-02-08 18:35:49');
/*!40000 ALTER TABLE `frecuencias` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.migrations: ~44 rows (aproximadamente)
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(21, '2014_10_12_000000_create_users_table', 1),
	(22, '2014_10_12_100000_create_password_resets_table', 1),
	(23, '2019_08_19_000000_create_failed_jobs_table', 1),
	(24, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(25, '2022_01_20_233955_create_permission_tables', 1),
	(26, '2022_01_21_011111_create_categorias_table', 1),
	(27, '2022_01_21_011120_create_frecuencias_table', 1),
	(28, '2022_01_21_141652_create_clientes_table', 1),
	(29, '2022_01_21_145924_create_facturas_table', 1),
	(30, '2022_01_21_153506_create_productos_table', 1),
	(31, '2022_01_21_161644_create_factura_detalles_table', 1),
	(65, '2014_10_12_000000_create_users_table', 1),
	(66, '2014_10_12_100000_create_password_resets_table', 1),
	(67, '2019_08_19_000000_create_failed_jobs_table', 1),
	(68, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(69, '2022_01_20_233955_create_permission_tables', 1),
	(70, '2022_01_21_011111_create_categorias_table', 1),
	(71, '2022_01_21_011120_create_frecuencias_table', 1),
	(72, '2022_01_21_141652_create_clientes_table', 1),
	(73, '2022_01_21_145924_create_facturas_table', 1),
	(74, '2022_01_21_153506_create_productos_table', 1),
	(75, '2022_01_21_161644_create_factura_detalles_table', 1),
	(76, '2014_10_12_000000_create_users_table', 1),
	(77, '2014_10_12_100000_create_password_resets_table', 1),
	(78, '2019_08_19_000000_create_failed_jobs_table', 1),
	(79, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(80, '2022_01_20_233955_create_permission_tables', 1),
	(81, '2022_01_21_011111_create_categorias_table', 1),
	(82, '2022_01_21_011120_create_frecuencias_table', 1),
	(83, '2022_01_21_141652_create_clientes_table', 1),
	(84, '2022_01_21_145924_create_facturas_table', 1),
	(85, '2022_01_21_153506_create_productos_table', 1),
	(86, '2022_01_21_161644_create_factura_detalles_table', 1),
	(87, '2014_10_12_000000_create_users_table', 1),
	(88, '2014_10_12_100000_create_password_resets_table', 1),
	(89, '2019_08_19_000000_create_failed_jobs_table', 1),
	(90, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(91, '2022_01_20_233955_create_permission_tables', 1),
	(92, '2022_01_21_011111_create_categorias_table', 1),
	(93, '2022_01_21_011120_create_frecuencias_table', 1),
	(94, '2022_01_21_141652_create_clientes_table', 1),
	(95, '2022_01_21_145924_create_facturas_table', 1),
	(96, '2022_01_21_153506_create_productos_table', 1),
	(97, '2022_01_21_161644_create_factura_detalles_table', 1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.model_has_permissions: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.model_has_roles: ~7 rows (aproximadamente)
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
	(2, 'App\\Models\\User', 4),
	(2, 'App\\Models\\User', 5),
	(2, 'App\\Models\\User', 7),
	(3, 'App\\Models\\User', 8),
	(3, 'App\\Models\\User', 9),
	(2, 'App\\Models\\User', 15),
	(3, 'App\\Models\\User', 16),
	(3, 'App\\Models\\User', 17);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.password_resets: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.permissions: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.personal_access_tokens: ~6 rows (aproximadamente)
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `created_at`, `updated_at`) VALUES
	(3, 'App\\Models\\User', 5, 'tokens', '71ef2957486cf539b70ee622422021639ecc02d563c141402e042700144d3ddd', '["*"]', NULL, '2022-01-26 22:48:28', '2022-01-26 22:48:28'),
	(4, 'App\\Models\\User', 7, 'tokens', '719cf336d9aafc4150ba4830f1ef8ba24983450bebf0378b34ac00b5d3842a76', '["*"]', NULL, '2022-02-13 22:01:27', '2022-02-13 22:01:27'),
	(5, 'App\\Models\\User', 8, 'tokens', '0d83aac804f098c514c8133e49f91d7bf0117d068195ebb0634b72140f86437e', '["*"]', NULL, '2022-02-15 01:29:02', '2022-02-15 01:29:02'),
	(6, 'App\\Models\\User', 9, 'tokens', '4ab2504b616793369172c3971b10b7a9be0b739088ac1892a51d2c0fb8d53436', '["*"]', NULL, '2022-02-15 02:11:21', '2022-02-15 02:11:21'),
	(7, 'App\\Models\\User', 15, 'tokens', '4476d9e271957d6d1cd25e4d0b1e045bfda57843a339ed3d0d562f71d16daa25', '["*"]', NULL, '2022-02-15 02:16:31', '2022-02-15 02:16:31'),
	(8, 'App\\Models\\User', 16, 'tokens', '7f2939226999365208b4f02656d6edafa759a2e600d0d9a98bfd86144886dcc9', '["*"]', NULL, '2022-02-15 02:18:16', '2022-02-15 02:18:16'),
	(9, 'App\\Models\\User', 17, 'tokens', 'a7ebadc38eb826755106375a195c494bf5daee958e02900e0da3d57972b4dc02', '["*"]', NULL, '2022-02-15 02:20:28', '2022-02-15 02:20:28');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.productos: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` (`id`, `marca`, `modelo`, `stock`, `precio`, `comision`, `linea`, `descripcion`, `estado`, `created_at`, `updated_at`) VALUES
	(1, 'fiat', 'uno', 4, 200.00, 3, 'ferrari', '4', 0, '2022-01-28 09:45:54', '2022-02-10 00:21:00'),
	(2, 'fiat', 'uno', 4, 200.00, 3, 'ferrari', 'es rapido', 1, '2022-01-28 13:15:28', '2022-01-28 13:24:25'),
	(3, 'fiat', 'uno', 4, 200.00, 3, 'ferrari', 'es rapido', 1, '2022-01-28 13:53:47', '2022-01-28 13:53:47'),
	(4, 'perez', '20021', 11, 210.23, 12, 'blanca', '11', 0, '2022-02-10 00:33:29', '2022-02-16 13:49:55');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.roles: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(2, 'admin', 'web', '2022-01-25 00:27:11', '2022-01-25 00:27:11'),
	(3, 'vendedor', 'web', '2022-02-13 23:31:21', '2022-02-13 23:31:21');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.role_has_permissions: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;

-- Volcando datos para la tabla api_maquillaje.users: ~12 rows (aproximadamente)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `apellido`, `cargo`, `email`, `email_verified_at`, `password`, `remember_token`, `estado`, `created_at`, `updated_at`) VALUES
	(4, 'PEPE', 'sanchez', 'vendedor', 'alejosb16@gmail.com', NULL, '$2y$10$.mU3bdHHOSKWSwA88D2IHebkZx4MLi.0vhLiuO3HiGlx6PC/VLeGG', NULL, 1, '2022-01-25 00:29:44', '2022-02-15 01:20:55'),
	(5, 'PEPE', 'sanchez', 'vendedor', 'alejosb1333@gmail.com', NULL, '$2y$10$EjyBwIUoo5AvTL6sR0oYSOlsv.tTULcmFmX8rBYHejE80qrNuqaHa', NULL, 1, '2022-01-26 22:48:28', '2022-01-26 22:48:28'),
	(6, 'carlos', 'parra', 'vendedor', 'alejosb13344@gmail.com', NULL, '$2y$10$EjyBwIUoo5AvTL6sR0oYSOlsv.tTULcmFmX8rBYHejE80qrNuqaHa', NULL, 0, '2022-01-26 22:48:28', '2022-02-13 20:05:25'),
	(7, 'PEPE', 'sanchez', 'vendedor', 'alejosb13333@gmail.com', NULL, '$2y$10$04sYnfcyObDx32gOTH4VnOAS0uYFLjZO0LOtgHMKvhw80SSC6trKS', NULL, 1, '2022-02-13 22:01:26', '2022-02-13 22:01:26'),
	(8, 'Ricardo', 'Panza', 'Tester', 'panza2@gmail.com', NULL, '$2y$10$GTd3JK8f./1jJdLap8SvTOoEtlpll93X2e5q.WhoAidplV3nEVdvS', NULL, 1, '2022-02-15 01:29:01', '2022-02-15 02:10:20'),
	(9, 'Alejandro Javier', 'Sanchez', 'Programador', 'alejosb13@gmail.com', NULL, '$2y$10$ibOemSnIlehLaD4ye2V1Y.1HeZTBufN.TD4g0UJqMgJ/QpOq/kHM.', NULL, 1, '2022-02-15 02:11:21', '2022-02-15 02:11:21'),
	(10, 'PEPE', 'sanchez', 'vendedor', 'alejosb133333@gmail.com', NULL, '$2y$10$TOqhQ2fwC6npP/FwmRXOLeOFmk8qhuJOsRsDct2MStUVPwugLjldm', NULL, 1, '2022-02-15 02:12:39', '2022-02-15 02:12:39'),
	(11, 'PEPE1', 'sanchez', 'vendedor', 'alej3@gmail.com', NULL, '$2y$10$8ytCbbStEJrR0vo3lE556eXmyFUUyO8KQ8RpJ5iVUBjCHeQRrNRnG', NULL, 1, '2022-02-15 02:12:58', '2022-02-15 02:12:58'),
	(12, 'PEPE1', 'sanchez', 'vendedor', 'alej33@gmail.com', NULL, '$2y$10$qY1gik8ztSDmZh.DufxLt.03PhCWSQBmFHaFQ2XpSeRdO9taqOUd6', NULL, 1, '2022-02-15 02:14:52', '2022-02-15 02:14:52'),
	(13, 'PEPE1', 'sanchez', 'vendedor', 'alej333@gmail.com', NULL, '$2y$10$06cIWTNpSkNOjO.J5u8/OeqKx5E6LqlDp9/eT1NARnWW7XyrsBaqK', NULL, 1, '2022-02-15 02:15:24', '2022-02-15 02:15:24'),
	(14, 'PEPE1', 'sanchez', 'vendedor', 'alej3333@gmail.com', NULL, '$2y$10$bniJd3IbMPGLfCH3NpiGD.rDdkO8aWchYsJqkFzvDczzIt64QHW52', NULL, 1, '2022-02-15 02:16:23', '2022-02-15 02:16:23'),
	(15, 'PEPE1', 'sanchez', 'vendedor', 'alej33333@gmail.com', NULL, '$2y$10$WXcyo0hGJXxikqVe.WV1hePVto8eE9eDG7fh2o/8r7PkU6FBtwiCu', NULL, 1, '2022-02-15 02:16:31', '2022-02-15 02:16:31'),
	(16, 'tes2', 'tes2', 'Test', 'test2@gmail.com', NULL, '$2y$10$DOhpBD3Sxia3s1HZypcOBOsGtD7ACwbl6yHunEbvj3j/gJzsXwmKm', NULL, 1, '2022-02-15 02:18:16', '2022-02-15 02:18:16'),
	(17, 'Alejandro Sanhce', 'asfasfsa', 'TEST', 'afsasf@gmail.com', NULL, '$2y$10$EH19BjS4qEgD.0dXdpU5kOkQxSKQGiBxCCGmoXuDOmwRuKAM9itIi', NULL, 1, '2022-02-15 02:20:28', '2022-02-15 02:20:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
