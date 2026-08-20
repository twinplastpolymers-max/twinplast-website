import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSignature } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    // 1. Initialise Supabase Server Client
    const supabase = await createClient();
    
    // 2. Authenticate the User session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Authorise that user exists in user_roles as 'admin'
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      return NextResponse.json({ error: 'Forbidden: Admin privilege required' }, { status: 403 });
    }

    // 4. Parse signing parameters
    const body = await request.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json({ error: 'Missing parameters to sign' }, { status: 400 });
    }

    // 5. Generate secure signature using sever-only API key and secret
    const signatureData = generateSignature(paramsToSign);

    return NextResponse.json(signatureData);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
