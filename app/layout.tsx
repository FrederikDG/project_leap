import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const universalSans = localFont({
  src: [
    {
      path: './fonts/Universal-Sans-Display-306.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Universal-Sans-Display-460.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-universal-sans',
});

const neueMachina = localFont({
  src: [
    {
      path: './fonts/PPNeueMachina-PlainVariable.woff',
    },
  ],
  display: 'swap',
  variable: '--font-neue-machina',
});

export const metadata: Metadata = {
  title: "Project Leap",
  description: "Elegantly simple, yet powerful.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html  lang="en"
   >
      <body className={`antialiased scroll-smooth ${neueMachina.variable} ${universalSans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
