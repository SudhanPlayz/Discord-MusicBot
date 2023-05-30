CREATE KEYSPACE IF NOT EXISTS test WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;
CREATE TABLE IF NOT EXISTS test.test (
		id int PRIMARY KEY,
		name text
);
SELECT * FROM test.test;
