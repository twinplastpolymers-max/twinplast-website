'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, CheckCircle2, Loader2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ManufacturingStep } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface ManufacturingManagerProps {
  initialSteps: ManufacturingStep[];
}

export function ManufacturingManager({ initialSteps }: ManufacturingManagerProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [steps, setSteps] = useState<ManufacturingStep[]>(initialSteps);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStep, setEditingStep] = useState<ManufacturingStep | null>(null);

  // Form State
  const [stepNumber, setStepNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Layers');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);

  // UX State
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openAddForm = () => {
    setEditingStep(null);
    const maxStep = steps.reduce((max, s) => Math.max(max, s.step_number), 0);
    setStepNumber(maxStep + 1);
    setTitle('');
    setDescription('');
    setIconName('Layers');
    setDisplayOrder(maxStep + 1);
    setActive(true);
    setIsEditing(true);
  };

  const openEditForm = (st: ManufacturingStep) => {
    setEditingStep(st);
    setStepNumber(st.step_number);
    setTitle(st.title);
    setDescription(st.description);
    setIconName(st.icon_name || 'Layers');
    setDisplayOrder(st.display_order);
    setActive(st.active);
    setIsEditing(true);
  };

  const handleSaveStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!title || !description || stepNumber <= 0) {
      toast.error('Validation Error', 'Title, Description, and a valid Step Number are required.');
      setIsSaving(false);
      return;
    }

    // Check duplicate step number if changed or adding
    const isDuplicate = steps.some(
      (s) => s.step_number === stepNumber && s.id !== editingStep?.id
    );
    if (isDuplicate) {
      toast.error('Step Number Conflict', `Stage number ${stepNumber} already exists.`);
      setIsSaving(false);
      return;
    }

    const payload = {
      step_number: stepNumber,
      title,
      description,
      icon_name: iconName || null,
      display_order: displayOrder || stepNumber,
      active,
    };

    try {
      if (editingStep) {
        const { data, error } = await supabase
          .from('manufacturing_steps')
          .update(payload)
          .eq('id', editingStep.id)
          .select()
          .single();

        if (error) throw error;

        setSteps((prev) =>
          prev.map((s) => (s.id === editingStep.id ? (data as ManufacturingStep) : s))
            .sort((a, b) => a.step_number - b.step_number)
        );
        toast.success('Stage Updated', `Step ${stepNumber} "${title}" updated.`);
      } else {
        const { data, error } = await supabase
          .from('manufacturing_steps')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setSteps((prev) => [...prev, data as ManufacturingStep].sort((a, b) => a.step_number - b.step_number));
        toast.success('Stage Added', `Step ${stepNumber} "${title}" added.`);
      }

      setIsEditing(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save manufacturing stage.';
      toast.error('Database Error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (st: ManufacturingStep) => {
    const newActive = !st.active;
    try {
      const { error } = await supabase
        .from('manufacturing_steps')
        .update({ active: newActive })
        .eq('id', st.id);

      if (error) throw error;

      setSteps((prev) =>
        prev.map((s) => (s.id === st.id ? { ...s, active: newActive } : s))
      );
      toast.success('Status Updated', `Step ${st.step_number} is now ${newActive ? 'active' : 'inactive'}.`);
    } catch {
      toast.error('Error', 'Failed to update active status.');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from('manufacturing_steps').delete().eq('id', id);
      if (error) throw error;

      setSteps((prev) => prev.filter((s) => s.id !== id));
      toast.success('Deleted', 'Manufacturing stage record deleted.');
    } catch {
      toast.error('Error', 'Failed to delete manufacturing stage.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>9-Step Manufacturing Process Manager</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure the 9 verified stages of sheet extrusion and fabrication.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Process Stage</span>
          </button>
        )}
      </div>

      {/* Form Area */}
      {isEditing && (
        <form onSubmit={handleSaveStep} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingStep ? `Edit Process Stage ${editingStep.step_number}` : 'New Process Stage'}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="step-num" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Stage Number (1-9) *
              </label>
              <input
                id="step-num"
                type="number"
                required
                min={1}
                max={20}
                value={stepNumber}
                onChange={(e) => setStepNumber(parseInt(e.target.value) || 1)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
              />
            </div>

            <div>
              <label htmlFor="step-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Stage Title *
              </label>
              <input
                id="step-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Extrusion"
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="step-icon" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Icon Identifier Name
              </label>
              <select
                id="step-icon"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="Layers">Layers (Raw Material)</option>
                <option value="RotateCw">RotateCw (Mixing)</option>
                <option value="Cpu">Cpu (Extrusion)</option>
                <option value="LayoutGrid">LayoutGrid (Sheet Formation)</option>
                <option value="ThermometerSnowflake">ThermometerSnowflake (Cooling)</option>
                <option value="Scissors">Scissors (Cutting)</option>
                <option value="CheckCircle">CheckCircle (Quality Inspection)</option>
                <option value="PackageCheck">PackageCheck (Packing)</option>
                <option value="Truck">Truck (Dispatch)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="step-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Stage Description *
            </label>
            <textarea
              id="step-desc"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Extruding molten polypropylene material through die."
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="step-order" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Display Order
              </label>
              <input
                id="step-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Active</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Saving...' : 'Save Stage'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Manufacturing Steps List View */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {steps.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            No process stages found. Click &quot;Add Process Stage&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {steps.map((st) => (
              <div key={st.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {st.step_number}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {st.title}
                      </h3>
                      {st.active ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleActive(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      st.active
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {st.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => openEditForm(st)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Stage"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {confirmDeleteId === st.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(st.id)}
                        disabled={deletingId === st.id}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
                      >
                        {deletingId === st.id ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(st.id)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Stage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
