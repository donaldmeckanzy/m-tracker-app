export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Report Not Found</h1>
        <p className="text-muted-foreground mb-8">
          This report may have expired or the link is invalid.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Reports automatically expire for privacy.</p>
          <p>Please request a new link from the user.</p>
        </div>
      </div>
    </div>
  )
}