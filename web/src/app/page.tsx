import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            M-Tracker
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Productivity Timer & Daily Report Sharing
          </p>
          <div className="text-muted-foreground">
            <p>This is the public report viewing interface for M-Tracker.</p>
            <p className="mt-2">To view a specific report, you need a direct link from a user.</p>
          </div>
        </div>
      </div>
    </div>
  )
}