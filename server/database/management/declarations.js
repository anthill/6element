var sql = require('sql');


exports.geography_columns = sql.define({
	name: 'geography_columns',
	columns: [
		{ name: 'f_table_catalog' },
		{ name: 'f_table_schema' },
		{ name: 'f_table_name' },
		{ name: 'f_geography_column' },
		{ name: 'coord_dimension' },
		{ name: 'srid' },
		{ name: 'type' }
	]
});


exports.geometry_columns = sql.define({
	name: 'geometry_columns',
	columns: [
		{ name: 'f_table_catalog' },
		{ name: 'f_table_schema' },
		{ name: 'f_table_name' },
		{ name: 'f_geometry_column' },
		{ name: 'coord_dimension' },
		{ name: 'srid' },
		{ name: 'type' }
	]
});


exports.lifecycle = sql.define({
	name: 'lifecycle',
	columns: [
		{ name: 'created_at' },
		{ name: 'updated_at' }
	]
});


exports.osmplaces = sql.define({
	name: 'osmplaces',
	columns: [
		{ name: 'created_at' },
		{ name: 'updated_at' },
		{ name: 'id' },
		{ name: 'pheromon_id' },
		{ name: 'osm_id' },
		{ name: 'name' },
		{ name: 'type' },
		{ name: 'operator' },
		{ name: 'website' },
		{ name: 'source' },
		{ name: 'source_url' },
		{ name: 'opening_hours' },
		{ name: 'phone' },
		{ name: 'address_1' },
		{ name: 'address_2' },
		{ name: 'public_access' },
		{ name: 'pro_access' },
		{ name: 'bins' },
		{ name: 'lat' },
		{ name: 'lon' },
		{ name: 'geom' }
	]
});


exports.places = sql.define({
	name: 'places',
	columns: [
		{ name: 'created_at' },
		{ name: 'updated_at' },
		{ name: 'id' },
		{ name: 'name' },
		{ name: 'type' },
		{ name: 'pheromon_id' },
		{ name: 'opening_hours' },
		{ name: 'phone' },
		{ name: 'website' },
		{ name: 'bins' },
		{ name: 'address_1' },
		{ name: 'address_2' },
		{ name: 'operator' },
		{ name: 'public_access' },
		{ name: 'pro_access' },
		{ name: 'lat' },
		{ name: 'lon' },
		{ name: 'geom' },
		{ name: 'source' },
		{ name: 'source_url' },
		{ name: 'osm_id' }
	]
});


exports.raster_columns = sql.define({
	name: 'raster_columns',
	columns: [
		{ name: 'r_table_catalog' },
		{ name: 'r_table_schema' },
		{ name: 'r_table_name' },
		{ name: 'r_raster_column' },
		{ name: 'srid' },
		{ name: 'scale_x' },
		{ name: 'scale_y' },
		{ name: 'blocksize_x' },
		{ name: 'blocksize_y' },
		{ name: 'same_alignment' },
		{ name: 'regular_blocking' },
		{ name: 'num_bands' },
		{ name: 'pixel_types' },
		{ name: 'nodata_values' },
		{ name: 'out_db' },
		{ name: 'extent' },
		{ name: 'spatial_index' }
	]
});


exports.raster_overviews = sql.define({
	name: 'raster_overviews',
	columns: [
		{ name: 'o_table_catalog' },
		{ name: 'o_table_schema' },
		{ name: 'o_table_name' },
		{ name: 'o_raster_column' },
		{ name: 'r_table_catalog' },
		{ name: 'r_table_schema' },
		{ name: 'r_table_name' },
		{ name: 'r_raster_column' },
		{ name: 'overview_factor' }
	]
});


exports.spatial_ref_sys = sql.define({
	name: 'spatial_ref_sys',
	columns: [
		{ name: 'srid' },
		{ name: 'auth_name' },
		{ name: 'auth_srid' },
		{ name: 'srtext' },
		{ name: 'proj4text' }
	]
});


