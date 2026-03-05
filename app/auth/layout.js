export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0D1F3C 0%, #162D52 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">◎</span>
          <h1 className="text-white text-2xl font-bold mt-2" style={{ fontFamily: 'DM Serif Display, serif' }}>UpCircle</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
