-- supabase_migrations/20260425_appointments.sql

CREATE TABLE sewist_working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INTEGER NOT NULL DEFAULT 60,
    max_customers_per_slot INTEGER NOT NULL DEFAULT 1,
    UNIQUE(user_id, day_of_week)
);

CREATE TABLE sewist_schedule_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    override_date DATE NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    start_time TIME,
    end_time TIME,
    UNIQUE(user_id, override_date)
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
    sewist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

ALTER TABLE service_requests ADD COLUMN appointment_end_date TIMESTAMPTZ;

-- RLS Policies
ALTER TABLE sewist_working_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view sewist working hours" ON sewist_working_hours FOR SELECT USING (true);
CREATE POLICY "Sewists can manage their own working hours" ON sewist_working_hours FOR ALL USING (auth.uid() = user_id);

ALTER TABLE sewist_schedule_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view sewist overrides" ON sewist_schedule_overrides FOR SELECT USING (true);
CREATE POLICY "Sewists can manage their own overrides" ON sewist_schedule_overrides FOR ALL USING (auth.uid() = user_id);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own appointments" ON appointments FOR SELECT USING (auth.uid() = client_id OR auth.uid() = sewist_id);
CREATE POLICY "Clients can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Sewists can update their appointments" ON appointments FOR UPDATE USING (auth.uid() = sewist_id);
