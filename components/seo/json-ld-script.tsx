interface JsonLdScriptProps {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function JsonLdScript({ id, data }: JsonLdScriptProps) {
  return (
    <script id={id} type='application/ld+json'>
      {JSON.stringify(data)}
    </script>
  );
}
