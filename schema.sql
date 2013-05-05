drop table if exists sites;
create table sites (
	id integer primary key autoincrement,
	name string not null,
	lat real not null,
	long real not null
);
