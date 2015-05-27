-- useful things --

CREATE TABLE IF NOT EXISTS lifecycle(
    created_at  timestamp without time zone default current_timestamp,
    updated_at  timestamp without time zone default current_timestamp
);

-- http://www.revsys.com/blog/2006/aug/04/automatically-updating-a-timestamp-column-in-postgresql/
CREATE OR REPLACE FUNCTION update_updated_at_column()	
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;	
END;
$$ language 'plpgsql';


-- Business tables --

CREATE TABLE IF NOT EXISTS recycling_centers (
    id           SERIAL PRIMARY KEY,
    name         text NOT NULL,
    lat          real NOT NULL,
    lon          real NOT NULL
) INHERITS(lifecycle);
CREATE TRIGGER updated_at_recycling_centers BEFORE UPDATE ON recycling_centers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


CREATE TABLE IF NOT EXISTS sensors (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    -- type         some_enum -- affluence/bin-level
    installed_at integer REFERENCES recycling_centers (id)
) INHERITS(lifecycle);
CREATE TRIGGER updated_at_sensors BEFORE UPDATE ON sensors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


CREATE TABLE IF NOT EXISTS affluence_sensor_measurements (
    id           SERIAL PRIMARY KEY,
    sensor_id    integer REFERENCES sensors (id) NOT NULL,
    signal_strengths  integer[] NOT NULL,
    measurement_date  timestamp without time zone NOT NULL
) INHERITS(lifecycle);
CREATE TRIGGER updated_at_sensor_measurements BEFORE UPDATE ON affluence_sensor_measurements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();




-- CREATE INDEX name ON table (column);
-- CREATE TYPE name AS ENUM ('v1', 'v2');

