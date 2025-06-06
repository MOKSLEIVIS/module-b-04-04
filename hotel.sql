PGDMP                      }           hotel    16.4    16.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17664    hotel    DATABASE        CREATE DATABASE hotel WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Lithuanian_Lithuania.1257';
    DROP DATABASE hotel;
                postgres    false            �            1259    17675    reservations    TABLE     |  CREATE TABLE public.reservations (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    zip text NOT NULL,
    country text NOT NULL,
    checkin text NOT NULL,
    checkout text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    room_id integer NOT NULL,
    room_number integer NOT NULL
);
     DROP TABLE public.reservations;
       public         heap    postgres    false            �            1259    17674    reservations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.reservations_id_seq;
       public          postgres    false    218            �           0    0    reservations_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;
          public          postgres    false    217            �            1259    17666    rooms    TABLE     "  CREATE TABLE public.rooms (
    id integer NOT NULL,
    number integer NOT NULL,
    capacity integer NOT NULL,
    floor integer NOT NULL,
    room_image text NOT NULL,
    price integer NOT NULL,
    wifi boolean NOT NULL,
    parking boolean NOT NULL,
    breakfast boolean NOT NULL
);
    DROP TABLE public.rooms;
       public         heap    postgres    false            �            1259    17665    rooms_id_seq    SEQUENCE     �   CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.rooms_id_seq;
       public          postgres    false    216            �           0    0    rooms_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;
          public          postgres    false    215                        2604    17678    reservations id    DEFAULT     r   ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);
 >   ALTER TABLE public.reservations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218                       2604    17669    rooms id    DEFAULT     d   ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);
 7   ALTER TABLE public.rooms ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            �          0    17675    reservations 
   TABLE DATA           �   COPY public.reservations (id, code, name, address, city, zip, country, checkin, checkout, created_at, room_id, room_number) FROM stdin;
    public          postgres    false    218   �       �          0    17666    rooms 
   TABLE DATA           i   COPY public.rooms (id, number, capacity, floor, room_image, price, wifi, parking, breakfast) FROM stdin;
    public          postgres    false    216          �           0    0    reservations_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.reservations_id_seq', 8, true);
          public          postgres    false    217            �           0    0    rooms_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.rooms_id_seq', 20, true);
          public          postgres    false    215            $           2606    17682    reservations reservations_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_pkey;
       public            postgres    false    218            "           2606    17673    rooms rooms_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.rooms DROP CONSTRAINT rooms_pkey;
       public            postgres    false    216            �      x������ � �      �   �  x����n�0�y�0�e����=R��<�	`��%o��H����V�X�;���0�R�`5���I���b-[����H�<(�ө]SM�e���NN��Ր7j4v�/�ץ��X�σFE��8b���O�N�5�'�rJhA�������YFEy����k�ٷ�����������<�+/o�o��tǒ���#ۅp���S�p pX��(��a;@��1��5�"��ZY����d��q���=N���HX�3*V�F<� X�#�� -˲)��U�X��6*g��RG�*GFk;�_���*nl����a��j�P��X����V)8k�٣d��9}/�A~I��$��Ŀ^�g0]��E���HFJ/���B�4L�;$������@��F$!��qEo3��"     