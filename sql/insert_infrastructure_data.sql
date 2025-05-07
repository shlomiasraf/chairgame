USE room_manager;

INSERT INTO infrastructure (
    supports_tablet,
    supports_phone_red,
    supports_phone_blue,
    supports_pc_red,
    supports_pc_blue
) VALUES
(TRUE, FALSE, TRUE, TRUE, FALSE),       -- 1
(TRUE, TRUE, FALSE, TRUE, FALSE),      -- 2
(FALSE, FALSE, TRUE, FALSE, TRUE),     -- 3
(TRUE, FALSE, TRUE, FALSE, TRUE),      -- 4
(FALSE, FALSE, TRUE, TRUE, FALSE),      -- 5
(TRUE, FALSE, TRUE, FALSE, TRUE),      -- 6
(TRUE, TRUE, TRUE, FALSE, TRUE),        -- 7
(FALSE, FALSE, TRUE, TRUE, FALSE),      -- 8
(TRUE, FALSE, TRUE, FALSE, TRUE),       -- 9
(TRUE, TRUE, FALSE, TRUE, TRUE),        -- 10
(FALSE, TRUE, FALSE, TRUE, TRUE),       -- 11
(TRUE, TRUE, TRUE, TRUE, TRUE),         -- 12
(FALSE, FALSE, TRUE, TRUE, TRUE),      -- 13
(TRUE, FALSE, TRUE, TRUE, FALSE),       -- 14
(FALSE, TRUE, TRUE, FALSE, TRUE),       -- 15
(TRUE, TRUE, FALSE, FALSE, TRUE),      -- 16
(TRUE, TRUE, TRUE, FALSE, TRUE),        -- 17
(FALSE, FALSE, TRUE, FALSE, FALSE),     -- 18
(TRUE, TRUE, FALSE, TRUE, TRUE),        -- 19
(TRUE, FALSE, TRUE, TRUE, FALSE),       -- 20
(FALSE, TRUE, FALSE, TRUE, TRUE),       -- 21
(TRUE, TRUE, TRUE, TRUE, FALSE),       -- 22
(FALSE, TRUE, TRUE, FALSE, TRUE),       -- 23
(TRUE, TRUE, FALSE, TRUE, FALSE),      -- 24
(TRUE, TRUE, FALSE, TRUE, TRUE),        -- 25
(FALSE, FALSE, TRUE, TRUE, TRUE),       -- 26
(TRUE, FALSE, TRUE, FALSE, TRUE),      -- 27
(TRUE, TRUE, TRUE, FALSE, TRUE);        -- 28