
INSERT INTO "Users" ("firstName", "lastName", "displayName", "email", password, role, "balance", "rating")
VALUES 
('Daenerys', 'Targaryen', 'Daenerys Targaryen', 'daenerystargaryen@gmail.com', 'password123', 'customer', 50.00, 5.0),
('Bran', 'Stark', 'Bran Stark', 'branstark@gmail.com', 'password456', 'customer', 30.00, 4.0),
('John', 'Snow', 'John Snow', 'johnsnow@gmail.com', 'password789', 'customer', 70.00, 3.8),
('Tyrion', 'Lannister', 'Tyrion Lannister', 'tyrionlannister@gmail.com', 'password101', 'customer', 40.00, 4.2);



CREATE TABLE IF NOT EXISTS "Orders" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE, 
    total_amount NUMERIC(10, 2) NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW() 
);


INSERT INTO "Orders" ("user_id", "total_amount", "created_at")
VALUES
(18, 120.50, '2023-12-26'), 
(18, 250.00, '2024-01-10'), 
(19, 300.00, '2024-12-28'), 
(20, 450.75, '2025-01-05'), 
(21, 600.00, '2023-12-31');


WITH holiday_orders AS (
    SELECT 
        o.user_id, 
        SUM(o.total_amount * 0.10) AS cashback 
    FROM "Orders" o
    JOIN "Users" u ON o.user_id = u.id
    WHERE 
        u.role = 'customer'
        AND o.created_at BETWEEN 
            (DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '2 year') + INTERVAL '11 months 25 days' 
            AND (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '14 days') 
    GROUP BY o.user_id
)
UPDATE "Users" u
SET balance = u.balance + h.cashback 
FROM holiday_orders h
WHERE u.id = h.user_id;

SELECT id, "firstName", "lastName", "balance" 
FROM "Users" 
WHERE role = 'customer';
