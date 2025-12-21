
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyhljzkfxdebngwdmvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aGxqemtmeGRlYm5nd2Rtdmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNzA2OTMsImV4cCI6MjA4MTg0NjY5M30.10DVSHJaw-ubnr5BZJwhCmbxsmTy5k4OhqkByyPkk6Y';

export const supabase = createClient(supabaseUrl, supabaseKey);
