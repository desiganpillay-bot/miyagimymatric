-- ============================================================
-- ROW LEVEL SECURITY — all tables locked to auth.uid() = user_id
-- ============================================================

-- PROFILES
alter table public.profiles enable row level security;
create policy "Own profile only" on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- LEARNER SUBJECTS
alter table public.learner_subjects enable row level security;
create policy "Own subjects only" on public.learner_subjects for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SUBJECT MARKS
alter table public.subject_marks enable row level security;
create policy "Own marks only" on public.subject_marks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- GOALS
alter table public.goals enable row level security;
create policy "Own goals only" on public.goals for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TIMETABLE TEMPLATES
alter table public.timetable_templates enable row level security;
create policy "Own templates only" on public.timetable_templates for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TIMETABLE SLOTS
alter table public.timetable_slots enable row level security;
create policy "Own slots only" on public.timetable_slots for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- STUDY SESSIONS
alter table public.study_sessions enable row level security;
create policy "Own sessions only" on public.study_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SBA TASKS
alter table public.sba_tasks enable row level security;
create policy "Own SBA tasks only" on public.sba_tasks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- REPORT UPLOADS
alter table public.report_uploads enable row level security;
create policy "Own reports only" on public.report_uploads for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ACHIEVEMENTS
alter table public.achievements enable row level security;
create policy "Own achievements only" on public.achievements for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ASSESSMENT SNAPSHOTS
alter table public.assessment_snapshots enable row level security;
create policy "Own snapshots only" on public.assessment_snapshots for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- STORAGE BUCKET POLICIES (run after creating bucket named 'report-uploads')
-- create policy "Upload own reports" on storage.objects for insert to authenticated
--   with check (bucket_id = 'report-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
-- create policy "View own reports only" on storage.objects for select to authenticated
--   using (bucket_id = 'report-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
