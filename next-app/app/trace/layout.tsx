export const metadata = {
  title: 'Trace Pharmaceuticals',
  description: 'Generated by Next.js',
}

export default async function TraceLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
          <div className="flex justify-center items-center">
            {props.children}
          </div>
        </div>
      </body>
    </html>
  )
}
