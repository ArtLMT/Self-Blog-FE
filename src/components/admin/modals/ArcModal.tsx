'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';

import { arcSchema, type ArcFormValues } from '@/lib/validators/content.schema';
import { useCreateArcMutation, useUpdateArcMutation } from '@/hooks/queries/useAdminQueries';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { slugify } from '@/lib/utils';
import { handleFormError } from '@/lib/error-handler';
import { AdminArcResponseDTO } from '@/types/models';

interface ArcModalProps {
  isOpen: boolean;
  onClose: () => void;
  arc?: AdminArcResponseDTO | null;
}

/** Minimal label matching the design: small-caps, uppercase, letter-spaced */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50 mb-1.5">
      {children}{required && <span className="ml-1 text-foreground/40">*</span>}
    </label>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[11px] italic text-foreground/40">{children}</p>;
}

export function ArcModal({ isOpen, onClose, arc }: ArcModalProps) {
  const isEdit = !!arc;
  const [globalError, setGlobalError] = useState<string | null>(null);

  const createMutation = useCreateArcMutation();
  const updateMutation = useUpdateArcMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<ArcFormValues>({
    resolver: zodResolver(arcSchema),
    defaultValues: {
      language: 'EN',
      title: '',
      slug: '',
      summary: '',
      displayOrder: 0,
      startDate: '',
      visibility: 'PUBLIC',
      status: 'DRAFT',
      notes: '',
    },
  });

  useEffect(() => {
    if (arc && isOpen) {
      form.reset({
        language: arc.language,
        title: arc.title,
        slug: arc.slug,
        summary: arc.summary || '',
        displayOrder: arc.displayOrder,
        startDate: arc.startDate,
        endDate: arc.endDate || '',
        visibility: arc.visibility,
        status: arc.status,
        notes: '',
      });
    } else if (!isOpen) {
      form.reset();
    }
  }, [arc, isOpen, form]);

  const onSubmit = async (values: ArcFormValues) => {
    try {
      setGlobalError(null);
      if (isEdit && arc) {
        await updateMutation.mutateAsync({ id: arc.id, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onClose();
    } catch (error) {
      handleFormError(error, form.setError, setGlobalError);
    }
  };

  const handleClose = () => {
    setGlobalError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-3xl w-full bg-background border-border/40 rounded-xl p-0 overflow-hidden max-h-[92vh] flex flex-col gap-0"
      >
        {/* Header */}
        <div className="relative px-7 pt-7 pb-5">
          <DialogClose
            onClick={handleClose}
            className="absolute top-5 right-5 text-foreground/30 hover:text-foreground/70 transition-colors text-xl leading-none"
          >
            ×
          </DialogClose>
          <h2 className="font-chapter-title text-2xl font-medium text-foreground">
            {isEdit ? `Edit Arc` : 'New Arc'}
          </h2>
          <p className="font-body-prose italic text-sm text-foreground/40 mt-1">
            {isEdit
              ? 'Changing the language will create or update that translation.'
              : 'A long stretch of life — the statement, not the paper.'}
          </p>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-7 pb-7">
          {globalError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{globalError}</span>
            </div>
          )}
          <Form {...form}>
            <form id="arc-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Language */}
              <FormField control={form.control} name="language" render={({ field }) => (
                <FormItem>
                  <FieldLabel required>Language</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full h-10 bg-transparent border-border/50 rounded text-sm text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EN">English</SelectItem>
                      <SelectItem value="VI">Vietnamese</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Title */}
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FieldLabel required>Title</FieldLabel>
                  <FormControl>
                    <Input
                      className="h-10 bg-transparent border-border/50 rounded text-sm"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!isEdit) form.setValue('slug', slugify(e.target.value), { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Slug */}
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem>
                  <FieldLabel required>Slug</FieldLabel>
                  <FormControl>
                    <Input
                      className="h-10 bg-transparent border-border/50 rounded font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      {...field}
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FieldHint>Auto-generated from title; editable on create.</FieldHint>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Summary */}
              <FormField control={form.control} name="summary" render={({ field }) => (
                <FormItem>
                  <FieldLabel>Summary</FieldLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="bg-transparent border-border/50 rounded text-sm resize-none leading-relaxed"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FieldHint>Max 1000 characters.</FieldHint>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Display Order + Status */}
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="displayOrder" render={({ field }) => (
                  <FormItem>
                    <FieldLabel required>Display Order</FieldLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-10 bg-transparent border-border/50 rounded text-sm"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FieldLabel required>Status</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-transparent border-border/50 rounded text-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Start Date + End Date */}
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <FieldLabel required>Start Date</FieldLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder="mm/dd/yyyy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem>
                    <FieldLabel>End Date</FieldLabel>
                    <FormControl>
                      <DatePicker value={field.value || ''} onChange={field.onChange} placeholder="mm/dd/yyyy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Visibility */}
              <FormField control={form.control} name="visibility" render={({ field }) => (
                <FormItem>
                  <FieldLabel required>Visibility</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full h-10 bg-transparent border-border/50 rounded text-sm">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Private Notes */}
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FieldLabel>Private Notes</FieldLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      className="bg-transparent border-border/50 rounded text-sm resize-none leading-relaxed"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FieldHint>Not shown publicly.</FieldHint>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Submit */}
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={handleClose} className="text-foreground/50">
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isPending} className="min-w-[100px]">
                  {isPending ? <Loader2 className="size-3.5 animate-spin" /> : isEdit ? 'Save Changes' : 'Create Arc'}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
