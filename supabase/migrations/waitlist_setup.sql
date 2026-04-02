-- Create the waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated users or a specific service role to delete if needed
-- But for our waitlist, we only want to allow insertions from the Server Action.

-- Policy for inserting: Anyone can submit an email via the server action (using service role or anon depends on setup)
-- Given we'll use a Server Action, we'll likely use the server-side client.

-- Policy: Allow Anon Insert (Optional if using service role, but safer to specify)
CREATE POLICY "Allow anon insertions" ON public.waitlist FOR INSERT TO anon WITH CHECK (true);

-- Policy: Allow everyone to see the count (Optional, but useful for the indicator)
CREATE POLICY "Allow public count" ON public.waitlist FOR SELECT TO anon USING (true);
