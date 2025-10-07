export default function DebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
                <span className="ml-2">{supabaseUrl || 'NOT SET'}</span>
              </div>
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
                <span className="ml-2">{supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Next.js Info</h2>
            <div className="font-mono text-sm">
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>Build Time: {new Date().toISOString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}