--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bans (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    moderator_id character varying(20) NOT NULL,
    action character varying(10) NOT NULL,
    reason text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    event_id integer
);


ALTER TABLE public.bans OWNER TO postgres;

--
-- Name: bans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bans_id_seq OWNER TO postgres;

--
-- Name: bans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bans_id_seq OWNED BY public.bans.id;


--
-- Name: birthdays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.birthdays (
    guild_id character varying(20) NOT NULL,
    user_id character varying(20) NOT NULL,
    day integer NOT NULL,
    month integer NOT NULL,
    announced boolean DEFAULT false
);


ALTER TABLE public.birthdays OWNER TO postgres;

--
-- Name: config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.config (
    guild_id bigint NOT NULL,
    birthday_channel_id bigint
);


ALTER TABLE public.config OWNER TO postgres;

--
-- Name: kicks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kicks (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    moderator_id character varying(20) NOT NULL,
    reason text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    event_id integer
);


ALTER TABLE public.kicks OWNER TO postgres;

--
-- Name: kicks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kicks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kicks_id_seq OWNER TO postgres;

--
-- Name: kicks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kicks_id_seq OWNED BY public.kicks.id;


--
-- Name: moderation_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moderation_events (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    moderator_id character varying(20) NOT NULL,
    action character varying(20) NOT NULL,
    reason text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    guild_id character varying(20) NOT NULL,
    event_type character varying(20),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.moderation_events OWNER TO postgres;

--
-- Name: moderation_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.moderation_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moderation_events_id_seq OWNER TO postgres;

--
-- Name: moderation_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.moderation_events_id_seq OWNED BY public.moderation_events.id;


--
-- Name: muted_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.muted_roles (
    id integer NOT NULL,
    guild_id character varying(255) NOT NULL,
    muted_role_id character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.muted_roles OWNER TO postgres;

--
-- Name: muted_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.muted_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.muted_roles_id_seq OWNER TO postgres;

--
-- Name: muted_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.muted_roles_id_seq OWNED BY public.muted_roles.id;


--
-- Name: mutes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mutes (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    moderator_id character varying(20) NOT NULL,
    action character varying(10) NOT NULL,
    reason text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    event_id integer,
    "time" integer,
    guild_id character varying(50)
);


ALTER TABLE public.mutes OWNER TO postgres;

--
-- Name: mutes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mutes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mutes_id_seq OWNER TO postgres;

--
-- Name: mutes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mutes_id_seq OWNED BY public.mutes.id;


--
-- Name: warnings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warnings (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    moderator_id character varying(20) NOT NULL,
    reason text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    event_id integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    guild_id character varying(20) NOT NULL
);


ALTER TABLE public.warnings OWNER TO postgres;

--
-- Name: warnings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.warnings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.warnings_id_seq OWNER TO postgres;

--
-- Name: warnings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.warnings_id_seq OWNED BY public.warnings.id;


--
-- Name: bans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bans ALTER COLUMN id SET DEFAULT nextval('public.bans_id_seq'::regclass);


--
-- Name: kicks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kicks ALTER COLUMN id SET DEFAULT nextval('public.kicks_id_seq'::regclass);


--
-- Name: moderation_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_events ALTER COLUMN id SET DEFAULT nextval('public.moderation_events_id_seq'::regclass);


--
-- Name: muted_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muted_roles ALTER COLUMN id SET DEFAULT nextval('public.muted_roles_id_seq'::regclass);


--
-- Name: mutes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mutes ALTER COLUMN id SET DEFAULT nextval('public.mutes_id_seq'::regclass);


--
-- Name: warnings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warnings ALTER COLUMN id SET DEFAULT nextval('public.warnings_id_seq'::regclass);


--
-- Data for Name: bans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bans (id, user_id, moderator_id, action, reason, date, event_id) FROM stdin;
\.


--
-- Data for Name: birthdays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.birthdays (guild_id, user_id, day, month, announced) FROM stdin;
\.


--
-- Data for Name: config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.config (guild_id, birthday_channel_id) FROM stdin;
\.


--
-- Data for Name: kicks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kicks (id, user_id, moderator_id, reason, date, event_id) FROM stdin;
\.


--
-- Data for Name: moderation_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.moderation_events (id, user_id, moderator_id, action, reason, date, guild_id, event_type, "timestamp") FROM stdin;
\.


--
-- Data for Name: muted_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.muted_roles (id, guild_id, muted_role_id, created_at) FROM stdin;
\.


--
-- Data for Name: mutes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mutes (id, user_id, moderator_id, action, reason, date, event_id, "time", guild_id) FROM stdin;
\.


--
-- Data for Name: warnings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warnings (id, user_id, moderator_id, reason, date, event_id, "timestamp", guild_id) FROM stdin;
\.


--
-- Name: bans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bans_id_seq', 1, false);


--
-- Name: kicks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kicks_id_seq', 1, false);


--
-- Name: moderation_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.moderation_events_id_seq', 2, true);


--
-- Name: muted_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.muted_roles_id_seq', 4, true);


--
-- Name: mutes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mutes_id_seq', 1, false);


--
-- Name: warnings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.warnings_id_seq', 4, true);


--
-- Name: bans bans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bans
    ADD CONSTRAINT bans_pkey PRIMARY KEY (id);


--
-- Name: birthdays birthdays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.birthdays
    ADD CONSTRAINT birthdays_pkey PRIMARY KEY (guild_id, user_id);


--
-- Name: config config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.config
    ADD CONSTRAINT config_pkey PRIMARY KEY (guild_id);


--
-- Name: kicks kicks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kicks
    ADD CONSTRAINT kicks_pkey PRIMARY KEY (id);


--
-- Name: moderation_events moderation_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_events
    ADD CONSTRAINT moderation_events_pkey PRIMARY KEY (id);


--
-- Name: muted_roles muted_roles_guild_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muted_roles
    ADD CONSTRAINT muted_roles_guild_id_key UNIQUE (guild_id);


--
-- Name: muted_roles muted_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muted_roles
    ADD CONSTRAINT muted_roles_pkey PRIMARY KEY (id);


--
-- Name: mutes mutes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mutes
    ADD CONSTRAINT mutes_pkey PRIMARY KEY (id);


--
-- Name: warnings warnings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warnings
    ADD CONSTRAINT warnings_pkey PRIMARY KEY (id);


--
-- Name: bans bans_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bans
    ADD CONSTRAINT bans_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.moderation_events(id) ON DELETE CASCADE;


--
-- Name: kicks kicks_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kicks
    ADD CONSTRAINT kicks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.moderation_events(id) ON DELETE CASCADE;


--
-- Name: mutes mutes_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mutes
    ADD CONSTRAINT mutes_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.moderation_events(id) ON DELETE CASCADE;


--
-- Name: warnings warnings_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warnings
    ADD CONSTRAINT warnings_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.moderation_events(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

