-- useful things --
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS lifecycle(
    created_at  timestamp without time zone DEFAULT current_timestamp,
    updated_at  timestamp without time zone DEFAULT current_timestamp
);


-- http://www.revsys.com/blog/2006/aug/04/automatically-updating-a-timestamp-column-in-postgresql/
CREATE OR REPLACE FUNCTION update_updated_at_column()	
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;	
END;
$$ language 'plpgsql';



CREATE TABLE IF NOT EXISTS places (
    id           SERIAL PRIMARY KEY,
    name         text NOT NULL,
    type         text DEFAULT NULL,
    dechet_non_dangereux boolean DEFAULT NULL,
    opening_hours text DEFAULT NULL,
    phone text DEFAULT NULL,
    website text DEFAULT NULL,
    objects hstore,
    address_1 text DEFAULT NULL,
    address_2 text DEFAULT NULL,
    owner text DEFAULT NULL,
    public_access boolean DEFAULT NULL,
    dechet_dangereux boolean DEFAULT NULL,
    dechet_inerte boolean DEFAULT NULL,
    pro_access boolean DEFAULT NULL,
    lat          real NOT NULL,
    lon          real NOT NULL,
    geom geometry
) INHERITS(lifecycle);
CREATE TRIGGER updated_at_places BEFORE UPDATE ON places FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE INDEX place_geo_index ON places USING GIST (geom);