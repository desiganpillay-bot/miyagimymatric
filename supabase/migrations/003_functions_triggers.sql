-- ============================================================
-- DB FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update study streak when a session is logged
create or replace function public.update_streak(p_user_id uuid)
returns void language plpgsql security definer as $$
declare
  v_last_activity date;
  v_current_streak smallint;
begin
  select streak_last_activity, streak_current
  into v_last_activity, v_current_streak
  from public.profiles where id = p_user_id;

  if v_last_activity = current_date then
    return; -- already updated today
  elsif v_last_activity = current_date - 1 then
    -- consecutive day — extend streak
    update public.profiles set
      streak_current = streak_current + 1,
      streak_longest = greatest(streak_longest, streak_current + 1),
      streak_last_activity = current_date
    where id = p_user_id;
  else
    -- streak broken — reset to 1
    update public.profiles set
      streak_current = 1,
      streak_last_activity = current_date
    where id = p_user_id;
  end if;
end;
$$;

-- Award XP and check achievements after a study session is inserted
create or replace function public.handle_session_xp()
returns trigger language plpgsql security definer as $$
declare
  v_xp smallint := 10;
  v_session_count integer;
begin
  -- Base XP by session type
  if new.session_type = 'past_paper' then v_xp := 25;
  elsif new.session_type = 'sba_task' then v_xp := 15;
  end if;

  -- Update XP total and streak
  update public.profiles set xp_total = xp_total + v_xp where id = new.user_id;
  perform public.update_streak(new.user_id);

  -- Update session with XP earned
  update public.study_sessions set xp_earned = v_xp where id = new.id;

  -- First session achievement
  select count(*) into v_session_count from public.study_sessions where user_id = new.user_id;
  if v_session_count = 1 then
    insert into public.achievements (user_id, achievement_type, xp_awarded)
    values (new.user_id, 'first_session', 50)
    on conflict (user_id, achievement_type) do nothing;
  end if;

  return new;
end;
$$;

create trigger on_study_session_created
  after insert on public.study_sessions
  for each row execute function public.handle_session_xp();
