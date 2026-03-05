import './globals.css'

export const metadata = {
  title: 'UpCircle — Community Savings',
  description: 'Modernizing rotating savings groups for immigrant and underserved communities.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-cream min-h-screen">{children}</body>
    </html>
  )
}
