-- Trigger for new order_items
CREATE OR REPLACE FUNCTION notify_sewist_on_order()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_sewist_id uuid;
  v_customer_id uuid;
  v_product_name text;
  v_customer_name text;
BEGIN
  -- Get sewist_id and product name from the product
  SELECT user_id, name INTO v_sewist_id, v_product_name
  FROM public.sewist_products
  WHERE id = NEW.product_id;

  -- Get customer_id from the order
  SELECT user_id INTO v_customer_id
  FROM public.orders
  WHERE id = NEW.order_id;

  -- Get customer name
  SELECT trim(first_name || ' ' || last_name) INTO v_customer_name
  FROM public.users
  WHERE id = v_customer_id;

  -- Insert notification for the sewist
  INSERT INTO public.notifications (user_id, title, message, type, action_link)
  VALUES (
    v_sewist_id,
    v_customer_name || ' bought ' || v_product_name || '!',
    'Click to go to products summary',
    'order',
    '/products' -- or appropriate link
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_order_item_created
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION notify_sewist_on_order();

-- Trigger for new service_requests (commissions)
CREATE OR REPLACE FUNCTION notify_sewist_on_commission()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_client_name text;
BEGIN
  -- Only notify for commissions
  IF NEW.service_type != 'commission' THEN
    RETURN NEW;
  END IF;

  -- Get client name
  SELECT trim(first_name || ' ' || last_name) INTO v_client_name
  FROM public.users
  WHERE id = NEW.client_id;

  -- Insert notification for the sewist
  INSERT INTO public.notifications (user_id, title, message, type, action_link)
  VALUES (
    NEW.sewist_id,
    v_client_name || ' would like to commission you!',
    'Click to check details',
    'commission',
    '/commissions' -- or appropriate link
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_service_request_created
  AFTER INSERT ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_sewist_on_commission();
