import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wovmcyqvhmpibltelcip.supabase.co';
const supabaseKey = 'sb_publishable_QEq_aNgqRssTnutCGK9z3A_MR8Mtcj-';

export const supabase = createClient(supabaseUrl, supabaseKey);