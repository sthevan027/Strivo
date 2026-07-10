-- ============================================================
-- STRIVO — Setup completo do banco no Supabase
-- Execute no SQL Editor: https://supabase.com/dashboard/project/cdjoeytslknugtvamylc/sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. TIPOS ENUM
-- ------------------------------------------------------------

create type if not exists public.media_kind   as enum ('photo', 'video');
create type if not exists public.media_status as enum ('pending', 'ready', 'failed');

-- do $$
-- begin
--     create type public.media_kind as enum ('photo', 'video');
--   exception
--     when duplicate_object then null;
-- end $$

-- do $$
-- begin
--     create type public.media_status as enum ('pending', 'ready', 'failed');
--   exception
--     when duplicate_object then null;
-- end $$


-- ------------------------------------------------------------
-- 2. TABELAS
-- ------------------------------------------------------------

-- Perfil do usuário (complementa auth.users)
create table if not exists public.user_profile (
  id         uuid        primary key references auth.users(id) on delete cascade,
  name       text        not null,
  username   text        unique,
  bio        varchar(500),
  avatar     varchar(255),
  phone      varchar(20),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts
create table if not exists public.posts (
  id         bigint      generated always as identity primary key,
  author_id  uuid        not null references public.user_profile(id) on delete cascade,
  caption    text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists posts_author_created_idx on public.posts(author_id, created_at desc);

-- Mídia (fotos e vídeos armazenados no Storage)
create table if not exists public.media (
  id         bigint        generated always as identity primary key,
  owner_id   uuid          not null references public.user_profile(id) on delete cascade,
  bucket     text          not null,
  path       text          not null,
  kind       media_kind    not null,
  mime_type  text          not null,
  size       int           not null,
  status     media_status  default 'pending',
  created_at timestamptz   default now(),
  unique(bucket, path)
);

-- Relacionamento post ↔ mídia
create table if not exists public.post_media (
  post_id    bigint references public.posts(id)  on delete cascade,
  media_id   bigint references public.media(id)  on delete cascade,
  "order"    int default 0,
  primary key (post_id, media_id)
);

-- Follows
create table if not exists public.follows (
  follower_id  uuid references public.user_profile(id) on delete cascade,
  following_id uuid references public.user_profile(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id)
);
create index if not exists follows_following_idx on public.follows(following_id);


-- ------------------------------------------------------------
-- 3. TRIGGER — cria user_profile automaticamente no signup
-- ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profile (id, name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Usuário'),
    new.raw_user_meta_data->>'username'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------

alter table public.user_profile enable row level security;
alter table public.posts        enable row level security;
alter table public.media        enable row level security;
alter table public.post_media   enable row level security;
alter table public.follows      enable row level security;

-- user_profile
drop policy if exists "read all profiles"  on public.user_profile;
drop policy if exists "update own profile" on public.user_profile;
drop policy if exists "insert own profile" on public.user_profile;

create policy "read all profiles"
  on public.user_profile for select using (true);

create policy "insert own profile"
  on public.user_profile for insert with check (auth.uid() = id);

create policy "update own profile"
  on public.user_profile for update using (auth.uid() = id);

-- posts
drop policy if exists "read all posts"  on public.posts;
drop policy if exists "insert own post" on public.posts;
drop policy if exists "delete own post" on public.posts;

create policy "read all posts"
  on public.posts for select using (true);

create policy "insert own post"
  on public.posts for insert with check (auth.uid() = author_id);

create policy "delete own post"
  on public.posts for delete using (auth.uid() = author_id);

-- media
drop policy if exists "read media"        on public.media;
drop policy if exists "insert own media"  on public.media;
drop policy if exists "update own media"  on public.media;

create policy "read media"
  on public.media for select using (true);

create policy "insert own media"
  on public.media for insert with check (auth.uid() = owner_id);

create policy "update own media"
  on public.media for update using (auth.uid() = owner_id);

-- post_media
drop policy if exists "read post_media"   on public.post_media;
drop policy if exists "insert post_media" on public.post_media;

create policy "read post_media"
  on public.post_media for select using (true);

create policy "insert post_media"
  on public.post_media for insert with check (
    exists (
      select 1 from public.posts
      where id = post_id and author_id = auth.uid()
    )
  );

-- follows
drop policy if exists "read follows"  on public.follows;
drop policy if exists "follow"        on public.follows;
drop policy if exists "unfollow"      on public.follows;

create policy "read follows"
  on public.follows for select using (true);

create policy "follow"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "unfollow"
  on public.follows for delete using (auth.uid() = follower_id);


-- ------------------------------------------------------------
-- 5. FUNÇÕES RPC
-- ------------------------------------------------------------

-- Feed com cursor pagination (cursor = created_at + id)
create or replace function public.get_feed(
  p_limit      int,
  p_cursor_at  timestamptz default null,
  p_cursor_id  bigint      default null
)
returns table (
  id         bigint,
  author_id  uuid,
  caption    text,
  created_at timestamptz,
  author     json,
  media      json
)
language sql stable
as $$
  select
    p.id,
    p.author_id,
    p.caption,
    p.created_at,
    json_build_object(
      'id',     up.id,
      'name',   up.name,
      'avatar', up.avatar
    ) as author,
    coalesce((
      select json_agg(
        json_build_object(
          'id',        m.id,
          'path',      m.path,
          'kind',      m.kind,
          'mime_type', m.mime_type
        )
        order by pm."order"
      )
      from public.post_media pm
      join public.media m on m.id = pm.media_id
      where pm.post_id = p.id
    ), '[]'::json) as media
  from public.posts p
  join public.user_profile up on up.id = p.author_id
  where
    p_cursor_at is null
    or (p.created_at < p_cursor_at)
    or (p.created_at = p_cursor_at and p.id < p_cursor_id)
  order by p.created_at desc, p.id desc
  limit p_limit + 1;
$$;


-- Ranking (mais seguidos / mais posts)
create or replace function public.get_ranking(p_limit int)
returns table (
  id             uuid,
  name           text,
  username       text,
  avatar         text,
  post_count     bigint,
  follower_count bigint
)
language sql stable
as $$
  select
    up.id,
    up.name,
    up.username,
    up.avatar,
    count(distinct p.id)          as post_count,
    count(distinct f.follower_id) as follower_count
  from public.user_profile up
  left join public.posts   p on p.author_id    = up.id
  left join public.follows f on f.following_id = up.id
  group by up.id
  order by post_count desc, follower_count desc
  limit p_limit;
$$;


-- Busca de usuários
create or replace function public.search_users(
  q               text,
  current_user_id uuid
)
returns table (
  id           uuid,
  name         text,
  username     text,
  avatar       text,
  is_following bool
)
language sql stable
as $$
  select
    up.id,
    up.name,
    up.username,
    up.avatar,
    exists(
      select 1 from public.follows
      where follower_id = current_user_id
        and following_id = up.id
    ) as is_following
  from public.user_profile up
  where up.id <> current_user_id
    and (
      up.name     ilike '%' || q || '%'
      or up.username ilike '%' || q || '%'
    )
  limit 20;
$$;


-- ------------------------------------------------------------
-- 6. STORAGE — bucket "posts"
-- (Execute manualmente no dashboard ou via API se preferir)
-- ------------------------------------------------------------
-- No Supabase Dashboard → Storage → New bucket:
--   Name: posts
--   Public: false (acesso via signed URLs)
--
-- Policies necessárias no bucket "posts":
--   • SELECT  → autenticados podem ler    (using: true)
--   • INSERT  → dono pode fazer upload    (using: auth.uid()::text = (storage.foldername(name))[2])
--   • DELETE  → dono pode deletar
-- ------------------------------------------------------------
