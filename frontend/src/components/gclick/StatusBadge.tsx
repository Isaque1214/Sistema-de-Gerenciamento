export function StatusBadge({ status }: { status: string }) {
  const isConcluido = status === 'Concluido' || status === 'Concluído';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
      isConcluido ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
    }`}>
      {status}
    </span>
  );
}