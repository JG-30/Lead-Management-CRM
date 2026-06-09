import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { STATUSES, SOURCES } from '../utils/constants';

const FIELDS = [
  { name: 'name',    label: 'Full Name',    type: 'text',  placeholder: 'e.g. Priya Sharma',       required: true,  col: 1 },
  { name: 'email',   label: 'Email',        type: 'email', placeholder: 'priya@company.com',        required: true,  col: 1 },
  { name: 'phone',   label: 'Phone',        type: 'tel',   placeholder: '+91 98765 43210',          required: false, col: 1 },
  { name: 'company', label: 'Company',      type: 'text',  placeholder: 'Acme Inc.',                required: false, col: 1 },
];

export default function LeadModal({ lead, onClose, onSubmit, isLoading }) {
  const isEdit = !!lead?._id;
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    reset(lead || { status: 'New', source: 'Other' });
  }, [lead, reset]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-[520px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.col === 2 ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  {f.label} {f.required && <span className="text-red-400">*</span>}
                </label>
                <input
                  {...register(f.name, {
                    required: f.required ? `${f.label} is required` : false,
                    ...(f.name === 'email' && { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } }),
                  })}
                  type={f.type}
                  placeholder={f.placeholder}
                  className="input-base"
                />
                {errors[f.name] && (
                  <p className="text-red-400 text-xs mt-1">{errors[f.name].message}</p>
                )}
              </div>
            ))}

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Status</label>
              <select {...register('status')} className="input-base">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Source</label>
              <select {...register('source')} className="input-base">
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Assigned To */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Assigned To</label>
              <input {...register('assignedTo')} type="text" placeholder="Team member name" className="input-base" />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Notes</label>
              <textarea
                {...register('notes')}
                placeholder="Add context, next steps, or anything relevant..."
                rows={3}
                className="input-base resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
