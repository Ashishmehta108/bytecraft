import { Separator } from '@/components/ui/separator';

function SectionTitle({ text }: { text: string }) {
  return (
    <div>
      <h2 className='text-2xl font-medium tracking-wider capitalize mb-8'>
        {text}
      </h2>
      <Separator className='bg-muted px-10' />
    </div>
  );
}
export default SectionTitle;