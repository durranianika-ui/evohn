import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { Wordmark } from "@/components/ui/Wordmark";

export default function NotFound() {
  return (
    <section className="flex min-h-dvh items-center bg-ink text-soft">
      <div className="container-content py-32 text-center">
        <Wordmark className="text-[1.1rem] text-soft/55" />

        <p className="type-label mt-16 text-soft/55">Error 404</p>

        <h1 className="type-display mx-auto mt-8 max-w-[16ch] text-soft">
          This page is not
          <br />
          in the catalogue.
        </h1>

        <p className="type-body mx-auto mt-9 max-w-[46ch] text-soft/55">
          The address you followed does not resolve. The catalogue index below
          lists everything currently presented.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/catalogue" tone="dark">
            View Catalogue
          </ButtonLink>
          <WhatsAppCTA intent="advisor" variant="outline" tone="dark" />
        </div>
      </div>
    </section>
  );
}
