import { supabase } from '../../lib/supabase'

export default async function TestPage() {
  let connectionTest = null
  let reportsCount = null
  let sampleReport = null

  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('shared_reports')
      .select('count(*)')
      .limit(1)

    connectionTest = { success: !testError, error: testError?.message }

    // Get total reports count
    const { count } = await supabase
      .from('shared_reports')
      .select('*', { count: 'exact', head: true })

    reportsCount = count

    // Get a sample report ID
    const { data: sampleData } = await supabase
      .from('shared_reports')
      .select('id, created_at, expires_at')
      .limit(1)

    sampleReport = sampleData?.[0]

  } catch (error) {
    connectionTest = { success: false, error: String(error) }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Test</h1>
        
        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Connection Test</h2>
            <div className="font-mono text-sm">
              <div>Status: {connectionTest?.success ? '✅ Connected' : '❌ Failed'}</div>
              {connectionTest?.error && (
                <div className="text-red-500 mt-2">Error: {connectionTest.error}</div>
              )}
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Reports Table</h2>
            <div className="font-mono text-sm">
              <div>Total Reports: {reportsCount ?? 'Unknown'}</div>
            </div>
          </div>

          {sampleReport && (
            <div className="bg-card border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Sample Report</h2>
              <div className="font-mono text-sm space-y-1">
                <div>ID: {sampleReport.id}</div>
                <div>Created: {sampleReport.created_at}</div>
                <div>Expires: {sampleReport.expires_at}</div>
                <div className="mt-2">
                  <a 
                    href={`/report/${sampleReport.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Test this report →
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Test Specific Report</h2>
            <div className="font-mono text-sm">
              <div className="mb-2">Report ID: 2d2dc400-5681-44b9-9246-c2826a9f09b5</div>
              <a 
                href="/report/2d2dc400-5681-44b9-9246-c2826a9f09b5"
                className="text-blue-500 hover:underline"
              >
                Test your report →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}