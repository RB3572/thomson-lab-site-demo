export default function Placeholder({ title }: { title: string }) {
  return (
    <main className="flex min-h-[86vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
        {title}
      </h1>
      <p className="max-w-xl text-lg text-white/70">
        This page is coming soon.
      </p>
    </main>
  )
}
