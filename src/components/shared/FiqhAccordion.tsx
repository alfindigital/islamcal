import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FiqhAccordionProps {
  content: string;
}

export const FiqhAccordion: React.FC<FiqhAccordionProps> = ({ content }) => (
  <Accordion type="single" collapsible className="mb-4">
    <AccordionItem value="fiqh" className="border rounded-lg px-3">
      <AccordionTrigger className="text-sm hover:no-underline">
        <span>Dasar Perhitungan</span>
      </AccordionTrigger>
      <AccordionContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
