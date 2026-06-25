export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='p-5 w-full h-full'>{children}</div>;
}
