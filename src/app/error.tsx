'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-5xl mb-6">⚠️</div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">Algo deu errado</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Ocorreu um erro ao carregar esta página. Tente novamente.
        </p>
        {error?.message && (
          <p className="text-xs text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 font-mono break-all">
            {error.message}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 transition-transform"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
