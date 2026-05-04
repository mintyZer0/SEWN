-- Expand service request notifications to commission, alteration, and repair.
-- Add appointment notifications for new appointments.

CREATE OR REPLACE FUNCTION public.notify_sewist_on_service_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_name text;
  v_service_label text;
BEGIN
  IF NEW.service_type NOT IN ('commission', 'alteration', 'repair') THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(
    NULLIF(TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')), ''),
    'A customer'
  )
    INTO v_client_name
  FROM public.users
  WHERE id = NEW.client_id;

  v_service_label := INITCAP(NEW.service_type);

  INSERT INTO public.notifications (user_id, title, message, type, action_link)
  VALUES (
    NEW.sewist_id,
    v_client_name || ' sent a ' || v_service_label || ' request!',
    'Click to check details',
    NEW.service_type,
    '/commissions?requestId=' || NEW.id::text
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_service_request_created ON public.service_requests;
CREATE TRIGGER on_service_request_created
  AFTER INSERT ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_sewist_on_service_request();

CREATE OR REPLACE FUNCTION public.notify_users_on_appointment_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, action_link)
  VALUES (
    NEW.sewist_id,
    'New appointment scheduled',
    'Click to check appointment details',
    'appointment',
    '/appointments?appointmentId=' || NEW.id::text
  );

  INSERT INTO public.notifications (user_id, title, message, type, action_link)
  VALUES (
    NEW.client_id,
    'Your appointment is scheduled',
    'Click to view your appointment details',
    'appointment',
    '/user-profile/orders?appointmentId=' || NEW.id::text
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_appointment_created_notify ON public.appointments;
CREATE TRIGGER on_appointment_created_notify
  AFTER INSERT ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_users_on_appointment_created();
