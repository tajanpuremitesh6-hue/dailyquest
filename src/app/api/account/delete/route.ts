import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Delete user records from tables
    await supabase.from('tasks').delete().eq('user_id', userId);
    await supabase.from('daily_stats').delete().eq('user_id', userId);
    await supabase.from('user_settings').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('user_id', userId);

    // If Supabase Service Role Key is configured, delete the auth user
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (serviceRoleKey && supabaseUrl) {
      const adminClient = createAdminClient(supabaseUrl, serviceRoleKey);
      await adminClient.auth.admin.deleteUser(userId);
    } else {
      // Otherwise sign the user out
      await supabase.auth.signOut();
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Delete account error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete account' },
      { status: 500 }
    );
  }
}
