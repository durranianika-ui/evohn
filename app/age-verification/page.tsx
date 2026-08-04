import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocument";
import { getLegalDocument } from "@/data/legal";

const doc = getLegalDocument("age-verification");

export const metadata: Metadata = {
  title: doc.title,
  description: doc.summary,
  alternates: { canonical: doc.path },
};

export default function Page() {
  return <LegalDocumentPage doc={doc} />;
}
