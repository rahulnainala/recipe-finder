// app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css"; // Import your global CSS

// Load Poppins font with specific weights
const poppins = Poppins({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Meal Explorer",
  description: "Recipe Finder App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
