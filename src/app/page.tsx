// Landing page - will show marketing/login for unauthenticated users
// Authenticated users will be redirected to /discover

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold text-text mb-4">BookLove</h1>
      <p className="text-lg text-text-muted mb-8 text-center max-w-md">
        Swipe through fictional book characters to discover your next favorite read.
      </p>
      <a
        href="/discover"
        className="bg-gradient-to-r from-primary to-primary-warm text-white px-8 py-4 rounded-button font-bold text-lg shadow-heart hover:scale-105 transition-transform"
      >
        Start Swiping
      </a>
    </div>
  );
}
