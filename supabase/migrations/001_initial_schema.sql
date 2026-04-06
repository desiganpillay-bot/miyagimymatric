-- ============================================================
-- MIYAGI MY MATRIC — Initial Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- PROFILES
create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  display_name      text,
  grade             smallint check (grade in (10, 11, 12)),
  exam_system       text check (exam_system in ('ieb', 'caps', 'unsure')),
  school            text,
  province          text,
  goal_type         text check (goal_type in ('top', 'bachelor', 'diploma', 'pass')),
  onboarding_complete boolean default false,
  streak_current    smallint default 0,
  streak_longest    smallint default 0,
  streak_last_activity date,
  xp_total          integer default 0,
  avatar_seed       text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- LEARNER SUBJECTS
create table public.learner_subjects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  subject_name  text not null,
  subject_code  text,
  is_home_language boolean default false,
  weight_type   text check (weight_type in ('25_75', '40_60', 'lo_internal')),
  created_at    timestamptz default now()
);

-- SUBJECT MARKS (history)
create table public.subject_marks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  subject_id    uuid references public.learner_subjects(id) on delete set null,
  subject_name  text not null,
  mark_type     text not null check (mark_type in ('sba','prelim','mock','final','report','assessment')),
  percentage    numeric(5,2) check (percentage between 0 and 100),
  term          smallint check (term between 1 and 4),
  year          smallint not null,
  notes         text,
  source        text check (source in ('manual','report_upload','assessment')),
  report_id     uuid,
  created_at    timestamptz default now()
);

-- GOALS
create table public.goals (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  field_id            text not null,
  field_label         text not null,
  career_note         text,
  target_universities jsonb,
  target_aps          smallint,
  is_primary          boolean default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- TIMETABLE TEMPLATES
create table public.timetable_templates (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  is_active   boolean default true,
  week_type   text check (week_type in ('regular','exam','prelim','holiday')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- TIMETABLE SLOTS
create table public.timetable_slots (
  id            uuid primary key default gen_random_uuid(),
  template_id   uuid not null references public.timetable_templates(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  day_of_week   smallint check (day_of_week between 0 and 6),
  start_time    time not null,
  end_time      time not null,
  subject_id    uuid references public.learner_subjects(id) on delete set null,
  subject_name  text,
  slot_type     text check (slot_type in ('study','revision','past_paper','sba','break','flex')),
  color         text,
  notes         text,
  created_at    timestamptz default now()
);

-- STUDY SESSIONS
create table public.study_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  subject_id    uuid references public.learner_subjects(id) on delete set null,
  subject_name  text,
  session_type  text check (session_type in ('pomodoro','free','past_paper','revision','sba_task')),
  started_at    timestamptz not null,
  ended_at      timestamptz,
  duration_mins smallint,
  technique     text,
  self_rating   smallint check (self_rating between 1 and 5),
  notes         text,
  xp_earned     smallint default 0,
  created_at    timestamptz default now()
);

-- SBA TASKS
create table public.sba_tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  subject_id    uuid references public.learner_subjects(id) on delete cascade,
  subject_name  text not null,
  task_name     text not null,
  task_type     text check (task_type in ('test','assignment','investigation','practical','oral','project','pat','prelim','other')),
  due_date      date,
  term          smallint check (term between 1 and 4),
  weight_pct    numeric(5,2),
  status        text check (status in ('upcoming','in_progress','submitted','marked')) default 'upcoming',
  mark_obtained numeric(5,2),
  mark_total    numeric(5,2),
  is_critical   boolean default false,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- REPORT UPLOADS
create table public.report_uploads (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  file_name     text not null,
  file_path     text not null,
  file_size_kb  integer,
  mime_type     text,
  report_year   smallint,
  report_term   smallint,
  parse_status  text check (parse_status in ('pending','processing','complete','failed','needs_review')) default 'pending',
  parse_result  jsonb,
  parse_error   text,
  parsed_marks  jsonb,
  uploaded_at   timestamptz default now(),
  parsed_at     timestamptz
);

-- Add FK from subject_marks to report_uploads
alter table public.subject_marks
  add constraint fk_report foreign key (report_id)
  references public.report_uploads(id) on delete set null;

-- ACHIEVEMENTS
create table public.achievements (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  achievement_type  text not null,
  earned_at         timestamptz default now(),
  xp_awarded        smallint default 0,
  unique (user_id, achievement_type)
);

-- ASSESSMENT SNAPSHOTS
create table public.assessment_snapshots (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  snapshot_data jsonb not null,
  aps_total     smallint,
  version       smallint default 1,
  created_at    timestamptz default now()
);

-- INDEXES
create index idx_subject_marks_user_year   on public.subject_marks(user_id, year);
create index idx_sba_tasks_due_date        on public.sba_tasks(user_id, due_date);
create index idx_study_sessions_user_date  on public.study_sessions(user_id, started_at);
create index idx_timetable_slots_template  on public.timetable_slots(template_id, day_of_week);
