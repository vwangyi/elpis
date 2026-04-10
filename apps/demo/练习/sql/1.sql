CREATE TABLE user(
    -- 字段 类型
    name VARCHAR(20),
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
);

-- 查
SELECT * FROM user;
-- SELECT * FROM user WHERE name = 'zhangsan';

-- 增
-- INSERT INTO user (字段名1, 字段名2) VALUES (值1, 值2);
-- INSERT INTO user (name) VALUES ('lisi');
INSERT INTO user (name) VALUES ('zhangsan');

-- 删
DELETE FROM user WHERE id = 1;

-- 改
-- UPDATE user SET 字段名1 = 值1, 字段名2 = 值2, 字段名3 = 值3 WHERE id = 1;
UPDATE user SET name = 'wangmazi' WHERE id = 2;

--
ALTER TABLE user ADD locked INT NULL;
