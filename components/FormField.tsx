// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FormFieldProps {
  label: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, description, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface FormFieldInputProps extends Omit<FormFieldProps, 'children'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function FormFieldInput({ 
  label, 
  description, 
  error, 
  required, 
  type = 'text',
  placeholder,
  value,
  onChange 
}: FormFieldInputProps) {
  return (
    <FormField label={label} description={description} error={error} required={required}>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={error ? 'border-red-500' : ''}
      />
    </FormField>
  )
}

interface FormFieldTextareaProps extends Omit<FormFieldProps, 'children'> {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  rows?: number
}

export function FormFieldTextarea({ 
  label, 
  description, 
  error, 
  required, 
  placeholder,
  value,
  onChange,
  rows = 3
}: FormFieldTextareaProps) {
  return (
    <FormField label={label} description={description} error={error} required={required}>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        className={error ? 'border-red-500' : ''}
      />
    </FormField>
  )
}

interface FormFieldSelectProps extends Omit<FormFieldProps, 'children'> {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  options: { value: string; label: string }[]
}

export function FormFieldSelect({ 
  label, 
  description, 
  error, 
  required, 
  placeholder,
  value,
  onChange,
  options
}: FormFieldSelectProps) {
  return (
    <FormField label={label} description={description} error={error} required={required}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
