export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    console.log("testok");
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  );
}
