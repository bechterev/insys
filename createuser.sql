CREATE TABLE public.users (
    id int PRIMARY KEY,
    fio VARCHAR(255),
    gender BOOLEAN,
    birthday DATE NOT NULL
);