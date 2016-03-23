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
    id            SERIAL PRIMARY KEY,
    pheromon_id   integer DEFAULT NULL,
    osm_id        text DEFAULT NULL,
    name          text DEFAULT NULL,
    type          text DEFAULT NULL, -- is it a center, a container, an association, a shop ...?
    operator      text DEFAULT NULL, -- who runs the place
    website       text DEFAULT NULL, -- the operator website
    source        text DEFAULT NULL, -- the source or reference of the data
    source_url    text DEFAULT NULL, -- the url of the source
    opening_hours text DEFAULT NULL,
    phone         text DEFAULT NULL,
    address_1     text DEFAULT NULL,
    address_2     text DEFAULT NULL,
    public_access boolean DEFAULT NULL,
    pro_access    boolean DEFAULT NULL,
    bins          json[],
    lat           real NOT NULL,
    lon           real NOT NULL,
    geom geometry
) INHERITS(lifecycle);

DROP TRIGGER IF EXISTS updated_at_places on places;
CREATE TRIGGER updated_at_places BEFORE UPDATE ON places FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


CREATE TABLE IF NOT EXISTS osmplaces (
    id            SERIAL PRIMARY KEY,
    pheromon_id   integer DEFAULT NULL,
    osm_id        text DEFAULT NULL,
    name          text DEFAULT NULL,
    type          text DEFAULT NULL, -- is it a center, a container, an association, a shop ...?
    operator      text DEFAULT NULL, -- who runs the place
    website       text DEFAULT NULL, -- the operator website
    source        text DEFAULT NULL, -- the source or reference of the data
    source_url    text DEFAULT NULL, -- the url of the source
    opening_hours text DEFAULT NULL,
    phone         text DEFAULT NULL,
    address_1     text DEFAULT NULL,
    address_2     text DEFAULT NULL,
    public_access boolean DEFAULT NULL,
    pro_access    boolean DEFAULT NULL,
    bins          json[],
    lat           real NOT NULL,
    lon           real NOT NULL,
    geom geometry
) INHERITS(lifecycle);

DROP TRIGGER IF EXISTS updated_at_osmplaces on osmplaces;
CREATE TRIGGER updated_at_osmPlaces BEFORE UPDATE ON osmplaces FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();



-- INDEXES
DROP INDEX IF EXISTS place_geo_index;
CREATE INDEX place_geo_index ON places USING GIST (geom);

DROP INDEX IF EXISTS osmPlace_geo_index;
CREATE INDEX osmPlace_geo_index ON osmPlaces USING GIST (geom)


