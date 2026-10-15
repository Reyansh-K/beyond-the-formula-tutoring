-- Publish Krish Anand on Mentors (Meet the tutors).
-- Run in the Supabase SQL Editor.
-- He must be approved, public, and have a slug to appear on /mentors.

-- 1) Preview
select
  id,
  display_name,
  role,
  tutor_status,
  mentor_slug,
  mentor_public,
  left(mentor_bio, 80) as bio_preview
from public.profiles
where display_name ilike '%krish%'
  and display_name ilike '%anand%';

-- 2) Publish (exactly one matching profile)
do $$
declare
  n int;
begin
  select count(*) into n
  from public.profiles
  where display_name ilike '%krish%'
    and display_name ilike '%anand%';

  if n = 0 then
    raise exception 'No profile matched Krish Anand';
  end if;
  if n > 1 then
    raise exception 'More than one profile matched Krish Anand (%). Narrow the update.', n;
  end if;

  perform set_config('app.allow_tutor_apply', 'on', true);

  update public.profiles
  set
    tutor_status = 'approved',
    role = case
      when role = 'admin' then role
      else 'tutor'::public.user_role
    end,
    mentor_slug = coalesce(nullif(trim(mentor_slug), ''), 'krish-anand'),
    mentor_public = true,
    mentor_focus = 'Algebra 2, PreCal',
    mentor_bio = $bio$I'm a junior at Plano Senior High School in Plano, Texas. I am currently in AP Calculus BC and in my free time I enjoy playing soccer and volunteering in various senior facilities. I am very vested in helping others improve whether it be in school or not. I hope that I can help some of yall reach your goals and can't wait to meet yall!$bio$
  where display_name ilike '%krish%'
    and display_name ilike '%anand%';
end $$;

-- 3) Confirm he is in the public directory
select
  display_name,
  mentor_slug,
  mentor_focus,
  mentor_bio,
  session_count
from public.public_mentor_profiles
where mentor_slug = 'krish-anand'
   or display_name ilike '%krish%anand%';
