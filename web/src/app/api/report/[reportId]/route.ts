import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    console.log('API: Fetching report with ID:', params.reportId)
    
    const { data, error } = await supabase
      .from('shared_reports')
      .select('*')
      .eq('id', params.reportId)
      .single()

    console.log('API: Supabase response:', { data, error })

    if (error) {
      console.error('API: Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!data) {
      console.log('API: No data found for report ID:', params.reportId)
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Check if report has expired
    const now = new Date()
    const expiresAt = new Date(data.expires_at)
    
    console.log('API: Expiration check:', { now, expiresAt, expired: now > expiresAt })
    
    if (now > expiresAt) {
      console.log('API: Report has expired')
      return NextResponse.json({ error: 'Report has expired' }, { status: 410 })
    }

    return NextResponse.json({ report: data })
  } catch (error) {
    console.error('API: Error in GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}