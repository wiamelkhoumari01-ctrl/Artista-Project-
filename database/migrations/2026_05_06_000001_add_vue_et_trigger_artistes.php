<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Exécute la création de la table de log, de la procédure stockée et du trigger.
     */
    public function up(): void
    {
        // ── 1. Table de log des suppressions ──────────────────────────
        DB::statement("
            CREATE TABLE IF NOT EXISTS artistes_suppression_log (
                id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                artist_id       BIGINT UNSIGNED     NOT NULL,
                user_id         BIGINT UNSIGNED     NOT NULL,
                email           VARCHAR(255)        NOT NULL,
                nom_scene_fr    VARCHAR(255)        DEFAULT NULL,
                slug            VARCHAR(255)        NOT NULL,
                views_count     INT                 DEFAULT 0,
                supprime_le     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
                raison          VARCHAR(500)        DEFAULT 'Suppression manuelle'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        // ── 2. Procédure Stockée pour générer la Vue ──────────────────
        // Cette procédure contient la logique de création de la vue
        DB::unprepared("
            CREATE PROCEDURE IF NOT EXISTS view_artist()
            BEGIN
                CREATE OR REPLACE VIEW artistes_stats_vue AS
                SELECT
                    a.id                                    AS artist_id,
                    u.id                                    AS user_id,
                    u.email                                 AS email,
                    u.first_name                            AS prenom,
                    u.last_name                             AS nom,
                    JSON_UNQUOTE(JSON_EXTRACT(a.stage_name, '$.fr')) AS nom_scene_fr,
                    a.city                                  AS ville,
                    a.country                               AS pays,
                    a.views_count                           AS vues_totales,
                    COALESCE(SUM(s.views), 0)               AS vues_30_jours,
                    COUNT(DISTINCT aw.id)                   AS nb_artworks,
                    COUNT(DISTINCT ae.event_id)             AS nb_events,
                    a.created_at                            AS inscrit_le
                FROM artists a
                INNER JOIN users        u  ON u.id  = a.user_id
                LEFT  JOIN artist_stats s  ON s.artist_id = a.id
                                           AND s.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                LEFT  JOIN artworks     aw ON aw.artist_id = a.id
                LEFT  JOIN artist_event ae ON ae.artist_id = a.id
                GROUP BY
                    a.id, u.id, u.email, u.first_name, u.last_name,
                    a.stage_name, a.city, a.country, a.views_count, a.created_at;
            END
        ");

        // On exécute la procédure immédiatement pour créer la vue la première fois
        DB::statement("CALL view_artist()");

        // ── 3. Trigger BEFORE DELETE sur artists ──────────────────────
        DB::unprepared("
            CREATE TRIGGER trg_log_artiste_suppression
            BEFORE DELETE ON artists
            FOR EACH ROW
            BEGIN
                DECLARE v_email     VARCHAR(255) DEFAULT '';
                DECLARE v_nom_scene VARCHAR(255) DEFAULT '';

                SELECT email INTO v_email
                FROM users
                WHERE id = OLD.user_id
                LIMIT 1;

                SET v_nom_scene = JSON_UNQUOTE(
                    COALESCE(JSON_EXTRACT(OLD.stage_name, '$.fr'), '\"Inconnu\"')
                );

                INSERT INTO artistes_suppression_log
                    (artist_id, user_id, email, nom_scene_fr, slug, views_count, supprime_le)
                VALUES
                    (OLD.id, OLD.user_id, v_email, v_nom_scene, OLD.slug, OLD.views_count, NOW());
            END
        ");
    }

    /**
     * Annule les modifications (rollback).
     */
    public function down(): void
    {
        DB::unprepared("DROP TRIGGER IF EXISTS trg_log_artiste_suppression");
        DB::unprepared("DROP PROCEDURE IF EXISTS view_artist");
        DB::statement("DROP VIEW IF EXISTS artistes_stats_vue");
        DB::statement("DROP TABLE IF EXISTS artistes_suppression_log");
    }
};