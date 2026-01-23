
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://umuevzdthivjxnhdimoo.supabase.co';
const supabaseAnonKey = 'sb_publishable_xoCxuzZBWe8sCo0bg-iAKw_h610hIjK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
