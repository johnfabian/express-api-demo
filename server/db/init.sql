CREATE TABLE todos (
  id          INTEGER PRIMARY KEY,
  title       TEXT     NOT NULL,
  status      TEXT     NOT NULL,
  priority    TEXT     NOT NULL,
  due_date    TEXT     NOT NULL,
  tags        TEXT     NOT NULL
);

CREATE INDEX idx_todos_status ON todos(status);

INSERT INTO todos (id, title, status, priority, due_date, tags)
SELECT
    i,
    'Task ' || i,
    (ARRAY['In-Progress', 'Not-Started', 'Completed'])[1 + floor(random() * 3)::int],
    (ARRAY['Low', 'Medium', 'High'])[1 + floor(random() * 3)::int],
    '2024-' || lpad(((i % 12) + 1)::text, 2, '0'),
    (ARRAY['work', 'personal', 'urgent'])[1 + floor(random() * 3)::int]
FROM generate_series(1, 1000) AS i;
