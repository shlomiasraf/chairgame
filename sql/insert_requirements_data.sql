USE room_manager;

INSERT INTO requirements (
    need_tablet,
    need_phone_red,
    need_phone_blue,
    need_pc_red,
    need_pc_blue
) VALUES 
(TRUE, FALSE, TRUE, TRUE, FALSE),        -- 1
(TRUE, TRUE, FALSE, FALSE, FALSE),       -- 2
(FALSE, FALSE, FALSE, FALSE, TRUE),      -- 3
(TRUE, FALSE, FALSE, FALSE, TRUE),       -- 4
(FALSE, FALSE, TRUE, TRUE, FALSE),       -- 5
(TRUE, FALSE, FALSE, FALSE, TRUE),       -- 6
(TRUE, TRUE, TRUE, FALSE, TRUE),         -- 7
(FALSE, FALSE, TRUE, TRUE, FALSE),       -- 8
(TRUE, FALSE, TRUE, FALSE, TRUE),        -- 9
(TRUE, TRUE, FALSE, TRUE, TRUE),         -- 10
(FALSE, TRUE, FALSE, TRUE, TRUE),        -- 11
(TRUE, TRUE, TRUE, TRUE, TRUE),          -- 12
(FALSE, FALSE, FALSE, TRUE, TRUE),       -- 13
(TRUE, FALSE, TRUE, TRUE, FALSE),        -- 14
(FALSE, TRUE, TRUE, FALSE, TRUE),        -- 15
(TRUE, TRUE, FALSE, FALSE, FALSE),       -- 16
(TRUE, TRUE, TRUE, FALSE, TRUE),         -- 17
(FALSE, FALSE, TRUE, FALSE, FALSE),      -- 18
(TRUE, TRUE, FALSE, TRUE, TRUE),         -- 19
(TRUE, FALSE, TRUE, TRUE, FALSE),        -- 20
(FALSE, TRUE, FALSE, TRUE, TRUE),        -- 21
(TRUE, TRUE, TRUE, FALSE, FALSE),        -- 22
(FALSE, TRUE, TRUE, FALSE, TRUE),        -- 23
(TRUE, FALSE, FALSE, TRUE, FALSE),       -- 24
(TRUE, TRUE, FALSE, TRUE, TRUE),         -- 25
(FALSE, FALSE, TRUE, TRUE, TRUE),        -- 26
(TRUE, FALSE, TRUE, FALSE, FALSE),       -- 27
(TRUE, TRUE, TRUE, FALSE, TRUE);         -- 28