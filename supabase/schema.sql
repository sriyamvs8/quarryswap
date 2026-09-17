create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  contact_name text not null
);

create table if not exists machines (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id),
  manufacturer text not null,
  model text not null,
  machine_type text not null
);

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id),
  part_family text not null check (part_family in ('HYDRAULIC_HOSE','BEARING')),
  part_name text not null,
  part_number text not null,
  condition text not null,
  availability text not null default 'AVAILABLE',
  specifications jsonb not null default '{}'::jsonb,
  notes text default '',
  created_at timestamptz default now()
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id),
  machine_id uuid references machines(id),
  part_family text not null check (part_family in ('HYDRAULIC_HOSE','BEARING')),
  required_specifications jsonb not null default '{}'::jsonb,
  urgency text not null,
  description text not null,
  status text not null default 'OPEN',
  created_at timestamptz default now()
);

create table if not exists loans (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  inventory_id uuid references inventory(id),
  from_site_id uuid references sites(id),
  to_site_id uuid references sites(id),
  transaction_type text not null,
  return_date date,
  deposit numeric default 0,
  replacement_guarantee boolean default false,
  status text not null default 'REQUESTED',
  notes text default '',
  created_at timestamptz default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  message text not null,
  request_id uuid references requests(id),
  loan_id uuid references loans(id),
  created_at timestamptz default now()
);

alter table sites enable row level security;
alter table machines enable row level security;
alter table inventory enable row level security;
alter table requests enable row level security;
alter table loans enable row level security;
alter table activities enable row level security;

create policy "demo read sites" on sites for select using (true);
create policy "demo read machines" on machines for select using (true);
create policy "demo read inventory" on inventory for select using (true);
create policy "demo read requests" on requests for select using (true);
create policy "demo read loans" on loans for select using (true);
create policy "demo read activities" on activities for select using (true);

-- For a real deployment, replace open read policies with authenticated site-scoped policies.
