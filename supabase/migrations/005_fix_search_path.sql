-- Migration 005: Fix mutable search_path on security definer functions
-- Resolves Supabase Security Advisor warnings:
--   "Function Search Path Mutable" on handle_new_user, update_streak, handle_session_xp
-- Apply in Supabase dashboard SQL editor: https://rdyeimdlnueqolptkpqx.supabase.co

-- ── handle_new_user ───────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- ── update_streak ─────────────────────────────────────────────
create or replace function public.update_streak(p_user_id uuid)
returns void language plpgsql security definer
set search_path = '' as $$
declare
  v_last_activity date;
  v_current_streak smallint;
begin
  select streak_last_activity, streak_current
  into v_last_activity, v_current_streak
  from public.profiles where id = p_user_id;

  if v_last_activity = current_date then
    return;
  elsif v_last_activity = current_date - 1 then
    update public.profiles set
      streak_current = streak_current + 1,
      streak_longest = greatest(streak_longest, streak_current + 1),
      streak_last_activity = current_date
    where id = p_user_id;
  else
    update public.profiles set
      streak_current = 1,
      streak_last_activity = current_date
    where id = p_user_id;
  end if;
end;
$$;

-- ── handle_session_xp ─────────────────────────────────────────
create or replace function public.handle_session_xp()
returns trigger language plpgsql security definer
set search_path = '' as $$
declare
  v_xp smallint := 10;
  v_session_count integer;
begin
  if new.session_type = 'past_paper' then v_xp := 25;
  elsif new.session_type = 'sba_task' then v_xp := 15;
  end if;

  update public.profiles set xp_total = xp_total + v_xp where id = new.user_id;
  perform public.update_streak(new.user_id);
  update public.study_sessions set xp_earned = v_xp where id = new.id;

  select count(*) into v_session_count from public.study_sessions where user_id = new.user_id;
  if v_session_count = 1 then
    insert into public.achievements (user_id, achievement_type, xp_awarded)
    values (new.user_id, 'first_session', 50)
    on conflict (user_id, achievement_type) do nothing;
  end if;

  return new;
end;
$$;
