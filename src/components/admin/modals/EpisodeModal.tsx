'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';

import { episodeSchema, type EpisodeFormValues } from '@/lib/validators/content.schema';
import { useCreateEpisodeMutation, useUpdateEpisodeMutation } from '@/hooks/queries/useAdminQueries';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { slugify } from '@/lib/utils';
import { handleFormError } from '@/lib/error-handler';
import { AdminEpisodeResponseDTO } from '@/types/models';

interface EpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId?: string;
  episode?: AdminEpisodeResponseDTO | null;
}

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

export function EpisodeModal({ isOpen, onClose, chapterId, episode }: EpisodeModalProps) {
  const isEdit = !!episode;
  const [globalError, setGlobalError] = useState<string | null>(null);

  const createMutation = useCreateEpisodeMutation();
  const updateMutation = useUpdateEpisodeMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      language: 'EN',
      title: '',
      slug: '',
      content: '',
      displayOrder: 1,
      status: 'DRAFT',
      publishDate: '',
      authorNotes: '',
      chapterId: '',
    },
  });

  useEffect(() => {
    if (episode && isOpen) {
      form.reset({
        language: episode.language,
        title: episode.title,
        slug: episode.slug,
        content: episode.content || '',
        displayOrder: episode.orderIndex,
        status: episode.status,
        publishDate: episode.eventDate || '',
        authorNotes: '',
        chapterId: episode.chapterId || '',
      });
    } else if (isOpen) {
      form.reset({
        language: 'EN',
        title: '',
        slug: '',
        content: '',
        displayOrder: 1,
        status: 'DRAFT',
        publishDate: '',
        authorNotes: '',
        chapterId: chapterId || '',
      });
    }
  }, [episode, chapterId, isOpen, form]);

  const onSubmit = async (values: EpisodeFormValues) => {
    try {
      setGlobalError(null);
      if (isEdit && episode) {
        await updateMutation.mutateAsync({ id: episode.id, data: values });
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
      {/* Episode modal is wider — needs room for the content textarea */}
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl w-full bg-background border-border/40 rounded-xl p-0 overflow-hidden max-h-[92vh] flex flex-col gap-0"
      >
        {/* Header */}
        <div className="relative px-7 pt-7 pb-5 border-b border-border/30 shrink-0">
          <DialogClose
            onClick={handleClose}
            className="absolute top-5 right-5 text-foreground/30 hover:text-foreground/70 transition-colors text-xl leading-none"
          >
            ×
          </DialogClose>
          <h2 className="font-chapter-title text-2xl font-medium text-foreground">
            {isEdit ? 'Edit Episode' : 'New Episode'}
          </h2>
          <p className="font-body-prose italic text-sm text-foreground/40 mt-1">
            {isEdit
              ? 'Changing the language will create or update that translation.'
              : 'Each episode is a single record, a moment in the arc.'}
          </p>
        </div>

        {globalError && (
          <div className="mx-7 mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md flex items-center gap-2 shrink-0">
            <AlertCircle className="size-4 shrink-0" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Two-pane layout: metadata left | content right */}
        <div className="flex flex-1 min-h-0">

          {/* Left: metadata fields */}
          <div className="w-56 shrink-0 border-r border-border/30 overflow-y-auto">
            <Form {...form}>
              <form id="episode-form" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="px-6 py-5 space-y-5">

                  {/* Language */}
                  <FormField control={form.control} name="language" render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Language</FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full h-9 bg-transparent border-border/50 rounded text-sm">
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
                          className="h-9 bg-transparent border-border/50 rounded text-sm"
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
                          className="h-9 bg-transparent border-border/50 rounded font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          {...field}
                          disabled={isEdit}
                        />
                      </FormControl>
                      <FieldHint>Auto-generated from title.</FieldHint>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Status */}
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Status</FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 bg-transparent border-border/50 rounded text-sm">
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

                  {/* Display Order */}
                  <FormField control={form.control} name="displayOrder" render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Display Order</FieldLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="h-9 bg-transparent border-border/50 rounded text-sm"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Event Date */}
                  <FormField control={form.control} name="publishDate" render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Event Date</FieldLabel>
                      <FormControl>
                        <DatePicker value={field.value || ''} onChange={field.onChange} placeholder="mm/dd/yyyy" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Author Notes */}
                  <FormField control={form.control} name="authorNotes" render={({ field }) => (
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

                </div>
              </form>
            </Form>
          </div>

          {/* Right: content editor */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-5 pb-2 shrink-0">
              <FieldLabel required>Content</FieldLabel>
              <p className="text-[11px] italic text-foreground/40 mb-2">Markdown supported.</p>
            </div>
            <Form {...form}>
              <div className="flex-1 px-6 pb-5 min-h-0">
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem className="h-full flex flex-col">
                    <FormControl className="flex-1">
                      <Textarea
                        placeholder={'# Episode Title\n\nWrite your episode content here...'}
                        className="h-full min-h-[280px] resize-none bg-transparent border-border/50 rounded font-mono text-sm leading-relaxed"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Form>
          </div>

        </div>

        {/* Footer */}
        <div className="shrink-0 px-7 py-4 border-t border-border/30 flex justify-end gap-2 bg-muted/10">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose} className="text-foreground/50">
            Cancel
          </Button>
          <Button type="submit" form="episode-form" size="sm" disabled={isPending} className="min-w-[120px]">
            {isPending ? <Loader2 className="size-3.5 animate-spin" /> : isEdit ? 'Save Changes' : 'Create Episode'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
