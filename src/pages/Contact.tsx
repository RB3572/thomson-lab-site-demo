import PageShell from '@/components/PageShell'

export default function Contact() {
  return (
    <PageShell
      title="Contact Us"
      intro="Get in touch with the Thomson Lab at Caltech."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0b0c10]/70 p-8 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white">Address</h2>
          <address className="mt-4 not-italic leading-relaxed text-white/80">
            Thomson Lab
            <br />
            Beckman Behavioral Biology
            <br />
            California Institute of Technology
            <br />
            1200 East California Boulevard
            <br />
            Pasadena, California 91125
          </address>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0c10]/70 p-8 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white">Email</h2>
          <p className="mt-4 text-white/80">
            For inquiries, including prospective students and collaborators,
            reach out to Matt Thomson:
          </p>
          <a
            href="mailto:mthomson@caltech.edu"
            className="mt-4 inline-block rounded-full border border-white/20 bg-white/5 px-5 py-2 font-medium text-[#f7cc34] transition-colors hover:border-[#f7cc34]"
          >
            mthomson@caltech.edu
          </a>
        </div>
      </div>
    </PageShell>
  )
}
