import { SUPPORT_EMAIL } from "@/lib/constants";

export type FaqItem = {
  question: string;
  answer: string;
};

export const SITE_FAQS: FaqItem[] = [
  {
    question: "Come faccio una domanda?",
    answer:
      "Vai su Fai una domanda e racconta il caso con più dettagli possibili: tipo evento, zona, numero persone, budget e cosa ti preoccupa."
  },
  {
    question: "Devo registrarmi per usare il sito?",
    answer:
      "No. Puoi leggere le conversazioni, cercare casi simili e pubblicare una domanda senza creare un account. Per alcune funzioni chiedíamo email o captcha solo per evitare spam."
  },
  {
    question: "Posso non mostrare il mio nome?",
    answer:
      "Sì. Puoi pubblicare come anonimo, con nickname o con nome reale. L'email, se la lasci, non viene mostrata sul sito."
  },
  {
    question: "La richiesta fornitori si vede nel forum?",
    answer:
      "No. Il modulo Trova fornitori è privato. Le domande pubbliche sono solo quelle che scegli di inserire nel forum."
  },
  {
    question: "Posso caricare un preventivo?",
    answer:
      "Sì, nella pagina Analizza preventivo puoi trascrivere o caricare il testo. Prima togli nomi, telefoni, indirizzi e dati riconoscibili del fornitore."
  },
  {
    question: "Si può parlare di politica",
    answer:
      "No. La community parla di eventi, fornitori, costi e problemi pratici. Discussioni politiche, propaganda e commenti fuori tema vengono bloccati o rimossi."
  },
  {
    question: "Posso nominare un fornitore con accuse?",
    answer:
      "Meglio di no. Racconta i fatti in modo neutro, senza insulti e senza dati personali. I contenuti scorretti possono essere rimossi."
  },
  {
    question: "Il magazine è diverso dal forum?",
    answer:
      "Sì. Il magazine serve per farsi un'idea generale; il forum serve per parlare del tuo caso specifico."
  },
  {
    question: "Come posso contattare assistenza?",
    answer: `Puoi usare il widget supporto dentro il sito oppure scrivere a ${SUPPORT_EMAIL}.`
  }
];
