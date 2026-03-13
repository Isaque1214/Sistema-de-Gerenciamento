// Arquivo: ColorPicker.tsx
// Caminho: frontend/src/components/configuracoes/

interface ColorPickerProps {
label: string;
corAtual: string;
onChange: (novaCor: string) => void;
}

export function ColorPicker({ label, corAtual, onChange }: ColorPickerProps) {
return (
<div>
    <label className="block text-sm font-bold text-slate-700 mb-2">
    {label}
    </label>
    <div className="flex items-center gap-3">
        {/* O input type="color" abre aquela janelinha nativa de escolher cor do sistema operacional */}
        <input
            type="color"
            value={corAtual}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer border-0 p-0 shadow-sm"
        />
        <span className="text-sm font-mono text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md">
        {corAtual.toUpperCase()}
        </span>
    </div>
</div>
);
}