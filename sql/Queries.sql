DELIMITER //

CREATE PROCEDURE move_item_between_stations(
    IN source_slot INT,
    IN target_slot INT,
    IN column_name VARCHAR(64)
)
BEGIN
    SET @slot_source := source_slot;
    SET @slot_target := target_slot;

    SET @reset_query = CONCAT(
        'UPDATE stations SET ', column_name, ' = FALSE WHERE slot_number = ?'
    );
    PREPARE stmt1 FROM @reset_query;
    EXECUTE stmt1 USING @slot_source;
    DEALLOCATE PREPARE stmt1;

    SET @update_query = CONCAT(
        'UPDATE stations SET ', column_name, ' = TRUE WHERE slot_number = ?'
    );
    PREPARE stmt2 FROM @update_query;
    EXECUTE stmt2 USING @slot_target;
    DEALLOCATE PREPARE stmt2;

    INSERT INTO action_log (
        action_by,
        equipment_column,
        source_slot,
        target_slot,
        description
    ) VALUES (
        'planner_user',
        column_name,
        source_slot,
        target_slot,
        CONCAT('Moved ', column_name, ' from slot ', source_slot, ' to slot ', target_slot)
    );

    CALL update_all_station_colors();
END;
//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE update_all_station_colors()
BEGIN
    UPDATE stations s
    LEFT JOIN employees e ON s.assigned_employee_id = e.id
    LEFT JOIN requirements r ON e.needs_id = r.id
    LEFT JOIN infrastructure i ON s.infra_id = i.id
    SET s.status_colors = TRIM(BOTH ',' FROM CONCAT_WS(',',

        -- 💪 purple
        IF((
            (r.need_tablet = TRUE AND i.supports_tablet = FALSE) OR
            (r.need_phone_red = TRUE AND i.supports_phone_red = FALSE) OR
            (r.need_phone_blue = TRUE AND i.supports_phone_blue = FALSE) OR
            (r.need_pc_red = TRUE AND i.supports_pc_red = FALSE) OR
            (r.need_pc_blue = TRUE AND i.supports_pc_blue = FALSE)
        ), 'purple', NULL),

        -- 🔴 red
        IF((
            (r.need_tablet = TRUE AND s.has_tablet = FALSE) OR
            (r.need_phone_red = TRUE AND s.has_phone_red = FALSE) OR
            (r.need_phone_blue = TRUE AND s.has_phone_blue = FALSE) OR
            (r.need_pc_red = TRUE AND s.has_pc_red = FALSE) OR
            (r.need_pc_blue = TRUE AND s.has_pc_blue = FALSE)
        ), 'red', NULL),

        -- 🟧 orange
        IF((
            e.id IS NULL OR r.id IS NULL OR
            (s.has_tablet = TRUE AND (r.need_tablet IS NULL OR r.need_tablet = FALSE)) OR
            (s.has_phone_red = TRUE AND (r.need_phone_red IS NULL OR r.need_phone_red = FALSE)) OR
            (s.has_phone_blue = TRUE AND (r.need_phone_blue IS NULL OR r.need_phone_blue = FALSE)) OR
            (s.has_pc_red = TRUE AND (r.need_pc_red IS NULL OR r.need_pc_red = FALSE)) OR
            (s.has_pc_blue = TRUE AND (r.need_pc_blue IS NULL OR r.need_pc_blue = FALSE))
        ), 'orange', NULL),

        -- 🟩 green
        IF((
            r.need_tablet = s.has_tablet AND r.need_tablet <= i.supports_tablet AND
            r.need_phone_red = s.has_phone_red AND r.need_phone_red <= i.supports_phone_red AND
            r.need_phone_blue = s.has_phone_blue AND r.need_phone_blue <= i.supports_phone_blue AND
            r.need_pc_red = s.has_pc_red AND r.need_pc_red <= i.supports_pc_red AND
            r.need_pc_blue = s.has_pc_blue AND r.need_pc_blue <= i.supports_pc_blue
        ), 'green', NULL)

    ));
END //

DELIMITER ;