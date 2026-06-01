'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PenTool, 
  BookOpen, 
  FileText,
  Plus, 
  Edit3, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useAdminArcsQuery } from '@/hooks/queries/useAdminQueries';
import { ArcModal } from '@/components/admin/modals/ArcModal';
import { ChapterModal } from '@/components/admin/modals/ChapterModal';
import { EpisodeModal } from '@/components/admin/modals/EpisodeModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AdminArcResponseDTO, AdminChapterResponseDTO, AdminEpisodeResponseDTO } from '@/types/models';

/**
 * AdminWorkspacePage Component
 * 
 * The primary writer's dashboard ("Archival Workspace").
 * - Restricted to administrators (role === 'ADMIN').
 * - Features writer-centric metrics: Drafts, Published Chapters, Unfinished Arcs.
 * - Displays a list of recently edited episodes.
 * - Features a nested Content Tree (Arcs ➔ Chapters ➔ Episodes) for structure management.
 */
export default function AdminWorkspacePage() {
  const router = useRouter();
  const { isAdmin, isInitialized } = useAuth();
  const { data: adminArcs = [], isLoading, isError, error } = useAdminArcsQuery();

  // Collapsible tree node state tracking
  const [expandedArcs, setExpandedArcs] = useState<Record<string, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Modal states
  type ModalState<T> = { type: 'create' | 'edit'; target?: T; parentId?: string } | null;
  const [arcModal, setArcModal] = useState<ModalState<AdminArcResponseDTO>>(null);
  const [chapterModal, setChapterModal] = useState<ModalState<AdminChapterResponseDTO>>(null);
  const [episodeModal, setEpisodeModal] = useState<ModalState<AdminEpisodeResponseDTO>>(null);

  const toggleArc = (id: string) => {
    setExpandedArcs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Redirect non-admins to the public unauthorized page
  useEffect(() => {
    if (isInitialized && !isAdmin) {
      router.replace('/unauthorized');
    }
  }, [isInitialized, isAdmin, router]);

  if (isInitialized && !isAdmin) {
    return null; // Avoid flashing content while redirecting
  }

  // Derived metrics from hierarchical admin arcs data
  const chapters = adminArcs.flatMap(arc => arc.chapters);
  const episodes = chapters.flatMap(ch => ch.episodes);

  const draftsCount = episodes.filter(ep => ep.status === 'DRAFT').length;
  const publishedChaptersCount = chapters.filter(ch => ch.status === 'PUBLISHED').length;
  
  // Unfinished arcs are those in DRAFT status OR that do not have an endDate
  const unfinishedArcsCount = adminArcs.filter(arc => 
    arc.status === 'DRAFT' || !arc.endDate
  ).length;

  // Recently edited episodes sorted by updatedAt
  const recentlyEdited = [...episodes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="font-body-prose text-sm text-muted-foreground italic">Decrypting archives...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 max-w-[500px] mx-auto text-center">
        <AlertCircle className="size-10 text-destructive mb-4" />
        <h2 className="font-chapter-title text-2xl font-medium text-destructive mb-2">Connection Interrupted</h2>
        <p className="font-body-prose text-sm text-muted-foreground mb-6">
          {(error as Error)?.message || 'Failed to fetch the workspace content. Ensure the API server is active.'}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      {/* Editorial Header */}
      <div>
        <h1 className="font-chapter-title text-4xl sm:text-5xl font-medium text-primary tracking-tight">
          Archivist&apos;s Workspace
        </h1>
        <p className="font-body-prose text-muted-foreground italic mt-2">
          Curate, organize, and record entries in the digital ledger.
        </p>
      </div>

      {/* Writer Metrics Section */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Metric 1: Drafts */}
        <Card className="border-border/60 bg-background/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold small-caps tracking-widest text-secondary">
              Drafts in Progress
            </CardTitle>
            <PenTool className="size-4 text-secondary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-chapter-title font-medium text-primary">{draftsCount}</div>
            <p className="text-xs text-muted-foreground font-body-prose mt-1">Awaiting final edits.</p>
          </CardContent>
        </Card>

        {/* Metric 2: Published Chapters */}
        <Card className="border-border/60 bg-background/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold small-caps tracking-widest text-secondary">
              Published Chapters
            </CardTitle>
            <CheckCircle className="size-4 text-secondary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-chapter-title font-medium text-primary">{publishedChaptersCount}</div>
            <p className="text-xs text-muted-foreground font-body-prose mt-1">Recorded in public view.</p>
          </CardContent>
        </Card>

        {/* Metric 3: Unfinished Arcs */}
        <Card className="border-border/60 bg-background/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold small-caps tracking-widest text-secondary">
              Unfinished Arcs
            </CardTitle>
            <BookOpen className="size-4 text-secondary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-chapter-title font-medium text-primary">{unfinishedArcsCount}</div>
            <p className="text-xs text-muted-foreground font-body-prose mt-1">Active arcs of thought.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Columns (2/3): Content Tree Explorer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-chapter-title text-2xl font-medium text-primary">Content Tree</h2>
            <Button size="sm" variant="outline" className="small-caps tracking-wider text-xs" onClick={() => setArcModal({ type: 'create' })}>
              <Plus className="size-3.5 mr-1" />
              New Arc
            </Button>
          </div>

          <div className="space-y-4">
            {adminArcs.length === 0 ? (
              <div className="border border-dashed border-border rounded-lg p-8 text-center bg-background/20">
                <p className="font-body-prose text-sm text-muted-foreground italic">
                  No arcs have been established. Create a new arc to begin.
                </p>
              </div>
            ) : (
              adminArcs.map(arc => {
                const isArcExpanded = !!expandedArcs[arc.id];
                return (
                  <div key={arc.id} className="border border-border/50 rounded-lg bg-background/30 overflow-hidden">
                    {/* Arc Row */}
                    <div 
                      onClick={() => toggleArc(arc.id)}
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-muted-foreground">
                          {isArcExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        </button>
                        <BookOpen className="size-4.5 text-primary" />
                        <div>
                          <h3 className="font-chapter-title text-[18px] font-medium text-foreground inline-flex items-center gap-2">
                            {arc.title}
                            <span className="text-xs font-mono text-muted-foreground font-normal">({arc.language})</span>
                          </h3>
                          <p className="text-xs text-muted-foreground font-body-prose mt-0.5 line-clamp-1">
                            {arc.summary || 'No summary specified.'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <Badge variant={arc.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5">
                          {arc.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5">
                          {arc.visibility}
                        </Badge>
                        <Button size="icon-sm" variant="ghost" title="Edit Arc" onClick={(e) => { e.stopPropagation(); setArcModal({ type: 'edit', target: arc }); }}>
                          <Edit3 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Collapsible Chapter List */}
                    {isArcExpanded && (
                      <div className="border-t border-border/30 bg-muted/5 pl-6 pr-4 py-2 space-y-2">
                        <div className="flex items-center justify-between py-1">
                          <span className="small-caps text-[10px] tracking-widest text-muted-foreground">Chapters</span>
                          <Button size="xs" variant="ghost" className="text-[10px] small-caps tracking-widest" onClick={() => setChapterModal({ type: 'create', parentId: arc.id })}>
                            <Plus className="size-3 mr-1" />
                            Add Chapter
                          </Button>
                        </div>
                        
                        {arc.chapters.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic font-body-prose py-2">
                            No chapters written under this arc yet.
                          </p>
                        ) : (
                          arc.chapters.map(chapter => {
                            const isChapterExpanded = !!expandedChapters[chapter.id];
                            return (
                              <div key={chapter.id} className="border border-border/30 rounded bg-background/40">
                                {/* Chapter Row */}
                                <div 
                                  onClick={() => toggleChapter(chapter.id)}
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/10 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <button className="text-muted-foreground">
                                      {isChapterExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                                    </button>
                                    <span className="text-xs text-muted-foreground font-mono">Ch. {chapter.orderIndex}</span>
                                    <h4 className="font-chapter-title text-[15px] font-medium text-foreground">
                                      {chapter.title}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                    <Badge variant={chapter.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[8px] scale-90 uppercase font-mono tracking-wider">
                                      {chapter.status}
                                    </Badge>
                                    <Button size="icon-xs" variant="ghost" onClick={(e) => { e.stopPropagation(); setChapterModal({ type: 'edit', target: chapter }); }}>
                                      <Edit3 className="size-3" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Collapsible Episode List */}
                                {isChapterExpanded && (
                                  <div className="border-t border-border/20 bg-muted/10 pl-8 pr-3 py-2 space-y-1">
                                    <div className="flex items-center justify-between py-1 border-b border-border/10 mb-1">
                                      <span className="small-caps text-[9px] tracking-widest text-muted-foreground">Episodes</span>
                                      <Button size="xs" variant="ghost" className="text-[9px] small-caps tracking-widest h-5 py-0 px-1" onClick={() => setEpisodeModal({ type: 'create', parentId: chapter.id })}>
                                        <Plus className="size-2.5 mr-1" />
                                        Add Episode
                                      </Button>
                                    </div>

                                    {chapter.episodes.length === 0 ? (
                                      <p className="text-xs text-muted-foreground italic font-body-prose py-1">
                                        No episodes logged in this chapter.
                                      </p>
                                    ) : (
                                      chapter.episodes.map(episode => (
                                        <div key={episode.id} className="flex items-center justify-between py-2 text-xs font-body-prose">
                                          <div className="flex items-center gap-2">
                                            <FileText className="size-3.5 text-muted-foreground" />
                                            <span className="font-medium text-foreground">{episode.title}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">({formatDate(episode.eventDate)})</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge variant={episode.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[8px] scale-75 uppercase font-mono">
                                              {episode.status}
                                            </Badge>
                                            <Button size="icon-xs" variant="ghost" onClick={(e) => { e.stopPropagation(); setEpisodeModal({ type: 'edit', target: episode }); }}>
                                              <Edit3 className="size-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (1/3): Recently Edited Panel */}
        <div className="space-y-6">
          <h2 className="font-chapter-title text-2xl font-medium text-primary inline-flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            Recently Edited
          </h2>
          
          <div className="space-y-4">
            {recentlyEdited.length === 0 ? (
              <div className="border border-border/40 rounded-lg p-6 text-center bg-background/10">
                <p className="font-body-prose text-xs text-muted-foreground italic">
                  No active edits detected.
                </p>
              </div>
            ) : (
              recentlyEdited.map(episode => (
                <Card key={episode.id} className="border-border/40 hover:border-primary/40 transition-colors bg-background/40">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {formatDate(episode.updatedAt)}
                      </span>
                      <Badge variant={episode.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[8px] uppercase font-mono">
                        {episode.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <h4 className="font-chapter-title text-[15px] font-medium text-foreground line-clamp-1">
                      {episode.title}
                    </h4>
                    <p className="text-xs font-body-prose text-muted-foreground mt-1 line-clamp-2">
                      {episode.content?.replace(/[#*`_]/g, '') || 'No content drafted.'}
                    </p>
                    <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-border/10">
                      <Button size="xs" variant="ghost" className="text-[10px] small-caps tracking-wider" onClick={() => setEpisodeModal({ type: 'edit', target: episode })}>
                        <Edit3 className="size-3 mr-1" />
                        Edit Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ArcModal 
        isOpen={!!arcModal} 
        onClose={() => setArcModal(null)} 
        arc={arcModal?.type === 'edit' ? arcModal.target : null} 
      />
      <ChapterModal 
        isOpen={!!chapterModal} 
        onClose={() => setChapterModal(null)} 
        arcId={chapterModal?.parentId}
        chapter={chapterModal?.type === 'edit' ? chapterModal.target : null}
      />
      <EpisodeModal 
        isOpen={!!episodeModal} 
        onClose={() => setEpisodeModal(null)} 
        chapterId={episodeModal?.parentId}
        episode={episodeModal?.type === 'edit' ? episodeModal.target : null}
      />
    </div>
  );
}
