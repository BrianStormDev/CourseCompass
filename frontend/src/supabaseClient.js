import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rgsntbrcaiuvxznjukyi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnc250YnJjYWl1dnh6bmp1a3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzA2MjMsImV4cCI6MjA2NjEwNjYyM30.2_qDAl4Sh3n8ujjpYWM52g-HgZyfcuLpW8jsnD6mxcE';
export const supabase = createClient(supabaseUrl, supabaseKey);